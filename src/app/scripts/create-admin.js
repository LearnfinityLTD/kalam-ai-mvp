// scripts/create-admin.js
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";
// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing required environment variables:");
  console.error("NEXT_PUBLIC_SUPABASE_URL:", !!supabaseUrl);
  console.error("SUPABASE_SERVICE_ROLE_KEY:", !!supabaseServiceKey);
  console.error("\nPlease check your .env.local file");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

function generateTempPassword() {
  return crypto.randomBytes(8).toString("hex") + "A1!";
}

async function createAdmin(adminData) {
  try {
    console.log(
      `\n🔄 Creating ${adminData.adminType} account for ${adminData.email}...`
    );

    const tempPassword = generateTempPassword();

    // Clean up any existing user first
    console.log("🧹 Cleaning up any existing user...");
    try {
      // Get existing user ID if exists
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers.users.find(
        (u) => u.email === adminData.email
      );

      if (existingUser) {
        await supabase.auth.admin.deleteUser(existingUser.id);
        console.log("Deleted existing user");
      }
    } catch (cleanupError) {
      console.log("Cleanup completed (no existing user)", cleanupError);
    }

    // 1. Create user in Supabase Auth (trigger will auto-create profile)
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: adminData.email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          full_name: adminData.fullName,
          user_type: adminData.userType,
          created_by: "system",
          needs_password_reset: true,
        },
      });

    if (authError)
      throw new Error(`Auth user creation failed: ${authError.message}`);
    if (!authData.user) throw new Error("Failed to create auth user");

    console.log("✓ Auth user created successfully");
    console.log("User ID:", authData.user.id);

    // 2. Wait for trigger to complete, then update the auto-created profile
    console.log("Waiting for trigger to create profile...");
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds

    // 3. Update the auto-created profile with admin settings
    const { data: updateResult, error: updateError } = await supabase
      .from("user_profiles")
      .update({
        full_name: adminData.fullName,
        user_type: adminData.userType,
        is_admin: true,
        is_super_admin: adminData.adminType === "super_admin",
        dialect: adminData.userType === "guard" ? adminData.dialect : null,
        assessment_completed: false,
        english_level: null,
        needs_password_reset: true,
      })
      .eq("id", authData.user.id)
      .select();

    if (updateError) {
      console.log("❌ Profile update failed, rolling back auth user...");
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw new Error(`Profile update failed: ${JSON.stringify(updateError)}`);
    }

    if (!updateResult || updateResult.length === 0) {
      console.log("❌ No profile found to update, rolling back auth user...");
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw new Error("Auto-created profile not found");
    }

    console.log("✓ Profile updated successfully with admin settings");

    // 4. Verify the final result
    const { data: verifyData } = await supabase
      .from("user_profiles")
      .select("full_name, is_admin, is_super_admin, needs_password_reset")
      .eq("id", authData.user.id)
      .single();

    console.log("✓ Final verification:", verifyData);

    return {
      success: true,
      userId: authData.user.id,
      email: adminData.email,
      tempPassword,
      adminType: adminData.adminType,
    };
  } catch (error) {
    console.error("❌ Admin creation failed:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}
// Script runner function
async function runCreateAdmin() {
  console.log("🚀 Kalam AI Admin Creation Tool");
  console.log("================================");

  // Configuration - MODIFY THESE VALUES
  const newAdmin = {
    fullName: "Learnfinity LTD",
    email: "support@learnfinity.co.uk", // Change this email
    userType: "guard", // "guard" or "professional"
    dialect: "egyptian", // Only needed for guards
    adminType: "super_admin", // "admin" or "super_admin"
  };

  console.log("📋 Admin Configuration:");
  console.log(`Name: ${newAdmin.fullName}`);
  console.log(`Email: ${newAdmin.email}`);
  console.log(`Type: ${newAdmin.adminType}`);
  console.log(`User Type: ${newAdmin.userType}`);
  if (newAdmin.userType === "guard") {
    console.log(`Dialect: ${newAdmin.dialect}`);
  }

  const result = await createAdmin(newAdmin);
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  async function sendAdminCredentials(adminData, tempPassword) {
    const msg = {
      to: adminData.email,
      from: "hello@kalam-ai.com", // Your verified sender
      subject: "Your KalamAI Admin Account",
      html: `
      <h2>Welcome to KalamAI Admin</h2>
      <p>Your admin account has been created:</p>
      <ul>
        <li><strong>Email:</strong> ${adminData.email}</li>
        <li><strong>Temporary Password:</strong> ${tempPassword}</li>
        <li><strong>Login URL:</strong> <a href="https://kalam-ai.com/admin/signin">https://kalam-ai.com/admin/signin</a></li>
      </ul>
      <p><strong>Important:</strong> You must change your password on first login.</p>
    `,
    };

    try {
      await sgMail.send(msg);
      console.log("📧 Credentials sent to:", adminData.email);
    } catch (error) {
      console.error("Failed to send email:", error.message);
    }
  }

  if (result.success) {
    console.log("\n🎉 SUCCESS! Admin account created");
    console.log("==================================");
    console.log("📧 Email:", result.email);
    console.log("🔑 Temporary Password:", result.tempPassword);
    console.log("👤 Admin Type:", result.adminType);
    console.log("🆔 User ID:", result.userId);

    // Send email automatically
    await sendAdminCredentials(newAdmin, result.tempPassword);

    console.log(`Login URL: https://kalam-ai.com/admin/signin`);

    console.log("\n📋 NEXT STEPS:");
    console.log("1. Send these credentials to the new admin:");
    console.log(
      `   Login URL: ${
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      }/admin/signin`
    );
    console.log(`   Email: ${result.email}`);
    console.log(`   Temporary Password: ${result.tempPassword}`);
    console.log("\n2. ⚠️  They MUST change password on first login");
    console.log("3. They will be redirected to the appropriate dashboard");

    if (result.adminType === "super_admin") {
      console.log("\n🔒 SUPER ADMIN WARNING:");
      console.log("This account has full platform access including:");
      console.log("• Billing and revenue management");
      console.log("• User management and admin creation");
      console.log("• System health and logs");
      console.log("• Platform-wide settings");
    }
  } else {
    console.log("\n💥 FAILED to create admin account");
    console.log("Error:", result.error);
  }
}

// Usage examples for reference
const examples = {
  regularAdmin: {
    fullName: "John Smith",
    email: "john.admin@company.com",
    userType: "guard",
    dialect: "egyptian",
    adminType: "admin",
  },
  superAdmin: {
    fullName: "Sarah Johnson",
    email: "sarah.superadmin@company.com",
    userType: "professional",
    adminType: "super_admin",
  },
};

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runCreateAdmin().catch((error) => {
    console.error("Script execution failed:", error);
    process.exit(1);
  });
}

export { createAdmin, examples };
