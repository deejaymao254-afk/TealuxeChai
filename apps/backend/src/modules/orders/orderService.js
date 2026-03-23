import pkg from "pg";
const { Pool } = pkg;

/**
 * Update or create an order
 */

export async function createOrder(userId, items, amount) {
  const res = await pool.query(
    `INSERT INTO orders (user_id, items, amount, status)
     VALUES ($1, $2, $3, 'PENDING')
     RETURNING *`,
    [userId, JSON.stringify(items), amount]
  );

  return res.rows[0];
}


export async function updateOrder(checkoutRequestId, data) {
  const { status, mpesaResponse, userId, amount, items, resultDesc, callbackMeta, message } = data;

  await pool.query(
    `INSERT INTO orders
     (checkout_request_id, user_id, amount, status, mpesa_response, items, result_desc, callback_meta, message)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     ON CONFLICT (checkout_request_id)
     DO UPDATE SET
       status = $4,
       mpesa_response = $5,
       items = $6,
       result_desc = $7,
       callback_meta = $8,
       message = $9,
       updated_at = NOW()`,
    [checkoutRequestId, userId || null, amount || 0, status || "PENDING", mpesaResponse || null, items || [], resultDesc || null, callbackMeta || null, message || null]
  );

  console.log(`[ORDER_SERVICE] Updated order ${checkoutRequestId}`);
}

/**
 * Get single order by checkoutRequestId
 */
export async function getOrder(checkoutRequestId) {
  const res = await pool.query(
    `SELECT * FROM orders WHERE checkout_request_id = $1`,
    [checkoutRequestId]
  );
  return res.rows[0] || { status: "PENDING" };
}

/**
 * Get all orders for a user
 */
export async function getOrdersByUser(userId) {
  const res = await pool.query(
    `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return res.rows;
}