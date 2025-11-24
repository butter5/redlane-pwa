/**
 * @typedef {Object} PersonAllowance
 * @property {number} personId - Person ID
 * @property {string} personName - Person name
 * @property {number} age - Age at arrival
 * @property {boolean} eligible - Whether eligible for allowances
 * @property {number} generalAllowance - General goods allowance in BMD
 * @property {boolean} alcoholEligible - Whether eligible for alcohol allowance
 * @property {boolean} tobaccoEligible - Whether eligible for tobacco allowance
 */

/**
 * @typedef {Object} CategoryBreakdown
 * @property {string} categoryId - Category ID
 * @property {string} categoryName - Category name
 * @property {number} totalValueBMD - Total value in BMD
 * @property {number} itemCount - Number of items
 */

/**
 * @typedef {Object} TripDutySummary
 * @property {number} tripId - Trip ID
 * @property {number} totalValueBMD - Total value of all items in BMD
 * @property {number} totalAllowanceBMD - Total pooled allowance in BMD
 * @property {number} taxableAmountBMD - Amount subject to duty in BMD
 * @property {number} estimatedDutyBMD - Estimated duty to pay in BMD
 * @property {number} dutyRate - Applied duty rate (percentage)
 * @property {PersonAllowance[]} personAllowances - Allowance breakdown per person
 * @property {CategoryBreakdown[]} categoryBreakdowns - Value breakdown by category
 * @property {number} eligibleTravelerCount - Number of eligible travelers
 * @property {string} calculatedAt - Calculation timestamp in ISO format
 */

// Bermuda customs duty rates (2024)
export const DutyRates = {
  GENERAL: 0.25, // 25% on general goods
  LUXURY: 0.33, // 33% on luxury items
  ZERO: 0.0, // Zero duty items
}

// Per-person allowances (Bermuda customs - 2024)
export const Allowances = {
  GENERAL_PER_PERSON: 300, // BMD per person for general goods
  ALCOHOL_MINIMUM_AGE: 18,
  TOBACCO_MINIMUM_AGE: 18,
  // Alcohol allowances (quantity-based, not value)
  ALCOHOL_WINE_BOTTLES: 1, // 1 liter
  ALCOHOL_SPIRITS_BOTTLES: 1, // 1 liter
  ALCOHOL_BEER_BOTTLES: 6, // 6 x 12oz bottles
  // Tobacco allowances (quantity-based, not value)
  CIGARETTES: 200, // 200 cigarettes
  CIGARS: 50, // 50 cigars
  TOBACCO_GRAMS: 250, // 250g of tobacco
}
