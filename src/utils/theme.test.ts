import { getTheme, setTheme, toggleTheme, initTheme } from './theme';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

describe('theme', () => {
  it('defaults to dark when nothing stored', () => {
    expect(getTheme()).toBe('dark');
  });

  it('returns stored theme', () => {
    localStorage.setItem('wow-bg-theme', 'light');
    expect(getTheme()).toBe('light');
  });

  it('ignores invalid stored values', () => {
    localStorage.setItem('wow-bg-theme', 'invalid');
    expect(getTheme()).toBe('dark');
  });

  it('setTheme updates localStorage and data-theme attribute', () => {
    setTheme('light');
    expect(localStorage.getItem('wow-bg-theme')).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('toggleTheme switches between dark and light', () => {
    setTheme('dark');
    expect(toggleTheme()).toBe('light');
    expect(getTheme()).toBe('light');
    expect(toggleTheme()).toBe('dark');
    expect(getTheme()).toBe('dark');
  });

  it('initTheme applies stored preference to DOM', () => {
    localStorage.setItem('wow-bg-theme', 'light');
    initTheme();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
});
