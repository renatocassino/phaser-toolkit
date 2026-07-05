import { type IconKey } from 'font-awesome-for-phaser';
import { type Scene } from 'phaser';
import { type ColorKey, type FontSizeKey, type RadiusKey } from 'phaser-wind';

import { Radio, type RadioParams } from '../radio';

/** Parameters for creating a {@link RadioGroup}. */
export type RadioGroupParams = {
  /** Phaser scene shared by all radios in this group. */
  scene: Scene;
  /**
   * Metadata that identifies this group (passed back as the 2nd arg of
   * `onChange`). Not used to auto-link anything — no global registry.
   */
  name?: string;
  /** Initially selected value. Radios matching this `value` will be checked. */
  value?: string;
  /** Disables every radio in the group. */
  disabled?: boolean;
  /** Marks every radio in the group as read-only (visible, ignores clicks). */
  readOnly?: boolean;
  /** Fires when the selected value changes. */
  onChange?: (value: string | undefined, name?: string) => void;

  // ---- Shared defaults applied to every Radio created via createRadio.
  // ---- Per-call params in `createRadio` override these.

  /** Default color for all radios in the group. */
  color?: ColorKey | string;
  /** Default icon for all radios in the group. */
  icon?: IconKey;
  /** Default icon color for all radios. */
  iconColor?: ColorKey | string;
  /** Default label color for all radios. */
  labelColor?: ColorKey | string;
  /** Default size for all radios. */
  size?: FontSizeKey | number;
  /** Default border radius for all radios. */
  borderRadius?: RadiusKey | number;
};

/**
 * Params for {@link RadioGroup.createRadio}. Same shape as {@link RadioParams}
 * minus the fields the group manages (`onChange` is intercepted; `checked` is
 * derived from the group's `value`).
 *
 * Every field the group has as a default can still be overridden here.
 */
export type RadioGroupCreateRadioParams = Omit<
  RadioParams,
  'scene' | 'checked' | 'onChange'
>;

/**
 * RadioGroup — a controller for a set of {@link Radio}s that enforces
 * "only one selected". Not a visual component — nothing renders. It exposes
 * a `createRadio(params)` factory; the returned Radios can be positioned
 * anywhere in the scene (inside a Stack, spread across a HUD, wherever).
 *
 * The group holds the "selected value" and ensures that whenever any radio
 * flips to checked, the previously selected radio is deselected.
 *
 * @example
 * const group = new RadioGroup({
 *   scene: this,
 *   name: 'difficulty',
 *   value: 'normal',
 *   color: 'blue-500',
 *   onChange: (value) => console.log('selected:', value),
 * });
 *
 * const easy   = group.createRadio({ x: 200, y: 100, value: 'easy',   label: 'Easy' });
 * const normal = group.createRadio({ x: 200, y: 150, value: 'normal', label: 'Normal' });
 * const hard   = group.createRadio({ x: 200, y: 200, value: 'hard',   label: 'Hard' });
 *
 * this.add.existing(easy);
 * this.add.existing(normal);
 * this.add.existing(hard);
 *
 * group.getValue(); // 'normal'
 * group.setValue('hard');
 */
export class RadioGroup {
  /** All radios created by this group's factory. Read-only for consumers. */
  public readonly radios: Radio[] = [];
  /** The group's name — passed back as the 2nd arg of `onChange`. */
  public readonly groupName: string | undefined;

  private readonly scene: Scene;
  private readonly defaults: Omit<RadioGroupParams, 'scene' | 'name' | 'value' | 'onChange'>;
  private currentValue: string | undefined;
  private disabledState: boolean;
  private readOnlyState: boolean;
  private onChangeCb:
    | ((value: string | undefined, name?: string) => void)
    | undefined;
  /**
   * Guard against recursion: when we call setChecked(false) on the "losing"
   * radios, we don't want their onChange handlers to feed back into the
   * group.
   */
  private updating = false;

