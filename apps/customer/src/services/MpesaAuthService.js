import axios from "axios";
import { MpesaConfig } from "./mpesaConfig.js";

/**
 * Check if backend is reachable
 * (Daraja auth is server-side now)
 */
export async function checkBackendStatus() {
  try {
    const response = await axios.get(`${MpesaConfig.backendUrl}/log`);
    console.log("[DEBUG] Backend availability check:", response.status);
    return response.status === 200;
  } catch (error) {
    console.error(
      "[ERROR] Backend connection error:",
      error.response?.data || error.message
    );
    throw error;
  }
}