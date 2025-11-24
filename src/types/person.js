/**
 * @typedef {Object} Person
 * @property {number} id - Unique identifier (timestamp or generated)
 * @property {string} fullName - Full name of the person
 * @property {string} dateOfBirth - Date of birth in ISO format (YYYY-MM-DD)
 * @property {string} relationship - Relationship to account owner ('self' | 'spouse' | 'child' | 'friend' | 'other')
 * @property {boolean} isSelf - Whether this is the account owner
 * @property {string} createdAt - Creation timestamp in ISO format
 * @property {string} updatedAt - Last update timestamp in ISO format
 */

/**
 * @typedef {Object} PersonInput
 * @property {string} fullName - Full name of the person
 * @property {string} dateOfBirth - Date of birth in ISO format (YYYY-MM-DD)
 * @property {string} relationship - Relationship to account owner
 * @property {boolean} [isSelf] - Whether this is the account owner
 */

export const PersonRelationships = {
  SELF: 'self',
  SPOUSE: 'spouse',
  CHILD: 'child',
  FRIEND: 'friend',
  OTHER: 'other',
}

export const PersonRelationshipLabels = {
  [PersonRelationships.SELF]: 'You',
  [PersonRelationships.SPOUSE]: 'Spouse',
  [PersonRelationships.CHILD]: 'Child',
  [PersonRelationships.FRIEND]: 'Friend',
  [PersonRelationships.OTHER]: 'Other',
}
