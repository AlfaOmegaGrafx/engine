import { math } from '../math/math';

/**
 * @class
 * @name pc.Color
 * @classdesc Representation of an RGBA color.
 * @description Create a new Color object.
 * @param {number|number[]} [r] - The value of the red component (0-1). If r is an array of length 3 or 4, the array will be used to populate all components.
 * @param {number} [g] - The value of the green component (0-1).
 * @param {number} [b] - The value of the blue component (0-1).
 * @param {number} [a] - The value of the alpha component (0-1).
 * @property {number} r The red component of the color.
 * @property {number} g The green component of the color.
 * @property {number} b The blue component of the color.
 * @property {number} a The alpha component of the color.
 */
class Color {
    r: number;
    g: number;
    b: number;
    a: number;

    constructor(r?: number | number[], g?: number, b?: number, a?: number) {
        if (Array.isArray(r)) {
            this.r = r[0];
            this.g = r[1];
            this.b = r[2];
            this.a = r[3] !== undefined ? r[3] : 1;
        } else {
            this.r = r || 0;
            this.g = g || 0;
            this.b = b || 0;
            this.a = a !== undefined ? a : 1;
        }
    }

    /**
     * @function
     * @name pc.Color#clone
     * @description Returns a clone of the specified color.
     * @returns {pc.Color} A duplicate color object.
     */
    clone(): Color {
        return new Color(this.r, this.g, this.b, this.a);
    }

    /**
     * @function
     * @name pc.Color#copy
     * @description Copies the contents of a source color to a destination color.
     * @param {pc.Color} rhs - A color to copy to the specified color.
     * @returns {pc.Color} Self for chaining.
     * @example
     * var src = new pc.Color(1, 0, 0, 1);
     * var dst = new pc.Color();
     *
     * dst.copy(src);
     *
     * console.log("The two colors are " + (dst.equals(src) ? "equal" : "different"));
     */
    copy(rhs: Color): Color {
        this.r = rhs.r;
        this.g = rhs.g;
        this.b = rhs.b;
        this.a = rhs.a;

        return this;
    }

    /**
     * @function
     * @name pc.Color#equals
     * @description Reports whether two colors are equal.
     * @param {pc.Color} rhs - The color to compare to the specified color.
     * @returns {boolean} True if the colors are equal and false otherwise.
     * @example
     * var a = new pc.Color(1, 0, 0, 1);
     * var b = new pc.Color(1, 1, 0, 1);
     * console.log("The two colors are " + (a.equals(b) ? "equal" : "different"));
     */
    equals(rhs: Color): boolean {
        return this.r === rhs.r && this.g === rhs.g && this.b === rhs.b && this.a === rhs.a;
    }

    /**
     * @function
     * @name pc.Color#set
     * @description Assign values to the color components, including alpha.
     * @param {number} r - The value for red (0-1).
     * @param {number} g - The value for blue (0-1).
     * @param {number} b - The value for green (0-1).
     * @param {number} [a] - The value for the alpha (0-1), defaults to 1.
     * @returns {pc.Color} Self for chaining.
     */
    set(r: number, g: number, b: number, a?: number): Color {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = (a === undefined) ? 1 : a;

        return this;
    }

    /**
     * @function
     * @name pc.Color#lerp
     * @description Returns the result of a linear interpolation between two specified colors.
     * @param {pc.Color} lhs - The color to interpolate from.
     * @param {pc.Color} rhs - The color to interpolate to.
     * @param {number} alpha - The value controlling the point of interpolation. Between 0 and 1, the linear interpolant
     * will occur on a straight line between lhs and rhs. Outside of this range, the linear interpolant will occur on
     * a ray extrapolated from this line.
     * @returns {pc.Color} Self for chaining.
     * @example
     * var a = new pc.Color(0, 0, 0);
     * var b = new pc.Color(1, 1, 0.5);
     * var r = new pc.Color();
     *
     * r.lerp(a, b, 0);   // r is equal to a
     * r.lerp(a, b, 0.5); // r is 0.5, 0.5, 0.25
     * r.lerp(a, b, 1);   // r is equal to b
     */
    lerp(lhs: Color, rhs: Color, alpha: number): Color {
        this.r = lhs.r + alpha * (rhs.r - lhs.r);
        this.g = lhs.g + alpha * (rhs.g - lhs.g);
        this.b = lhs.b + alpha * (rhs.b - lhs.b);
        this.a = lhs.a + alpha * (rhs.a - lhs.a);

        return this;
    }

