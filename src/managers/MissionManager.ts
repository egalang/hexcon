import { MISSIONS } from "../missions";
import { Mission } from "../missions";

export class MissionManager {

    /**
     * Returns a mission by id.
     */
    static getMission(id: string): Mission {

        const mission = MISSIONS[id];

        if (!mission) {
            throw new Error(`Mission '${id}' not found.`);
        }

        return mission;
    }

    /**
     * Returns true if the mission exists.
     */
    static hasMission(id: string): boolean {

        return id in MISSIONS;

    }

    /**
     * Returns every registered mission.
     */
    static getAll(): Mission[] {

        return Object.values(MISSIONS);

    }

}