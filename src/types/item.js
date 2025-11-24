/**
 * @typedef {Object} ItemCategory
 * @property {string} id - Category ID
 * @property {string} name - Category name
 * @property {string} description - Category description
 * @property {boolean} dutyFree - Whether items in this category can be duty-free
 * @property {number} [allowanceLimit] - Individual allowance limit in BMD (if applicable)
 * @property {boolean} [requiresAge] - Whether age restrictions apply
 * @property {number} [minimumAge] - Minimum age required for allowance
 */

/**
 * @typedef {Object} Item
 * @property {number} id - Unique identifier (timestamp or generated)
 * @property {number} tripId - ID of the trip this item belongs to
 * @property {number} personId - ID of the person who purchased this item
 * @property {string} categoryId - Category ID
 * @property {string} description - Item description
 * @property {string} currency - Currency code (e.g., 'USD', 'BMD', 'GBP')
 * @property {number} amount - Purchase amount
 * @property {number} amountBMD - Amount converted to BMD
 * @property {number} [quantity] - Quantity of items
 * @property {number} [legId] - Optional trip leg where item was purchased
 * @property {string} [notes] - Additional notes
 * @property {string} [receiptImage] - Base64 encoded receipt image
 * @property {string} createdAt - Creation timestamp in ISO format
 * @property {string} updatedAt - Last update timestamp in ISO format
 */

/**
 * @typedef {Object} ItemInput
 * @property {number} tripId - ID of the trip this item belongs to
 * @property {number} personId - ID of the person who purchased this item
 * @property {string} categoryId - Category ID
 * @property {string} description - Item description
 * @property {string} currency - Currency code
 * @property {number} amount - Purchase amount
 * @property {number} [quantity] - Quantity of items
 * @property {number} [legId] - Optional trip leg where item was purchased
 * @property {string} [notes] - Additional notes
 * @property {string} [receiptImage] - Base64 encoded receipt image
 */

export const ItemCategories = {
  GENERAL: 'general',
  ALCOHOL: 'alcohol',
  TOBACCO: 'tobacco',
  PERFUME: 'perfume',
  GIFTS: 'gifts',
  ELECTRONICS: 'electronics',
  JEWELRY: 'jewelry',
  CLOTHING: 'clothing',
  FOOD: 'food',
  OTHER: 'other',
}

export const ItemCategoryDefinitions = [
  {
    id: ItemCategories.GENERAL,
    name: 'General Goods',
    description: 'General merchandise, souvenirs, and other items',
    dutyFree: true,
    allowanceLimit: 300, // BMD per person
    requiresAge: false,
  },
  {
    id: ItemCategories.ALCOHOL,
    name: 'Alcohol',
    description: 'Alcoholic beverages (beer, wine, spirits)',
    dutyFree: true,
    allowanceLimit: null, // Quantity-based
    requiresAge: true,
    minimumAge: 18,
  },
  {
    id: ItemCategories.TOBACCO,
    name: 'Tobacco',
    description: 'Cigarettes, cigars, and tobacco products',
    dutyFree: true,
    allowanceLimit: null, // Quantity-based
    requiresAge: true,
    minimumAge: 18,
  },
  {
    id: ItemCategories.PERFUME,
    name: 'Perfume',
    description: 'Perfumes and colognes',
    dutyFree: true,
    allowanceLimit: null,
    requiresAge: false,
  },
  {
    id: ItemCategories.GIFTS,
    name: 'Gifts',
    description: 'Gifts for others',
    dutyFree: true,
    allowanceLimit: 300,
    requiresAge: false,
  },
  {
    id: ItemCategories.ELECTRONICS,
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    dutyFree: false,
    allowanceLimit: null,
    requiresAge: false,
  },
  {
    id: ItemCategories.JEWELRY,
    name: 'Jewelry',
    description: 'Jewelry and precious items',
    dutyFree: false,
    allowanceLimit: null,
    requiresAge: false,
  },
  {
    id: ItemCategories.CLOTHING,
    name: 'Clothing',
    description: 'Clothing and accessories',
    dutyFree: true,
    allowanceLimit: 300,
    requiresAge: false,
  },
  {
    id: ItemCategories.FOOD,
    name: 'Food',
    description: 'Food items (subject to restrictions)',
    dutyFree: false,
    allowanceLimit: null,
    requiresAge: false,
  },
  {
    id: ItemCategories.OTHER,
    name: 'Other',
    description: 'Other items not categorized above',
    dutyFree: false,
    allowanceLimit: null,
    requiresAge: false,
  },
]

export const Currencies = {
  BMD: 'BMD',
  USD: 'USD',
  GBP: 'GBP',
  EUR: 'EUR',
  CAD: 'CAD',
}

export const CurrencyLabels = {
  [Currencies.BMD]: 'BMD (Bermuda Dollar)',
  [Currencies.USD]: 'USD (US Dollar)',
  [Currencies.GBP]: 'GBP (British Pound)',
  [Currencies.EUR]: 'EUR (Euro)',
  [Currencies.CAD]: 'CAD (Canadian Dollar)',
}

// Exchange rates (for demo/MVP - should come from API in production)
export const ExchangeRates = {
  BMD: 1.0,
  USD: 1.0, // BMD is pegged 1:1 with USD
  GBP: 1.27,
  EUR: 1.09,
  CAD: 0.72,
}
