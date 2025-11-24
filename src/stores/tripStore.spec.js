import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTripStore } from '@/stores/tripStore'
import { TripStatus } from '@/types/trip'

describe('tripStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  describe('Initial State', () => {
    it('should have empty trips array initially', () => {
      const store = useTripStore()
      expect(store.trips).toEqual([])
      expect(store.allTrips).toEqual([])
    })

    it('should have isLoading set to false initially', () => {
      const store = useTripStore()
      expect(store.isLoading).toBe(false)
    })

    it('should have tripCount of 0 initially', () => {
      const store = useTripStore()
      expect(store.tripCount).toBe(0)
    })
  })

  describe('createTrip', () => {
    it('should create a new trip', () => {
      const store = useTripStore()
      const tripData = {
        name: 'Summer Vacation',
        startDate: '2024-07-01',
        endDate: '2024-07-15',
        personIds: [1, 2],
      }

      const trip = store.createTrip(tripData)

      expect(trip.id).toBeDefined()
      expect(trip.name).toBe('Summer Vacation')
      expect(trip.startDate).toBe('2024-07-01')
      expect(trip.endDate).toBe('2024-07-15')
      expect(trip.personIds).toEqual([1, 2])
      expect(trip.legs).toEqual([])
      expect(trip.status).toBe(TripStatus.PLANNING)
      expect(trip.createdAt).toBeDefined()
      expect(trip.updatedAt).toBeDefined()
    })

    it('should add trip to the trips array', () => {
      const store = useTripStore()
      const tripData = {
        name: 'Business Trip',
        startDate: '2024-08-01',
        endDate: '2024-08-05',
        personIds: [1],
      }

      store.createTrip(tripData)

      expect(store.trips.length).toBe(1)
      expect(store.trips[0].name).toBe('Business Trip')
    })

    it('should save to localStorage', () => {
      const store = useTripStore()
      const tripData = {
        name: 'Weekend Getaway',
        startDate: '2024-09-01',
        endDate: '2024-09-03',
        personIds: [1, 2, 3],
      }

      store.createTrip(tripData)

      const stored = JSON.parse(localStorage.getItem('redlane_trips'))
      expect(stored).toHaveLength(1)
      expect(stored[0].name).toBe('Weekend Getaway')
    })

    it('should default personIds to empty array if not provided', () => {
      const store = useTripStore()
      const tripData = {
        name: 'Solo Trip',
        startDate: '2024-10-01',
        endDate: '2024-10-05',
      }

      const trip = store.createTrip(tripData)

      expect(trip.personIds).toEqual([])
    })
  })

  describe('updateTrip', () => {
    it('should update an existing trip', () => {
      const store = useTripStore()
      const trip = store.createTrip({
        name: 'Original Name',
        startDate: '2024-07-01',
        endDate: '2024-07-15',
        personIds: [1],
      })

      const updated = store.updateTrip(trip.id, {
        name: 'Updated Name',
      })

      expect(updated.name).toBe('Updated Name')
      expect(updated.startDate).toBe('2024-07-01') // Unchanged
    })

    it('should update the updatedAt timestamp', () => {
      const store = useTripStore()
      const trip = store.createTrip({
        name: 'Test Trip',
        startDate: '2024-07-01',
        endDate: '2024-07-15',
        personIds: [1],
      })

      const originalUpdatedAt = trip.updatedAt

      setTimeout(() => {
        const updated = store.updateTrip(trip.id, {
          name: 'New Name',
        })

        expect(updated.updatedAt).not.toBe(originalUpdatedAt)
      }, 10)
    })

    it('should return null if trip not found', () => {
      const store = useTripStore()
      const result = store.updateTrip(99999, { name: 'Test' })
      expect(result).toBeNull()
    })

    it('should preserve legs when updating trip', () => {
      const store = useTripStore()
      const trip = store.createTrip({
        name: 'Test Trip',
        startDate: '2024-07-01',
        endDate: '2024-07-15',
        personIds: [1],
      })

      store.addTripLeg(trip.id, {
        from: 'New York',
        to: 'London',
        departureDate: '2024-07-01T10:00:00Z',
      })

      const updated = store.updateTrip(trip.id, { name: 'Updated' })

      expect(updated.legs).toHaveLength(1)
      expect(updated.legs[0].from).toBe('New York')
    })
  })

  describe('deleteTrip', () => {
    it('should delete a trip', () => {
      const store = useTripStore()
      const trip = store.createTrip({
        name: 'To Delete',
        startDate: '2024-07-01',
        endDate: '2024-07-15',
        personIds: [1],
      })

      const result = store.deleteTrip(trip.id)

      expect(result).toBe(true)
      expect(store.trips.length).toBe(0)
    })

    it('should return false if trip not found', () => {
      const store = useTripStore()
      const result = store.deleteTrip(99999)
      expect(result).toBe(false)
    })

    it('should update localStorage after deletion', () => {
      const store = useTripStore()
      const trip1 = store.createTrip({
        name: 'Trip 1',
        startDate: '2024-07-01',
        endDate: '2024-07-15',
        personIds: [1],
      })
      const trip2 = store.createTrip({
        name: 'Trip 2',
        startDate: '2024-08-01',
        endDate: '2024-08-15',
        personIds: [2],
      })

      store.deleteTrip(trip1.id)

      const stored = JSON.parse(localStorage.getItem('redlane_trips'))
      expect(stored).toHaveLength(1)
      expect(stored[0].id).toBe(trip2.id)
    })
  })

  describe('updateTripStatus', () => {
    it('should update trip status', () => {
      const store = useTripStore()
      const trip = store.createTrip({
        name: 'Test Trip',
        startDate: '2024-07-01',
        endDate: '2024-07-15',
        personIds: [1],
      })

      const updated = store.updateTripStatus(trip.id, TripStatus.ACTIVE)

      expect(updated.status).toBe(TripStatus.ACTIVE)
    })
  })

  describe('Getters', () => {
    beforeEach(() => {
      const store = useTripStore()
      store.createTrip({
        name: 'Planning Trip',
        startDate: '2024-07-01',
        endDate: '2024-07-15',
        personIds: [1, 2],
      })
      const activeTrip = store.createTrip({
        name: 'Active Trip',
        startDate: '2024-08-01',
        endDate: '2024-08-15',
        personIds: [1],
      })
      store.updateTripStatus(activeTrip.id, TripStatus.ACTIVE)
      const completedTrip = store.createTrip({
        name: 'Completed Trip',
        startDate: '2024-06-01',
        endDate: '2024-06-15',
        personIds: [2, 3],
      })
      store.updateTripStatus(completedTrip.id, TripStatus.COMPLETED)
    })

    it('should get all trips', () => {
      const store = useTripStore()
      expect(store.allTrips).toHaveLength(3)
    })

    it('should get active trips', () => {
      const store = useTripStore()
      expect(store.activeTrips).toHaveLength(2) // Planning + Active
      expect(store.activeTrips.every(t => 
        t.status === TripStatus.PLANNING || t.status === TripStatus.ACTIVE
      )).toBe(true)
    })

    it('should get completed trips', () => {
      const store = useTripStore()
      expect(store.completedTrips).toHaveLength(1)
      expect(store.completedTrips[0].status).toBe(TripStatus.COMPLETED)
    })

    it('should get trip by ID', () => {
      const store = useTripStore()
      const trip = store.trips[0]
      const found = store.getTripById(trip.id)
      expect(found).toEqual(trip)
    })

    it('should return null for non-existent trip ID', () => {
      const store = useTripStore()
      const found = store.getTripById(99999)
      expect(found).toBeNull()
    })

    it('should get trips by person ID', () => {
      const store = useTripStore()
      const tripsForPerson1 = store.getTripsByPersonId(1)
      expect(tripsForPerson1).toHaveLength(2)
    })

    it('should return correct trip count', () => {
      const store = useTripStore()
      expect(store.tripCount).toBe(3)
    })
  })

  describe('Trip Legs', () => {
    let store
    let trip

    beforeEach(() => {
      store = useTripStore()
      trip = store.createTrip({
        name: 'Multi-Leg Trip',
        startDate: '2024-07-01',
        endDate: '2024-07-15',
        personIds: [1],
      })
    })

    describe('addTripLeg', () => {
      it('should add a leg to a trip', () => {
        const legData = {
          from: 'New York',
          to: 'London',
          departureDate: '2024-07-01T10:00:00Z',
          arrivalDate: '2024-07-01T22:00:00Z',
          carrier: 'British Airways',
          flightNumber: 'BA178',
        }

        const leg = store.addTripLeg(trip.id, legData)

        expect(leg).toBeDefined()
        expect(leg.id).toBeDefined()
        expect(leg.from).toBe('New York')
        expect(leg.to).toBe('London')
        expect(leg.order).toBe(1)
      })

      it('should add multiple legs in order', () => {
        store.addTripLeg(trip.id, {
          from: 'New York',
          to: 'London',
          departureDate: '2024-07-01T10:00:00Z',
        })
        store.addTripLeg(trip.id, {
          from: 'London',
          to: 'Paris',
          departureDate: '2024-07-08T14:00:00Z',
        })

        const updatedTrip = store.getTripById(trip.id)
        expect(updatedTrip.legs).toHaveLength(2)
        expect(updatedTrip.legs[0].order).toBe(1)
        expect(updatedTrip.legs[1].order).toBe(2)
      })

      it('should return null if trip not found', () => {
        const result = store.addTripLeg(99999, {
          from: 'A',
          to: 'B',
          departureDate: '2024-07-01T10:00:00Z',
        })
        expect(result).toBeNull()
      })
    })

    describe('updateTripLeg', () => {
      it('should update a trip leg', () => {
        const leg = store.addTripLeg(trip.id, {
          from: 'New York',
          to: 'London',
          departureDate: '2024-07-01T10:00:00Z',
        })

        const updated = store.updateTripLeg(trip.id, leg.id, {
          carrier: 'American Airlines',
        })

        expect(updated.carrier).toBe('American Airlines')
        expect(updated.from).toBe('New York') // Unchanged
      })

      it('should return null if trip not found', () => {
        const result = store.updateTripLeg(99999, 1, { carrier: 'Test' })
        expect(result).toBeNull()
      })

      it('should return null if leg not found', () => {
        const result = store.updateTripLeg(trip.id, 99999, { carrier: 'Test' })
        expect(result).toBeNull()
      })
    })

    describe('deleteTripLeg', () => {
      it('should delete a trip leg', () => {
        const leg = store.addTripLeg(trip.id, {
          from: 'New York',
          to: 'London',
          departureDate: '2024-07-01T10:00:00Z',
        })

        const result = store.deleteTripLeg(trip.id, leg.id)

        expect(result).toBe(true)
        const updatedTrip = store.getTripById(trip.id)
        expect(updatedTrip.legs).toHaveLength(0)
      })

      it('should reorder remaining legs after deletion', () => {
        const leg1 = store.addTripLeg(trip.id, {
          from: 'New York',
          to: 'London',
          departureDate: '2024-07-01T10:00:00Z',
        })
        store.addTripLeg(trip.id, {
          from: 'London',
          to: 'Paris',
          departureDate: '2024-07-08T14:00:00Z',
        })
        store.addTripLeg(trip.id, {
          from: 'Paris',
          to: 'New York',
          departureDate: '2024-07-15T10:00:00Z',
        })

        store.deleteTripLeg(trip.id, leg1.id)

        const updatedTrip = store.getTripById(trip.id)
        expect(updatedTrip.legs).toHaveLength(2)
        expect(updatedTrip.legs[0].order).toBe(1)
        expect(updatedTrip.legs[1].order).toBe(2)
      })

      it('should return false if trip not found', () => {
        const result = store.deleteTripLeg(99999, 1)
        expect(result).toBe(false)
      })

      it('should return false if leg not found', () => {
        const result = store.deleteTripLeg(trip.id, 99999)
        expect(result).toBe(false)
      })
    })

    describe('reorderTripLegs', () => {
      it('should reorder trip legs', () => {
        const leg1 = store.addTripLeg(trip.id, {
          from: 'New York',
          to: 'London',
          departureDate: '2024-07-01T10:00:00Z',
        })
        const leg2 = store.addTripLeg(trip.id, {
          from: 'London',
          to: 'Paris',
          departureDate: '2024-07-08T14:00:00Z',
        })
        const leg3 = store.addTripLeg(trip.id, {
          from: 'Paris',
          to: 'New York',
          departureDate: '2024-07-15T10:00:00Z',
        })

        const result = store.reorderTripLegs(trip.id, [leg3.id, leg1.id, leg2.id])

        expect(result).toBe(true)
        const updatedTrip = store.getTripById(trip.id)
        expect(updatedTrip.legs[0].id).toBe(leg3.id)
        expect(updatedTrip.legs[0].order).toBe(1)
        expect(updatedTrip.legs[1].id).toBe(leg1.id)
        expect(updatedTrip.legs[1].order).toBe(2)
        expect(updatedTrip.legs[2].id).toBe(leg2.id)
        expect(updatedTrip.legs[2].order).toBe(3)
      })

      it('should return false if trip not found', () => {
        const result = store.reorderTripLegs(99999, [1, 2, 3])
        expect(result).toBe(false)
      })

      it('should return false if any leg ID is invalid', () => {
        const leg1 = store.addTripLeg(trip.id, {
          from: 'New York',
          to: 'London',
          departureDate: '2024-07-01T10:00:00Z',
        })

        const result = store.reorderTripLegs(trip.id, [leg1.id, 99999])
        expect(result).toBe(false)
      })
    })
  })

  describe('clearAll', () => {
    it('should clear all trips', () => {
      const store = useTripStore()
      store.createTrip({
        name: 'Test',
        startDate: '2024-07-01',
        endDate: '2024-07-15',
        personIds: [1],
      })

      store.clearAll()

      expect(store.trips).toEqual([])
      expect(store.tripCount).toBe(0)
    })

    it('should clear localStorage', () => {
      const store = useTripStore()
      store.createTrip({
        name: 'Test',
        startDate: '2024-07-01',
        endDate: '2024-07-15',
        personIds: [1],
      })

      store.clearAll()

      expect(localStorage.getItem('redlane_trips')).toBeNull()
    })
  })

  describe('Persistence', () => {
    it('should load from localStorage on initialization', () => {
      const store = useTripStore()
      store.createTrip({
        name: 'Persisted Trip',
        startDate: '2024-07-01',
        endDate: '2024-07-15',
        personIds: [1],
      })

      // Create a new store instance (simulating page reload)
      const newPinia = createPinia()
      setActivePinia(newPinia)
      const newStore = useTripStore()

      expect(newStore.trips).toHaveLength(1)
      expect(newStore.trips[0].name).toBe('Persisted Trip')
    })

    it('should handle corrupted localStorage gracefully', () => {
      localStorage.setItem('redlane_trips', 'invalid json')

      const store = useTripStore()
      expect(store.trips).toEqual([])
    })
  })
})
