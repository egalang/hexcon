import { AiDifficulty, AiPersonality } from "../game/ai";

export type MissionObjective =
    | "eliminate_red"
    | "win_within_turns"
    | "control_territory"
    | "hold_center"
    | "survive_turns";

export interface Mission {

    //
    // Identity
    //

    id: string;

    title: string;

    description: string;

    //
    // Battle
    //

    map: string;

    objective: MissionObjective;

    target?: number;

    aiDifficulty: AiDifficulty;

    aiPersonality: AiPersonality;

    //
    // Rewards
    //

    rewardGold: number;

    //
    // Stars
    //

    bronzeTurns: number;

    silverTurns: number;

    goldTurns: number;

    //
    // Future
    //

    introText?: string;

    victoryText?: string;

    commander?: string;

    music?: string;

}