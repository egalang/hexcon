/**
 * Converts axial hex coordinates to screen coordinates.
 *
 * Pointy-top orientation.
 */
export function worldToScreen(
    q: number,
    r: number,
    size: number
) {

    return {

        x: size * Math.sqrt(3) * (q + r / 2),

        y: size * 1.5 * r

    };

}

/**
 * Hex distance.
 */
export function hexDistance(
    q1: number,
    r1: number,
    q2: number,
    r2: number
) {

    return (
        Math.abs(q1 - q2)
        + Math.abs(q1 + r1 - q2 - r2)
        + Math.abs(r1 - r2)
    ) / 2;

}

/**
 * Neighbor directions.
 */
export const HEX_DIRECTIONS = [

    { q: 1, r: 0 },

    { q: 1, r: -1 },

    { q: 0, r: -1 },

    { q: -1, r: 0 },

    { q: -1, r: 1 },

    { q: 0, r: 1 }

];

/**
 * Returns neighboring hex.
 */
export function getNeighbor(
    q: number,
    r: number,
    direction: number
) {

    const d = HEX_DIRECTIONS[direction];

    return {

        q: q + d.q,

        r: r + d.r

    };

}