import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ExchangeRates } from '@/types/item'

const STORAGE_KEY = 'redlane_items'

/**
 * Item Store
 * Manages items (purchases) associated with trips and people
 */
export const useItemStore = defineStore('item', () => {
  // State
  const items = ref([])
  const isLoading = ref(false)

  // Load from localStorage on initialization
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        items.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load items from storage:', error)
      items.value = []
    }
  }

  // Save to localStorage
  const saveToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
    } catch (error) {
      console.error('Failed to save items to storage:', error)
    }
  }

  // Helper: Convert currency to BMD
  const convertToBMD = (amount, currency) => {
    const rate = ExchangeRates[currency] || 1.0
    return amount * rate
  }

  // Getters
  const allItems = computed(() => items.value)
  
  const getItemById = computed(() => {
    return (id) => items.value.find(i => i.id === id) || null
  })

  const getItemsByTripId = computed(() => {
    return (tripId) => items.value.filter(i => i.tripId === tripId)
  })

  const getItemsByPersonId = computed(() => {
    return (personId) => items.value.filter(i => i.personId === personId)
  })

  const getItemsByTripAndPerson = computed(() => {
    return (tripId, personId) => 
      items.value.filter(i => i.tripId === tripId && i.personId === personId)
  })

  const getItemsByCategory = computed(() => {
    return (categoryId) => items.value.filter(i => i.categoryId === categoryId)
  })

  const getItemsByLeg = computed(() => {
    return (legId) => items.value.filter(i => i.legId === legId)
  })

  const itemCount = computed(() => items.value.length)

  // Computed totals
  const getTotalValueByTrip = computed(() => {
    return (tripId) => {
      const tripItems = getItemsByTripId.value(tripId)
      return tripItems.reduce((sum, item) => sum + item.amountBMD, 0)
    }
  })

  const getTotalValueByPerson = computed(() => {
    return (personId) => {
      const personItems = getItemsByPersonId.value(personId)
      return personItems.reduce((sum, item) => sum + item.amountBMD, 0)
    }
  })

  const getTotalValueByCategory = computed(() => {
    return (categoryId) => {
      const categoryItems = getItemsByCategory.value(categoryId)
      return categoryItems.reduce((sum, item) => sum + item.amountBMD, 0)
    }
  })

  // Actions
  
  /**
   * Create a new item
   * @param {import('@/types/item').ItemInput} itemData 
   * @returns {import('@/types/item').Item}
   */
  const createItem = (itemData) => {
    const now = new Date().toISOString()
    const amountBMD = convertToBMD(itemData.amount, itemData.currency)
    
    const newItem = {
      id: Date.now() + items.value.length,
      tripId: itemData.tripId,
      personId: itemData.personId,
      categoryId: itemData.categoryId,
      description: itemData.description,
      currency: itemData.currency,
      amount: itemData.amount,
      amountBMD,
      quantity: itemData.quantity || 1,
      legId: itemData.legId || null,
      notes: itemData.notes || null,
      receiptImage: itemData.receiptImage || null,
      createdAt: now,
      updatedAt: now,
    }
    
    items.value.push(newItem)
    saveToStorage()
    
    return newItem
  }

  /**
   * Update an existing item
   * @param {number} id 
   * @param {Partial<import('@/types/item').ItemInput>} updates 
   * @returns {import('@/types/item').Item | null}
   */
  const updateItem = (id, updates) => {
    const index = items.value.findIndex(i => i.id === id)
    if (index === -1) return null

    const currentItem = items.value[index]
    
    // Recalculate BMD if amount or currency changed
    let amountBMD = currentItem.amountBMD
    if (updates.amount !== undefined || updates.currency !== undefined) {
      const newAmount = updates.amount !== undefined ? updates.amount : currentItem.amount
      const newCurrency = updates.currency !== undefined ? updates.currency : currentItem.currency
      amountBMD = convertToBMD(newAmount, newCurrency)
    }

    const updatedItem = {
      ...currentItem,
      ...updates,
      id, // Ensure ID cannot be changed
      amountBMD,
      updatedAt: new Date().toISOString(),
    }
    
    items.value[index] = updatedItem
    saveToStorage()
    
    return updatedItem
  }

  /**
   * Delete an item
   * @param {number} id 
   * @returns {boolean} Success status
   */
  const deleteItem = (id) => {
    const index = items.value.findIndex(i => i.id === id)
    if (index === -1) return false

    items.value.splice(index, 1)
    saveToStorage()
    
    return true
  }

  /**
   * Delete all items for a specific trip
   * @param {number} tripId 
   * @returns {number} Number of items deleted
   */
  const deleteItemsByTrip = (tripId) => {
    const initialLength = items.value.length
    items.value = items.value.filter(i => i.tripId !== tripId)
    const deletedCount = initialLength - items.value.length
    
    if (deletedCount > 0) {
      saveToStorage()
    }
    
    return deletedCount
  }

  /**
   * Delete all items for a specific person
   * @param {number} personId 
   * @returns {number} Number of items deleted
   */
  const deleteItemsByPerson = (personId) => {
    const initialLength = items.value.length
    items.value = items.value.filter(i => i.personId !== personId)
    const deletedCount = initialLength - items.value.length
    
    if (deletedCount > 0) {
      saveToStorage()
    }
    
    return deletedCount
  }

  /**
   * Clear all items (useful for logout or testing)
   */
  const clearAll = () => {
    items.value = []
    localStorage.removeItem(STORAGE_KEY)
  }

  /**
   * Get category breakdown for a trip
   * @param {number} tripId
   * @returns {Array<{categoryId: string, totalValueBMD: number, itemCount: number}>}
   */
  const getCategoryBreakdownByTrip = (tripId) => {
    const tripItems = getItemsByTripId.value(tripId)
    const breakdown = {}

    tripItems.forEach(item => {
      if (!breakdown[item.categoryId]) {
        breakdown[item.categoryId] = {
          categoryId: item.categoryId,
          totalValueBMD: 0,
          itemCount: 0,
        }
      }
      breakdown[item.categoryId].totalValueBMD += item.amountBMD
      breakdown[item.categoryId].itemCount += 1
    })

    return Object.values(breakdown)
  }

  // Initialize on store creation
  loadFromStorage()

  return {
    // State
    items,
    isLoading,
    // Getters
    allItems,
    getItemById,
    getItemsByTripId,
    getItemsByPersonId,
    getItemsByTripAndPerson,
    getItemsByCategory,
    getItemsByLeg,
    itemCount,
    getTotalValueByTrip,
    getTotalValueByPerson,
    getTotalValueByCategory,
    // Actions
    createItem,
    updateItem,
    deleteItem,
    deleteItemsByTrip,
    deleteItemsByPerson,
    clearAll,
    getCategoryBreakdownByTrip,
    // Internal helpers (exposed for testing)
    loadFromStorage,
    saveToStorage,
    convertToBMD,
  }
})
