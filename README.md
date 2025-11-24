# Red Lane PWA

Red Lane Progressive Web App - A Vue.js 3 PWA for customs duty declarations.

## Prerequisites

- **Node.js** 18+ (recommended: Node.js 20+)
- **npm** 9+ or **yarn** 1.22+

## Technology Stack

- **Vue.js 3** - Progressive JavaScript framework (Composition API with `<script setup>`)
- **Vite** - Lightning-fast build tool with HMR
- **Tailwind CSS** - Utility-first CSS framework
- **Pinia** - State management for Vue 3
- **Vue Router** - Official routing library
- **Axios** - Promise-based HTTP client
- **Vitest** - Unit testing framework
- **Tesseract.js** - OCR library for receipt scanning
- **PWA Plugin** - Service worker for offline support

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd redlane-pwa
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=Red Lane
```

### 4. Start development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Development Commands

```bash
# Start development server with hot module replacement
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run unit tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code with Prettier
npm run format
```

## Project Structure

```
redlane-pwa/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, fonts, etc.
│   ├── components/        # Reusable Vue components
│   ├── composables/       # Shared composition functions (Vue 3 composables)
│   ├── layouts/           # Layout components
│   ├── pages/             # Page components (route views)
│   ├── router/            # Vue Router configuration
│   │   └── index.js       # Router setup and routes
│   ├── stores/            # Pinia stores (state management)
│   │   └── index.js       # Pinia root store
│   ├── services/          # API services
│   │   └── apiClient.js   # Axios instance with interceptors
│   ├── utils/             # Helper functions and utilities
│   ├── test/              # Test utilities and setup
│   ├── App.vue            # Root component
│   ├── main.js            # Application entry point
│   └── style.css          # Global styles (Tailwind imports)
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
├── .prettierrc            # Prettier configuration
├── eslint.config.js       # ESLint configuration (flat config)
├── index.html             # HTML entry point
├── package.json           # Dependencies and scripts
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.js         # Vite configuration
└── vitest.config.js       # Vitest configuration
```

## Code Style Guidelines

### Vue 3 Composition API

- Use `<script setup>` syntax for all components
- Prefer Composition API over Options API
- Use composables for shared logic

Example:

```vue
<script setup>
import { ref, computed } from 'vue'

const count = ref(0)
const doubleCount = computed(() => count.value * 2)

const increment = () => {
  count.value++
}
</script>

<template>
  <button @click="increment">Count: {{ count }}</button>
</template>
```

### Styling

- Use Tailwind utility classes for styling
- Follow mobile-first responsive design
- Use custom theme colors defined in `tailwind.config.js`

### State Management

- Use Pinia for global state
- Keep component state local when possible
- Use composables for shared stateful logic

Example Pinia store:

```javascript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  
  const setUser = (newUser) => {
    user.value = newUser
  }
  
  return { user, setUser }
})
```

### API Services

- Use the configured Axios instance from `src/services/apiClient.js`
- Create service modules for different API endpoints

Example:

```javascript
import apiClient from '@/services/apiClient'

export const getDeclarations = async () => {
  return await apiClient.get('/declarations')
}

export const createDeclaration = async (data) => {
  return await apiClient.post('/declarations', data)
}
```

### Testing

- Write unit tests for all components
- Use Vitest and Vue Test Utils
- Aim for high test coverage
- Tests should be colocated with components (`.spec.js` files)

Example test:

```javascript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from './MyComponent.vue'

describe('MyComponent', () => {
  it('renders properly', () => {
    const wrapper = mount(MyComponent)
    expect(wrapper.text()).toContain('Hello')
  })
})
```

## Environment Variables

All environment variables must be prefixed with `VITE_` to be exposed to the client-side code.

Available variables:

- `VITE_API_URL` - Backend API base URL
- `VITE_APP_NAME` - Application name

Access in code:

```javascript
const apiUrl = import.meta.env.VITE_API_URL
```

## PWA Features

This app is configured as a Progressive Web App with:

- **Offline support** via service worker
- **Installable** on mobile and desktop
- **App manifest** for native-like experience
- **Automatic updates** for new versions

The PWA configuration is in `vite.config.js` under the `VitePWA` plugin.

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory with:

- Minified code
- Tree-shaking
- Code splitting
- PWA service worker
- Optimized assets

Preview the production build:

```bash
npm run preview
```

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Development server won't start

1. Check Node.js version: `node --version` (should be 18+)
2. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
3. Check port 5173 isn't in use

### Build errors

1. Clear Vite cache: `rm -rf node_modules/.vite`
2. Rebuild: `npm run build`

### Tests failing

1. Check test setup: `src/test/setup.js`
2. Run with verbose output: `npm run test -- --reporter=verbose`

## Contributing

1. Follow the existing code style
2. Write tests for new features
3. Run linting and formatting before committing
4. Keep commits focused and atomic

## License

ISC

## Support

For issues and questions, please create an issue in the repository.
