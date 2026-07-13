import { Mission } from "./types";

export const TUTORIAL_MISSIONS: Record<string, Mission> = {

    training: {

        id: "training",

        title: "Training Grounds",

        description:
            "Learn the basics of conquest.",

        map: "default",

        objective: "eliminate_red",

        aiDifficulty: "easy",

        aiPersonality: "balanced",

        rewardGold: 100,

        bronzeTurns: 30,

        silverTurns: 20,

        goldTurns: 15

    }

};