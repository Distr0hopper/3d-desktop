import Matrix from "./matrix";
import AABoxNode from "../nodes/aabox-node";
import GroupNode from "../nodes/group-node";
import TextureBoxNode from "../nodes/texture-box-node";
import TextureVideoBoxNode from "../nodes/texture-video-box-node";
import Vector from "./vector";
// import Quaternion from './quaternion';

export interface Transformation {
    getMatrix(): Matrix;
    getInverseMatrix(): Matrix;
    toJSON(): any;
}

export class MatrixTransformation implements Transformation {
    public matrix: Matrix;
    public inverse: Matrix;

    constructor(matrix: Matrix, inverse: Matrix) {
        this.matrix = matrix;
        this.inverse = inverse;
    }

    //Constructor that constructs a transformation given a translation vector and rotation matrix
    // static fromTranslationAndRotation(translation: Vector, rotation: Matrix) {
    //     return new MatrixTransformation(Matrix.translation(translation).mul(rotation), rotation.transpose().mul(Matrix.translation(translation.mul(-1))));
    // }

    getMatrix(): Matrix {
        return this.matrix;
    }

    getInverseMatrix(): Matrix {
        return this.inverse;
    }

    toJSON() {
        let transform;
        if (this instanceof Transform4x4) {
            transform = {
                type: "Transform4x4",
                matrix: this.matrix.toJSON(),
                inverse: this.inverse.toJSON()
            }
        } else if (this instanceof Translation) {
            transform = {
                type: "Translation",
                matrix: this.matrix.toJSON(),
                inverse: this.inverse.toJSON()
            }
        } else if (this instanceof EmptyTransformation) {
            transform = {
                type: "EmptyTransformation",
                matrix: this.matrix.toJSON(),
                inverse: this.inverse.toJSON()
            }
        } else if (this instanceof Rotation) {
            transform = {
                type: "Rotation",
                matrix: this.matrix.toJSON(),
                inverse: this.inverse.toJSON()
            }
        } else if (this instanceof RotateWithPosition) {
            transform = {
                type: "RotateWithPosition",
                matrix: this.matrix.toJSON(),
                inverse: this.inverse.toJSON()
            }
        } else if (this instanceof Scaling) {
            transform = {
                type: "Scaling",
                matrix: this.matrix.toJSON(),
                inverse: this.inverse.toJSON()
            }
        }
        return transform;
    }
}

export class Transform4x4 extends MatrixTransformation {
    constructor(translation: Vector, rotation: Rotation) {
        super(Matrix.translation(translation).mul(rotation.getMatrix()), rotation.getMatrix().transpose().mul(Matrix.translation(translation.mul(-1))));
    }
}
export class Translation extends MatrixTransformation {
    constructor(translation: Vector) {
        super(Matrix.translation(translation), Matrix.translation(translation.mul(-1)));
    }
}

export class EmptyTransformation extends MatrixTransformation {
    constructor() {
        super(Matrix.identity(), Matrix.identity());
    }
}

export class Rotation extends MatrixTransformation {
    private _axis: Vector;
    private _angle: number;


    /**
     * Creates a new Rotation object.
     * @param axis The axis of rotation.
     * @param angle The angle of rotation in degrees.
     */
    constructor(axis: Vector, angle: number) {
        super(Matrix.rotation(axis, angle), Matrix.rotation(axis, -angle));
        this._axis = axis;
        // this._angle = angle;
        this.angle = angle * (Math.PI / 180); //Convert to radians, because Math.sin and Math.cos expect radians
    }

    set axis(axis: Vector) {
        this._axis = axis;
        this.recalculate();
    }

    set angle(angle: number) {
        this._angle = angle;
        this.recalculate();
    }

    private recalculate() {
        this.matrix = Matrix.rotation(this._axis, this._angle);
        this.inverse = Matrix.rotation(this._axis, -this._angle);
    }
}

export class RotateWithPosition extends MatrixTransformation {
    constructor(node: GroupNode, rotation: Rotation) {
        rotation.angle = rotation.angle * (Math.PI / 180);
        super(node.transform.getMatrix().mul(rotation.getMatrix()), rotation.getInverseMatrix().mul(node.transform.getInverseMatrix()));
    }
}


export class Scaling extends MatrixTransformation {
    constructor(scale: Vector) {
        super(Matrix.scaling(scale), Matrix.scaling(new Vector(1 / scale.x, 1 / scale.y, 1 / scale.z, 0)));
    }
}

// export class SQT extends MatrixTransformation {
//     scale: Vector;
//     quaternion: Quaternion;
//     translation: Vector;

//     constructor(scale: Vector, rotation: { angle: number, axis: Vector }, translation: Vector) {
//         super(Matrix.identity(), Matrix.identity());
//         this.scale = scale;
//         this.translation = translation;
//         this.quaternion = Quaternion.fromAxisAngle(rotation.axis, rotation.angle);
//         this.recalculate();
//     }

//     set rotation(q: Quaternion) {
//         this.quaternion = q;
//         this.recalculate();
//     }

//     private recalculate() {
//         this.matrix = Matrix.translation(this.translation).mul(this.quaternion.toMatrix()).mul(Matrix.scaling(this.scale));
//         this.inverse = Matrix.scaling(new Vector(1 / this.scale.x, 1 / this.scale.y, 1 / this.scale.z, 0)).mul(this.quaternion.inverse.toMatrix()).mul(Matrix.translation(this.translation.mul(-1)));
//     }
// }