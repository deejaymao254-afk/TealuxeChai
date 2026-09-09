import axios from "axios";
import { MpesaConfig } from "./mpesaConfig";
/**
 * Initiates STK push via backend
 * @param {string} phoneNumber format 2547XXXXXXXX
 * @param {number} amount
 * @returns {Promise<Object>} Daraja STK push response
 */
export async function lipaNaMpesaOnline(phoneNumber, amount) {
  try {
    const response = await axios.post(
      `${MpesaConfig.backendUrl}${MpesaConfig.stkPushEndpoint}`,
      { phone: phoneNumber, amount }
    );

    console.log("[DEBUG] Backend STK Push Response:", response.data);

    if (!response.data?.CheckoutRequestID) {
      throw new Error(
        "Invalid STK Push response from backend: " +
          JSON.stringify(response.data)
      );
    }

    return response.data;
  } catch (error) {
    console.error(
      "[ERROR] Backend STK Push Error:",
      error.response?.data || error.message
    );
    throw error;
  }
}