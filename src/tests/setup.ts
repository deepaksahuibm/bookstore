import '@testing-library/jest-dom';

// Clean localStorage between tests
beforeEach(() => {
  localStorage.clear();
  window.scrollTo = vi.fn();
});
