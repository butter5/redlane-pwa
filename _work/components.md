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
