import bcrypt from "bcryptjs";
import {
  getUserByPhone,
  createUser,
  updateUserRole,
  updateUserPin,
} from "../services/userService.js";

/* =============================== */
/* ENSURE SUPER ADMIN */
/* =============================== */
export async function ensureSuperAdmin() {
  try {
    const phone = "254700000001";
    const defaultPin = "1234";

    const existing = await getUserByPhone(phone);

    // ===============================
    // CREATE IF NOT EXISTS
    // ===============================
    if (!existing) {
      await createUser({
        phone,
        pin: defaultPin, // 🔥 send raw pin, service will hash it
        firstName: "Super",
        lastName: "Admin",
        idNo: "00000000",
        shopName: "HQ",
        shopAddress: "Nairobi",
        role: "superadmin",
      });

      console.log("[INFO] Super admin created");
      return;
    }

    let updated = false;

    // ===============================
    // ENSURE ROLE
    // ===============================
    if ((existing.role || "").toLowerCase() !== "superadmin") {
      await updateUserRole(phone, "superadmin");
      updated = true;
    }

    // ===============================
    // ENSURE PIN IS HASHED
    // ===============================
    const isHashed =
      existing.pin?.startsWith("$2a$") ||
      existing.pin?.startsWith("$2b$");

    if (!isHashed) {
      // ⚠️ IMPORTANT: pass RAW pin, let service handle hashing
      await updateUserPin(phone, defaultPin);
      updated = true;
    }

    if (updated) {
      console.log("[INFO] Super admin ensured/updated");
    }

  } catch (err) {
    console.error("[ERROR] Super admin creation failed:", err.message);
  }
}