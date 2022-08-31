import Matrix from '../matrix';
import Vector from '../vector';
import Sphere from './ray-sphere';
import Intersection from '../intersection';
import Ray from './ray';
import Visitor from '../visitor';
import phong from './phong';
import {
  Node, GroupNode, SphereNode,
  AABoxNode, TextureBoxNode, CameraNode   
} from '../nodes';
import AABox from './aabox';

const UNIT_SPHERE = new Sphere(new Vector(0, 0, 0, 1), 1, new Vector(0, 0, 0, 1));
const UNIT_AABOX = new AABox(new Vector(-0.5, -0.5, -0.5, 1), new Vector(0.5, 0.5, 0.5, 1), new Vector(0, 0, 0, 1));

/**
 * Class representing a Visitor that uses
 * Raytracing to render a Scenegraph
 */
export default class RayVisitor implements Visitor {
  /**
   * The image data of the context to
   * set individual pixels
   */
  imageData: ImageData;
  camera: CameraNode;



  // TODO declare instance variables here
  stack:  [{ matrix: Matrix, inverse: Matrix }];
  intersection: Intersection | null;
  intersectionColor: Vector;
  ray: Ray;

  /**
   * Creates a new RayVisitor
   * @param context The 2D context to render to
   * @param width The width of the canvas
   * @param height The height of the canvas
   */
  constructor(
    private context: CanvasRenderingContext2D,
    width: number,
    height: number
  ) {
    this.imageData = context.getImageData(0, 0, width, height);
    this.camera = null;
  }

  /**
   * Renders the Scenegraph
   * @param rootNode The root node of the Scenegraph
   * @param camera The camera used
   * @param lightPositions The light light positions
   */
  render(
    rootNode: Node,
    camera: CameraNode,
    lightPositions: Array<Vector>
  ) {
    // clear
    let data = this.imageData.data;
    data.fill(0);

    // raytrace
    const width = this.imageData.width;
    const height = this.imageData.height;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        this.ray = Ray.makeRay(x, y, height, width, camera);

        // TODO initialize the matrix stack
        //Initialize the matrix stack with identity matrices
        this.stack = [{ matrix: Matrix.identity(), inverse: Matrix.identity() }];
        this.intersection = null;
        rootNode.accept(this);

        if (this.intersection) {
          if (!this.intersectionColor) {
            data[4 * (width * y + x) + 0] = 0;
            data[4 * (width * y + x) + 1] = 0;
            data[4 * (width * y + x) + 2] = 0;
            data[4 * (width * y + x) + 3] = 255;
          } else {
            let color = phong(this.intersectionColor, this.intersection, lightPositions, 10, camera.eye, 0.8, 0.5, 0.5);
            data[4 * (width * y + x) + 0] = color.r * 255;
            data[4 * (width * y + x) + 1] = color.g * 255;
            data[4 * (width * y + x) + 2] = color.b * 255;
            data[4 * (width * y + x) + 3] = 255;
          }
        }
      }
    }
    this.context.putImageData(this.imageData, 0, 0);
  }

  /**
   * Visits a group node
   * @param node The node to visit
   */
  visitGroupNode(node: GroupNode) {
    // TODO traverse the graph and build the model matrix
    this.stack.push({ matrix: node.transform.getMatrix(), inverse: node.transform.getInverseMatrix() });
    for (let i = 0; i < node.children.length; i++) {
      node.children[i].accept(this);
    }
    this.stack.pop();
  }

  /**
   * Visits a sphere node
   * @param node - The node to visit
   */
  visitSphereNode(node: SphereNode) {
    let toWorld = Matrix.identity();
    let fromWorld = Matrix.identity();
    // TODO assign the model matrix and its inverse
    for (let i = 0; i < this.stack.length; i++) {
      toWorld = toWorld.mul(this.stack[i].matrix);
      fromWorld = this.stack[i].inverse.mul(fromWorld);
    }

    const ray = new Ray(fromWorld.mulVec(this.ray.origin), fromWorld.mulVec(this.ray.direction).normalize());
    let intersection = UNIT_SPHERE.intersect(ray);

    if (intersection) {
      const intersectionPointWorld = toWorld.mulVec(intersection.point);
      const intersectionNormalWorld = toWorld.mulVec(intersection.normal).normalize();
      intersection = new Intersection(
        (intersectionPointWorld.x - ray.origin.x) / ray.direction.x,
        intersectionPointWorld,
        intersectionNormalWorld
      );
      if (this.intersection === null || intersection.closerThan(this.intersection)) {
        this.intersection = intersection;
        this.intersectionColor = node.color;
      }
    }
  }

  /**
   * Visits an axis aligned box node
   * @param node The node to visit
   */
  visitAABoxNode(node: AABoxNode) {
    let toWorld = Matrix.identity();
    let fromWorld = Matrix.identity();
    // TODO assign the model matrix and its inverse
    for (let i = 0; i < this.stack.length; i++) {
      toWorld = toWorld.mul(this.stack[i].matrix);
      fromWorld = this.stack[i].inverse.mul(fromWorld);
    }
    
    const ray = new Ray(fromWorld.mulVec(this.ray.origin), fromWorld.mulVec(this.ray.direction).normalize());
    let intersection = UNIT_AABOX.intersect(ray);

    if (intersection) {
      const intersectionPointWorld = toWorld.mulVec(intersection.point);
      const intersectionNormalWorld = toWorld.mulVec(intersection.normal).normalize();
      intersection = new Intersection(
        (intersectionPointWorld.x - ray.origin.x) / ray.direction.x,
        intersectionPointWorld,
        intersectionNormalWorld
      );
      if (this.intersection === null || intersection.closerThan(this.intersection)) {
        this.intersection = intersection;
        this.intersectionColor = node.color;
      }
    }
  }

  /**
   * Visits a textured box node
   * @param node The node to visit
   */
  visitTextureBoxNode(node: TextureBoxNode) { }

  visitCameraNode(node: CameraNode) {
    let center = this.stack[this.stack.length - 1].matrix.mulVec(node.center);
    let eye = node.eye.mul(1);
    eye.z -= 2;
    eye = this.stack[this.stack.length - 1].matrix.mulVec(eye);
    let up = this.stack[this.stack.length - 1].matrix.mulVec(node.up);
    this.camera = new CameraNode(eye, center, up, node.fovy, node.aspect,
      node.near, node.far);
  }

    /**
   * Visits a camera node
   * @param node The node to visit
   */
     visitGroupNodeCamera(node: GroupNode) {

    }
}

