import { Mission } from "./types";

export const WESTERN_FRONTIER_MISSIONS: Record<string, Mission> = {

    valley: {

        id: "valley",

        title: "Broken Valley",

        description:
            "Drive the enemy from the valley.",

        map: "default",

        objective: "control_territory",

        target: 70,

        aiDifficulty: "normal",

        aiPersonality: "aggressive",

        rewardGold: 150,

        bronzeTurns: 35,

        silverTurns: 25,

        goldTurns: 18

    },

    north: {

        id: "north",

        title: "Northern Pass",

        description:
            "Capture the mountain pass.",

        map: "default",

        objective: "hold_center",

        target: 5,

        aiDifficulty: "hard",

        aiPersonality: "defensive",

        rewardGold: 200,

        bronzeTurns: 40,

        silverTurns: 28,

        goldTurns: 20

    }

};