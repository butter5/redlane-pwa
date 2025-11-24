import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePersonStore } from '@/stores/personStore'
import { PersonRelationships } from '@/types/person'

describe('personStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  describe('Initial State', () => {
    it('should have empty people array initially', () => {
      const store = usePersonStore()
      expect(store.people).toEqual([])
      expect(store.allPeople).toEqual([])
    })

    it('should have isLoading set to false initially', () => {
      const store = usePersonStore()
      expect(store.isLoading).toBe(false)
    })

    it('should have personCount of 0 initially', () => {
      const store = usePersonStore()
      expect(store.personCount).toBe(0)
    })

    it('should have no self person initially', () => {
      const store = usePersonStore()
      expect(store.selfPerson).toBeNull()
    })
  })

  describe('createPerson', () => {
    it('should create a new person', () => {
      const store = usePersonStore()
      const personData = {
        fullName: 'John Doe',
        dateOfBirth: '1990-01-15',
        relationship: PersonRelationships.SELF,
        isSelf: true,
      }

      const person = store.createPerson(personData)

      expect(person.id).toBeDefined()
      expect(person.fullName).toBe('John Doe')
      expect(person.dateOfBirth).toBe('1990-01-15')
      expect(person.relationship).toBe(PersonRelationships.SELF)
      expect(person.isSelf).toBe(true)
      expect(person.createdAt).toBeDefined()
      expect(person.updatedAt).toBeDefined()
    })

    it('should add person to the people array', () => {
      const store = usePersonStore()
      const personData = {
        fullName: 'Jane Smith',
        dateOfBirth: '1985-05-20',
        relationship: PersonRelationships.SPOUSE,
      }

      store.createPerson(personData)

      expect(store.people.length).toBe(1)
      expect(store.people[0].fullName).toBe('Jane Smith')
    })

    it('should save to localStorage', () => {
      const store = usePersonStore()
      const personData = {
        fullName: 'Bob Johnson',
        dateOfBirth: '2010-03-10',
        relationship: PersonRelationships.CHILD,
      }

      store.createPerson(personData)

      const stored = JSON.parse(localStorage.getItem('redlane_people'))
      expect(stored).toHaveLength(1)
      expect(stored[0].fullName).toBe('Bob Johnson')
    })

    it('should default isSelf to false if not provided', () => {
      const store = usePersonStore()
      const personData = {
        fullName: 'Alice Brown',
        dateOfBirth: '1995-07-25',
        relationship: PersonRelationships.FRIEND,
      }

      const person = store.createPerson(personData)

      expect(person.isSelf).toBe(false)
    })
  })

  describe('updatePerson', () => {
    it('should update an existing person', () => {
      const store = usePersonStore()
      const person = store.createPerson({
        fullName: 'Original Name',
        dateOfBirth: '1990-01-01',
        relationship: PersonRelationships.SELF,
      })

      const updated = store.updatePerson(person.id, {
        fullName: 'Updated Name',
      })

      expect(updated.fullName).toBe('Updated Name')
      expect(updated.dateOfBirth).toBe('1990-01-01') // Unchanged
    })

    it('should update the updatedAt timestamp', () => {
      const store = usePersonStore()
      const person = store.createPerson({
        fullName: 'Test Person',
        dateOfBirth: '1990-01-01',
        relationship: PersonRelationships.SELF,
      })

      const originalUpdatedAt = person.updatedAt

      // Wait a tiny bit to ensure timestamp changes
      setTimeout(() => {
        const updated = store.updatePerson(person.id, {
          fullName: 'New Name',
        })

        expect(updated.updatedAt).not.toBe(originalUpdatedAt)
      }, 10)
    })

    it('should return null if person not found', () => {
      const store = usePersonStore()
      const result = store.updatePerson(99999, { fullName: 'Test' })
      expect(result).toBeNull()
    })

    it('should not allow changing the ID', () => {
      const store = usePersonStore()
      const person = store.createPerson({
        fullName: 'Test',
        dateOfBirth: '1990-01-01',
        relationship: PersonRelationships.SELF,
      })

      const originalId = person.id
      store.updatePerson(person.id, { id: 12345 })

      expect(store.people[0].id).toBe(originalId)
    })

    it('should save changes to localStorage', () => {
      const store = usePersonStore()
      const person = store.createPerson({
        fullName: 'Original',
        dateOfBirth: '1990-01-01',
        relationship: PersonRelationships.SELF,
      })

      store.updatePerson(person.id, { fullName: 'Updated' })

      const stored = JSON.parse(localStorage.getItem('redlane_people'))
      expect(stored[0].fullName).toBe('Updated')
    })
  })

  describe('deletePerson', () => {
    it('should delete a person', () => {
      const store = usePersonStore()
      const person = store.createPerson({
        fullName: 'To Delete',
        dateOfBirth: '1990-01-01',
        relationship: PersonRelationships.FRIEND,
      })

      const result = store.deletePerson(person.id)

      expect(result).toBe(true)
      expect(store.people.length).toBe(0)
    })

    it('should not allow deleting self person', () => {
      const store = usePersonStore()
      const person = store.createPerson({
        fullName: 'Self',
        dateOfBirth: '1990-01-01',
        relationship: PersonRelationships.SELF,
        isSelf: true,
      })

      expect(() => store.deletePerson(person.id)).toThrow('Cannot delete self person')
      expect(store.people.length).toBe(1)
    })

    it('should return false if person not found', () => {
      const store = usePersonStore()
      const result = store.deletePerson(99999)
      expect(result).toBe(false)
    })

    it('should update localStorage after deletion', () => {
      const store = usePersonStore()
      const person1 = store.createPerson({
        fullName: 'Person 1',
        dateOfBirth: '1990-01-01',
        relationship: PersonRelationships.FRIEND,
      })
      const person2 = store.createPerson({
        fullName: 'Person 2',
        dateOfBirth: '1995-01-01',
        relationship: PersonRelationships.FRIEND,
      })

      store.deletePerson(person1.id)

      const stored = JSON.parse(localStorage.getItem('redlane_people'))
      expect(stored).toHaveLength(1)
      expect(stored[0].id).toBe(person2.id)
    })
  })

  describe('Getters', () => {
    let testStore

    beforeEach(() => {
      testStore = usePersonStore()
      testStore.clearAll() // Ensure clean state
      testStore.createPerson({
        fullName: 'Self Person',
        dateOfBirth: '1990-01-01',
        relationship: PersonRelationships.SELF,
        isSelf: true,
      })
      testStore.createPerson({
        fullName: 'Spouse Person',
        dateOfBirth: '1992-02-02',
        relationship: PersonRelationships.SPOUSE,
      })
      testStore.createPerson({
        fullName: 'Child Person',
        dateOfBirth: '2015-03-03',
        relationship: PersonRelationships.CHILD,
      })
    })

    it('should get all people', () => {
      expect(testStore.allPeople).toHaveLength(3)
    })

    it('should get self person', () => {
      expect(testStore.selfPerson).toBeDefined()
      expect(testStore.selfPerson.fullName).toBe('Self Person')
      expect(testStore.selfPerson.isSelf).toBe(true)
    })

    it('should get other people (not self)', () => {
      expect(testStore.otherPeople).toHaveLength(2)
      expect(testStore.otherPeople.every(p => !p.isSelf)).toBe(true)
    })

    it('should get person by ID', () => {
      const person = testStore.people[0]
      const found = testStore.getPersonById(person.id)
      expect(found).toEqual(person)
    })

    it('should return null for non-existent ID', () => {
      const found = testStore.getPersonById(99999)
      expect(found).toBeNull()
    })

    it('should get people by IDs array', () => {
      const ids = [testStore.people[0].id, testStore.people[2].id]
      const found = testStore.getPeopleByIds(ids)
      expect(found).toHaveLength(2)
      expect(found.map(p => p.id)).toContain(ids[0])
      expect(found.map(p => p.id)).toContain(ids[1])
    })

    it('should return correct person count', () => {
      expect(testStore.personCount).toBe(3)
    })
  })

  describe('initializeSelf', () => {
    it('should create self person', () => {
      const store = usePersonStore()
      store.initializeSelf({
        fullName: 'Initial Self',
        dateOfBirth: '1990-01-01',
      })

      expect(store.selfPerson).toBeDefined()
      expect(store.selfPerson.fullName).toBe('Initial Self')
      expect(store.selfPerson.isSelf).toBe(true)
      expect(store.selfPerson.relationship).toBe(PersonRelationships.SELF)
    })

    it('should throw error if self already exists', () => {
      const store = usePersonStore()
      store.initializeSelf({
        fullName: 'First Self',
        dateOfBirth: '1990-01-01',
      })

      expect(() =>
        store.initializeSelf({
          fullName: 'Second Self',
          dateOfBirth: '1991-01-01',
        })
      ).toThrow('Self person already exists')
    })
  })

  describe('clearAll', () => {
    it('should clear all people', () => {
      const store = usePersonStore()
      store.createPerson({
        fullName: 'Test',
        dateOfBirth: '1990-01-01',
        relationship: PersonRelationships.SELF,
      })

      store.clearAll()

      expect(store.people).toEqual([])
      expect(store.personCount).toBe(0)
    })

    it('should clear localStorage', () => {
      const store = usePersonStore()
      store.createPerson({
        fullName: 'Test',
        dateOfBirth: '1990-01-01',
        relationship: PersonRelationships.SELF,
      })

      store.clearAll()

      expect(localStorage.getItem('redlane_people')).toBeNull()
    })
  })

  describe('calculateAge', () => {
    it('should calculate age correctly', () => {
      const store = usePersonStore()
      const age = store.calculateAge('1990-01-15', '2024-01-15')
      expect(age).toBe(34)
    })

    it('should calculate age before birthday in year', () => {
      const store = usePersonStore()
      const age = store.calculateAge('1990-06-15', '2024-01-15')
      expect(age).toBe(33)
    })

    it('should calculate age after birthday in year', () => {
      const store = usePersonStore()
      const age = store.calculateAge('1990-01-15', '2024-06-15')
      expect(age).toBe(34)
    })

    it('should use current date if no atDate provided', () => {
      const store = usePersonStore()
      const age = store.calculateAge('2000-01-01')
      expect(age).toBeGreaterThanOrEqual(24)
    })
  })

  describe('Persistence', () => {
    it('should load from localStorage on initialization', () => {
      const store = usePersonStore()
      store.createPerson({
        fullName: 'Persisted Person',
        dateOfBirth: '1990-01-01',
        relationship: PersonRelationships.SELF,
      })

      // Create a new store instance (simulating page reload)
      const newPinia = createPinia()
      setActivePinia(newPinia)
      const newStore = usePersonStore()

      expect(newStore.people).toHaveLength(1)
      expect(newStore.people[0].fullName).toBe('Persisted Person')
    })

    it('should handle corrupted localStorage gracefully', () => {
      localStorage.setItem('redlane_people', 'invalid json')

      const store = usePersonStore()
      expect(store.people).toEqual([])
    })
  })
})
