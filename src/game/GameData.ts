import { PlayerProfile, PlayerProfileService } from "./PlayerProfile";

export class GameData {

    static profile: PlayerProfile;

    static initialize() {
        GameData.profile = PlayerProfileService.load();
    }

    static save() {
        PlayerProfileService.save(GameData.profile);
    }

}