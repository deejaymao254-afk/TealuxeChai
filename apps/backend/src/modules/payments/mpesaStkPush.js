import fetch from "node-fetch";
import { getAccessToken } from "../payments/mpesaAuth.js";
import { updateOrder } from "../orders/orderService.js";

/**
 * STK Push with full debug logging
 * @param {string} phone - Customer phone number (2547XXXXXXXX)
 * @param {number} amount - Amount to charge
 * @param {number|null} userId - Optional logged-in user ID
 */
export async function stkPush(phone, amount, userId = null) {
  try {
    const token = await getAccessToken();
    console.log("[DEBUG] Access token:", token ? `${token.slice(0,10)}...` : "None");

    const shortcode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0, 14);
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

    const callbackURL = process.env.MPESA_CALLBACK;

    const payload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: shortcode,
      PhoneNumber: phone,
      CallBackURL: callbackURL,
      AccountReference: "Duka2",
      TransactionDesc: "Order Payment",
    };

    console.log("[DEBUG] STK Push payload:", payload);

    const res = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`STK Push failed with status ${res.status}: ${text}`);
    }

    const resBody = await res.json();

    console.log(`[INFO] STK Push sent | CheckoutRequestID: ${resBody.CheckoutRequestID}, ResponseCode: ${resBody.ResponseCode}`);

    // Save initial order in DB
    if (resBody.CheckoutRequestID) {
      await updateOrder(resBody.CheckoutRequestID, {
        status: "PENDING",
        userId,
        amount,
        items: JSON.stringify([]),
        mpesaResponse: resBody,
      });
    }

    return resBody;
  } catch (err) {
    console.error("[ERROR] M-PESA STK Push Failed", err.message);
    throw err;
  }
}