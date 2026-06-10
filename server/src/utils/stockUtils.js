/**
 * Checks if a medicine is out of stock or has insufficient quantity.
 * A product is considered out of stock if:
 * - stock is 0
 * - stock is negative (< 0)
 * - stock is null
 * - stock is undefined
 * - stock field is missing
 * 
 * @param {Object} medicine The medicine document from DB
 * @returns {boolean} True if the medicine is out of stock
 */
const isStockUnavailable = (medicine) => {
  if (!medicine) return true;
  const stock = medicine.stock;
  return stock === undefined || stock === null || stock <= 0;
};

/**
 * Checks if the requested quantity exceeds the available stock.
 * 
 * @param {Object} medicine The medicine document from DB
 * @param {number} requestedQty The requested quantity
 * @returns {boolean} True if available quantity is less than requested quantity
 */
const isQuantityInsufficient = (medicine, requestedQty) => {
  if (isStockUnavailable(medicine)) return true;
  return medicine.stock < requestedQty;
};

module.exports = {
  isStockUnavailable,
  isQuantityInsufficient,
};
