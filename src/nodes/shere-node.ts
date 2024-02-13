import Node from "./node";
import Vector from "../vector";
import Visitor from "../visitor";

export default class SphereNode extends Node {
  /**
   * Creates a new Sphere.
   * The sphere is defined around the origin
   * with radius 1.
   * @param color The colour of the Sphere
   */
  constructor(
    public color: Vector,
    public center: Vector,
    public radius: number
  ) {
    super();
  }

  /**
   * Accepts a visitor according to the visitor pattern
   * @param visitor The visitor
   */
  accept(visitor: Visitor) {
    // TODO
    visitor.visitSphereNode(this);
  }

  toJSON() {
    return {
      SphereNode: {
        color: this.color,
      },
    };
  }
}
