// scripts/run-create-admin.js
import { createAdmin } from "./create-admin.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: ".env.local" });

async function runCreateAdmin() {
  // Modify this with actual admin details
  const newAdmin = {
    fullName: "learnfinity",
    email: "support@learnfinity.co.uk",
    userType: "guard",
    dialect: "egyptian",
    adminType: "admin",
  };

  console.log("Creating admin account...");
  const result = await createAdmin(newAdmin);

  if (result.success) {
    console.log("✅ Admin created successfully!");
    console.log("📧 Email:", result.email);
    console.log("🔑 Temporary Password:", result.tempPassword);
    console.log("👤 Admin Type:", result.adminType);
    console.log("\n📋 Send these credentials to the new admin:");
    console.log(
      `Login at: ${
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      }/admin/signin`
    );
    console.log(`Email: ${result.email}`);
    console.log(`Temporary Password: ${result.tempPassword}`);
    console.log("⚠️  They will be required to change password on first login");
  } else {
    console.error("❌ Failed to create admin:", result.error);
  }
}

runCreateAdmin().catch(console.error);
