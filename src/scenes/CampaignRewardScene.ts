import Phaser from "phaser";

import { WIDTH } from "../game/constants";
import { CAMPAIGN_MAX_LEVEL } from "../game/campaign";

export default class CampaignRewardScene extends Phaser.Scene {

    constructor() {
        super("CampaignRewardScene");
    }

    create(data: {
        level: number;
        stars: number;
        goldReward: number;
    }) {

        const {
            level,
            stars,
            goldReward
        } = data;

        this.cameras.main.setBackgroundColor("#163d5d");

        //------------------------------------------------
        // Title
        //------------------------------------------------

        this.add.text(
            WIDTH / 2,
            80,
            "MISSION COMPLETE",
            {
                fontFamily: "monospace",
                fontSize: "30px",
                fontStyle: "bold",
                color: "#ffffff"
            }
        ).setOrigin(0.5);

        //------------------------------------------------
        // Subtitle
        //------------------------------------------------

        this.add.text(
            WIDTH / 2,
            130,
            `Level ${level} Complete`,
            {
                fontFamily: "monospace",
                fontSize: "20px",
                color: "#ffd46a"
            }
        ).setOrigin(0.5);

        //------------------------------------------------
        // Stars
        //------------------------------------------------

        const starText =
            "★".repeat(stars) +
            "☆".repeat(3 - stars);

        this.add.text(
            WIDTH / 2,
            220,
            starText,
            {
                fontFamily: "Arial",
                fontSize: "54px",
                color: "#ffe66d"
            }
        ).setOrigin(0.5);

        //------------------------------------------------
        // Divider
        //------------------------------------------------

        this.add.line(
            WIDTH / 2,
            275,
            -120,
            0,
            120,
            0,
            0xffffff,
            0.35
        );

        //------------------------------------------------
        // Rewards
        //------------------------------------------------

        this.add.text(
            WIDTH / 2,
            320,
            "REWARDS",
            {
                fontFamily: "monospace",
                fontSize: "18px",
                color: "#ffffff"
            }
        ).setOrigin(0.5);

        this.add.text(
            WIDTH / 2,
            365,
            `Gold   +${goldReward}`,
            {
                fontFamily: "monospace",
                fontSize: "28px",
                color: "#ffd46a"
            }
        ).setOrigin(0.5);

        //------------------------------------------------
        // Future reward placeholders
        //------------------------------------------------

        // XP +50
        // Bronze Spear
        // Ability: Penetrate
        // Achievement
        // Daily Bonus
        // Chest Reward

        //------------------------------------------------
        // Continue
        //------------------------------------------------

        const continueBtn = this.add.rectangle(
            WIDTH / 2,
            590,
            280,
            64,
            0xc69657
        )
            .setStrokeStyle(3, 0xffffff)
            .setInteractive({ useHandCursor: true });

        this.add.text(
            WIDTH / 2,
            590,
            level >= CAMPAIGN_MAX_LEVEL
                ? "Campaign Complete!"
                : "Continue",
            {
                fontFamily: "monospace",
                fontSize: "22px",
                color: "#ffffff",
            }
        ).setOrigin(0.5);

        continueBtn.on("pointerover", () => {
            continueBtn.setFillStyle(0xd9a766);
        });

        continueBtn.on("pointerout", () => {
            continueBtn.setFillStyle(0xc69657);
        });

        continueBtn.on("pointerdown", () => {

            if (level >= CAMPAIGN_MAX_LEVEL) {
                this.scene.start("CampaignLevelSelectScene");
                return;
            }

            this.scene.start("HexConquestScene", {
                mode: "campaign",
                campaignLevel: Math.min(level + 1, CAMPAIGN_MAX_LEVEL),
            });

        });

        //------------------------------------------------
        // Level Select
        //------------------------------------------------

        const levelBtn = this.add.rectangle(
            WIDTH / 2,
            665,
            280,
            58,
            0x3f6686
        )
            .setStrokeStyle(2, 0xffffff)
            .setInteractive({ useHandCursor: true });

        this.add.text(
            WIDTH / 2,
            665,
            "Level Select",
            {
                fontFamily: "monospace",
                fontSize: "20px",
                color: "#ffffff",
            }
        ).setOrigin(0.5);

        levelBtn.on("pointerover", () => {
            levelBtn.setFillStyle(0x4a769a);
        });

        levelBtn.on("pointerout", () => {
            levelBtn.setFillStyle(0x3f6686);
        });

        levelBtn.on("pointerdown", () => {

            this.scene.start("CampaignLevelSelectScene");

        });

        //------------------------------------------------
        // Main Menu
        //------------------------------------------------

        const menu = this.add.text(
            WIDTH / 2,
            730,
            "Main Menu",
            {
                fontFamily: "monospace",
                fontSize: "18px",
                color: "#ffd46a",
            }
        )
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        menu.on("pointerover", () => {
            menu.setScale(1.05);
        });

        menu.on("pointerout", () => {
            menu.setScale(1);
        });

        menu.on("pointerdown", () => {

            this.scene.start("MenuScene");

        });
    }
}