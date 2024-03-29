import GroupNode from "./nodes/group-node";
import TextureTextBoxNode from "./nodes/texture-text-box-node";
import { RasterSetupVisitor } from "./rasterzier/rastervisitor";
import { Scenegraph } from "./scenegraph";
import { EmptyTransformation, Scaling, Translation } from "./math/transformation";
import Vector from "./math/vector";
import Node from "./nodes/node";

/**
 * A class representing a Tic Tac Toe game.
 */
export class TicTacToe {
    private static parent: GroupNode;
    private static currentPlayer = true; // true = X, false = O

    /**
     * Creates a Tic Tac Toe game.
     * @returns The root node of the Tic Tac Toe game.
     */
    createTicTacToe() {
        // create root for the tic tac toe
        TicTacToe.parent = new GroupNode(new EmptyTransformation());
        console.log(TicTacToe.parent);

        // Scale the size of the cubes
        const ticTacToeScale = new GroupNode(new Scaling(new Vector(1.5, 1.5, 1.5, 1)));

        //Add the cubes to the scaler
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                //Position of the cubes in the tic tac toe
                const position = new GroupNode(new Translation(new Vector(i * 0.6, j * 0.6, 0, 1)));
                let cube = new TextureTextBoxNode("", new Vector(0, 0, 0, 1), new Vector(0.5, 0.5, 0.1, 1));
                position.add(cube);
                ticTacToeScale.add(position);
            }
        }
        // Add the new game to the parent
        TicTacToe.parent.add(ticTacToeScale);
        return TicTacToe.parent;
    }

    /**
     * Clears the game and sets the current player to true.
     * @param currentPlayer The current player.
     */
    static clearGame() {
        // clear children of the parent
        TicTacToe.parent.children = [];

        // Scale the size of the cubes
        const ticTacToeScale = new GroupNode(new Scaling(new Vector(1.5, 1.5, 1.5, 1)));

        //Add the cubes to the scaler
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                //Position of the cubes in the tic tac toe
                const position = new GroupNode(new Translation(new Vector(i * 0.6, j * 0.6, 0, 1)));
                let cube = new TextureTextBoxNode("", new Vector(0, 0, 0, 1), new Vector(0.5, 0.5, 0.1, 1));
                position.add(cube);
                ticTacToeScale.add(position);
            }
        }
        // Add the new game to the parent
        TicTacToe.parent.add(ticTacToeScale);

        // Reset the current player
        this.currentPlayer = true;
    }

    /**
     * Checks the TikTakToe field and updates the selected node's texture based on the current player.
     * 
     * @param currentPlayer - A boolean indicating the current player (true for Player 1, false for Player 2).
     * @param selectedBox - The box/field that was selected.
     * @param rasterSetupVisitor - The raster setup visitor used to update the scenegraph.
     */
    static CheckTikTakToeField(selectedBox: Node, rasterSetupVisitor: RasterSetupVisitor) {
        if (this.currentPlayer) {
            if (selectedBox instanceof TextureTextBoxNode && selectedBox.texture == "") {
                selectedBox.texture = "O";
                rasterSetupVisitor.setup(Scenegraph.getGraph());
                this.currentPlayer = !this.currentPlayer;
            }
        } else {
            if (selectedBox instanceof TextureTextBoxNode && selectedBox.texture == "") {
                selectedBox.texture = "X";
                rasterSetupVisitor.setup(Scenegraph.getGraph());
                this.currentPlayer = !this.currentPlayer;
            }
        }
    }

}