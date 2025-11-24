import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTripDutySummaryStore } from '@/stores/tripDutySummaryStore'
import { usePersonStore } from '@/stores/personStore'
import { useTripStore } from '@/stores/tripStore'
import { useItemStore } from '@/stores/itemStore'
import { PersonRelationships } from '@/types/person'
import { ItemCategories, Currencies } from '@/types/item'
import { Allowances, DutyRates } from '@/types/dutySummary'

describe('tripDutySummaryStore', () => {
  let summaryStore
  let personStore
  let tripStore
  let itemStore
  let testPerson1
  let testPerson2
  let testChild
  let testTrip

  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()

    // Initialize stores
    summaryStore = useTripDutySummaryStore()
    personStore = usePersonStore()
    tripStore = useTripStore()
    itemStore = useItemStore()

    // Create test people
    testPerson1 = personStore.createPerson({
      fullName: 'Adult 1',
      dateOfBirth: '1990-01-01',
      relationship: PersonRelationships.SELF,
      isSelf: true,
    })

    testPerson2 = personStore.createPerson({
      fullName: 'Adult 2',
      dateOfBirth: '1992-06-15',
      relationship: PersonRelationships.SPOUSE,
    })

    testChild = personStore.createPerson({
      fullName: 'Child',
      dateOfBirth: '2015-03-10',
      relationship: PersonRelationships.CHILD,
    })

    // Create test trip with adults
    testTrip = tripStore.createTrip({
      name: 'Test Trip',
      startDate: '2024-07-01',
      endDate: '2024-07-15',
      personIds: [testPerson1.id, testPerson2.id],
    })
  })

  describe('calculatePersonAllowances', () => {
    it('should calculate allowances for all people on trip', () => {
      const allowances = summaryStore.calculatePersonAllowances(testTrip.id)

      expect(allowances).toHaveLength(2)
      expect(allowances[0].personId).toBe(testPerson1.id)
      expect(allowances[1].personId).toBe(testPerson2.id)
    })

    it('should mark adults as eligible for alcohol and tobacco', () => {
      const allowances = summaryStore.calculatePersonAllowances(testTrip.id)

      const adult1Allowance = allowances.find(a => a.personId === testPerson1.id)
      expect(adult1Allowance.alcoholEligible).toBe(true)
      expect(adult1Allowance.tobaccoEligible).toBe(true)
    })

    it('should mark children as ineligible for alcohol and tobacco', () => {
      const tripWithChild = tripStore.createTrip({
        name: 'Family Trip',
        startDate: '2024-07-01',
        endDate: '2024-07-15',
        personIds: [testPerson1.id, testChild.id],
      })

      const allowances = summaryStore.calculatePersonAllowances(tripWithChild.id)
      const childAllowance = allowances.find(a => a.personId === testChild.id)

      expect(childAllowance.alcoholEligible).toBe(false)
      expect(childAllowance.tobaccoEligible).toBe(false)
      expect(childAllowance.age).toBeLessThan(18)
    })

    it('should assign general allowance to all travelers', () => {
      const allowances = summaryStore.calculatePersonAllowances(testTrip.id)

      expect(allowances.every(a => a.generalAllowance === Allowances.GENERAL_PER_PERSON)).toBe(true)
      expect(allowances.every(a => a.eligible === true)).toBe(true)
    })

    it('should calculate age based on trip arrival date', () => {
      const allowances = summaryStore.calculatePersonAllowances(testTrip.id)

      const adult1Allowance = allowances.find(a => a.personId === testPerson1.id)
      expect(adult1Allowance.age).toBeGreaterThanOrEqual(34) // Born 1990, trip in 2024
    })

    it('should return empty array for non-existent trip', () => {
      const allowances = summaryStore.calculatePersonAllowances(99999)
      expect(allowances).toEqual([])
    })
  })

  describe('calculateCategoryBreakdown', () => {
    beforeEach(() => {
      itemStore.createItem({
        tripId: testTrip.id,
        personId: testPerson1.id,
        categoryId: ItemCategories.GENERAL,
        description: 'General Item 1',
        currency: Currencies.USD,
        amount: 100,
      })
      itemStore.createItem({
        tripId: testTrip.id,
        personId: testPerson1.id,
        categoryId: ItemCategories.GENERAL,
        description: 'General Item 2',
        currency: Currencies.USD,
        amount: 50,
      })
      itemStore.createItem({
        tripId: testTrip.id,
        personId: testPerson2.id,
        categoryId: ItemCategories.ALCOHOL,
        description: 'Wine',
        currency: Currencies.USD,
        amount: 75,
      })
    })

    it('should break down items by category', () => {
      const breakdown = summaryStore.calculateCategoryBreakdown(testTrip.id)

      expect(breakdown).toHaveLength(2)
      
      const generalBreakdown = breakdown.find(b => b.categoryId === ItemCategories.GENERAL)
      expect(generalBreakdown.totalValueBMD).toBe(150)
      expect(generalBreakdown.itemCount).toBe(2)
      expect(generalBreakdown.categoryName).toBe('General Goods')

      const alcoholBreakdown = breakdown.find(b => b.categoryId === ItemCategories.ALCOHOL)
      expect(alcoholBreakdown.totalValueBMD).toBe(75)
      expect(alcoholBreakdown.itemCount).toBe(1)
      expect(alcoholBreakdown.categoryName).toBe('Alcohol')
    })

    it('should return empty array for trip with no items', () => {
      const emptyTrip = tripStore.createTrip({
        name: 'Empty Trip',
        startDate: '2024-08-01',
        endDate: '2024-08-15',
        personIds: [testPerson1.id],
      })

      const breakdown = summaryStore.calculateCategoryBreakdown(emptyTrip.id)
      expect(breakdown).toEqual([])
    })
  })

  describe('calculateTripDutySummary', () => {
    it('should calculate summary with no items (no duty)', () => {
      const summary = summaryStore.calculateTripDutySummary(testTrip.id)

      expect(summary).toBeDefined()
      expect(summary.tripId).toBe(testTrip.id)
      expect(summary.totalValueBMD).toBe(0)
      expect(summary.totalAllowanceBMD).toBe(600) // 2 people × $300
      expect(summary.taxableAmountBMD).toBe(0)
      expect(summary.estimatedDutyBMD).toBe(0)
      expect(summary.eligibleTravelerCount).toBe(2)
    })

    it('should calculate summary under duty-free limit', () => {
      itemStore.createItem({
        tripId: testTrip.id,
        personId: testPerson1.id,
        categoryId: ItemCategories.GENERAL,
        description: 'Item',
        currency: Currencies.USD,
        amount: 400,
      })

      const summary = summaryStore.calculateTripDutySummary(testTrip.id)

      expect(summary.totalValueBMD).toBe(400)
      expect(summary.totalAllowanceBMD).toBe(600) // 2 people × $300
      expect(summary.taxableAmountBMD).toBe(0)
      expect(summary.estimatedDutyBMD).toBe(0)
    })

    it('should calculate summary over duty-free limit', () => {
      itemStore.createItem({
        tripId: testTrip.id,
        personId: testPerson1.id,
        categoryId: ItemCategories.GENERAL,
        description: 'Expensive Item',
        currency: Currencies.USD,
        amount: 800,
      })

      const summary = summaryStore.calculateTripDutySummary(testTrip.id)

      expect(summary.totalValueBMD).toBe(800)
      expect(summary.totalAllowanceBMD).toBe(600) // 2 people × $300
      expect(summary.taxableAmountBMD).toBe(200) // 800 - 600
      expect(summary.estimatedDutyBMD).toBe(50) // 200 × 25%
      expect(summary.dutyRate).toBe(DutyRates.GENERAL)
    })

    it('should pool allowances across all travelers', () => {
      const tripWith3People = tripStore.createTrip({
        name: 'Group Trip',
        startDate: '2024-07-01',
        endDate: '2024-07-15',
        personIds: [testPerson1.id, testPerson2.id, testChild.id],
      })

      itemStore.createItem({
        tripId: tripWith3People.id,
        personId: testPerson1.id,
        categoryId: ItemCategories.GENERAL,
        description: 'Item',
        currency: Currencies.USD,
        amount: 1000,
      })

      const summary = summaryStore.calculateTripDutySummary(tripWith3People.id)

      expect(summary.totalAllowanceBMD).toBe(900) // 3 people × $300
      expect(summary.taxableAmountBMD).toBe(100) // 1000 - 900
      expect(summary.estimatedDutyBMD).toBe(25) // 100 × 25%
    })

    it('should include person allowances in summary', () => {
      const summary = summaryStore.calculateTripDutySummary(testTrip.id)

      expect(summary.personAllowances).toHaveLength(2)
      expect(summary.personAllowances[0].personName).toBe('Adult 1')
      expect(summary.personAllowances[1].personName).toBe('Adult 2')
    })

    it('should include category breakdowns in summary', () => {
      itemStore.createItem({
        tripId: testTrip.id,
        personId: testPerson1.id,
        categoryId: ItemCategories.GENERAL,
        description: 'Item',
        currency: Currencies.USD,
        amount: 100,
      })

      const summary = summaryStore.calculateTripDutySummary(testTrip.id)

      expect(summary.categoryBreakdowns).toHaveLength(1)
      expect(summary.categoryBreakdowns[0].categoryId).toBe(ItemCategories.GENERAL)
    })

    it('should return null for non-existent trip', () => {
      const summary = summaryStore.calculateTripDutySummary(99999)
      expect(summary).toBeNull()
    })

    it('should include calculation timestamp', () => {
      const summary = summaryStore.calculateTripDutySummary(testTrip.id)
      expect(summary.calculatedAt).toBeDefined()
      expect(new Date(summary.calculatedAt)).toBeInstanceOf(Date)
    })
  })

  describe('isOverDutyFreeLimit', () => {
    it('should return false when under limit', () => {
      itemStore.createItem({
        tripId: testTrip.id,
        personId: testPerson1.id,
        categoryId: ItemCategories.GENERAL,
        description: 'Item',
        currency: Currencies.USD,
        amount: 400,
      })

      expect(summaryStore.isOverDutyFreeLimit(testTrip.id)).toBe(false)
    })

    it('should return true when over limit', () => {
      itemStore.createItem({
        tripId: testTrip.id,
        personId: testPerson1.id,
        categoryId: ItemCategories.GENERAL,
        description: 'Expensive Item',
        currency: Currencies.USD,
        amount: 800,
      })

      expect(summaryStore.isOverDutyFreeLimit(testTrip.id)).toBe(true)
    })

    it('should return false for non-existent trip', () => {
      expect(summaryStore.isOverDutyFreeLimit(99999)).toBe(false)
    })
  })

  describe('remainingDutyFreeAllowance', () => {
    it('should calculate remaining allowance', () => {
      itemStore.createItem({
        tripId: testTrip.id,
        personId: testPerson1.id,
        categoryId: ItemCategories.GENERAL,
        description: 'Item',
        currency: Currencies.USD,
        amount: 400,
      })

      const remaining = summaryStore.remainingDutyFreeAllowance(testTrip.id)
      expect(remaining).toBe(200) // 600 - 400
    })

    it('should return 0 when over limit', () => {
      itemStore.createItem({
        tripId: testTrip.id,
        personId: testPerson1.id,
        categoryId: ItemCategories.GENERAL,
        description: 'Expensive Item',
        currency: Currencies.USD,
        amount: 800,
      })

      const remaining = summaryStore.remainingDutyFreeAllowance(testTrip.id)
      expect(remaining).toBe(0)
    })

    it('should return 0 for non-existent trip', () => {
      const remaining = summaryStore.remainingDutyFreeAllowance(99999)
      expect(remaining).toBe(0)
    })
  })

  describe('getAllTripDutySummaries', () => {
    it('should return summaries for all trips', () => {
      const trip2 = tripStore.createTrip({
        name: 'Trip 2',
        startDate: '2024-08-01',
        endDate: '2024-08-15',
        personIds: [testPerson1.id],
      })

      const summaries = summaryStore.getAllTripDutySummaries

      expect(summaries).toHaveLength(2)
      expect(summaries.map(s => s.tripId)).toContain(testTrip.id)
      expect(summaries.map(s => s.tripId)).toContain(trip2.id)
    })

    it('should filter out invalid trips', () => {
      const summaries = summaryStore.getAllTripDutySummaries
      expect(summaries.every(s => s !== null)).toBe(true)
    })
  })

  describe('totalDutyAllTrips', () => {
    it('should sum duty across all trips', () => {
      const trip2 = tripStore.createTrip({
        name: 'Trip 2',
        startDate: '2024-08-01',
        endDate: '2024-08-15',
        personIds: [testPerson1.id],
      })

      itemStore.createItem({
        tripId: testTrip.id,
        personId: testPerson1.id,
        categoryId: ItemCategories.GENERAL,
        description: 'Item 1',
        currency: Currencies.USD,
        amount: 800, // $200 taxable = $50 duty
      })

      itemStore.createItem({
        tripId: trip2.id,
        personId: testPerson1.id,
        categoryId: ItemCategories.GENERAL,
        description: 'Item 2',
        currency: Currencies.USD,
        amount: 500, // $200 taxable = $50 duty
      })

      const totalDuty = summaryStore.totalDutyAllTrips
      expect(totalDuty).toBe(100) // $50 + $50
    })

    it('should return 0 when no trips have duty', () => {
      const totalDuty = summaryStore.totalDutyAllTrips
      expect(totalDuty).toBe(0)
    })
  })

  describe('Helper Functions', () => {
    describe('formatCurrency', () => {
      it('should format currency with 2 decimal places', () => {
        expect(summaryStore.formatCurrency(100)).toBe('$100.00')
        expect(summaryStore.formatCurrency(50.5)).toBe('$50.50')
        expect(summaryStore.formatCurrency(25.123)).toBe('$25.12')
      })
    })

    describe('formatPercentage', () => {
      it('should format percentage correctly', () => {
        expect(summaryStore.formatPercentage(0.25)).toBe('25%')
        expect(summaryStore.formatPercentage(0.33)).toBe('33%')
        expect(summaryStore.formatPercentage(0.5)).toBe('50%')
      })
    })

    describe('getCategoryName', () => {
      it('should return correct category names', () => {
        expect(summaryStore.getCategoryName(ItemCategories.GENERAL)).toBe('General Goods')
        expect(summaryStore.getCategoryName(ItemCategories.ALCOHOL)).toBe('Alcohol')
        expect(summaryStore.getCategoryName(ItemCategories.TOBACCO)).toBe('Tobacco')
      })

      it('should return "Unknown" for invalid category', () => {
        expect(summaryStore.getCategoryName('invalid')).toBe('Unknown')
      })
    })
  })

  describe('Real-World Scenarios', () => {
    it('should handle family trip with mixed ages', () => {
      const familyTrip = tripStore.createTrip({
        name: 'Family Vacation',
        startDate: '2024-07-01',
        endDate: '2024-07-15',
        personIds: [testPerson1.id, testPerson2.id, testChild.id],
      })

      // Adults buy items
      itemStore.createItem({
        tripId: familyTrip.id,
        personId: testPerson1.id,
        categoryId: ItemCategories.GENERAL,
        description: 'Souvenirs',
        currency: Currencies.USD,
        amount: 400,
      })

      // Child's items
      itemStore.createItem({
        tripId: familyTrip.id,
        personId: testChild.id,
        categoryId: ItemCategories.GENERAL,
        description: 'Toys',
        currency: Currencies.USD,
        amount: 200,
      })

      const summary = summaryStore.calculateTripDutySummary(familyTrip.id)

      expect(summary.eligibleTravelerCount).toBe(3)
      expect(summary.totalAllowanceBMD).toBe(900) // 3 × $300
      expect(summary.totalValueBMD).toBe(600)
      expect(summary.taxableAmountBMD).toBe(0) // Under limit
      expect(summary.estimatedDutyBMD).toBe(0)
    })

    it('should handle single traveler exceeding limit', () => {
      const soloTrip = tripStore.createTrip({
        name: 'Solo Trip',
        startDate: '2024-07-01',
        endDate: '2024-07-15',
        personIds: [testPerson1.id],
      })

      itemStore.createItem({
        tripId: soloTrip.id,
        personId: testPerson1.id,
        categoryId: ItemCategories.JEWELRY,
        description: 'Watch',
        currency: Currencies.USD,
        amount: 1000,
      })

      const summary = summaryStore.calculateTripDutySummary(soloTrip.id)

      expect(summary.totalAllowanceBMD).toBe(300) // 1 person
      expect(summary.taxableAmountBMD).toBe(700) // 1000 - 300
      expect(summary.estimatedDutyBMD).toBe(175) // 700 × 25%
    })

    it('should handle multiple categories', () => {
      itemStore.createItem({
        tripId: testTrip.id,
        personId: testPerson1.id,
        categoryId: ItemCategories.GENERAL,
        description: 'Clothes',
        currency: Currencies.USD,
        amount: 300,
      })

      itemStore.createItem({
        tripId: testTrip.id,
        personId: testPerson1.id,
        categoryId: ItemCategories.ALCOHOL,
        description: 'Wine',
        currency: Currencies.USD,
        amount: 100,
      })

      itemStore.createItem({
        tripId: testTrip.id,
        personId: testPerson2.id,
        categoryId: ItemCategories.PERFUME,
        description: 'Perfume',
        currency: Currencies.USD,
        amount: 150,
      })

      const summary = summaryStore.calculateTripDutySummary(testTrip.id)

      expect(summary.totalValueBMD).toBe(550)
      expect(summary.categoryBreakdowns).toHaveLength(3)
      expect(summary.taxableAmountBMD).toBe(0) // 550 < 600
    })
  })
})
