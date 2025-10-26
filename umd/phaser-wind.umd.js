(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('phaser'), require('lodash.merge')) :
    typeof define === 'function' && define.amd ? define(['exports', 'phaser', 'lodash.merge'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.phaserWind = {}, global.Phaser, global._.merge));
})(this, (function (exports, phaser, merge) { 'use strict';

    /* eslint-disable security/detect-unsafe-regex */
    /**
     * Checks if a string is a valid CSS color value
     * @param color - The color string to validate
     * @returns True if the color string is valid, false otherwise
     *
     * Supports the following formats:
     * - Hex colors (#RRGGBB or #RGB)
     * - RGB colors (rgb(r, g, b))
     * - RGBA colors (rgba(r, g, b, a))
     * - OKLCH colors (oklch(l c h [/ a]))
     */
    var isValidColor = function (color) {
        if (typeof color !== 'string') {
            return false;
        }
        var trimmedColor = color.trim();
        if (/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(trimmedColor)) {
            return true;
        }
        if (/^rgb\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*\)$/.test(trimmedColor)) {
            return true;
        }
        if (/^rgba\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*([01]|0?\.\d+)\s*\)$/.test(trimmedColor)) {
            return true;
        }
        if (/^oklch\(\s*(\d*\.?\d+%?)\s+(\d*\.?\d+)\s+(\d*\.?\d+)(?:\s*\/\s*([01]|0?\.\d+))?\s*\)$/.test(trimmedColor)) {
            return true;
        }
        return false;
    };

    // https://github.com/tailwindlabs/tailwindcss/blob/main/packages/tailwindcss/src/compat/colors.ts
    var palette = {
        black: '#000',
        white: '#fff',
        slate: {
            '50': 'rgb(248, 250, 252)',
            '100': 'rgb(241, 245, 249)',
            '200': 'rgb(226, 232, 240)',
            '300': 'rgb(203, 213, 225)',
            '400': 'rgb(148, 163, 184)',
            '500': 'rgb(100, 116, 139)',
            '600': 'rgb(71, 85, 105)',
            '700': 'rgb(51, 65, 85)',
            '800': 'rgb(30, 41, 59)',
            '900': 'rgb(15, 23, 42)',
            '950': 'rgb(2, 6, 23)',
        },
        gray: {
            '50': 'rgb(249, 250, 251)',
            '100': 'rgb(243, 244, 246)',
            '200': 'rgb(229, 231, 235)',
            '300': 'rgb(209, 213, 219)',
            '400': 'rgb(156, 163, 175)',
            '500': 'rgb(107, 114, 128)',
            '600': 'rgb(75, 85, 99)',
            '700': 'rgb(55, 65, 81)',
            '800': 'rgb(31, 41, 55)',
            '900': 'rgb(17, 24, 39)',
            '950': 'rgb(3, 7, 18)',
        },
        zinc: {
            '50': 'rgb(250, 250, 250)',
            '100': 'rgb(244, 244, 245)',
            '200': 'rgb(228, 228, 231)',
            '300': 'rgb(212, 212, 216)',
            '400': 'rgb(161, 161, 170)',
            '500': 'rgb(113, 113, 122)',
            '600': 'rgb(82, 82, 91)',
            '700': 'rgb(63, 63, 70)',
            '800': 'rgb(39, 39, 42)',
            '900': 'rgb(24, 24, 27)',
            '950': 'rgb(9, 9, 11)',
        },
        neutral: {
            '50': 'rgb(250, 250, 250)',
            '100': 'rgb(245, 245, 245)',
            '200': 'rgb(229, 229, 229)',
            '300': 'rgb(212, 212, 212)',
            '400': 'rgb(163, 163, 163)',
            '500': 'rgb(115, 115, 115)',
            '600': 'rgb(82, 82, 82)',
            '700': 'rgb(64, 64, 64)',
            '800': 'rgb(38, 38, 38)',
            '900': 'rgb(23, 23, 23)',
            '950': 'rgb(10, 10, 10)',
        },
        stone: {
            '50': 'rgb(250, 250, 249)',
            '100': 'rgb(245, 245, 244)',
            '200': 'rgb(231, 229, 228)',
            '300': 'rgb(214, 211, 209)',
            '400': 'rgb(168, 162, 158)',
            '500': 'rgb(120, 113, 108)',
            '600': 'rgb(87, 83, 78)',
            '700': 'rgb(68, 64, 60)',
            '800': 'rgb(41, 37, 36)',
            '900': 'rgb(28, 25, 23)',
            '950': 'rgb(12, 10, 9)',
        },
        red: {
            '50': 'rgb(254, 242, 242)',
            '100': 'rgb(254, 226, 226)',
            '200': 'rgb(254, 202, 202)',
            '300': 'rgb(252, 165, 165)',
            '400': 'rgb(248, 113, 113)',
            '500': 'rgb(239, 68, 68)',
            '600': 'rgb(220, 38, 38)',
            '700': 'rgb(185, 28, 28)',
            '800': 'rgb(153, 27, 27)',
            '900': 'rgb(127, 29, 29)',
            '950': 'rgb(69, 10, 10)',
        },
        orange: {
            '50': 'rgb(255, 247, 237)',
            '100': 'rgb(255, 237, 213)',
            '200': 'rgb(254, 215, 170)',
            '300': 'rgb(253, 186, 116)',
            '400': 'rgb(251, 146, 60)',
            '500': 'rgb(249, 115, 22)',
            '600': 'rgb(234, 88, 12)',
            '700': 'rgb(194, 65, 12)',
            '800': 'rgb(154, 52, 18)',
            '900': 'rgb(124, 45, 18)',
            '950': 'rgb(67, 20, 7)',
        },
        amber: {
            '50': 'rgb(255, 251, 235)',
            '100': 'rgb(254, 243, 199)',
            '200': 'rgb(253, 230, 138)',
            '300': 'rgb(252, 211, 77)',
            '400': 'rgb(251, 191, 36)',
            '500': 'rgb(245, 158, 11)',
            '600': 'rgb(217, 119, 6)',
            '700': 'rgb(180, 83, 9)',
            '800': 'rgb(146, 64, 14)',
            '900': 'rgb(120, 53, 15)',
            '950': 'rgb(69, 26, 3)',
        },
        yellow: {
            '50': 'rgb(254, 252, 232)',
            '100': 'rgb(254, 249, 195)',
            '200': 'rgb(254, 240, 138)',
            '300': 'rgb(253, 224, 71)',
            '400': 'rgb(250, 204, 21)',
            '500': 'rgb(234, 179, 8)',
            '600': 'rgb(202, 138, 4)',
            '700': 'rgb(161, 98, 7)',
            '800': 'rgb(133, 77, 14)',
            '900': 'rgb(113, 63, 18)',
            '950': 'rgb(66, 32, 6)',
        },
        lime: {
            '50': 'rgb(247, 254, 231)',
            '100': 'rgb(236, 252, 203)',
            '200': 'rgb(217, 249, 157)',
            '300': 'rgb(190, 242, 100)',
            '400': 'rgb(163, 230, 53)',
            '500': 'rgb(132, 204, 22)',
            '600': 'rgb(101, 163, 13)',
            '700': 'rgb(77, 124, 15)',
            '800': 'rgb(63, 98, 18)',
            '900': 'rgb(54, 83, 20)',
            '950': 'rgb(26, 46, 5)',
        },
        green: {
            '50': 'rgb(240, 253, 244)',
            '100': 'rgb(220, 252, 231)',
            '200': 'rgb(187, 247, 208)',
            '300': 'rgb(134, 239, 172)',
            '400': 'rgb(74, 222, 128)',
            '500': 'rgb(34, 197, 94)',
            '600': 'rgb(22, 163, 74)',
            '700': 'rgb(21, 128, 61)',
            '800': 'rgb(22, 101, 52)',
            '900': 'rgb(20, 83, 45)',
            '950': 'rgb(5, 46, 22)',
        },
        emerald: {
            '50': 'rgb(236, 253, 245)',
            '100': 'rgb(209, 250, 229)',
            '200': 'rgb(167, 243, 208)',
            '300': 'rgb(110, 231, 183)',
            '400': 'rgb(52, 211, 153)',
            '500': 'rgb(16, 185, 129)',
            '600': 'rgb(5, 150, 105)',
            '700': 'rgb(4, 120, 87)',
            '800': 'rgb(6, 95, 70)',
            '900': 'rgb(6, 78, 59)',
            '950': 'rgb(2, 44, 34)',
        },
        teal: {
            '50': 'rgb(240, 253, 250)',
            '100': 'rgb(204, 251, 241)',
            '200': 'rgb(153, 246, 228)',
            '300': 'rgb(94, 234, 212)',
            '400': 'rgb(45, 212, 191)',
            '500': 'rgb(20, 184, 166)',
            '600': 'rgb(13, 148, 136)',
            '700': 'rgb(15, 118, 110)',
            '800': 'rgb(17, 94, 89)',
            '900': 'rgb(19, 78, 74)',
            '950': 'rgb(4, 47, 46)',
        },
        cyan: {
            '50': 'rgb(236, 254, 255)',
            '100': 'rgb(207, 250, 254)',
            '200': 'rgb(165, 243, 252)',
            '300': 'rgb(103, 232, 249)',
            '400': 'rgb(34, 211, 238)',
            '500': 'rgb(6, 182, 212)',
            '600': 'rgb(8, 145, 178)',
            '700': 'rgb(14, 116, 144)',
            '800': 'rgb(21, 94, 117)',
            '900': 'rgb(22, 78, 99)',
            '950': 'rgb(8, 51, 68)',
        },
        sky: {
            '50': 'rgb(240, 249, 255)',
            '100': 'rgb(224, 242, 254)',
            '200': 'rgb(186, 230, 253)',
            '300': 'rgb(125, 211, 252)',
            '400': 'rgb(56, 189, 248)',
            '500': 'rgb(14, 165, 233)',
            '600': 'rgb(2, 132, 199)',
            '700': 'rgb(3, 105, 161)',
            '800': 'rgb(7, 89, 133)',
            '900': 'rgb(12, 74, 110)',
            '950': 'rgb(8, 47, 73)',
        },
        blue: {
            '50': 'rgb(239, 246, 255)',
            '100': 'rgb(219, 234, 254)',
            '200': 'rgb(191, 219, 254)',
            '300': 'rgb(147, 197, 253)',
            '400': 'rgb(96, 165, 250)',
            '500': 'rgb(59, 130, 246)',
            '600': 'rgb(37, 99, 235)',
            '700': 'rgb(29, 78, 216)',
            '800': 'rgb(30, 64, 175)',
            '900': 'rgb(30, 58, 138)',
            '950': 'rgb(23, 37, 84)',
        },
        indigo: {
            '50': 'rgb(238, 242, 255)',
            '100': 'rgb(224, 231, 255)',
            '200': 'rgb(199, 210, 254)',
            '300': 'rgb(165, 180, 252)',
            '400': 'rgb(129, 140, 248)',
            '500': 'rgb(99, 102, 241)',
            '600': 'rgb(79, 70, 229)',
            '700': 'rgb(67, 56, 202)',
            '800': 'rgb(55, 48, 163)',
            '900': 'rgb(49, 46, 129)',
            '950': 'rgb(30, 27, 75)',
        },
        violet: {
            '50': 'rgb(245, 243, 255)',
            '100': 'rgb(237, 233, 254)',
            '200': 'rgb(221, 214, 254)',
            '300': 'rgb(196, 181, 253)',
            '400': 'rgb(167, 139, 250)',
            '500': 'rgb(139, 92, 246)',
            '600': 'rgb(124, 58, 237)',
            '700': 'rgb(109, 40, 217)',
            '800': 'rgb(91, 33, 182)',
            '900': 'rgb(76, 29, 149)',
            '950': 'rgb(46, 16, 101)',
        },
        purple: {
            '50': 'rgb(250, 245, 255)',
            '100': 'rgb(243, 232, 255)',
            '200': 'rgb(233, 213, 255)',
            '300': 'rgb(216, 180, 254)',
            '400': 'rgb(192, 132, 252)',
            '500': 'rgb(168, 85, 247)',
            '600': 'rgb(147, 51, 234)',
            '700': 'rgb(126, 34, 206)',
            '800': 'rgb(107, 33, 168)',
            '900': 'rgb(88, 28, 135)',
            '950': 'rgb(59, 7, 100)',
        },
        fuchsia: {
            '50': 'rgb(253, 244, 255)',
            '100': 'rgb(250, 232, 255)',
            '200': 'rgb(245, 208, 254)',
            '300': 'rgb(240, 171, 252)',
            '400': 'rgb(232, 121, 249)',
            '500': 'rgb(217, 70, 239)',
            '600': 'rgb(192, 38, 211)',
            '700': 'rgb(162, 28, 175)',
            '800': 'rgb(134, 25, 143)',
            '900': 'rgb(112, 26, 117)',
            '950': 'rgb(74, 4, 78)',
        },
        pink: {
            '50': 'rgb(253, 242, 248)',
            '100': 'rgb(252, 231, 243)',
            '200': 'rgb(251, 207, 232)',
            '300': 'rgb(249, 168, 212)',
            '400': 'rgb(244, 114, 182)',
            '500': 'rgb(236, 72, 153)',
            '600': 'rgb(219, 39, 119)',
            '700': 'rgb(190, 24, 93)',
            '800': 'rgb(157, 23, 77)',
            '900': 'rgb(131, 24, 67)',
            '950': 'rgb(80, 7, 36)',
        },
        rose: {
            '50': 'rgb(255, 241, 242)',
            '100': 'rgb(255, 228, 230)',
            '200': 'rgb(254, 205, 211)',
            '300': 'rgb(253, 164, 175)',
            '400': 'rgb(251, 113, 133)',
            '500': 'rgb(244, 63, 94)',
            '600': 'rgb(225, 29, 72)',
            '700': 'rgb(190, 18, 60)',
            '800': 'rgb(159, 18, 57)',
            '900': 'rgb(136, 19, 55)',
            '950': 'rgb(76, 5, 25)',
        },
    };

    /** Regular expression to match RGB color format */
    var RGB_REGEX = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;
    /**
     * Convert hex color value to number
     * @param hexValue - Hex color value (e.g., '#ff0000')
     * @returns Number representation of hex color
     */
    var convertHexToNumber = function (hexValue) {
        var hex = hexValue.slice(1);
        if (hex.length === 3) {
            var r = parseInt(hex[0] + hex[0], 16);
            var g = parseInt(hex[1] + hex[1], 16);
            var b = parseInt(hex[2] + hex[2], 16);
            return (r << 16) + (g << 8) + b;
        }
        return parseInt(hex, 16);
    };
    /**
     * Convert RGB color value to number
     * @param rgbValue - RGB color value (e.g., 'rgb(255, 0, 0)')
     * @returns Number representation of RGB color
     * @throws {Error} If RGB format is invalid
     */
    var convertRgbToNumber = function (rgbValue) {
        var matches = rgbValue.match(RGB_REGEX);
        if (!matches) {
            throw new Error("Invalid RGB format: ".concat(rgbValue));
        }
        var r = parseInt(matches[1]);
        var g = parseInt(matches[2]);
        var b = parseInt(matches[3]);
        return (r << 16) + (g << 8) + b;
    };
    /**
     * Convert color value to number
     * @param colorValue - Color value (e.g., '#ff0000' or 'rgb(255, 0, 0)')
     * @returns Number representation of color
     */
    var convertColorValueToNumber = function (colorValue) {
        if (colorValue.startsWith('#')) {
            return convertHexToNumber(colorValue);
        }
        return convertRgbToNumber(colorValue);
    };
    /**
     * Factory that creates a color utility API based on the provided theme colors
     * @param themeColors - Theme colors configuration
     * @returns Color utility API instance
     */
    /**
     * Create a color API bound to an optional theme colors map.
     * If a key exists in `themeColors`, it will be resolved to a palette token and then to RGB/Hex.
     *
     * @typeParam T - Theme colors map
     * @param themeColors - Optional map of theme color tokens
     * @example
     * const c = createColor({ primary: 'blue-500' });
     * c.rgb('primary'); // rgb(59, 130, 246)
     */
    var createColor = function (themeColors) {
        /**
         * Get color value from theme configuration
         * @param key - Color token or theme color key
         * @returns Color value from theme or null if not found
         */
        var getValueFromTheme = function (key) {
            if (themeColors && key in themeColors) {
                return themeColors[key];
            }
            return null;
        };
        /**
         * Get RGB string representation of a color
         * @param color - Color token, theme color key or valid color string
         * @returns RGB color string
         * @throws {Error} If color token is not found
         */
        var rgb = function (color) {
            var _a;
            // Runtime supports direct CSS strings for flexibility, but
            // the public type restricts to palette tokens or theme keys.
            if (typeof color === 'string' && isValidColor(color)) {
                return color;
            }
            var colorFromTheme = getValueFromTheme(color);
            if (colorFromTheme) {
                return rgb(colorFromTheme);
            }
            var parts = color.split('-');
            if (parts.length === 2) {
                var colorKey = parts[0];
                var shade = parts[1];
                var colorValue_1 = (_a = palette[colorKey]) === null || _a === void 0 ? void 0 : _a[shade];
                if (!colorValue_1) {
                    if (isValidColor(color)) {
                        return color;
                    }
                    throw new Error("Color token \"".concat(colorKey, "-").concat(shade, "\" not found"));
                }
                return colorValue_1;
            }
            var colorValue = palette[color];
            if (!colorValue) {
                if (isValidColor(color)) {
                    return color;
                }
                throw new Error("Color token \"".concat(color, "\" not found"));
            }
            return colorValue;
        };
        /**
         * Get hex number representation of a color
         * @param color - Color token, theme color key or valid color string
         * @returns Hex color number
         * @throws {Error} If color token is not found
         */
        var hex = function (color) {
            var _a;
            // See note in rgb()
            if (typeof color === 'string' && isValidColor(color)) {
                return convertColorValueToNumber(color);
            }
            var colorFromTheme = getValueFromTheme(color);
            if (colorFromTheme) {
                return hex(colorFromTheme);
            }
            var parts = color.split('-');
            if (parts.length === 2) {
                var colorKey = parts[0];
                var shade = parts[1];
                var colorValue = (_a = palette[colorKey]) === null || _a === void 0 ? void 0 : _a[shade];
                if (!colorValue) {
                    if (isValidColor(color)) {
                        return convertColorValueToNumber(color);
                    }
                    throw new Error("Color token \"".concat(colorKey, "-").concat(shade, "\" not found"));
                }
                return convertColorValueToNumber(colorValue);
            }
            var colorToConvert = palette[color];
            if (isValidColor(colorToConvert)) {
                return convertColorValueToNumber(colorToConvert);
            }
            throw new Error("Color token \"".concat(color, "\" not found"));
        };
        var api = {
            rgb: rgb,
            hex: hex,
            black: function () { return rgb('black'); },
            white: function () { return rgb('white'); },
            slate: function (shade) { return rgb("slate-".concat(shade)); },
            gray: function (shade) { return rgb("gray-".concat(shade)); },
            zinc: function (shade) { return rgb("zinc-".concat(shade)); },
            neutral: function (shade) { return rgb("neutral-".concat(shade)); },
            stone: function (shade) { return rgb("stone-".concat(shade)); },
            red: function (shade) { return rgb("red-".concat(shade)); },
            orange: function (shade) { return rgb("orange-".concat(shade)); },
            amber: function (shade) { return rgb("amber-".concat(shade)); },
            yellow: function (shade) { return rgb("yellow-".concat(shade)); },
            lime: function (shade) { return rgb("lime-".concat(shade)); },
            green: function (shade) { return rgb("green-".concat(shade)); },
            emerald: function (shade) { return rgb("emerald-".concat(shade)); },
            teal: function (shade) { return rgb("teal-".concat(shade)); },
            cyan: function (shade) { return rgb("cyan-".concat(shade)); },
            sky: function (shade) { return rgb("sky-".concat(shade)); },
            blue: function (shade) { return rgb("blue-".concat(shade)); },
            indigo: function (shade) { return rgb("indigo-".concat(shade)); },
            violet: function (shade) { return rgb("violet-".concat(shade)); },
            purple: function (shade) { return rgb("purple-".concat(shade)); },
            fuchsia: function (shade) { return rgb("fuchsia-".concat(shade)); },
            pink: function (shade) { return rgb("pink-".concat(shade)); },
            rose: function (shade) { return rgb("rose-".concat(shade)); },
            blackHex: function () { return hex('black'); },
            whiteHex: function () { return hex('white'); },
            slateHex: function (shade) { return hex("slate-".concat(shade)); },
            grayHex: function (shade) { return hex("gray-".concat(shade)); },
            zincHex: function (shade) { return hex("zinc-".concat(shade)); },
            neutralHex: function (shade) { return hex("neutral-".concat(shade)); },
            stoneHex: function (shade) { return hex("stone-".concat(shade)); },
            redHex: function (shade) { return hex("red-".concat(shade)); },
            orangeHex: function (shade) { return hex("orange-".concat(shade)); },
            amberHex: function (shade) { return hex("amber-".concat(shade)); },
            yellowHex: function (shade) { return hex("yellow-".concat(shade)); },
            limeHex: function (shade) { return hex("lime-".concat(shade)); },
            greenHex: function (shade) { return hex("green-".concat(shade)); },
            emeraldHex: function (shade) { return hex("emerald-".concat(shade)); },
            tealHex: function (shade) { return hex("teal-".concat(shade)); },
            cyanHex: function (shade) { return hex("cyan-".concat(shade)); },
            skyHex: function (shade) { return hex("sky-".concat(shade)); },
            blueHex: function (shade) { return hex("blue-".concat(shade)); },
            indigoHex: function (shade) { return hex("indigo-".concat(shade)); },
            violetHex: function (shade) { return hex("violet-".concat(shade)); },
            purpleHex: function (shade) { return hex("purple-".concat(shade)); },
            fuchsiaHex: function (shade) { return hex("fuchsia-".concat(shade)); },
            pinkHex: function (shade) { return hex("pink-".concat(shade)); },
            roseHex: function (shade) { return hex("rose-".concat(shade)); },
        };
        return api;
    };
    /**
     * Convenience instance using only the default palette tokens (no theme).
     *
     * @example
     * Color.rgb('emerald-400')
     * Color.hex('black')
     */
    // eslint-disable-next-line no-redeclare
    var Color = createColor({});

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    /**
     * Default mapping of font size keys to their pixel values in pixels
     */
    /** Default font-size scale mapping (in pixels). */
    var fontSizeMap = {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
        '5xl': 48,
        '6xl': 60,
        '7xl': 72,
        '8xl': 96,
        '9xl': 128,
    };
    /**
     * Creates a font size conversion API with optional custom font sizes
     * @template T - Optional custom font size map type
     * @param themeFontSizes - Optional custom font size mappings to extend defaults
     * @returns Font size conversion API
     */
    /**
     * Create a font-size API bound to an optional custom map.
     * @example
     * const f = createFontSize({ xxl: 28 });
     * f.css('xxl'); // '28px'
     */
    var createFontSize = function (themeFontSizes) {
        var fontmap = __assign(__assign({}, fontSizeMap), themeFontSizes);
        return {
            px: function (key) {
                var value = fontmap[key];
                if (typeof value === 'number') {
                    return value;
                }
                return 0;
            },
            rem: function (key) {
                var value = fontmap[key];
                if (typeof value === 'number') {
                    return value / 16;
                }
                return 0;
            },
            css: function (key) {
                var value = fontmap[key];
                if (typeof value === 'number') {
                    return "".concat(value, "px");
                }
                return '0px';
            },
        };
    };
    // Convenience instance using default font sizes (no theme)
    var FontSize = createFontSize(undefined);

    var fontMap = {
        primary: 'Inter, system-ui, sans-serif',
        secondary: 'Roboto, Arial, sans-serif',
        monospace: 'Fira Code, Consolas, monospace',
        display: 'Poppins, Inter, sans-serif',
    };
    var createFont = function (fonts, fontSizes) {
        var map = __assign(__assign({}, fontMap), fonts);
        var fontSizeApi = createFontSize(fontSizes);
        var getFamily = function (key) {
            if (key.includes('.')) {
                var _a = key.split('.'), short = _a[1];
                if (short && typeof map[short] === 'string') {
                    return map[short];
                }
            }
            return typeof map[key] === 'string' ? map[key] : key;
        };
        return {
            size: function (key) {
                var _a;
                return (_a = fontSizeApi.px(key)) !== null && _a !== void 0 ? _a : 0;
            },
            format: function (_a) {
                var _b;
                var size = _a.size, family = _a.family;
                var sizePx = (_b = fontSizeApi.px(size)) !== null && _b !== void 0 ? _b : 0;
                return "".concat(sizePx, "px '").concat(getFamily(family), "'");
            },
            family: function (key) { return getFamily(key); },
            getAvailableFonts: function () {
                return Array.from(new Set(__spreadArray(__spreadArray([], Object.keys(fontMap), true), Object.keys(map), true)));
            },
        };
    };

    /**
     * Mapping of radius keys to their pixel values
     */
    /** Default radius scale mapping (in pixels). */
    var radiusMap = {
        none: 0,
        sm: 2,
        default: 4,
        md: 6,
        lg: 8,
        xl: 12,
        '2xl': 16,
        '3xl': 24,
        full: 9999,
    };
    /**
     * Create a radius API bound to an optional theme radius map.
     * @example
     * const r = createRadius({ card: 12 });
     * r.css('card'); // '12px'
     */
    var createRadius = function (themeRadius) {
        var map = __assign(__assign({}, radiusMap), themeRadius);
        var get = function (key) {
            return typeof map[key] === 'number' ? map[key] : 0;
        };
        return {
            px: function (key) {
                return get(key);
            },
            rem: function (key) {
                return get(key) / 16;
            },
            css: function (key) {
                return "".concat(get(key), "px");
            },
        };
    };
    /** Convenience instance using default radius map (no theme). */
    var Radius = createRadius(undefined);

    /** Default shadow presets. */
    var defaultShadowMap = {
        sm: { blur: 2, offsetX: 1, offsetY: 1, alpha: 0.15 },
        md: { blur: 4, offsetX: 2, offsetY: 2, alpha: 0.2 },
        lg: { blur: 6, offsetX: 4, offsetY: 4, alpha: 0.25 },
        xl: { blur: 8, offsetX: 6, offsetY: 6, alpha: 0.3 },
        '2xl': { blur: 12, offsetX: 8, offsetY: 8, alpha: 0.35 },
        inner: { blur: 4, offsetX: -2, offsetY: -2, alpha: 0.2 },
    };
    /**
     * Create a shadow API bound to an optional effects map.
     * @example
     * const sh = createShadow({ glow: { blur: 8, offsetX: 0, offsetY: 0, alpha: .6 } });
     * sh.get('glow');
     */
    var createShadow = function (effects) {
        var map = __assign(__assign({}, defaultShadowMap), effects);
        var getConfig = function (key) {
            var cfg = map[key];
            if (cfg && typeof cfg === 'object')
                return cfg;
            return defaultShadowMap['md'];
        };
        return {
            get: function (key) { return getConfig(key); },
        };
    };
    /** Convenience instance using default shadows (no theme). */
    var Shadow = createShadow(undefined);

    /**
     * Spacing scale mapping following Tailwind's spacing scale.
     * Values are in pixels, with a base unit of 4px (1 = 4px).
     */
    var spacingMap = {
        '0': 0,
        px: 1,
        '0.5': 2,
        '1': 4,
        '1.5': 6,
        '2': 8,
        '2.5': 10,
        '3': 12,
        '3.5': 14,
        '4': 16,
        '5': 20,
        '6': 24,
        '7': 28,
        '8': 32,
        '9': 36,
        '10': 40,
        '11': 44,
        '12': 48,
        '14': 56,
        '16': 64,
        '20': 80,
        '24': 96,
        '28': 112,
        '32': 128,
        '36': 144,
        '40': 160,
        '44': 176,
        '48': 192,
        '52': 208,
        '56': 224,
        '60': 240,
        '64': 256,
        '72': 288,
        '80': 320,
        '96': 384,
    };
    /**
     * Create a spacing API bound to an optional theme spacing map.
     * @example
     * const s = createSpacing({ gutter: 24 });
     * s.px('gutter'); // 24
     */
    var createSpacing = function (themeSpacing) {
        var map = __assign(__assign({}, spacingMap), themeSpacing);
        var get = function (key) {
            return typeof map[key] === 'number' ? map[key] : 0;
        };
        return {
            px: function (key) {
                return get(key);
            },
            rem: function (key) {
                return get(key) / 16;
            },
            css: function (key) {
                return "".concat(get(key), "px");
            },
        };
    };
    /** Convenience instance using default spacing map (no theme). */
    var Spacing = createSpacing(undefined);

    /**
     * Example theme configurations with structured design tokens
     */
    var defaultLightTheme = {
        fonts: {
            primary: 'Inter, system-ui, sans-serif',
            secondary: 'Roboto, Arial, sans-serif',
            monospace: 'Fira Code, Consolas, monospace',
            display: 'Poppins, Inter, sans-serif',
        },
        fontSizes: __assign({}, fontSizeMap),
        colors: {
            // Primary colors
            primary: 'blue-600',
            secondary: 'gray-600',
            // Semantic colors
            success: 'green-500',
            warning: 'yellow-500',
            error: 'red-500',
            info: 'blue-400',
            // Background colors
            background: 'white',
            // Text colors
            text: 'gray-900',
            // UI elements
            shadow: 'black',
            overlay: 'black',
        },
        spacing: __assign({}, spacingMap),
        typography: {
            heading: {
                fontSize: '2xl',
                fontFamily: 'fonts.display',
                fontWeight: 600,
                lineHeight: 1.2,
            },
            'heading-large': {
                fontSize: '4xl',
                fontFamily: 'fonts.display',
                fontWeight: 700,
                lineHeight: 1.1,
            },
            body: {
                fontSize: 'base',
                fontFamily: 'fonts.primary',
                fontWeight: 400,
                lineHeight: 1.5,
            },
            caption: {
                fontSize: 'sm',
                fontFamily: 'fonts.primary',
                fontWeight: 400,
                lineHeight: 1.4,
            },
        },
        // TODO: Check this implementation
        effects: {
            'shadow-sm': {
                blur: 2,
                offsetY: 1,
                color: 'colors.shadow',
                alpha: 0.05,
            },
            'shadow-md': {
                blur: 4,
                offsetY: 2,
                color: 'colors.shadow',
                alpha: 0.1,
            },
            'shadow-lg': {
                blur: 8,
                offsetY: 4,
                color: 'colors.shadow',
                alpha: 0.1,
            },
        },
        custom: {},
    };
    var defaultDarkTheme = {
        fonts: {
            primary: 'Inter, system-ui, sans-serif',
            secondary: 'Roboto, Arial, sans-serif',
            monospace: 'Fira Code, Consolas, monospace',
            display: 'Poppins, Inter, sans-serif',
        },
        fontSizes: __assign({}, fontSizeMap),
        radius: __assign({}, radiusMap),
        colors: {
            // Primary colors
            primary: 'blue-400',
            secondary: 'gray-400',
            // Semantic colors
            success: 'green-400',
            warning: 'yellow-400',
            error: 'red-400',
            info: 'blue-300',
            // Background colors
            background: 'gray-900',
            // Text colors
            text: 'white',
            // UI elements
            shadow: 'black',
            overlay: 'black',
        },
        spacing: __assign({}, spacingMap),
        typography: {
            heading: {
                fontSize: '2xl',
                fontFamily: 'fonts.display',
                fontWeight: 600,
                lineHeight: 1.2,
            },
            'heading-large': {
                fontSize: '4xl',
                fontFamily: 'fonts.display',
                fontWeight: 700,
                lineHeight: 1.1,
            },
            body: {
                fontSize: 'base',
                fontFamily: 'fonts.primary',
                fontWeight: 400,
                lineHeight: 1.5,
            },
            caption: {
                fontSize: 'sm',
                fontFamily: 'fonts.primary',
                fontWeight: 400,
                lineHeight: 1.4,
            },
        },
        effects: {
            'shadow-sm': {
                blur: 2,
                offsetY: 1,
                color: 'colors.shadow',
                alpha: 0.1,
            },
            'shadow-md': {
                blur: 4,
                offsetY: 2,
                color: 'colors.shadow',
                alpha: 0.15,
            },
            'shadow-lg': {
                blur: 8,
                offsetY: 4,
                color: 'colors.shadow',
                alpha: 0.2,
            },
        },
        custom: {},
    };

    var createTheme = function (theme) {
        return merge({}, defaultLightTheme, theme);
    };

    var PHASER_WIND_KEY = 'pw';
    /**
     * Phaser Wind Plugin class that manages theme configuration
     * @extends Plugins.BasePlugin
     */
    var PhaserWindPlugin = /** @class */ (function (_super) {
        __extends(PhaserWindPlugin, _super);
        /**
         * Creates an instance of PhaserWindPlugin
         * @param pluginManager - Phaser plugin manager instance
         */
        function PhaserWindPlugin(pluginManager) {
            var _this = _super.call(this, pluginManager) || this;
            _this.colorInstance = null;
            _this.fontSizeInstance = null;
            _this.spacingInstance = null;
            _this.radiusInstance = null;
            _this.fontInstance = null;
            _this.shadowInstance = null;
            _this.theme = defaultLightTheme;
            return _this;
        }
        /**
         * Initializes the plugin with theme configuration
         * @param theme - Custom theme configuration
         * @param darkMode - Whether to use dark mode theme when no custom theme provided
         * @example
         * ```typescript
         * const game = new Phaser.Game({
         *   plugins: {
         *     global: [
         *       {
         *         key: PHASER_WIND_KEY,
         *         plugin: PhaserWindPlugin,
         *         mapping: PHASER_WIND_KEY,
         *         data: { theme: defaultLightTheme }
         *       },
         *     ],
         *   },
         * });
         * ```
         */
        PhaserWindPlugin.prototype.init = function (_a) {
            var theme = _a.theme, _b = _a.darkMode, darkMode = _b === void 0 ? false : _b;
            if (!theme) {
                this.theme = darkMode
                    ? defaultDarkTheme
                    : defaultLightTheme;
                return;
            }
            else {
                this.theme = theme;
            }
            this.colorInstance = createColor(this.theme.colors);
            this.fontSizeInstance = createFontSize(this.theme.fontSizes);
            this.spacingInstance = createSpacing(this.theme.spacing);
            this.radiusInstance = createRadius(this.theme.radius);
            this.fontInstance = createFont(this.theme.fonts, this.theme.fontSizes);
            this.shadowInstance = createShadow(this.theme.effects);
        };
        /**
         * Returns the current theme configuration
         * @returns Current BaseThemeConfig
         */
        PhaserWindPlugin.prototype.getTheme = function () {
            return this.theme;
        };
        Object.defineProperty(PhaserWindPlugin.prototype, "color", {
            get: function () {
                return this.colorInstance;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PhaserWindPlugin.prototype, "fontSize", {
            get: function () {
                return this.fontSizeInstance;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PhaserWindPlugin.prototype, "spacing", {
            get: function () {
                return this.spacingInstance;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PhaserWindPlugin.prototype, "radius", {
            get: function () {
                return this.radiusInstance;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PhaserWindPlugin.prototype, "font", {
            get: function () {
                return this.fontInstance;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PhaserWindPlugin.prototype, "shadow", {
            get: function () {
                return this.shadowInstance;
            },
            enumerable: false,
            configurable: true
        });
        return PhaserWindPlugin;
    }(phaser.Plugins.BasePlugin));

    var SceneWithPhaserWind = /** @class */ (function (_super) {
        __extends(SceneWithPhaserWind, _super);
        /**
         *
         * @param config The scene key or scene specific configuration settings.
         */
        function SceneWithPhaserWind(config) {
            return _super.call(this, config) || this;
        }
        return SceneWithPhaserWind;
    }(Phaser.Scene));

    exports.Color = Color;
    exports.FontSize = FontSize;
    exports.PHASER_WIND_KEY = PHASER_WIND_KEY;
    exports.PhaserWindPlugin = PhaserWindPlugin;
    exports.Radius = Radius;
    exports.SceneWithPhaserWind = SceneWithPhaserWind;
    exports.Shadow = Shadow;
    exports.Spacing = Spacing;
    exports.createColor = createColor;
    exports.createFont = createFont;
    exports.createFontSize = createFontSize;
    exports.createRadius = createRadius;
    exports.createShadow = createShadow;
    exports.createSpacing = createSpacing;
    exports.createTheme = createTheme;
    exports.defaultDarkTheme = defaultDarkTheme;
    exports.defaultLightTheme = defaultLightTheme;
    exports.defaultShadowMap = defaultShadowMap;
    exports.fontMap = fontMap;
    exports.fontSizeMap = fontSizeMap;
    exports.isValidColor = isValidColor;
    exports.palette = palette;
    exports.radiusMap = radiusMap;
    exports.spacingMap = spacingMap;

}));
