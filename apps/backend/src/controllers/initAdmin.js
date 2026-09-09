import {
  getUserByPhone,
  createUser,
  updateUserRole,
  updateUserPin,
} from "../services/userService.js";

/* =============================== */
/* HELPERS */
/* =============================== */
function normalizePhone(phone) {
  let p = phone.replace(/\D/g, "");
  if (p.startsWith("0")) p = "254" + p.slice(1);
  if (!p.startsWith("254")) p = "254" + p;
  return p;
}

/* =============================== */
/* ENSURE SUPER ADMIN */
/* =============================== */
export async function ensureSuperAdmin() {
  try {
    const phone = normalizePhone("254700000001");
    const defaultPin = "1234";

    const existing = await getUserByPhone(phone);

    if (!existing) {
      await createUser({
        phone,
        pin: defaultPin,
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

    if ((existing.role || "").toLowerCase() !== "superadmin") {
      await updateUserRole(phone, "superadmin");
      updated = true;
    }

    const isHashed =
      existing.pin?.startsWith("$2a$") ||
      existing.pin?.startsWith("$2b$");

    if (!isHashed) {
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