# Component Documentation - Authentication Flow

## LoginPage

### Overview
**Purpose**: Allow users to authenticate with email and password

**Scope**: Auth flow entry point, form validation, error display

**Dependencies**: 
- authStore (Pinia)
- useAuth composable
- vue-router (for navigation)
- @headlessui/vue (form components)

### Props
N/A (Page component, no props)

### State (Internal)
- email: ref('')
- password: ref('')
- rememberMe: ref(false)
- errors: ref({})
- isSubmitting: computed from authStore.isLoading

### Events
| Event | Payload | Description |
|-------|---------|-------------|
| submit | FormData | Login form submission |
| forgotPassword | - | Navigate to forgot password |
| register | - | Navigate to registration |

### Accessibility (A11y)
- Semantic HTML (form, input, button)
- ARIA labels on inputs
- Keyboard navigation (tab order)
- Error announcements
- Focus management on mount
- Color contrast compliance

### Styling & Responsiveness
- Tailwind utility classes
- Mobile-first responsive
- AuthLayout wrapper
- Card-based design
- Focus states

### Tests
- [ ] Unit: Form renders correctly
- [ ] Unit: Validation on submit
- [ ] Unit: Error display
- [ ] Integration: Successful login redirects to dashboard
- [ ] Integration: Failed login shows error

### Performance Considerations
- No heavy computations
- Minimal re-renders
- Form validation on submit only

### Usage Examples
```vue
<!-- Used in router -->
<LoginPage />
```

---

## RegisterPage

### Overview
**Purpose**: Allow new users to create an account

**Scope**: Registration form with validation, terms acceptance

**Dependencies**: 
- authStore (Pinia)
- useAuth composable
- vue-router
- @headlessui/vue

### Props
N/A (Page component)

### State (Internal)
- formData: ref({ email, password, confirmPassword, firstName, lastName, phone })
- termsAccepted: ref(false)
- errors: ref({})
- isSubmitting: computed from authStore.isLoading

### Events
| Event | Payload | Description |
|-------|---------|-------------|
| submit | FormData | Registration form submission |
| login | - | Navigate to login |

### Accessibility (A11y)
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Error announcements
- Password visibility toggle
- Focus management

### Styling & Responsiveness
- Tailwind utilities
- Mobile-first
- Multi-step form (optional)
- Password strength indicator

### Tests
- [ ] Unit: Form renders
- [ ] Unit: Password match validation
- [ ] Unit: Required field validation
- [ ] Integration: Successful registration
- [ ] Integration: Validation errors display

### Performance Considerations
- Debounced validation
- Minimal re-renders

### Usage Examples
```vue
<RegisterPage />
```

---

## ForgotPasswordPage

### Overview
**Purpose**: Initiate password reset flow via email

**Scope**: Email input, API call, success message

**Dependencies**: 
- authStore
- useAuth
- vue-router

### Props
N/A

### State (Internal)
- email: ref('')
- submitted: ref(false)
- error: ref(null)
- isSubmitting: computed from authStore.isLoading

### Events
| Event | Payload | Description |
|-------|---------|-------------|
| submit | { email } | Request password reset |
| backToLogin | - | Navigate to login |

### Accessibility (A11y)
- Semantic HTML
- ARIA labels
- Success message announcement
- Focus management

### Styling & Responsiveness
- Tailwind utilities
- Mobile-first
- Simple card layout

### Tests
- [ ] Unit: Form renders
- [ ] Unit: Email validation
- [ ] Integration: Success message on submit
- [ ] Integration: Error handling

### Performance Considerations
- Minimal state
- Simple form

### Usage Examples
```vue
<ForgotPasswordPage />
```

---

## ResetPasswordPage

### Overview
**Purpose**: Complete password reset with token from email

**Scope**: New password input, token validation, redirect on success

**Dependencies**: 
- authStore
- useAuth
- vue-router (for token param)

### Props
N/A (Token from route params)

### State (Internal)
- password: ref('')
- confirmPassword: ref('')
- token: computed from route.params.token
- errors: ref({})
- isSubmitting: computed

### Events
| Event | Payload | Description |
|-------|---------|-------------|
| submit | { token, password } | Reset password |
| success | - | Redirect to login |

### Accessibility (A11y)
- Semantic HTML
- ARIA labels
- Password visibility toggle
- Success announcement
- Focus management

### Styling & Responsiveness
- Tailwind utilities
- Mobile-first

### Tests
- [ ] Unit: Form renders with token
- [ ] Unit: Password match validation
- [ ] Integration: Successful reset redirects
- [ ] Integration: Invalid token shows error

### Performance Considerations
- Minimal state
- Simple validation

### Usage Examples
```vue
<ResetPasswordPage />
```

