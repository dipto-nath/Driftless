import "@testing-library/jest-dom/vitest";

// jsdom does not implement matchMedia, which ThemeProvider uses for dark mode detection
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: query.includes("dark"),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// jsdom does not implement ResizeObserver, which Radix UI components use
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

(globalThis as Record<string, unknown>).ResizeObserver = ResizeObserver;