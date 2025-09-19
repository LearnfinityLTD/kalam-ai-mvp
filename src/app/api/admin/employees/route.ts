// app/api/admin/employees/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { ServerAdminAccessControl } from "@/lib/admin-access-server";
import {
  FilterOptions,
  AdminContext,
  EmployeeData,
  isUserType,
} from "@/app/types/admin";

interface EmployeesResponse {
  employees: EmployeeData[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  adminContext: AdminContext;
  success: boolean;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const department = searchParams.get("department");
    const userType = searchParams.get("userType");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessControl = new ServerAdminAccessControl();
    const adminContext = await accessControl.getAdminContext(user.id);

    if (!adminContext.scope.permissions.canViewAllEmployees) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const filterOptions: FilterOptions = {
      search: search || undefined,
      department: department || undefined,
      userType: isUserType(userType) ? userType : undefined,
    };

    const employees = await accessControl.getFilteredEmployees(
      adminContext,
      filterOptions
    );

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEmployees = employees.slice(startIndex, endIndex);

    const response: EmployeesResponse = {
      employees: paginatedEmployees,
      pagination: {
        total: employees.length,
        page,
        limit,
        totalPages: Math.ceil(employees.length / limit),
      },
      adminContext,
      success: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Admin employees error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { employeeId, updates } = await request.json();
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessControl = new ServerAdminAccessControl();
    const adminContext = await accessControl.getAdminContext(user.id);

    if (!adminContext.scope.permissions.canManageEmployees) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Verify employee is in admin's scope
    const employees = await accessControl.getFilteredEmployees(adminContext);
    const targetEmployee = employees.find(
      (emp: EmployeeData) => emp.id === employeeId
    );

    if (!targetEmployee) {
      return NextResponse.json(
        { error: "Employee not found or access denied" },
        { status: 404 }
      );
    }

    // Clean updates object
    const cleanUpdates = Object.entries(updates).reduce(
      (acc: Record<string, unknown>, [key, value]) => {
        acc[key] = value === null ? undefined : value;
        return acc;
      },
      {}
    );

    const { error } = await supabase
      .from("user_profiles")
      .update({
        ...cleanUpdates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", employeeId);

    if (error) throw error;

    return NextResponse.json({
      message: "Employee updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Admin employee update error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to update employee" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get("employeeId");

    if (!employeeId) {
      return NextResponse.json(
        { error: "Employee ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessControl = new ServerAdminAccessControl();
    const adminContext = await accessControl.getAdminContext(user.id);

    if (!adminContext.scope.permissions.canManageEmployees) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Verify employee is in admin's scope
    const employees = await accessControl.getFilteredEmployees(adminContext);
    const targetEmployee = employees.find(
      (emp: EmployeeData) => emp.id === employeeId
    );

    if (!targetEmployee) {
      return NextResponse.json(
        { error: "Employee not found or access denied" },
        { status: 404 }
      );
    }

    const { error } = await supabase.auth.admin.deleteUser(employeeId);

    if (error) throw error;

    return NextResponse.json({
      message: "Employee deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Admin employee delete error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to delete employee" },
      { status: 500 }
    );
  }
}
