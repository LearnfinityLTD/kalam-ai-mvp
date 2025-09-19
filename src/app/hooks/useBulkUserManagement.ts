// /hooks/useBulkUserManagement.ts - Updated with correct Supabase imports
import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";

interface Employee {
  id: string;
  full_name: string;
  email?: string;
  user_type: "guard" | "professional" | "tourist_guide";
  assessment_completed: boolean;
  assessment_score: number | null;
  english_level: string | null;
  progress: number;
  status: "active" | "pending" | "inactive";
  department: string;
  created_at: string;
}

interface BulkUploadResult {
  successful: number;
  failed: number;
  details: {
    successful: Array<{ email: string }>;
    failed: Array<{ email: string; error: string }>;
  };
}

export const useBulkUserManagement = (companyId: string) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchEmployees = useCallback(
    async (filters?: { search?: string; department?: string }) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          companyId,
          ...(filters?.search && { search: filters.search }),
          ...(filters?.department && { department: filters.department }),
        });

        const response = await fetch(`/api/admin/employees?${params}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch employees");
        }

        setEmployees(data.employees);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [companyId]
  );

  const uploadBulkUsers = useCallback(
    async (csvData: string[][]): Promise<BulkUploadResult> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/admin/bulk-upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            csvData,
            companyId,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to upload users");
        }

        // Refresh employee list after successful upload
        await fetchEmployees();

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Upload failed";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [companyId, fetchEmployees]
  );

  const updateEmployee = useCallback(
    async (employeeId: string, updates: Partial<Employee>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/admin/employees", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employeeId,
            updates,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to update employee");
        }

        // Update local state
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === employeeId ? { ...emp, ...updates } : emp
          )
        );

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Update failed";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteEmployee = useCallback(async (employeeId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/employees?employeeId=${employeeId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete employee");
      }

      // Remove from local state
      setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Delete failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const exportReport = useCallback(
    async (format: "csv" | "json" = "csv") => {
      try {
        const response = await fetch(
          `/api/admin/reports/export?companyId=${companyId}&format=${format}`
        );

        if (!response.ok) {
          throw new Error("Failed to generate report");
        }

        if (format === "csv") {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `kalam-ai-report-${
            new Date().toISOString().split("T")[0]
          }.csv`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } else {
          const data = await response.json();
          return data;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Export failed";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [companyId]
  );

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    uploadBulkUsers,
    updateEmployee,
    deleteEmployee,
    exportReport,
  };
};
