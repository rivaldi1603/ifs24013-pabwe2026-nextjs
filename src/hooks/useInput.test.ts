import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useInput } from '../hooks/useInput';

describe('useInput hook', () => {
  it('should initialize with empty string by default', () => {
    const { result } = renderHook(() => useInput());
    expect(result.current[0]).toBe('');
  });

  it('should initialize with provided value', () => {
    const { result } = renderHook(() => useInput('initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('should update value on change event', () => {
    const { result } = renderHook(() => useInput(''));
    
    act(() => {
      const event = {
        target: { value: 'new value' }
      } as React.ChangeEvent<HTMLInputElement>;
      result.current[1](event);
    });

    expect(result.current[0]).toBe('new value');
  });

  it('should update value via setValue directly', () => {
    const { result } = renderHook(() => useInput(''));
    
    act(() => {
      result.current[2]('direct value');
    });

    expect(result.current[0]).toBe('direct value');
  });
});
