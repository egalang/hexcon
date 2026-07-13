import Phaser from "phaser";

import { WIDTH, HEIGHT, WORLD_HEX_SIZE, WORLD_OFFSET_X, WORLD_OFFSET_Y } from "../game/constants";
import { GameData } from "../game/GameData";
import { worldToScreen } from "../game/HexMath";
import { WORLD_NODES, WorldNode } from "../game/world";

import { WorldManager } from "../managers/WorldManager";
import { WorldNodeView } from "../ui/WorldNodeView";

export default class WorldMapScene extends Phaser.Scene {

    private world!: WorldManager;

    private selectedNode?: WorldNode;

    private infoTitle!: Phaser.GameObjects.Text;

    private infoReward!: Phaser.GameObjects.Text;

    private playButton!: Phaser.GameObjects.Container;

    private nodeViews = new Map<string, WorldNodeView>();

    constructor() {
        super("WorldMapScene");
    }

    create() {

        this.world = new WorldManager();

        this.cameras.main.setBackgroundColor(0x163d5d);

        this.drawHeader();

        this.drawConnections();

        this.drawNodes();

        this.drawBottomPanel();

        this.selectNode(
            this.world.getCurrentNode()
        );

    }

    //---------------------------------------------------------
    // Header
    //---------------------------------------------------------

    private drawHeader() {

        this.add.text(
            WIDTH / 2,
            35,
            "WORLD MAP",
            {
                fontSize: "30px",
                color: "#ffffff",
                fontStyle: "bold"
            }
        ).setOrigin(.5);

        this.add.text(
            20,
            70,
            `Gold : ${GameData.profile.gold}`,
            {
                fontSize: "18px",
                color: "#ffd54f"
            }
        );

    }

    //---------------------------------------------------------
    // Connection lines
    //---------------------------------------------------------

    private drawConnections() {

        const g = this.add.graphics();

        g.lineStyle(
            4,
            0xffffff,
            .25
        );

        for (const node of WORLD_NODES) {

            const p1 = worldToScreen(
                node.q,
                node.r,
                WORLD_HEX_SIZE
            );

            for (const id of node.unlocks) {

                const other =
                    this.world.getNode(id);

                if (!other)
                    continue;

                const p2 = worldToScreen(
                    other.q,
                    other.r,
                    WORLD_HEX_SIZE
                );

                g.beginPath();

                g.moveTo(
                    WORLD_OFFSET_X + p1.x,
                    WORLD_OFFSET_Y + p1.y
                );

                g.lineTo(
                    WORLD_OFFSET_X + p2.x,
                    WORLD_OFFSET_Y + p2.y
                );

                g.strokePath();

            }

        }

    }

    //---------------------------------------------------------
    // Nodes
    //---------------------------------------------------------

    private drawNodes() {

        for (const node of WORLD_NODES) {

            const p = worldToScreen(
                node.q,
                node.r,
                WORLD_HEX_SIZE
            );

            const view =
                new WorldNodeView(
                    this,
                    node,
                    WORLD_OFFSET_X + p.x,
                    WORLD_OFFSET_Y + p.y,
                    n => this.selectNode(n)
                );

            if (
                this.world.isCompleted(node.id)
            )
                view.setState("completed");

            else if (
                this.world.isUnlocked(node.id)
            )
                view.setState("unlocked");

            else
                view.setState("locked");

            this.nodeViews.set(
                node.id,
                view
            );

        }

    }

    //---------------------------------------------------------
    // Bottom Panel
    //---------------------------------------------------------

    private drawBottomPanel() {

        const g = this.add.graphics();

        g.fillStyle(
            0x0d2238,
            .92
        );

        g.fillRect(
            0,
            HEIGHT - 170,
            WIDTH,
            170
        );

        this.infoTitle =
            this.add.text(
                WIDTH / 2,
                HEIGHT - 145,
                "",
                {
                    fontSize: "24px",
                    fontStyle: "bold",
                    color: "#ffffff"
                }
            ).setOrigin(.5);

        this.infoReward =
            this.add.text(
                WIDTH / 2,
                HEIGHT - 105,
                "",
                {
                    fontSize: "18px",
                    color: "#ffd54f"
                }
            ).setOrigin(.5);

        this.playButton =
            this.createButton(
                WIDTH / 2,
                HEIGHT - 45,
                "PLAY MISSION",
                () => this.startMission()
            );

    }

    //---------------------------------------------------------
    // Selection
    //---------------------------------------------------------

    private selectNode(node: WorldNode) {

        this.selectedNode = node;

        for (const view of this.nodeViews.values()) {

            if (
                this.world.isCompleted(view.node.id)
            )
                view.setState("completed");

            else if (
                this.world.isUnlocked(view.node.id)
            )
                view.setState("unlocked");

            else
                view.setState("locked");

        }

        const view =
            this.nodeViews.get(node.id);

        if (
            view &&
            this.world.isUnlocked(node.id)
        ) {

            view.setState("selected");

        }

        this.infoTitle.setText(
            node.name
        );

        this.infoReward.setText(
            `Reward : ${node.rewardGold ?? 0} Gold`
        );

        this.playButton.setVisible(
            this.world.isUnlocked(node.id)
        );

    }

    //---------------------------------------------------------
    // Start Battle
    //---------------------------------------------------------

    private startMission() {

        if (!this.selectedNode)
            return;

        if (
            !this.world.isUnlocked(
                this.selectedNode.id
            )
        )
            return;

        this.scene.start(
            "HexConquestScene",
            {
                mode: "campaign",
                campaignLevel:
                    this.selectedNode.campaignLevel,
                nodeId:
                    this.selectedNode.id
            }
        );

    }

    //---------------------------------------------------------
    // Button
    //---------------------------------------------------------

    private createButton(
        x: number,
        y: number,
        text: string,
        callback: () => void
    ) {

        const c =
            this.add.container(
                x,
                y
            );

        const bg =
            this.add.rectangle(
                0,
                0,
                220,
                52,
                0xb78a55
            );

        bg.setStrokeStyle(
            2,
            0xffffff
        );

        const label =
            this.add.text(
                0,
                0,
                text,
                {
                    fontSize: "22px",
                    color: "#ffffff",
                    fontStyle: "bold"
                }
            ).setOrigin(.5);

        c.add([
            bg,
            label
        ]);

        c.setSize(
            220,
            52
        );

        c.setInteractive();

        c.on(
            "pointerdown",
            callback
        );

        return c;

    }

}