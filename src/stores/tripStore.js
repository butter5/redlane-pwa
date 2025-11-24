import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TripStatus } from '@/types/trip'

const STORAGE_KEY = 'redlane_trips'

/**
 * Trip Store
 * Manages trips and their associated legs
 */
export const useTripStore = defineStore('trip', () => {
  // State
  const trips = ref([])
  const isLoading = ref(false)

  // Load from localStorage on initialization
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        trips.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load trips from storage:', error)
      trips.value = []
    }
  }

  // Save to localStorage
  const saveToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips.value))
    } catch (error) {
      console.error('Failed to save trips to storage:', error)
    }
  }

  // Getters
  const allTrips = computed(() => trips.value)
  
  const activeTrips = computed(() =>
    trips.value.filter(t => t.status === TripStatus.ACTIVE || t.status === TripStatus.PLANNING)
  )
  
  const completedTrips = computed(() =>
    trips.value.filter(t => t.status === TripStatus.COMPLETED)
  )
  
  const getTripById = computed(() => {
    return (id) => trips.value.find(t => t.id === id) || null
  })

  const getTripsByPersonId = computed(() => {
    return (personId) => trips.value.filter(t => t.personIds.includes(personId))
  })

  const tripCount = computed(() => trips.value.length)

  // Actions - Trips
  
  /**
   * Create a new trip
   * @param {import('@/types/trip').TripInput} tripData 
   * @returns {import('@/types/trip').Trip}
   */
  const createTrip = (tripData) => {
    const now = new Date().toISOString()
    const newTrip = {
      id: Date.now() + trips.value.length,
      name: tripData.name,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      personIds: tripData.personIds || [],
      legs: [],
      status: TripStatus.PLANNING,
      createdAt: now,
      updatedAt: now,
    }
    
    trips.value.push(newTrip)
    saveToStorage()
    
    return newTrip
  }

  /**
   * Update an existing trip
   * @param {number} id 
   * @param {Partial<import('@/types/trip').TripInput>} updates 
   * @returns {import('@/types/trip').Trip | null}
   */
  const updateTrip = (id, updates) => {
    const index = trips.value.findIndex(t => t.id === id)
    if (index === -1) return null

    const updatedTrip = {
      ...trips.value[index],
      ...updates,
      id, // Ensure ID cannot be changed
      legs: trips.value[index].legs, // Preserve legs unless explicitly updated
      updatedAt: new Date().toISOString(),
    }
    
    trips.value[index] = updatedTrip
    saveToStorage()
    
    return updatedTrip
  }

  /**
   * Delete a trip
   * @param {number} id 
   * @returns {boolean} Success status
   */
  const deleteTrip = (id) => {
    const index = trips.value.findIndex(t => t.id === id)
    if (index === -1) return false

    trips.value.splice(index, 1)
    saveToStorage()
    
    return true
  }

  /**
   * Update trip status
   * @param {number} id 
   * @param {string} status 
   * @returns {import('@/types/trip').Trip | null}
   */
  const updateTripStatus = (id, status) => {
    return updateTrip(id, { status })
  }

  // Actions - Trip Legs

  /**
   * Add a leg to a trip
   * @param {number} tripId 
   * @param {import('@/types/trip').TripLegInput} legData 
   * @returns {import('@/types/trip').TripLeg | null}
   */
  const addTripLeg = (tripId, legData) => {
    const trip = getTripById.value(tripId)
    if (!trip) return null

    const newLeg = {
      id: Date.now() + trip.legs.length,
      from: legData.from,
      to: legData.to,
      departureDate: legData.departureDate,
      arrivalDate: legData.arrivalDate || null,
      carrier: legData.carrier || null,
      flightNumber: legData.flightNumber || null,
      order: trip.legs.length + 1,
    }

    trip.legs.push(newLeg)
    trip.updatedAt = new Date().toISOString()
    saveToStorage()
    
    return newLeg
  }

  /**
   * Update a trip leg
   * @param {number} tripId 
   * @param {number} legId 
   * @param {Partial<import('@/types/trip').TripLegInput>} updates 
   * @returns {import('@/types/trip').TripLeg | null}
   */
  const updateTripLeg = (tripId, legId, updates) => {
    const trip = getTripById.value(tripId)
    if (!trip) return null

    const legIndex = trip.legs.findIndex(l => l.id === legId)
    if (legIndex === -1) return null

    const updatedLeg = {
      ...trip.legs[legIndex],
      ...updates,
      id: legId, // Ensure ID cannot be changed
    }

    trip.legs[legIndex] = updatedLeg
    trip.updatedAt = new Date().toISOString()
    saveToStorage()
    
    return updatedLeg
  }

  /**
   * Delete a trip leg
   * @param {number} tripId 
   * @param {number} legId 
   * @returns {boolean} Success status
   */
  const deleteTripLeg = (tripId, legId) => {
    const trip = getTripById.value(tripId)
    if (!trip) return false

    const legIndex = trip.legs.findIndex(l => l.id === legId)
    if (legIndex === -1) return false

    trip.legs.splice(legIndex, 1)
    
    // Reorder remaining legs
    trip.legs.forEach((leg, index) => {
      leg.order = index + 1
    })

    trip.updatedAt = new Date().toISOString()
    saveToStorage()
    
    return true
  }

  /**
   * Reorder trip legs
   * @param {number} tripId 
   * @param {number[]} legIds - Array of leg IDs in desired order
   * @returns {boolean} Success status
   */
  const reorderTripLegs = (tripId, legIds) => {
    const trip = getTripById.value(tripId)
    if (!trip) return false

    // Validate that all leg IDs exist
    const existingLegIds = trip.legs.map(l => l.id)
    if (!legIds.every(id => existingLegIds.includes(id))) {
      return false
    }

    // Create new ordered array
    const reorderedLegs = legIds.map(id => {
      const leg = trip.legs.find(l => l.id === id)
      return leg
    }).filter(Boolean)

    // Update order property
    reorderedLegs.forEach((leg, index) => {
      leg.order = index + 1
    })

    trip.legs = reorderedLegs
    trip.updatedAt = new Date().toISOString()
    saveToStorage()
    
    return true
  }

  /**
   * Clear all trips (useful for logout or testing)
   */
  const clearAll = () => {
    trips.value = []
    localStorage.removeItem(STORAGE_KEY)
  }

  // Initialize on store creation
  loadFromStorage()

  return {
    // State
    trips,
    isLoading,
    // Getters
    allTrips,
    activeTrips,
    completedTrips,
    getTripById,
    getTripsByPersonId,
    tripCount,
    // Trip Actions
    createTrip,
    updateTrip,
    deleteTrip,
    updateTripStatus,
    // Leg Actions
    addTripLeg,
    updateTripLeg,
    deleteTripLeg,
    reorderTripLegs,
    // Utility
    clearAll,
    // Internal helpers (exposed for testing)
    loadFromStorage,
    saveToStorage,
  }
})