  constructor(params: RadioGroupParams) {
    const {
      scene,
      name,
      value,
      disabled = false,
      readOnly = false,
      onChange,
      ...defaults
    } = params;

    this.scene = scene;
    this.groupName = name;
    this.currentValue = value;
    this.disabledState = disabled;
    this.readOnlyState = readOnly;
    this.onChangeCb = onChange;
    this.defaults = defaults;
  }

  // -------- factory --------

  /**
   * Create a Radio wired to this group. The Radio is checked automatically
   * if its `value` matches the group's current value.
   *
   * @param params Radio configuration. Any of the group-level defaults
   *   (`color`, `icon`, `size`, etc.) can be overridden here per-radio.
   */
  public createRadio(params: RadioGroupCreateRadioParams): Radio {
    // Pass the group's name through so `onChange` on the RADIO also reports
    // the form field (matches Checkbox/Toggle behavior). `exactOptionalPropertyTypes`
    // makes us conditionally spread — can't pass `undefined` into an optional slot.
    const effectiveName = params.name ?? this.groupName;

    // Merge group defaults with per-radio overrides. Per-radio wins.
    const merged: RadioParams = {
      ...this.defaults,
      ...params,
      scene: this.scene,
      // Derived: checked iff this radio's value matches the group's.
      checked: params.value !== undefined && params.value === this.currentValue,
      // Inherit group-level disabled/readOnly unless the radio overrides.
      disabled: params.disabled ?? this.disabledState,
      readOnly: params.readOnly ?? this.readOnlyState,
      ...(effectiveName !== undefined && { name: effectiveName }),
      // Intercept the change: any radio going true means it's the new value.
      onChange: (checked, value): void => {
        if (this.updating) return;
        if (checked && value !== undefined) {
          this.setValue(value);
        } else if (!checked && value === this.currentValue) {
          // Radio was programmatically deselected AND it was the current
          // selection. Group's current value goes to undefined.
          this.setValue(undefined);
        }
      },
    };

    const radio = new Radio(merged);
    this.radios.push(radio);
    return radio;
  }

  // -------- public API --------

  /**
   * Programmatically set the selected value. Fires `onChange` on the group
   * if the value changes.
   */
  public setValue(value: string | undefined): this {
    if (this.currentValue === value) return this;
    this.currentValue = value;
    // Sync every radio to the new selection (silently to avoid recursion).
    this.updating = true;
    try {
      this.radios.forEach((radio) => {
        radio.setChecked(radio.value !== undefined && radio.value === value);
      });
    } finally {
      this.updating = false;
    }
    this.onChangeCb?.(value, this.groupName);
    return this;
  }

  /** The value of the currently selected radio, or `undefined`. */
  public getValue(): string | undefined {
    return this.currentValue;
  }

  /** Disable / enable every radio in the group. */
  public setDisabled(disabled: boolean): this {
    this.disabledState = disabled;
    this.radios.forEach((radio) => radio.setDisabled(disabled));
    return this;
  }

  public disable(): this {
    return this.setDisabled(true);
  }

  public enable(): this {
    return this.setDisabled(false);
  }

  public isDisabled(): boolean {
    return this.disabledState;
  }

  /** Mark every radio as read-only (or clear it). */
  public setReadOnly(readOnly: boolean): this {
    this.readOnlyState = readOnly;
    this.radios.forEach((radio) => radio.setReadOnly(readOnly));
    return this;
  }

  public isReadOnly(): boolean {
    return this.readOnlyState;
  }

  /** Replace the group's onChange callback. */
  public onChange(
    cb: ((value: string | undefined, name?: string) => void) | undefined
  ): this {
    this.onChangeCb = cb;
    return this;
  }

  /**
   * Clear this group's registry. Does NOT destroy the individual Radios —
   * they remain in the scene and continue to function standalone. Call
   * `radio.destroy()` on each if you want to remove them too.
   */
  public destroy(): void {
    this.radios.length = 0;
    this.onChangeCb = undefined;
  }
}