    /**
     * @function
     * @name pc.Color#fromString
     * @description Set the values of the color from a string representation '#11223344' or '#112233'.
     * @param {string} hex - A string representation in the format '#RRGGBBAA' or '#RRGGBB'. Where RR, GG, BB, AA are red, green, blue and alpha values.
     * This is the same format used in HTML/CSS.
     * @returns {pc.Color} Self for chaining.
     */
    fromString(hex: string): Color {
        var i = parseInt(hex.replace('#', '0x'), 16);
        var bytes;
        if (hex.length > 7) {
            bytes = math.intToBytes32(i);
        } else {
            bytes = math.intToBytes24(i);
            bytes[3] = 255;
        }

        this.set(bytes[0] / 255, bytes[1] / 255, bytes[2] / 255, bytes[3] / 255);

        return this;
    }

    /**
     * @function
     * @name pc.Color#toString
     * @description Converts the color to string form. The format is '#RRGGBBAA', where
     * RR, GG, BB, AA are the red, green, blue and alpha values. When the alpha value is not
     * included (the default), this is the same format as used in HTML/CSS.
     * @param {boolean} alpha - If true, the output string will include the alpha value.
     * @returns {string} The color in string form.
     * @example
     * var c = new pc.Color(1, 1, 1);
     * // Should output '#ffffffff'
     * console.log(c.toString());
     */
    toString(alpha: boolean): string {
        var s = "#" + ((1 << 24) + (Math.round(this.r * 255) << 16) + (Math.round(this.g * 255) << 8) + Math.round(this.b * 255)).toString(16).slice(1);
        if (alpha === true) {
            var a = Math.round(this.a * 255).toString(16);
            if (this.a < 16 / 255) {
                s += '0' + a;
            } else {
                s += a;
            }

        }

        return s;
    }

    /**
     * @field
     * @static
     * @readonly
     * @name pc.Color.BLACK
     * @type {pc.Color}
     * @description A constant color set to black [0, 0, 0, 1].
     */
    static readonly BLACK: Color = Object.freeze(new Color(0, 0, 0, 1));

    /**
     * @field
     * @static
     * @readonly
     * @name pc.Color.BLUE
     * @type {pc.Color}
     * @description A constant color set to blue [0, 0, 1, 1].
     */
    static readonly BLUE: Color = Object.freeze(new Color(0, 0, 1, 1));

    /**
     * @field
     * @static
     * @readonly
     * @name pc.Color.CYAN
     * @type {pc.Color}
     * @description A constant color set to cyan [0, 1, 1, 1].
     */
    static readonly CYAN: Color = Object.freeze(new Color(0, 1, 1, 1));

    /**
     * @field
     * @static
     * @readonly
     * @name pc.Color.GRAY
     * @type {pc.Color}
     * @description A constant color set to gray [0.5, 0.5, 0.5, 1].
     */
    static readonly GRAY: Color = Object.freeze(new Color(0.5, 0.5, 0.5, 1));

    /**
     * @field
     * @static
     * @readonly
     * @name pc.Color.GREEN
     * @type {pc.Color}
     * @description A constant color set to green [0, 1, 0, 1].
     */
    static readonly GREEN: Color = Object.freeze(new Color(0, 1, 0, 1));

    /**
     * @field
     * @static
     * @readonly
     * @name pc.Color.MAGENTA
     * @type {pc.Color}
     * @description A constant color set to magenta [1, 0, 1, 1].
     */
    static readonly MAGENTA: Color = Object.freeze(new Color(1, 0, 1, 1));

    /**
     * @field
     * @static
     * @readonly
     * @name pc.Color.RED
     * @type {pc.Color}
     * @description A constant color set to red [1, 0, 0, 1].
     */
    static readonly RED: Color = Object.freeze(new Color(1, 0, 0, 1));

    /**
     * @field
     * @static
     * @readonly
     * @name pc.Color.WHITE
     * @type {pc.Color}
     * @description A constant color set to white [1, 1, 1, 1].
     */
    static readonly WHITE: Color = Object.freeze(new Color(1, 1, 1, 1));

    /**
     * @field
     * @static
     * @readonly
     * @name pc.Color.YELLOW
     * @type {pc.Color}
     * @description A constant color set to yellow [1, 1, 0, 1].
     */
    static readonly YELLOW: Color = Object.freeze(new Color(1, 1, 0, 1));
}

export { Color };