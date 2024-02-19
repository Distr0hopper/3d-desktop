import CameraNode from "../nodes/camera-node";
import { Scenegraph } from "../scenegraph";
import Vector from "../vector";

/**
 * Class representing a ray
 */
export default class Ray {
  /**
   * Creates a new ray with origin and direction
   * @param origin The origin of the Ray
   * @param direction The direction of the Ray
   */
  constructor(public origin: Vector, public direction: Vector) { }

  /**
   * Creates a ray from the camera through the image plane.
   * @param x The pixel's x-position in the canvas
   * @param y The pixel's y-position in the canvas
   * @param camera The Camera
   * @return The resulting Ray
   */
  static makeRay(
    x: number,
    y: number,
    canvasHeight: number,
    canvasWidth: number,
    camera: CameraNode
  ): Ray {
    // get camera origin
    // console.log(Scenegraph.getToWorld(Scenegraph.getCamera()));
    // const origin = Scenegraph.getToWorld(Scenegraph.getCamera()).mul(new Vector(0, 0, 0, 1));
    // const origin = Scenegraph.getToWorld(Scenegraph.getCamera()).mul(new Vector(0, 0, 0, 1));
    // console.log(origin);

    // let cameraGroup = Scenegraph.getGroupNodeCamera();
    // let cameraOrigin = Scenegraph.getToWorld(cameraGroup);

    // cameraOrigin.print();

    // let origin = new Vector(0, 0, 0, 1);
    // let origin = cameraOrigin.transpose().mul(new Vector(0, 0, 0, 1));
    // console.log(origin);

    const origin = new Vector(0, 0, 0, 1);
    const alpha = (camera.fovy * Math.PI) / 180;

    // Calculate the direction of the ray
    const direction = new Vector(
      x - (canvasWidth - 1) / 2,
      (canvasHeight - 1) / 2 - y,
      -(canvasWidth / 2 / Math.tan(alpha / 2)),
      0
    );
    return new Ray(origin, direction.normalize());
  }
}
