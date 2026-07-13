export type WorldNodeType =
    | "battle"
    | "arena"
    | "town"
    | "merchant"
    | "forge"
    | "boss"
    | "event";

export interface WorldNode {

    /**
     * Unique node id.
     */
    id: string;

    /**
     * Display name.
     */
    name: string;

    /**
     * What kind of location is this?
     */
    type: WorldNodeType;

    /**
     * Axial hex coordinates.
     */
    q: number;
    r: number;

    /**
     * Mission launched from this node.
     * Undefined for towns, merchants, etc.
     */
    missionId?: string;

    /**
     * Connected nodes unlocked after completion.
     */
    unlocks: string[];
}

export const WORLD_NODES: WorldNode[] = [

    {
        id: "training",
        name: "Training Grounds",
        type: "battle",

        q: 0,
        r: 0,

        missionId: "training",

        unlocks: [
            "valley"
        ]
    },

    {
        id: "valley",
        name: "Broken Valley",
        type: "battle",

        q: 1,
        r: 0,

        missionId: "valley",

        unlocks: [
            "north"
        ]
    },

    {
        id: "north",
        name: "Northern Pass",
        type: "battle",

        q: 2,
        r: 0,

        missionId: "north",

        unlocks: []
    }

];