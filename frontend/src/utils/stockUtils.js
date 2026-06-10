/**
 * Determines if a product is out of stock.
 * A product is considered out of stock if:
 * - stock is 0
 * - stock is negative (< 0)
 * - stock is null
 * - stock is undefined
 * - stock field is missing
 * 
 * @param {Object} product The product object
 * @returns {boolean} True if the product is out of stock
 */
export const isOutOfStock = (product) => {
  if (!product) return true;
  const stock = product.stock;
  return stock === undefined || stock === null || stock <= 0;
};

/**
 * Determines if the requested quantity exceeds the available stock.
 * 
 * @param {Object} product The product object
 * @param {number} requestedQty The quantity requested by the user
 * @returns {boolean} True if available quantity is less than requested quantity
 */
export const hasInsufficientStock = (product, requestedQty) => {
  if (isOutOfStock(product)) return true;
  return product.stock < requestedQty;
};
