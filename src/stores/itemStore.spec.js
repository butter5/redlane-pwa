import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useItemStore } from '@/stores/itemStore'
import { ItemCategories, Currencies, ExchangeRates } from '@/types/item'

describe('itemStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  describe('Initial State', () => {
    it('should have empty items array initially', () => {
      const store = useItemStore()
      expect(store.items).toEqual([])
      expect(store.allItems).toEqual([])
    })

    it('should have isLoading set to false initially', () => {
      const store = useItemStore()
      expect(store.isLoading).toBe(false)
    })

    it('should have itemCount of 0 initially', () => {
      const store = useItemStore()
      expect(store.itemCount).toBe(0)
    })
  })

  describe('createItem', () => {
    it('should create a new item', () => {
      const store = useItemStore()
      const itemData = {
        tripId: 1,
        personId: 1,
        categoryId: ItemCategories.GENERAL,
        description: 'Souvenir',
        currency: Currencies.USD,
        amount: 50,
        quantity: 1,
      }

      const item = store.createItem(itemData)

      expect(item.id).toBeDefined()
      expect(item.tripId).toBe(1)
      expect(item.personId).toBe(1)
      expect(item.categoryId).toBe(ItemCategories.GENERAL)
      expect(item.description).toBe('Souvenir')
      expect(item.currency).toBe(Currencies.USD)
      expect(item.amount).toBe(50)
      expect(item.amountBMD).toBe(50) // USD = BMD
      expect(item.quantity).toBe(1)
      expect(item.createdAt).toBeDefined()
      expect(item.updatedAt).toBeDefined()
    })

    it('should convert currency to BMD', () => {
      const store = useItemStore()
      const itemData = {
        tripId: 1,
        personId: 1,
        categoryId: ItemCategories.GENERAL,
        description: 'Item in GBP',
        currency: Currencies.GBP,
        amount: 100,
      }

      const item = store.createItem(itemData)

      expect(item.amountBMD).toBe(100 * ExchangeRates.GBP)
    })

    it('should default quantity to 1 if not provided', () => {
      const store = useItemStore()
      const itemData = {
        tripId: 1,
        personId: 1,
        categoryId: ItemCategories.GENERAL,
        description: 'Test Item',
        currency: Currencies.USD,
        amount: 25,
      }

      const item = store.createItem(itemData)

      expect(item.quantity).toBe(1)
    })

    it('should handle optional fields', () => {
      const store = useItemStore()
      const itemData = {
        tripId: 1,
        personId: 1,
        categoryId: ItemCategories.GENERAL,
        description: 'Test',
        currency: Currencies.USD,
        amount: 25,
        legId: 5,
        notes: 'Some notes',
        receiptImage: 'base64image',
      }

      const item = store.createItem(itemData)

      expect(item.legId).toBe(5)
      expect(item.notes).toBe('Some notes')
      expect(item.receiptImage).toBe('base64image')
    })

    it('should add item to the items array', () => {
      const store = useItemStore()
      const itemData = {
        tripId: 1,
        personId: 1,
        categoryId: ItemCategories.ALCOHOL,
        description: 'Wine',
        currency: Currencies.EUR,
        amount: 30,
      }

      store.createItem(itemData)

      expect(store.items.length).toBe(1)
      expect(store.items[0].description).toBe('Wine')
    })

    it('should save to localStorage', () => {
      const store = useItemStore()
      const itemData = {
        tripId: 1,
        personId: 1,
        categoryId: ItemCategories.GENERAL,
        description: 'Test',
        currency: Currencies.USD,
        amount: 100,
      }

      store.createItem(itemData)

      const stored = JSON.parse(localStorage.getItem('redlane_items'))
      expect(stored).toHaveLength(1)
      expect(stored[0].description).toBe('Test')
    })
  })

  describe('updateItem', () => {
    it('should update an existing item', () => {
      const store = useItemStore()
      const item = store.createItem({
        tripId: 1,
        personId: 1,
        categoryId: ItemCategories.GENERAL,
        description: 'Original',
        currency: Currencies.USD,
        amount: 50,
      })

      const updated = store.updateItem(item.id, {
        description: 'Updated',
      })

      expect(updated.description).toBe('Updated')
      expect(updated.amount).toBe(50) // Unchanged
    })

    it('should recalculate BMD when amount changes', () => {
      const store = useItemStore()
      const item = store.createItem({
        tripId: 1,
        personId: 1,
        categoryId: ItemCategories.GENERAL,
        description: 'Test',
        currency: Currencies.USD,
        amount: 50,
      })

      const updated = store.updateItem(item.id, {
        amount: 100,
      })

      expect(updated.amountBMD).toBe(100)
    })

    it('should recalculate BMD when currency changes', () => {
      const store = useItemStore()
      const item = store.createItem({
        tripId: 1,
        personId: 1,
        categoryId: ItemCategories.GENERAL,
        description: 'Test',
        currency: Currencies.USD,
        amount: 100,
      })

      const updated = store.updateItem(item.id, {
        currency: Currencies.GBP,
      })

      expect(updated.amountBMD).toBe(100 * ExchangeRates.GBP)
    })

    it('should return null if item not found', () => {
      const store = useItemStore()
      const result = store.updateItem(99999, { description: 'Test' })
      expect(result).toBeNull()
    })

    it('should update the updatedAt timestamp', () => {
      const store = useItemStore()
      const item = store.createItem({
        tripId: 1,
        personId: 1,
        categoryId: ItemCategories.GENERAL,
        description: 'Test',
        currency: Currencies.USD,
        amount: 50,
      })

      const originalUpdatedAt = item.updatedAt

      setTimeout(() => {
        const updated = store.updateItem(item.id, {
          description: 'New',
        })

        expect(updated.updatedAt).not.toBe(originalUpdatedAt)
      }, 10)
    })
  })

  describe('deleteItem', () => {
    it('should delete an item', () => {
      const store = useItemStore()
      const item = store.createItem({
        tripId: 1,
        personId: 1,
        categoryId: ItemCategories.GENERAL,
        description: 'To Delete',
        currency: Currencies.USD,
        amount: 50,
      })

      const result = store.deleteItem(item.id)

      expect(result).toBe(true)
      expect(store.items.length).toBe(0)
    })

    it('should return false if item not found', () => {
      const store = useItemStore()
      const result = store.deleteItem(99999)
      expect(result).toBe(false)
    })

    it('should update localStorage after deletion', () => {
      const store = useItemStore()
      const item1 = store.createItem({
        tripId: 1,
        personId: 1,
        categoryId: ItemCategories.GENERAL,
        description: 'Item 1',
        currency: Currencies.USD,
        amount: 50,
      })
      const item2 = store.createItem({
        tripId: 1,
        personId: 1,
        categoryId: ItemCategories.GENERAL,
        description: 'Item 2',
        currency: Currencies.USD,
        amount: 75,
      })

      store.deleteItem(item1.id)

      const stored = JSON.parse(localStorage.getItem('redlane_items'))
      expect(stored).toHaveLength(1)
      expect(stored[0].id).toBe(item2.id)
    })
  })

  describe('deleteItemsByTrip', () => {
    it('should delete all items for a trip', () => {
      const store = useItemStore()
      store.createItem({
        tripId: 1,
        personId: 1,
        categoryId: ItemCategories.GENERAL,
        description: 'Trip 1 Item 1',
        currency: Currencies.USD,
        amount: 50,
      })
      store.createItem({
        tripId: 1,
        personId: 2,
        categoryId: ItemCategories.GENERAL,
        description: 'Trip 1 Item 2',
        currency: Currencies.USD,
        amount: 75,
      })
      store.createItem({
        tripId: 2,
        personId: 1,
        categoryId: ItemCategories.GENERAL,
        description: 'Trip 2 Item',
        currency: Currencies.USD,
        amount: 100,
      })

      const deletedCount = store.deleteItemsByTrip(1)

      expect(deletedCount).toBe(2)
      expect(store.items.length).toBe(1)
      expect(store.items[0].tripId).toBe(2)
    })

    it('should return 0 if no items found for trip', () => {
      const store = useItemStore()
      const deletedCount = store.deleteItemsByTrip(99999)
      expect(deletedCount).toBe(0)
    })
  })

  describe('deleteItemsByPerson', () => {
    it('should delete all items for a person', () => {
      const store = useItemStore()
      store.createItem({
        tripId: 1,
        personId: 1,
        categoryId: ItemCategories.GENERAL,
        description: 'Person 1 Item 1',
        currency: Currencies.USD,
        amount: 50,
      })
      store.createItem({
        tripId: 2,
        personId: 1,
        categoryId: ItemCategories.GENERAL,
        description: 'Person 1 Item 2',
        currency: Currencies.USD,
        amount: 75,
      })
      store.createItem({
        tripId: 1,
        personId: 2,
        categoryId: ItemCategories.GENERAL,
        description: 'Person 2 Item',
        currency: Currencies.USD,
        amount: 100,
      })

      const deletedCount = store.deleteItemsByPerson(1)

      expect(deletedCount).toBe(2)
      expect(store.items.length).toBe(1)
      expect(store.items[0].personId).toBe(2)
    })

    it('should return 0 if no items found for person', () => {
      const store = useItemStore()
      const deletedCount = store.deleteItemsByPerson(99999)
      expect(deletedCount).toBe(0)
    })
  })

  describe('Getters', () => {
    let store

    beforeEach(() => {
      store = useItemStore()
      store.clearAll()
      
      // Create test items
      store.createItem({
        tripId: 1,
        personId: 1,
        categoryId: ItemCategories.GENERAL,
        description: 'Item 1',
        currency: Currencies.USD,
        amount: 100,
        legId: 1,
      })
      store.createItem({
        tripId: 1,
        personId: 2,
        categoryId: ItemCategories.ALCOHOL,
        description: 'Item 2',
        currency: Currencies.USD,
        amount: 50,
        legId: 1,
      })
      store.createItem({
        tripId: 2,
        personId: 1,
        categoryId: ItemCategories.GENERAL,
        description: 'Item 3',
        currency: Currencies.GBP,
        amount: 100,
        legId: 2,
      })
    })

    it('should get all items', () => {
      expect(store.allItems).toHaveLength(3)
    })

    it('should get item by ID', () => {
      const item = store.items[0]
      const found = store.getItemById(item.id)
      expect(found).toEqual(item)
    })

    it('should return null for non-existent item ID', () => {
      const found = store.getItemById(99999)
      expect(found).toBeNull()
    })

    it('should get items by trip ID', () => {
      const trip1Items = store.getItemsByTripId(1)
      expect(trip1Items).toHaveLength(2)
      expect(trip1Items.every(i => i.tripId === 1)).toBe(true)
    })

    it('should get items by person ID', () => {
      const person1Items = store.getItemsByPersonId(1)
      expect(person1Items).toHaveLength(2)
      expect(person1Items.every(i => i.personId === 1)).toBe(true)
    })

    it('should get items by trip and person', () => {
      const items = store.getItemsByTripAndPerson(1, 1)
      expect(items).toHaveLength(1)
      expect(items[0].tripId).toBe(1)
      expect(items[0].personId).toBe(1)
    })

    it('should get items by category', () => {
      const generalItems = store.getItemsByCategory(ItemCategories.GENERAL)
      expect(generalItems).toHaveLength(2)
      expect(generalItems.every(i => i.categoryId === ItemCategories.GENERAL)).toBe(true)
    })

    it('should get items by leg', () => {
      const leg1Items = store.getItemsByLeg(1)
      expect(leg1Items).toHaveLength(2)
      expect(leg1Items.every(i => i.legId === 1)).toBe(true)
    })

    it('should return correct item count', () => {
      expect(store.itemCount).toBe(3)
    })
  })

  describe('Computed Totals', () => {
    let store

    beforeEach(() => {
      store = useItemStore()
      store.clearAll()
      
      store.createItem({
        tripId: 1,
        personId: 1,
        categoryId: ItemCategories.GENERAL,
        description: 'Item 1',
        currency: Currencies.USD,
        amount: 100,
      })
      store.createItem({
        tripId: 1,
        personId: 1,
        categoryId: ItemCategories.ALCOHOL,
        description: 'Item 2',
        currency: Currencies.USD,
        amount: 50,
      })
      store.createItem({
        tripId: 1,
        personId: 2,
        categoryId: ItemCategories.GENERAL,
        description: 'Item 3',
        currency: Currencies.USD,
        amount: 75,
      })
      store.createItem({
        tripId: 2,
        personId: 1,
        categoryId: ItemCategories.GENERAL,
        description: 'Item 4',
        currency: Currencies.USD,
        amount: 200,
      })
    })

    it('should calculate total value by trip', () => {
      const trip1Total = store.getTotalValueByTrip(1)
      expect(trip1Total).toBe(225) // 100 + 50 + 75
    })

    it('should calculate total value by person', () => {
      const person1Total = store.getTotalValueByPerson(1)
      expect(person1Total).toBe(350) // 100 + 50 + 200
    })

    it('should calculate total value by category', () => {
      const generalTotal = store.getTotalValueByCategory(ItemCategories.GENERAL)
      expect(generalTotal).toBe(375) // 100 + 75 + 200
    })
  })

  describe('getCategoryBreakdownByTrip', () => {
    it('should return category breakdown for a trip', () => {
      const store = useItemStore()
      store.createItem({
        tripId: 1,
        personId: 1,
        categoryId: ItemCategories.GENERAL,
        description: 'Item 1',
        currency: Currencies.USD,
        amount: 100,
      })
      store.createItem({
        tripId: 1,
        personId: 1,
        categoryId: ItemCategories.GENERAL,
        description: 'Item 2',
        currency: Currencies.USD,
        amount: 50,
      })
      store.createItem({
        tripId: 1,
        personId: 2,
        categoryId: ItemCategories.ALCOHOL,
        description: 'Item 3',
        currency: Currencies.USD,
        amount: 75,
      })

      const breakdown = store.getCategoryBreakdownByTrip(1)

      expect(breakdown).toHaveLength(2)
      
      const generalBreakdown = breakdown.find(b => b.categoryId === ItemCategories.GENERAL)
      expect(generalBreakdown.totalValueBMD).toBe(150)
      expect(generalBreakdown.itemCount).toBe(2)

      const alcoholBreakdown = breakdown.find(b => b.categoryId === ItemCategories.ALCOHOL)
      expect(alcoholBreakdown.totalValueBMD).toBe(75)
      expect(alcoholBreakdown.itemCount).toBe(1)
    })

    it('should return empty array for trip with no items', () => {
      const store = useItemStore()
      const breakdown = store.getCategoryBreakdownByTrip(99999)
      expect(breakdown).toEqual([])
    })
  })

  describe('convertToBMD', () => {
    it('should convert USD to BMD (1:1)', () => {
      const store = useItemStore()
      const bmd = store.convertToBMD(100, Currencies.USD)
      expect(bmd).toBe(100)
    })

    it('should convert GBP to BMD', () => {
      const store = useItemStore()
      const bmd = store.convertToBMD(100, Currencies.GBP)
      expect(bmd).toBe(100 * ExchangeRates.GBP)
    })

    it('should convert EUR to BMD', () => {
      const store = useItemStore()
      const bmd = store.convertToBMD(100, Currencies.EUR)
      expect(bmd).toBe(100 * ExchangeRates.EUR)
    })

    it('should handle unknown currency as 1:1', () => {
      const store = useItemStore()
      const bmd = store.convertToBMD(100, 'XXX')
      expect(bmd).toBe(100)
    })
  })

  describe('clearAll', () => {
    it('should clear all items', () => {
      const store = useItemStore()
      store.createItem({
        tripId: 1,
        personId: 1,
        categoryId: ItemCategories.GENERAL,
        description: 'Test',
        currency: Currencies.USD,
        amount: 100,
      })

      store.clearAll()

      expect(store.items).toEqual([])
      expect(store.itemCount).toBe(0)
    })

    it('should clear localStorage', () => {
      const store = useItemStore()
      store.createItem({
        tripId: 1,
        personId: 1,
        categoryId: ItemCategories.GENERAL,
        description: 'Test',
        currency: Currencies.USD,
        amount: 100,
      })

      store.clearAll()

      expect(localStorage.getItem('redlane_items')).toBeNull()
    })
  })

  describe('Persistence', () => {
    it('should load from localStorage on initialization', () => {
      const store = useItemStore()
      store.createItem({
        tripId: 1,
        personId: 1,
        categoryId: ItemCategories.GENERAL,
        description: 'Persisted Item',
        currency: Currencies.USD,
        amount: 100,
      })

      // Create a new store instance (simulating page reload)
      const newPinia = createPinia()
      setActivePinia(newPinia)
      const newStore = useItemStore()

      expect(newStore.items).toHaveLength(1)
      expect(newStore.items[0].description).toBe('Persisted Item')
    })

    it('should handle corrupted localStorage gracefully', () => {
      localStorage.setItem('redlane_items', 'invalid json')

      const store = useItemStore()
      expect(store.items).toEqual([])
    })
  })
})
