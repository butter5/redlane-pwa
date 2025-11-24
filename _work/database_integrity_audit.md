# Database Integrity Audit - Authentication Flow

## Overview
This is a frontend PWA application. There is no database in the frontend application itself. This document tracks the integrity of frontend state management and data persistence.

## Current State Structure

### LocalStorage Schema
**Current Implementation**:
```javascript
{
  'auth_token': string | null  // JWT token (legacy key)
}
```

**Proposed Implementation**:
```javascript
{
  'redlane_auth_token': string | null  // JWT token (new key per requirements)
}
```

### Pinia Store Schema
**Current**: No auth store exists

**Proposed authStore**:
```javascript
{
  state: {
    user: null | {
      id: number,
      email: string,
      firstName: string,
      lastName: string,
      phone: string,
      createdAt: string,
      updatedAt: string
    },
    token: string | null,
    isLoading: boolean
  },
  getters: {
    isAuthenticated: () => boolean,
    currentUser: () => User | null
  },
  actions: {
    login: (email, password) => Promise<void>,
    register: (userData) => Promise<void>,
    logout: () => Promise<void>,
    refreshToken: () => Promise<void>,
    getAuthenticatedUser: () => Promise<void>,
    forgotPassword: (email) => Promise<void>,
    resetPassword: (data) => Promise<void>
  }
}
```

## Data Integrity Standards

### 1. Token Management
- ✅ Token stored in localStorage for persistence
- ✅ Token cleared on logout
- ✅ Token validated on app init
- ✅ Invalid token triggers re-authentication
- ✅ Token included in API requests

### 2. User State Management
- ✅ User data loaded from API (GET /auth/me)
- ✅ User data cleared on logout
- ✅ User data reactive (Pinia store)
- ✅ No sensitive data stored in frontend

### 3. Authentication State
- ✅ isAuthenticated derived from token existence
- ✅ State synchronized with API
- ✅ State persists across page reloads
- ✅ State cleared on logout

## Normalization Compliance

### Frontend State (Not Applicable - No Database)
This is not a database schema but frontend state. However, we follow best practices:

1. **Single Source of Truth**: authStore is the only source for auth state
2. **No Duplication**: Token stored in localStorage, referenced in store
3. **Computed Values**: isAuthenticated is computed, not stored
4. **Separation**: User data separate from auth token

## Data Access Patterns

### Read Operations
- Check authentication: `store.isAuthenticated`
- Get current user: `store.currentUser`
- Get token: `localStorage.getItem('redlane_auth_token')`

### Write Operations
- Login: `store.login(email, password)` → sets token and user
- Logout: `store.logout()` → clears token and user
- Register: `store.register(userData)` → sets token and user
- Auto-load: On app init, load user if token exists

### Consistency Rules
1. Token must always match user state
2. If token exists, user must be loaded
3. If token invalid, clear user and token
4. Logout must clear both token and user

## Current Issues & Risks

### Issues
1. ❌ Old token key `auth_token` in apiClient.js
2. ❌ No auth store exists yet
3. ❌ No token refresh logic
4. ❌ No auto-load user on init

### Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Token in localStorage (XSS) | High | Implement CSP, sanitize inputs |
| Token not refreshed | Medium | Implement refresh interceptor |
| State loss on reload | Medium | Auto-load user on init |
| Concurrent auth requests | Low | Use loading flags |

## Post-Implementation State

### Verified Compliance
After implementation, verify:
- ✅ Token key migrated to `redlane_auth_token`
- ✅ Auth store created and tested
- ✅ Token persists across reloads
- ✅ Auto-load user works
- ✅ Logout clears all state
- ✅ No sensitive data in localStorage
- ✅ State synchronized with API
- ✅ Error handling in place

## Frontend Data Flow

```
User Action (Login)
  ↓
LoginPage Component
  ↓
authStore.login()
  ↓
authService.login() (API Call)
  ↓
Store token in localStorage
  ↓
Store user in Pinia state
  ↓
Router redirect to dashboard
```

## Summary
This frontend application follows best practices for client-side state management:
1. Single source of truth (Pinia store)
2. Persistent storage (localStorage for token only)
3. No sensitive data stored long-term
4. Proper error handling and state synchronization
5. Clean separation between API layer and state management
