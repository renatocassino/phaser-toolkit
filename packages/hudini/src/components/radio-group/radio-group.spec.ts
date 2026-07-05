/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
/* eslint-disable sonarjs/no-identical-functions */
import { describe, expect, it, vi } from 'vitest';

import { RadioGroup } from './radio-group';

/**
 * We mock the Radio class here — RadioGroup's responsibility is only the
 * "only one selected" invariant + defaults propagation. The actual visual
 * Radio is tested in ../radio/radio.spec.ts.
 */
vi.mock('../radio', () => {
  class Radio {
    public readonly value: string | undefined;
    public name: string | undefined;
    private checkedState: boolean;
    private disabledState: boolean;
    private readOnlyState: boolean;
    private onChangeCb:
      | ((checked: boolean, value?: string, name?: string) => void)
      | undefined;

    constructor(params: {
      value?: string;
      name?: string;
      checked?: boolean;
      disabled?: boolean;
      readOnly?: boolean;
      onChange?: (
        checked: boolean,
        value?: string,
        name?: string
      ) => void;
    }) {
      this.value = params.value;
      this.name = params.name;
      this.checkedState = params.checked ?? false;
      this.disabledState = params.disabled ?? false;
      this.readOnlyState = params.readOnly ?? false;
      this.onChangeCb = params.onChange;
    }

    setChecked(v: boolean): this {
      if (this.checkedState === v) return this;
      this.checkedState = v;
      this.onChangeCb?.(v, this.value, this.name);
      return this;
    }

    select(): this {
      return this.setChecked(true);
    }

    isChecked(): boolean {
      return this.checkedState;
    }

    getValue(): boolean {
      return this.checkedState;
    }

    setDisabled(v: boolean): this {
      this.disabledState = v;
      return this;
    }

    isDisabled(): boolean {
      return this.disabledState;
    }

    setReadOnly(v: boolean): this {
      this.readOnlyState = v;
      return this;
    }

    isReadOnly(): boolean {
      return this.readOnlyState;
    }
  }
  return { Radio };
});

const fakeScene = {} as never;

describe('RadioGroup', () => {
  it('should start with the initial value selected', () => {
    const group = new RadioGroup({
      scene: fakeScene,
      value: 'normal',
    });
    const easy = group.createRadio({ x: 0, y: 0, value: 'easy' });
    const normal = group.createRadio({ x: 0, y: 0, value: 'normal' });
    const hard = group.createRadio({ x: 0, y: 0, value: 'hard' });

    expect(group.getValue()).toBe('normal');
    expect(easy.isChecked()).toBe(false);
    expect(normal.isChecked()).toBe(true);
    expect(hard.isChecked()).toBe(false);
  });

  it('should deselect the previous radio when another is selected', () => {
    const group = new RadioGroup({ scene: fakeScene, value: 'a' });
    const a = group.createRadio({ x: 0, y: 0, value: 'a' });
    const b = group.createRadio({ x: 0, y: 0, value: 'b' });

    b.select();
    expect(a.isChecked()).toBe(false);
    expect(b.isChecked()).toBe(true);
    expect(group.getValue()).toBe('b');
  });

  it('should fire onChange when the selection changes (once per change)', () => {
    const calls: Array<[string | undefined, string | undefined]> = [];
    const group = new RadioGroup({
      scene: fakeScene,
      name: 'diff',
      onChange: (v, n): void => {
        calls.push([v, n]);
      },
    });
    const a = group.createRadio({ x: 0, y: 0, value: 'a' });
    const b = group.createRadio({ x: 0, y: 0, value: 'b' });

    a.select();
    b.select();
    expect(calls).toEqual([
      ['a', 'diff'],
      ['b', 'diff'],
    ]);
  });

  it('should NOT fire onChange when selecting the already-selected value', () => {
    let calls = 0;
    const group = new RadioGroup({
      scene: fakeScene,
      value: 'a',
      onChange: (): void => {
        calls++;
      },
    });
    const a = group.createRadio({ x: 0, y: 0, value: 'a' });
    a.select();
    expect(calls).toBe(0);
  });

  it('should set value programmatically via setValue', () => {
    const group = new RadioGroup({ scene: fakeScene });
    const a = group.createRadio({ x: 0, y: 0, value: 'a' });
    const b = group.createRadio({ x: 0, y: 0, value: 'b' });

    group.setValue('b');
    expect(a.isChecked()).toBe(false);
    expect(b.isChecked()).toBe(true);
    expect(group.getValue()).toBe('b');
  });

  it('should clear the value when passed undefined', () => {
    const group = new RadioGroup({ scene: fakeScene, value: 'a' });
    const a = group.createRadio({ x: 0, y: 0, value: 'a' });

    group.setValue(undefined);
    expect(a.isChecked()).toBe(false);
    expect(group.getValue()).toBeUndefined();
  });

  it('should not recurse when internally deselecting siblings', () => {
    let calls = 0;
    const group = new RadioGroup({
      scene: fakeScene,
      value: 'a',
      onChange: (): void => {
        calls++;
      },
    });
    group.createRadio({ x: 0, y: 0, value: 'a' });
    const b = group.createRadio({ x: 0, y: 0, value: 'b' });

    b.select();
    // Only the group's onChange fires — the "a → false" propagated from the
    // group's internal update is muted by the recursion guard.
    expect(calls).toBe(1);
  });

  it('should propagate defaults to each Radio unless overridden', () => {
    const group = new RadioGroup({
      scene: fakeScene,
      color: 'purple-600',
      name: 'diff',
    });
    const a = group.createRadio({ x: 0, y: 0, value: 'a' });
    // Radio inherited the name.
    expect(a.name).toBe('diff');
  });

  it('should allow per-radio overrides on createRadio', () => {
    const group = new RadioGroup({
      scene: fakeScene,
      color: 'purple-600',
    });
    const overridden = group.createRadio({
      x: 0,
      y: 0,
      value: 'a',
      color: 'red-500',
    });
    // Just make sure it constructed — we don't introspect color internals here.
    expect(overridden.value).toBe('a');
  });

  it('should disable / enable every radio in the group', () => {
    const group = new RadioGroup({ scene: fakeScene });
    const a = group.createRadio({ x: 0, y: 0, value: 'a' });
    const b = group.createRadio({ x: 0, y: 0, value: 'b' });

    group.disable();
    expect(a.isDisabled()).toBe(true);
    expect(b.isDisabled()).toBe(true);

    group.enable();
    expect(a.isDisabled()).toBe(false);
    expect(b.isDisabled()).toBe(false);
  });

  it('should apply readOnly to every radio', () => {
    const group = new RadioGroup({ scene: fakeScene });
    const a = group.createRadio({ x: 0, y: 0, value: 'a' });
    const b = group.createRadio({ x: 0, y: 0, value: 'b' });

    group.setReadOnly(true);
    expect(a.isReadOnly()).toBe(true);
    expect(b.isReadOnly()).toBe(true);
    expect(group.isReadOnly()).toBe(true);
  });

  it('should allow replacing the onChange callback', () => {
    const group = new RadioGroup({ scene: fakeScene });
    const a = group.createRadio({ x: 0, y: 0, value: 'a' });
    let calls = 0;
    group.onChange((): void => {
      calls++;
    });
    a.select();
    expect(calls).toBe(1);
    group.onChange(undefined);
    group.setValue('a-again' as never);
    expect(calls).toBe(1);
  });
});
