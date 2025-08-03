import { describe, expect, it, vi } from 'vitest';

import type { HookState } from './type';
import { withGlobalState } from './with-global-state';

describe('withGlobalState', () => {
    it('should create a global state and get the initial value', () => {
        const state: HookState<number> = withGlobalState('test', 0);

        expect(state.get()).toBe(0);
    });

    it('should create a global state and set a new value', () => {
        const state: HookState<number> = withGlobalState('test2', 0);

        expect(state.get()).toBe(0);
        state.set(1);

        expect(state.get()).toBe(1);
    });

    it('should create a global state and set a new value with a validator', () => {
        const state: HookState<number> = withGlobalState('test3', 1, {
            validator: (value: unknown) => {
                return typeof value === 'number' && value > 0;
            },
        });

        expect(state.get()).toBe(1);

        expect(() => state.set(-1)).toThrow();
        expect(state.get()).toBe(1);
    });

    it('should create a global state and listen to changes', () => {
        const state: HookState<number> = withGlobalState('test4', 0);

        const callback = vi.fn();
        state.onChange(callback);

        state.set(1);

        expect(callback).toHaveBeenCalledWith(1, 0);
    });
});
