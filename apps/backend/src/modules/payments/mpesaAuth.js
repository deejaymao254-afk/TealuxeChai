/* eslint-env node */
import fetch from "node-fetch";

export async function getAccessToken() {
  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;

  if (!key || !secret) {
    throw new Error("MPESA_CONSUMER_KEY or MPESA_CONSUMER_SECRET missing in .env");
  }

  const auth = Buffer.from(`${key}:${secret}`).toString("base64");

  const res = await fetch(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    { method: "GET", headers: { Authorization: `Basic ${auth}` } }
  );

  let data;
  try {
    data = await res.json();
  } catch (err) {
    throw new Error("Failed to parse access token response: " + err.message);
  }

  if (!data.access_token) {
    throw new Error("Failed to obtain access token: " + JSON.stringify(data));
  }

  return data.access_token;
}