---

## AuthLayout

### Overview
**Purpose**: Layout wrapper for authentication pages

**Scope**: Branding, centered content, responsive

**Dependencies**: None (presentational)

### Props
N/A (uses slot)

### State (Internal)
None

### Events
None

### Accessibility (A11y)
- Semantic HTML (main, section)
- Proper heading hierarchy
- Landmark regions

### Styling & Responsiveness
- Tailwind utilities
- Mobile-first
- Centered card
- Red Lane branding
- Background gradient/image

### Tests
- [ ] Unit: Renders slot content
- [ ] Unit: Branding visible

### Performance Considerations
- Static layout
- No re-renders

### Usage Examples
```vue
<AuthLayout>
  <LoginPage />
</AuthLayout>
```

---

## AppLayout

### Overview
**Purpose**: Main application layout with navigation

**Scope**: Header, navigation, user menu, mobile menu

**Dependencies**: 
- authStore (for user info)
- @headlessui/vue (Menu components)

### Props
N/A (uses slot)

### State (Internal)
- mobileMenuOpen: ref(false)
- user: computed from authStore

### Events
| Event | Payload | Description |
|-------|---------|-------------|
| logout | - | User logout action |
| navigate | route | Navigation click |

### Accessibility (A11y)
- Semantic HTML (nav, header)
- ARIA labels on menu
- Keyboard navigation
- Focus trap in mobile menu
- Skip links

### Styling & Responsiveness
- Tailwind utilities
- Mobile-first
- Hamburger menu on mobile
- Sticky header
- Dropdown user menu

### Tests
- [ ] Unit: Header renders
- [ ] Unit: User menu shows user info
- [ ] Unit: Mobile menu toggles
- [ ] Integration: Logout works

### Performance Considerations
- Memoize user computed
- Lazy load mobile menu

### Usage Examples
```vue
<AppLayout>
  <RouterView />
</AppLayout>
```

---

## Component Hierarchy
```
App.vue
├── AuthLayout (for auth pages)
│   ├── LoginPage
│   ├── RegisterPage
│   ├── ForgotPasswordPage
│   └── ResetPasswordPage
└── AppLayout (for authenticated pages)
    └── RouterView (Dashboard, etc.)
```

---

# People Management Pages

## PeopleListPage

### Overview
**Purpose**: Display list of people user can declare for

**Scope**: List view, navigation to add/edit person

**Dependencies**: 
- AppLayout
- vue-router

### Props
N/A (Page component)

### State (Internal)
None (placeholder - will add people list from store)

### Events
| Event | Payload | Description |
|-------|---------|-------------|
| addPerson | - | Navigate to new person form |

### Accessibility (A11y)
- Semantic HTML
- Proper heading hierarchy
- Button labels
- Keyboard navigation

### Styling & Responsiveness
- Tailwind utilities
- Mobile-first
- Card-based layout

### Tests
- [x] Unit: Page renders correctly
- [x] Unit: Add person button exists

### Performance Considerations
- Will paginate when data added

### Usage Examples
```vue
<PeopleListPage />
```

---

## PersonFormPage

### Overview
**Purpose**: Add or edit person profile

**Scope**: Form for person details, validation

**Dependencies**: 
- AppLayout
- vue-router (for id param)

### Props
N/A (ID from route params)

### State (Internal)
- personId: computed from route.params.id
- isEditMode: computed (!!personId)

### Events
| Event | Payload | Description |
|-------|---------|-------------|
| save | PersonData | Save person |
| back | - | Navigate to people list |

### Accessibility (A11y)
- Semantic HTML
- Form labels
- Error announcements
- Focus management

### Styling & Responsiveness
- Tailwind utilities
- Mobile-first
- Form layout

### Tests
- [x] Unit: Add mode renders correctly
- [x] Unit: Edit mode renders correctly
- [x] Unit: Back button exists

### Performance Considerations
- Form validation on submit

### Usage Examples
```vue
<PersonFormPage />
```

---

# Trips Management Pages

## TripsListPage

### Overview
**Purpose**: Display list of user's trips

**Scope**: List view, navigation to trip management

**Dependencies**: 
- AppLayout
- vue-router

### Props
N/A

### State (Internal)
None (placeholder - will add trips list from store)

### Events
| Event | Payload | Description |
|-------|---------|-------------|
| newTrip | - | Navigate to new trip form |

### Accessibility (A11y)
- Semantic HTML
- Proper heading hierarchy
- Button labels
- Keyboard navigation

### Styling & Responsiveness
- Tailwind utilities
- Mobile-first
- Card-based layout

### Tests
- [x] Unit: Page renders correctly
- [x] Unit: New trip button exists

### Performance Considerations
- Will paginate when data added

