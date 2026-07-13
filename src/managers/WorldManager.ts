import { GameData } from "../game/GameData";
import { WORLD_NODES, WorldNode } from "../game/world";

export class WorldManager {

    /**
     * Returns every node defined in the game.
     */
    getNodes(): WorldNode[] {
        return WORLD_NODES;
    }

    /**
     * Returns a node by id.
     */
    getNode(id: string): WorldNode | undefined {
        return WORLD_NODES.find(node => node.id === id);
    }

    /**
     * Returns whether a node is unlocked.
     */
    isUnlocked(id: string): boolean {

        return GameData.profile.unlockedNodes.includes(id);

    }

    /**
     * Returns whether the mission attached to this node has been completed.
     */
    isCompleted(id: string): boolean {

        const node = this.getNode(id);

        if (!node)
            return false;

        if (!node.missionId)
            return false;

        return GameData.profile.completedMissions.includes(
            node.missionId
        );

    }

    /**
     * Unlock a world node.
     */
    unlockNode(id: string): void {

        if (!GameData.profile.unlockedNodes.includes(id)) {

            GameData.profile.unlockedNodes.push(id);

            GameData.save();

        }

    }

    /**
     * Marks a mission as completed,
     * unlocks connected nodes,
     * and moves the player to this node.
     */
    completeMission(nodeId: string): void {

        const node = this.getNode(nodeId);

        if (!node)
            return;

        //
        // Save mission completion.
        //

        if (
            node.missionId &&
            !GameData.profile.completedMissions.includes(node.missionId)
        ) {

            GameData.profile.completedMissions.push(
                node.missionId
            );

        }

        //
        // Unlock connected nodes.
        //

        for (const next of node.unlocks) {

            this.unlockNode(next);

        }

        //
        // Update player location.
        //

        GameData.profile.currentWorldNode = node.id;

        GameData.save();

    }

    /**
     * Returns player's current world node.
     */
    getCurrentNode(): WorldNode {

        return (
            this.getNode(GameData.profile.currentWorldNode)
            ?? WORLD_NODES[0]
        );

    }

    /**
     * Moves the player to another unlocked node.
     */
    moveToNode(id: string): boolean {

        if (!this.isUnlocked(id))
            return false;

        if (!this.getNode(id))
            return false;

        GameData.profile.currentWorldNode = id;

        GameData.save();

        return true;

    }

    /**
     * Returns all unlocked nodes.
     */
    getUnlockedNodes(): WorldNode[] {

        return WORLD_NODES.filter(node =>
            this.isUnlocked(node.id)
        );

    }

    /**
     * Returns all completed nodes.
     */
    getCompletedNodes(): WorldNode[] {

        return WORLD_NODES.filter(node =>
            this.isCompleted(node.id)
        );

    }

    /**
     * Returns true if the node exists.
     */
    hasNode(id: string): boolean {

        return this.getNode(id) !== undefined;

    }

}