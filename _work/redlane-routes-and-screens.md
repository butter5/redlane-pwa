# Red Lane – Routes & Screens Map

This document outlines the proposed Vue 3 + Vue Router route structure and the corresponding screens for the Red Lane PWA. It reflects the current product design where users:
- Register and manage people they can declare for (with names and dates of birth).
- Create trips (with multiple legs).
- Add items per person, per trip, and per category.
- See a pooled, trip-level duty estimate (what they will pay) based on allowances combined across eligible travellers.

---

## 1. Top-Level Route Structure

```text
/
├─ /auth
│   ├─ /auth/login
│   └─ /auth/register
│
├─ /people
│   ├─ /people              (list)
│   └─ /people/new          (create)
│   └─ /people/:personId    (edit)
│
├─ /trips
│   ├─ /trips               (list/dashboard)
│   ├─ /trips/new           (create)
│   └─ /trips/:tripId
│       ├─ /trips/:tripId   (overview)
│       ├─ /trips/:tripId/edit
│       ├─ /trips/:tripId/legs
│       ├─ /trips/:tripId/legs/new
│       ├─ /trips/:tripId/legs/:legId/edit
│       ├─ /trips/:tripId/items
│       ├─ /trips/:tripId/items/new
│       ├─ /trips/:tripId/items/:itemId/edit
│       └─ /trips/:tripId/duty
│
└─ /settings   (optional later)
```

You can either make each bullet above a distinct route, or treat some of the "new/edit" flows as modals on top of the core route. This document assumes separate routes for clarity.

---

## 2. Auth Routes

### 2.1 `/auth/login`

**Purpose:** Login for returning users.

- Component: `AuthLoginView`
- Key UI:
  - Email, password inputs
  - "Forgot password?" link
  - Link to `Create account`

### 2.2 `/auth/register`

**Purpose:** Create account for new users.

- Component: `AuthRegisterView`
- Flow:
  1. Capture email + password.
  2. On success, redirect to an onboarding step to create the user's own person profile (name + DOB), or directly to `/people` with a special "self" person form.

**Optional onboarding route:**
- `/onboarding/self` – first-time only, collect full name and date of birth.

---

## 3. People Routes

### 3.1 `/people` – People list

**Purpose:** Manage "people you can declare for".

- Component: `PeopleListView`
- Behaviour:
  - Show the account owner as "You".
  - Show all additional people (family, friends, etc.).
  - CTA to add a new person.

### 3.2 `/people/new` – Add person

**Purpose:** Create a new person profile.

- Component: `PersonFormView` (create mode)
- Fields:
  - Full name
  - Date of birth
  - Relationship (Spouse, Child, Friend, Other)
- On save:
  - Navigate back to `/people`.

### 3.3 `/people/:personId` – Edit person

**Purpose:** Edit an existing person profile.

- Component: `PersonFormView` (edit mode)
- Route params:
  - `personId`
- On save:
  - Navigate back to `/people` or use `router.back()`.

---

## 4. Trip Routes

### 4.1 `/trips` – Trips list / dashboard

**Purpose:** Show all trips for the logged-in user.

- Component: `TripsListView`
- Behaviour:
  - Show upcoming/active trips.
  - Show past trips.
  - CTA to create a new trip.

### 4.2 `/trips/new` – Create trip

**Purpose:** Create a trip and assign people.

- Component: `TripFormView` (create mode)
- Fields:
  - Trip name
  - Start date, end date
  - People on this trip (multi-select from People list)
- On save:
  - Redirect to `/trips/:tripId` (trip overview).

### 4.3 `/trips/:tripId` – Trip overview

**Purpose:** Hub for a specific trip.

- Component: `TripOverviewView`
- Sections:
  - Trip details (name, dates)
  - People on this trip (names + ages at arrival)
  - Trip legs summary
  - Links to items & duty summary

### 4.4 `/trips/:tripId/edit` – Edit trip

**Purpose:** Edit basic trip info and people.

- Component: `TripFormView` (edit mode)
- Route params:
  - `tripId`

---

## 5. Trip Leg Routes

### 5.1 `/trips/:tripId/legs` – List legs

**Purpose:** Manage all legs for a trip.

- Component: `TripLegsView`
- Behaviour:
  - Show a list of legs (from → to, key dates).
  - CTA to add a new leg.

### 5.2 `/trips/:tripId/legs/new` – Add leg

