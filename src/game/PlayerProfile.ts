export interface PlayerProfile {

    //
    // Campaign Progress
    //

    gold: number;

    completedCampaignLevels: number[];

    currentWorldNode: string;

    unlockedNodes: string[];

    completedMissions: string[];

    //
    // Progression
    //

    ownedWeapons: string[];

    ownedAbilities: string[];

    equippedWeapon?: string;

    equippedAbilities: string[];

    //
    // Statistics
    //

    statistics: PlayerStatistics;

}

export interface PlayerStatistics {

    gamesPlayed: number;

    wins: number;

    losses: number;

    territoriesCaptured: number;

    soldiersConverted: number;

}

interface LegacyPlayerProfile extends Partial<PlayerProfile> {
    unlockedAbilities?: string[];
}

const DEFAULT_STATISTICS: PlayerStatistics = {

    gamesPlayed: 0,

    wins: 0,

    losses: 0,

    territoriesCaptured: 0,

    soldiersConverted: 0

};

const STORAGE_KEY = "hexcon-profile";

export class PlayerProfileService {

    static load(): PlayerProfile {

        const json = localStorage.getItem(STORAGE_KEY);

        if (json) {

            //
            // Upgrade older save files automatically.
            //

            const profile =
                JSON.parse(json) as LegacyPlayerProfile;

            return {

                gold: profile.gold ?? 0,

                completedCampaignLevels:
                    profile.completedCampaignLevels ?? [],

                currentWorldNode:
                    profile.currentWorldNode ?? "training",

                unlockedNodes:
                    profile.unlockedNodes ?? ["training"],

                completedMissions:
                    profile.completedMissions ?? [],

                ownedWeapons:
                    profile.ownedWeapons ?? [],

                ownedAbilities:
                    profile.ownedAbilities ??
                    profile.unlockedAbilities ??
                    [],

                equippedWeapon:
                    profile.equippedWeapon,

                equippedAbilities:
                    profile.equippedAbilities ?? [],

                statistics:
                    profile.statistics ?? { ...DEFAULT_STATISTICS }

            };

        }

        //
        // Brand new save.
        //

        return {

            gold: 0,

            completedCampaignLevels: [],

            currentWorldNode: "training",

            unlockedNodes: [

                "training"

            ],

            completedMissions: [],
            
            ownedWeapons: [],

            ownedAbilities: [],

            equippedWeapon: undefined,

            equippedAbilities: [],

            statistics: { ...DEFAULT_STATISTICS }

        };

    }

    static save(profile: PlayerProfile) {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(profile)
        );

    }

    static reset() {

        localStorage.removeItem(STORAGE_KEY);

    }

}