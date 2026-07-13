import { Mission } from "./types";

import { TUTORIAL_MISSIONS } from "./tutorial";
import { WESTERN_FRONTIER_MISSIONS } from "./western_frontier";
import { ARENA_MISSIONS } from "./arena";
import { EVENT_MISSIONS } from "./events";

export const MISSIONS: Record<string, Mission> = {

    ...TUTORIAL_MISSIONS,
    ...WESTERN_FRONTIER_MISSIONS,
    ...ARENA_MISSIONS,
    ...EVENT_MISSIONS

};

export * from "./types";