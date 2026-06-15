import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from '@/hooks/useIsMobile';

describe('useIsMobile', () => {
  let listeners: Array<(e: any) => void> = [];
  let addEventListenerSpy: any;
  let removeEventListenerSpy: any;

  beforeEach(() => {
    listeners = [];
    addEventListenerSpy = vi.fn((_event: string, handler: any) => {
      listeners.push(handler);
    });
    removeEventListenerSpy = vi.fn((_event: string, handler: any) => {
      const idx = listeners.indexOf(handler);
      if (idx > -1) listeners.splice(idx, 1);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function mockMatchMedia(matches: boolean) {
    return vi.fn((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: addEventListenerSpy,
      removeEventListener: removeEventListenerSpy,
      dispatchEvent: vi.fn(),
    }));
  }

  it('returns false on desktop-sized viewport', () => {
    window.matchMedia = mockMatchMedia(false);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('returns true on mobile-sized viewport', () => {
    window.matchMedia = mockMatchMedia(true);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('responds to viewport change', () => {
    window.matchMedia = mockMatchMedia(true);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);

    act(() => {
      listeners.forEach((fn) => fn({ matches: false }));
    });
    expect(result.current).toBe(false);
  });

  it('uses default breakpoint of 576', () => {
    window.matchMedia = mockMatchMedia(false);
    renderHook(() => useIsMobile());
    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 575px)');
  });

  it('uses custom breakpoint', () => {
    window.matchMedia = mockMatchMedia(false);
    renderHook(() => useIsMobile(768));
    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 767px)');
  });

  it('cleans up event listener on unmount', () => {
    window.matchMedia = mockMatchMedia(false);
    const { unmount } = renderHook(() => useIsMobile());
    expect(addEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function));
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function));
  });
});