**Purpose:** Add a new leg to the trip.

- Component: `TripLegFormView` (create mode)
- Fields:
  - From, To
  - Departure date/time
  - Arrival date/time (optional)
  - Carrier and flight number (optional)

### 5.3 `/trips/:tripId/legs/:legId/edit` – Edit leg

**Purpose:** Edit an existing leg.

- Component: `TripLegFormView` (edit mode)
- Route params:
  - `tripId`, `legId`

---

## 6. Item Routes

### 6.1 `/trips/:tripId/items` – Items list

**Purpose:** The main "purchases" screen for a trip.

- Component: `TripItemsView`
- Behaviour:
  - List items, optionally grouped by person or category.
  - Filter by person (`All` / specific traveller).
  - CTA to add an item.
  - CTA to see duty summary.

### 6.2 `/trips/:tripId/items/new` – Add item

**Purpose:** Add a new item.

- Component: `ItemFormView` (create mode)
- Fields:
  - Person (limited to people on this trip)
  - Category
  - Description
  - Currency and amount
  - Quantity (optional)
  - Leg (optional, limited to this trip's legs)

### 6.3 `/trips/:tripId/items/:itemId/edit` – Edit item

**Purpose:** Edit an existing item.

- Component: `ItemFormView` (edit mode)
- Route params:
  - `tripId`, `itemId`

---

## 7. Duty Summary Routes

### 7.1 `/trips/:tripId/duty` – Trip duty summary

**Purpose:** Show the user a single, pooled duty estimate for the trip.

- Component: `TripDutySummaryView`
- Behaviour:
  - Calculate total value across all items and people.
  - Determine eligible travellers (based on DOB and arrival date).
  - Compute a **pooled general allowance** (e.g. 3 travellers × $300 = $900).
  - Deduct pooled allowances at trip level from total value to derive taxable amount.
  - Calculate estimated duty.
- UI elements:
  - Total value of all items (BMD)
  - Pooled allowance line (e.g. "Pooled allowance for 3 people: BMD $900")
  - Taxable amount (BMD)
  - Single bold number: **estimated duty you'll pay**
  - "Who is included" panel showing each person and their allowance eligibility (e.g. child has no alcohol allowance)
  - Category breakdown of values
  - Links back to items and, later, to online submission/payment when available.

---

## 8. Suggested Vue Router Config (Sketch)

Below is a high-level sketch of how these routes might look in Vue Router. Component names are indicative and can be adapted.

```ts
const routes = [
  { path: '/', redirect: '/trips' },

  {
    path: '/auth',
    children: [
      { path: 'login', name: 'auth-login', component: AuthLoginView },
      { path: 'register', name: 'auth-register', component: AuthRegisterView },
    ],
  },

  {
    path: '/people',
    children: [
      { path: '', name: 'people-list', component: PeopleListView },
      { path: 'new', name: 'person-new', component: PersonFormView },
      { path: ':personId', name: 'person-edit', component: PersonFormView },
    ],
  },

  {
    path: '/trips',
    children: [
      { path: '', name: 'trips-list', component: TripsListView },
      { path: 'new', name: 'trip-new', component: TripFormView },
      {
        path: ':tripId',
        children: [
          { path: '', name: 'trip-overview', component: TripOverviewView },
          { path: 'edit', name: 'trip-edit', component: TripFormView },

          { path: 'legs', name: 'trip-legs', component: TripLegsView },
          { path: 'legs/new', name: 'trip-leg-new', component: TripLegFormView },
          {
            path: 'legs/:legId/edit',
            name: 'trip-leg-edit',
            component: TripLegFormView,
          },

          { path: 'items', name: 'trip-items', component: TripItemsView },
          { path: 'items/new', name: 'trip-item-new', component: ItemFormView },
          {
            path: 'items/:itemId/edit',
            name: 'trip-item-edit',
            component: ItemFormView,
          },

          { path: 'duty', name: 'trip-duty', component: TripDutySummaryView },
        ],
      },
    ],
  },

  // Optional future settings route
  // { path: '/settings', name: 'settings', component: SettingsView },
];
```

This structure keeps a clear separation between:
- Authentication
- People management
- Trip creation and overview
- Trip legs
- Items
- Duty summary (with pooled trip-level allowance).

It should give you a solid foundation to begin implementing the navigation and screen layout in the Vue app.