### Usage Examples
```vue
<TripsListPage />
```

---

## TripFormPage

### Overview
**Purpose**: Create new trip

**Scope**: Trip creation form

**Dependencies**: 
- AppLayout
- vue-router

### Props
N/A

### State (Internal)
None (placeholder)

### Events
| Event | Payload | Description |
|-------|---------|-------------|
| save | TripData | Create trip |
| back | - | Navigate to trips list |

### Accessibility (A11y)
- Semantic HTML
- Form labels
- Focus management

### Styling & Responsiveness
- Tailwind utilities
- Mobile-first

### Tests
- Unit tests pending (placeholder component)

### Performance Considerations
- Form validation

### Usage Examples
```vue
<TripFormPage />
```

---

## TripDetailPage

### Overview
**Purpose**: Trip overview hub

**Scope**: Display trip info, navigate to sub-sections

**Dependencies**: 
- AppLayout
- vue-router (for trip id)

### Props
N/A (ID from route params)

### State (Internal)
- tripId: computed from route.params.id

### Events
| Event | Payload | Description |
|-------|---------|-------------|
| viewItems | - | Navigate to items |
| viewLegs | - | Navigate to legs |
| viewDuty | - | Navigate to duty |
| back | - | Navigate to trips list |

### Accessibility (A11y)
- Semantic HTML
- Button labels
- Keyboard navigation

### Styling & Responsiveness
- Tailwind utilities
- Mobile-first
- Grid layout for actions

### Tests
- [x] Unit: Page renders with trip ID
- [x] Unit: View items button exists
- [x] Unit: View legs button exists
- [x] Unit: Duty summary button exists
- [x] Unit: Back button exists

### Performance Considerations
- Simple navigation hub

### Usage Examples
```vue
<TripDetailPage />
```

---

## TripItemsPage

### Overview
**Purpose**: Manage items for a trip

**Scope**: List items, add/edit items

**Dependencies**: 
- AppLayout
- vue-router (for trip id)

### Props
N/A (ID from route params)

### State (Internal)
- tripId: computed from route.params.id

### Events
| Event | Payload | Description |
|-------|---------|-------------|
| addItem | - | Navigate to item form |
| back | - | Navigate to trip detail |

### Accessibility (A11y)
- Semantic HTML
- Proper headings
- Keyboard navigation

### Styling & Responsiveness
- Tailwind utilities
- Mobile-first

### Tests
- Unit tests pending (placeholder component)

### Performance Considerations
- Will paginate items list

### Usage Examples
```vue
<TripItemsPage />
```

---

## TripLegsPage

### Overview
**Purpose**: Manage trip legs (flights/travel segments)

**Scope**: List legs, add/edit legs

**Dependencies**: 
- AppLayout
- vue-router (for trip id)

### Props
N/A (ID from route params)

### State (Internal)
- tripId: computed from route.params.id

### Events
| Event | Payload | Description |
|-------|---------|-------------|
| addLeg | - | Navigate to leg form |
| back | - | Navigate to trip detail |

### Accessibility (A11y)
- Semantic HTML
- Proper headings
- Keyboard navigation

### Styling & Responsiveness
- Tailwind utilities
- Mobile-first

### Tests
- Unit tests pending (placeholder component)

### Performance Considerations
- Simple list view

### Usage Examples
```vue
<TripLegsPage />
```

---

## TripDutyPage

### Overview
**Purpose**: Display pooled duty calculation

**Scope**: Duty summary, allowances, taxable amount

**Dependencies**: 
- AppLayout
- vue-router (for trip id)

### Props
N/A (ID from route params)

### State (Internal)
- tripId: computed from route.params.id

### Events
| Event | Payload | Description |
|-------|---------|-------------|
| back | - | Navigate to trip detail |

### Accessibility (A11y)
- Semantic HTML
- Proper headings
- Table semantics for calculations
- Keyboard navigation

### Styling & Responsiveness
- Tailwind utilities
- Mobile-first
- Emphasis on duty amount

### Tests
- Unit tests pending (placeholder component)

### Performance Considerations
- Calculation logic will be in composable/store

### Usage Examples
```vue
<TripDutyPage />
```

---

## Updated Component Hierarchy
```
App.vue
├── AuthLayout (for auth pages)
│   ├── LoginPage
│   ├── RegisterPage
│   ├── ForgotPasswordPage
│   └── ResetPasswordPage
└── AppLayout (for authenticated pages)
    ├── DashboardPage
    ├── PeopleListPage
    ├── PersonFormPage
    ├── TripsListPage
    ├── TripFormPage
    ├── TripDetailPage
    ├── TripItemsPage
    ├── TripLegsPage
    └── TripDutyPage
```
