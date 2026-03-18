const pool = require("../database/")

/* 
 *  Get all classification data
 */
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* 
 *  Get inventory items by classification_id
 */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory WHERE classification_id = $1",
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("model error: " + error)
  }
}

module.exports = { getClassifications, getInventoryByClassificationId }