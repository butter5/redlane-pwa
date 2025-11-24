import { defineStore } from 'pinia'
import { computed } from 'vue'
import { usePersonStore } from './personStore'
import { useTripStore } from './tripStore'
import { useItemStore } from './itemStore'
import { DutyRates, Allowances } from '@/types/dutySummary'
import { ItemCategories } from '@/types/item'

/**
 * Trip Duty Summary Store
 * Calculates duty estimates for trips based on items, people, and allowances
 * This is a computed store - it doesn't persist state but derives it from other stores
 */
export const useTripDutySummaryStore = defineStore('tripDutySummary', () => {
  const personStore = usePersonStore()
  const tripStore = useTripStore()
  const itemStore = useItemStore()

  /**
   * Calculate person allowances for a trip
   * @param {number} tripId
   * @returns {Array<import('@/types/dutySummary').PersonAllowance>}
   */
  const calculatePersonAllowances = (tripId) => {
    const trip = tripStore.getTripById(tripId)
    if (!trip) return []

    const people = personStore.getPeopleByIds(trip.personIds)
    const arrivalDate = trip.endDate // Use trip end date as arrival date

    return people.map(person => {
      const age = personStore.calculateAge(person.dateOfBirth, arrivalDate)
      const isAdult = age >= Allowances.ALCOHOL_MINIMUM_AGE

      return {
        personId: person.id,
        personName: person.fullName,
        age,
        eligible: true, // All travelers are eligible for general allowance
        generalAllowance: Allowances.GENERAL_PER_PERSON,
        alcoholEligible: isAdult,
        tobaccoEligible: isAdult,
      }
    })
  }

  /**
   * Calculate category breakdown for a trip
   * @param {number} tripId
   * @returns {Array<import('@/types/dutySummary').CategoryBreakdown>}
   */
  const calculateCategoryBreakdown = (tripId) => {
    return itemStore.getCategoryBreakdownByTrip(tripId).map(breakdown => ({
      categoryId: breakdown.categoryId,
      categoryName: getCategoryName(breakdown.categoryId),
      totalValueBMD: breakdown.totalValueBMD,
      itemCount: breakdown.itemCount,
    }))
  }

  /**
   * Get category name by ID
   * @param {string} categoryId
   * @returns {string}
   */
  const getCategoryName = (categoryId) => {
    const categoryMap = {
      [ItemCategories.GENERAL]: 'General Goods',
      [ItemCategories.ALCOHOL]: 'Alcohol',
      [ItemCategories.TOBACCO]: 'Tobacco',
      [ItemCategories.PERFUME]: 'Perfume',
      [ItemCategories.GIFTS]: 'Gifts',
      [ItemCategories.ELECTRONICS]: 'Electronics',
      [ItemCategories.JEWELRY]: 'Jewelry',
      [ItemCategories.CLOTHING]: 'Clothing',
      [ItemCategories.FOOD]: 'Food',
      [ItemCategories.OTHER]: 'Other',
    }
    return categoryMap[categoryId] || 'Unknown'
  }

  /**
   * Calculate trip duty summary
   * @param {number} tripId
   * @returns {import('@/types/dutySummary').TripDutySummary}
   */
  const calculateTripDutySummary = (tripId) => {
    const trip = tripStore.getTripById(tripId)
    if (!trip) {
      return null
    }

    // Get all items for the trip
    const items = itemStore.getItemsByTripId(tripId)
    
    // Calculate total value
    const totalValueBMD = items.reduce((sum, item) => sum + item.amountBMD, 0)

    // Get person allowances
    const personAllowances = calculatePersonAllowances(tripId)
    const eligibleTravelerCount = personAllowances.filter(p => p.eligible).length

    // Calculate pooled general allowance
    const totalAllowanceBMD = eligibleTravelerCount * Allowances.GENERAL_PER_PERSON

    // Calculate taxable amount
    const taxableAmountBMD = Math.max(0, totalValueBMD - totalAllowanceBMD)

    // Calculate duty (25% on general goods)
    const estimatedDutyBMD = taxableAmountBMD * DutyRates.GENERAL

    // Get category breakdown
    const categoryBreakdowns = calculateCategoryBreakdown(tripId)

    return {
      tripId,
      totalValueBMD,
      totalAllowanceBMD,
      taxableAmountBMD,
      estimatedDutyBMD,
      dutyRate: DutyRates.GENERAL,
      personAllowances,
      categoryBreakdowns,
      eligibleTravelerCount,
      calculatedAt: new Date().toISOString(),
    }
  }

  /**
   * Get duty summary for a trip (computed)
   */
  const getTripDutySummary = computed(() => {
    return (tripId) => calculateTripDutySummary(tripId)
  })

  /**
   * Calculate if a trip is over the duty-free limit
   * @param {number} tripId
   * @returns {boolean}
   */
  const isOverDutyFreeLimit = (tripId) => {
    const summary = calculateTripDutySummary(tripId)
    return summary ? summary.taxableAmountBMD > 0 : false
  }

  /**
   * Calculate how much more can be spent duty-free for a trip
   * @param {number} tripId
   * @returns {number} Amount in BMD
   */
  const remainingDutyFreeAllowance = (tripId) => {
    const summary = calculateTripDutySummary(tripId)
    if (!summary) return 0
    
    return Math.max(0, summary.totalAllowanceBMD - summary.totalValueBMD)
  }

  /**
   * Get duty summary for all trips
   * @returns {Array<import('@/types/dutySummary').TripDutySummary>}
   */
  const getAllTripDutySummaries = computed(() => {
    return tripStore.allTrips.map(trip => calculateTripDutySummary(trip.id)).filter(Boolean)
  })

  /**
   * Calculate total duty across all trips
   * @returns {number}
   */
  const totalDutyAllTrips = computed(() => {
    return getAllTripDutySummaries.value.reduce(
      (sum, summary) => sum + summary.estimatedDutyBMD,
      0
    )
  })

  /**
   * Format currency for display
   * @param {number} amount
   * @returns {string}
   */
  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`
  }

  /**
   * Format percentage for display
   * @param {number} rate
   * @returns {string}
   */
  const formatPercentage = (rate) => {
    return `${(rate * 100).toFixed(0)}%`
  }

  return {
    // Main calculation functions
    calculateTripDutySummary,
    calculatePersonAllowances,
    calculateCategoryBreakdown,
    // Getters
    getTripDutySummary,
    getAllTripDutySummaries,
    totalDutyAllTrips,
    // Helper functions
    isOverDutyFreeLimit,
    remainingDutyFreeAllowance,
    formatCurrency,
    formatPercentage,
    getCategoryName,
  }
})
