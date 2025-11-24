/**
 * @typedef {Object} TripLeg
 * @property {number} id - Unique identifier
 * @property {string} from - Departure location
 * @property {string} to - Destination location
 * @property {string} departureDate - Departure date/time in ISO format
 * @property {string} [arrivalDate] - Arrival date/time in ISO format
 * @property {string} [carrier] - Airline or carrier name
 * @property {string} [flightNumber] - Flight number
 * @property {number} order - Order of this leg in the trip sequence
 */

/**
 * @typedef {Object} Trip
 * @property {number} id - Unique identifier (timestamp or generated)
 * @property {string} name - Trip name/title
 * @property {string} startDate - Trip start date in ISO format
 * @property {string} endDate - Trip end date in ISO format
 * @property {number[]} personIds - IDs of people on this trip
 * @property {TripLeg[]} legs - Trip legs/flights
 * @property {string} status - Trip status ('planning' | 'active' | 'completed')
 * @property {string} createdAt - Creation timestamp in ISO format
 * @property {string} updatedAt - Last update timestamp in ISO format
 */

/**
 * @typedef {Object} TripInput
 * @property {string} name - Trip name/title
 * @property {string} startDate - Trip start date in ISO format
 * @property {string} endDate - Trip end date in ISO format
 * @property {number[]} personIds - IDs of people on this trip
 */

/**
 * @typedef {Object} TripLegInput
 * @property {string} from - Departure location
 * @property {string} to - Destination location
 * @property {string} departureDate - Departure date/time in ISO format
 * @property {string} [arrivalDate] - Arrival date/time in ISO format
 * @property {string} [carrier] - Airline or carrier name
 * @property {string} [flightNumber] - Flight number
 */

export const TripStatus = {
  PLANNING: 'planning',
  ACTIVE: 'active',
  COMPLETED: 'completed',
}

export const TripStatusLabels = {
  [TripStatus.PLANNING]: 'Planning',
  [TripStatus.ACTIVE]: 'Active',
  [TripStatus.COMPLETED]: 'Completed',
}
