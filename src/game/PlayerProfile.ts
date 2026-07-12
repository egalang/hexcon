export interface PlayerProfile {
    gold: number;
    completedCampaignLevels: number[];
    unlockedAbilities: string[];
}

const STORAGE_KEY = "hexcon-profile";

export class PlayerProfileService {

    static load(): PlayerProfile {

        const json = localStorage.getItem(STORAGE_KEY);

        if (json) {
            return JSON.parse(json);
        }

        return {
            gold: 0,
            completedCampaignLevels: [],
            unlockedAbilities: []
        };
    }

    static save(profile: PlayerProfile) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    }

    static reset() {
        localStorage.removeItem(STORAGE_KEY);
    }

}