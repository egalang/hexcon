import Phaser from "phaser";
import { WorldNode } from "../game/world";

export type WorldNodeState =
    | "locked"
    | "unlocked"
    | "completed"
    | "selected";

export class WorldNodeView extends Phaser.GameObjects.Container {

    readonly node: WorldNode;

    private hex: Phaser.GameObjects.Polygon;
    private label: Phaser.GameObjects.Text;

    private state: WorldNodeState = "locked";

    constructor(
        scene: Phaser.Scene,
        node: WorldNode,
        x: number,
        y: number,
        onClick: (node: WorldNode) => void
    ) {

        super(scene, x, y);

        this.node = node;

        const points = this.createHexPoints(32);

        this.hex = scene.add.polygon(
            0,
            0,
            points,
            0x555555
        );

        this.hex.setStrokeStyle(3, 0xffffff);

        this.label = scene.add.text(
            0,
            48,
            node.name,
            {
                fontSize: "15px",
                color: "#ffffff",
                align: "center"
            }
        );

        this.label.setOrigin(0.5);

        this.add([
            this.hex,
            this.label
        ]);

        this.setSize(70, 70);

        this.setInteractive(
            new Phaser.Geom.Circle(0, 0, 34),
            Phaser.Geom.Circle.Contains
        );

        this.on("pointerover", () => {

            scene.tweens.add({

                targets: this,

                scaleX: 1.08,

                scaleY: 1.08,

                duration: 120

            });

        });

        this.on("pointerout", () => {

            scene.tweens.add({

                targets: this,

                scaleX: 1,

                scaleY: 1,

                duration: 120

            });

        });

        this.on("pointerdown", () => {

            onClick(node);

        });

        scene.add.existing(this);

    }

    /**
     * Changes visual state.
     */
    setState(state: WorldNodeState) {

        this.state = state;

        switch (state) {

            case "locked":

                this.hex.setFillStyle(0x555555);
                break;

            case "unlocked":

                this.hex.setFillStyle(0x2d8cff);
                break;

            case "completed":

                this.hex.setFillStyle(0x2ecc71);
                break;

            case "selected":

                this.hex.setFillStyle(0xffd54f);
                break;

        }

    }

    getState() {

        return this.state;

    }

    /**
     * Builds a pointy-top hexagon.
     */
    private createHexPoints(radius: number): number[] {

        const pts: number[] = [];

        for (let i = 0; i < 6; i++) {

            const angle =
                Phaser.Math.DegToRad(
                    60 * i - 30
                );

            pts.push(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius
            );

        }

        return pts;

    }

}