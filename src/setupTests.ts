// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock para variables de entorno
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

// Mock para import.meta.env
global.import = {
  meta: {
    env: {
      VITE_API_URL: 'https://api.test.com',
      VITE_PUBLIC_KEY_ACCESS: 'test_public_key',
      VITE_URL_WP: 'https://api.test.com/tokens/cards'
    }
  }
};