const pool = require("../database")

const invModel = {}

/* Get inventory by classification */
invModel.getInventoryByClassificationId = async (classification_id) => {
  const sql = "SELECT * FROM inventory WHERE classification_id = $1"
  const result = await pool.query(sql, [classification_id])
  return result.rows
}

/* Get single vehicle by ID */
invModel.getVehicleById = async (inv_id) => {
  const sql = "SELECT * FROM inventory WHERE inv_id = $1"
  const result = await pool.query(sql, [inv_id])
  return result.rows[0]
}

/* Get single inventory item for edit */
invModel.getInventoryById = async (inv_id) => {
  const sql = "SELECT * FROM inventory WHERE inv_id = $1"
  const result = await pool.query(sql, [inv_id])
  return result.rows[0]
}

/* Add classification */
invModel.addClassification = async (classification_name) => {
  const sql = "INSERT INTO classification (classification_name) VALUES ($1)"
  return await pool.query(sql, [classification_name])
}

/* Add inventory */
invModel.addInventory = async (
  inv_make, inv_model, inv_year, inv_description,
  inv_image, inv_thumbnail, inv_price, inv_miles,
  inv_color, classification_id
) => {
  const sql = `INSERT INTO inventory 
    (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) 
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`
  return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
}

/* Update inventory */
invModel.updateInventory = async (
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) => {
  try {
    const sql = `UPDATE public.inventory SET 
      inv_make = $1, 
      inv_model = $2, 
      inv_description = $3, 
      inv_image = $4, 
      inv_thumbnail = $5, 
      inv_price = $6, 
      inv_year = $7, 
      inv_miles = $8, 
      inv_color = $9, 
      classification_id = $10 
      WHERE inv_id = $11 RETURNING *`
    
    // El orden aquí es la clave para que la DB encuentre el registro
    const result = await pool.query(sql, [
      inv_make,         // $1
      inv_model,        // $2
      inv_description,  // $3
      inv_image,        // $4
      inv_thumbnail,    // $5
      inv_price,        // $6
      inv_year,         // $7
      inv_miles,        // $8
      inv_color,        // $9
      classification_id,// $10
      inv_id            // $11 (Utilizado en el WHERE)
    ])
    return result.rows[0]
  } catch (error) {
    console.error("model error: " + error)
    return null
  }
}

/* Get all classifications */
invModel.getClassifications = async () => {
  const sql = "SELECT * FROM classification ORDER BY classification_name"
  const result = await pool.query(sql)
  return result.rows
}

/* Delete inventory item */
invModel.deleteInventoryItem = async (inv_id) => {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1 RETURNING *"
    const result = await pool.query(sql, [inv_id])
    return result.rows[0]  // Devuelve el vehículo eliminado (si existe)
  } catch (error) {
    console.error("model delete error: " + error)
    return null
  }
}

/* Get inventory by classification and price range */
invModel.getInventoryByPriceRange = async (classification_id, minPrice, maxPrice) => {
  try {
    const sql = `
      SELECT i.*, c.classification_name 
      FROM inventory i
      JOIN classification c ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1 
        AND i.inv_price BETWEEN $2 AND $3
      ORDER BY i.inv_price
    `;
    const result = await pool.query(sql, [classification_id, minPrice, maxPrice]);
    return result.rows;
  } catch (error) {
    console.error("getInventoryByPriceRange error:", error);
    return [];
  }
};

module.exports = invModel