import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { PersonRelationships } from '@/types/person'

const STORAGE_KEY = 'redlane_people'

/**
 * Person Store
 * Manages all people that the user can declare for
 */
export const usePersonStore = defineStore('person', () => {
  // State
  const people = ref([])
  const isLoading = ref(false)

  // Load from localStorage on initialization
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        people.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load people from storage:', error)
      people.value = []
    }
  }

  // Save to localStorage
  const saveToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(people.value))
    } catch (error) {
      console.error('Failed to save people to storage:', error)
    }
  }

  // Getters
  const allPeople = computed(() => people.value)
  
  const selfPerson = computed(() => 
    people.value.find(p => p.isSelf) || null
  )
  
  const otherPeople = computed(() => 
    people.value.filter(p => !p.isSelf)
  )
  
  const getPersonById = computed(() => {
    return (id) => people.value.find(p => p.id === id) || null
  })
  
  const getPeopleByIds = computed(() => {
    return (ids) => people.value.filter(p => ids.includes(p.id))
  })

  const personCount = computed(() => people.value.length)

  // Actions
  
  /**
   * Create a new person
   * @param {import('@/types/person').PersonInput} personData 
   * @returns {import('@/types/person').Person}
   */
  const createPerson = (personData) => {
    const now = new Date().toISOString()
    // Generate unique ID - use Date.now() + length to avoid collisions in quick succession
    const newPerson = {
      id: Date.now() + people.value.length,
      fullName: personData.fullName,
      dateOfBirth: personData.dateOfBirth,
      relationship: personData.relationship,
      isSelf: personData.isSelf || false,
      createdAt: now,
      updatedAt: now,
    }
    
    people.value.push(newPerson)
    saveToStorage()
    
    return newPerson
  }

  /**
   * Update an existing person
   * @param {number} id 
   * @param {Partial<import('@/types/person').PersonInput>} updates 
   * @returns {import('@/types/person').Person | null}
   */
  const updatePerson = (id, updates) => {
    const index = people.value.findIndex(p => p.id === id)
    if (index === -1) return null

    const updatedPerson = {
      ...people.value[index],
      ...updates,
      id, // Ensure ID cannot be changed
      updatedAt: new Date().toISOString(),
    }
    
    people.value[index] = updatedPerson
    saveToStorage()
    
    return updatedPerson
  }

  /**
   * Delete a person
   * @param {number} id 
   * @returns {boolean} Success status
   */
  const deletePerson = (id) => {
    const index = people.value.findIndex(p => p.id === id)
    if (index === -1) return false

    // Don't allow deleting self
    if (people.value[index].isSelf) {
      throw new Error('Cannot delete self person')
    }

    people.value.splice(index, 1)
    saveToStorage()
    
    return true
  }

  /**
   * Initialize with a self person (typically on first app use)
   * @param {Object} selfData
   * @param {string} selfData.fullName
   * @param {string} selfData.dateOfBirth
   */
  const initializeSelf = (selfData) => {
    if (selfPerson.value) {
      throw new Error('Self person already exists')
    }

    createPerson({
      fullName: selfData.fullName,
      dateOfBirth: selfData.dateOfBirth,
      relationship: PersonRelationships.SELF,
      isSelf: true,
    })
  }

  /**
   * Clear all people (useful for logout or testing)
   */
  const clearAll = () => {
    people.value = []
    localStorage.removeItem(STORAGE_KEY)
  }

  /**
   * Calculate age at a specific date
   * @param {string} dateOfBirth - ISO date string
   * @param {string} [atDate] - ISO date string (defaults to today)
   * @returns {number} Age in years
   */
  const calculateAge = (dateOfBirth, atDate = null) => {
    const dob = new Date(dateOfBirth)
    const compareDate = atDate ? new Date(atDate) : new Date()
    
    let age = compareDate.getFullYear() - dob.getFullYear()
    const monthDiff = compareDate.getMonth() - dob.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && compareDate.getDate() < dob.getDate())) {
      age--
    }
    
    return age
  }

  // Initialize on store creation
  loadFromStorage()

  return {
    // State
    people,
    isLoading,
    // Getters
    allPeople,
    selfPerson,
    otherPeople,
    getPersonById,
    getPeopleByIds,
    personCount,
    // Actions
    createPerson,
    updatePerson,
    deletePerson,
    initializeSelf,
    clearAll,
    calculateAge,
    // Internal helpers (exposed for testing)
    loadFromStorage,
    saveToStorage,
  }
})
