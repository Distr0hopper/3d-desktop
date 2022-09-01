import RasterSphere from './raster-sphere';
import RasterBox from './raster-box';
import RasterTextureBox from './raster-texture-box';
import Vector from '../vector';
import Matrix from '../matrix';
import Visitor from '../visitor';
import {
  Node, GroupNode,
  SphereNode, AABoxNode,
  TextureBoxNode,CameraNode, LightNode
} from '../nodes';
import Shader from '../shader/shader';
import PhongProperties from '../phong-properties';

interface Renderable {
  render(shader: Shader): void;
}

/**
 * Class representing a Visitor that uses Rasterisation 2
 * to render a Scenegraph
 */
export class RasterVisitor implements Visitor {
  // TODO declare instance variables here
  stack: [{traverse: Matrix, inverse: Matrix}] 
  /**
   * Creates a new RasterVisitor
   * @param gl The 3D context to render to
   * @param shader The default shader to use
   * @param textureshader The texture shader to use
   */
  constructor(
    private gl: WebGL2RenderingContext,
    private shader: Shader,
    private textureshader: Shader,
    private renderables: WeakMap<Node, Renderable>,
    private phongProperties: PhongProperties
  ) {
    // TODO setup
    this.stack = [{traverse: Matrix.identity(), inverse: Matrix.identity()}];
    this.phongProperties = phongProperties;
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
    // lightPositions: Array<LightNode>
  ) {
    // clear
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.setupCamera(camera);
    

    // traverse and render
    rootNode.accept(this);
  }

  /**
   * The view matrix to transform vertices from
   * the world coordinate system to the 
   * view coordinate system
   */
  private lookat: Matrix;

  /**
   * The perspective matrix to transform vertices from
   * the view coordinate system to the 
   * normalized device coordinate system
   */
  private perspective: Matrix;

  /**
   * Helper function to setup camera matrices
   * @param camera The camera used
   */
  setupCamera(camera: CameraNode) {
    this.lookat = Matrix.lookat(
      camera.eye,
      camera.center,
      camera.up);

    this.perspective = Matrix.perspective(
      camera.fovy,
      camera.aspect,
      camera.near,
      camera.far
    );
  }

  /**
   * Visits a group node
   * @param node The node to visit
   */
  visitGroupNode(node: GroupNode) {
    // TODO
    this.stack.push({ traverse: node.transform.getMatrix(), inverse: node.transform.getInverseMatrix() });
    for (let i = 0; i < node.children.length; i++) {
      node.children[i].accept(this);
    }
    this.stack.pop();
  }

  /**
   * Visits a sphere node
   * @param node The node to visit
   */
  visitSphereNode(node: SphereNode) {
    const shader = this.shader;
    shader.use();
    let toWorld = Matrix.identity();
    let fromWorld = Matrix.identity();
    // TODO Calculate the model matrix for the sphere
    for (let i = 0; i < this.stack.length; i++) {
      toWorld = toWorld.mul(this.stack[i].traverse);
      fromWorld = this.stack[i].inverse.mul(fromWorld);
    }

    // TODO set the material properties
    // const float kA = 0.3;
    // const float kD = 0.6;
    // const float kS = 0.7;
    // const float shininess = 16.0;
    shader.getUniformFloat("a_ka").set(this.phongProperties.ambient);
    shader.getUniformFloat("a_kd").set(this.phongProperties.diffuse);
    shader.getUniformFloat("a_ks").set(this.phongProperties.specular);
    shader.getUniformFloat("a_shininess").set(this.phongProperties.shininess);
    
    shader.getUniformMatrix("M").set(toWorld);
    shader.getUniformMatrix("M_inverse").set(fromWorld);

    const V = shader.getUniformMatrix("V");
    if (V && this.lookat) {
      V.set(this.lookat);
    }
    const P = shader.getUniformMatrix("P");
    if (P && this.perspective) {
      P.set(this.perspective);
    }
    // TODO set the normal matrix
    const normalMatrix = fromWorld.transpose();
    normalMatrix.setVal(0, 3, 0);
    normalMatrix.setVal(1, 3, 0);
    normalMatrix.setVal(2, 3, 0);
    normalMatrix.setVal(3, 3, 1);
    normalMatrix.setVal(3, 0, 0);
    normalMatrix.setVal(3, 1, 0);
    normalMatrix.setVal(3, 2, 0);
    if (normalMatrix && fromWorld) {
      shader.getUniformMatrix("N").set(normalMatrix);
    }
    this.renderables.get(node).render(shader);
  }

  /**
   * Visits an axis aligned box node
   * @param  {AABoxNode} node - The node to visit
   */
  visitAABoxNode(node: AABoxNode) {
    this.shader.use();
    let shader = this.shader;
    let toWorld = Matrix.identity();
    // TODO Calculate the model matrix for the box
    for (let i = 0; i < this.stack.length; i++) {
      toWorld = toWorld.mul(this.stack[i].traverse);
    }

    // TODO set the material properties
    shader.getUniformFloat("a_ka").set(this.phongProperties.ambient);
    shader.getUniformFloat("a_kd").set(this.phongProperties.diffuse);
    shader.getUniformFloat("a_ks").set(this.phongProperties.specular);
    shader.getUniformFloat("a_shininess").set(this.phongProperties.shininess);

    shader.getUniformMatrix("M").set(toWorld);
    let V = shader.getUniformMatrix("V");
    if (V && this.lookat) {
      V.set(this.lookat);
    }
    let P = shader.getUniformMatrix("P");
    if (P && this.perspective) {
      P.set(this.perspective);
    }

    this.renderables.get(node).render(shader);
  }

  /**
   * Visits a textured box node
   * @param  {TextureBoxNode} node - The node to visit
   */
  visitTextureBoxNode(node: TextureBoxNode) {
    this.textureshader.use();
    let shader = this.textureshader;

    let toWorld = Matrix.identity();
    // TODO calculate the model matrix for the box
    for (let i = 0; i < this.stack.length; i++) {
      toWorld = toWorld.mul(this.stack[i].traverse);
    }

    shader.getUniformFloat("a_ka").set(this.phongProperties.ambient);
    shader.getUniformFloat("a_kd").set(this.phongProperties.diffuse);
    shader.getUniformFloat("a_ks").set(this.phongProperties.specular);
    shader.getUniformFloat("a_shininess").set(this.phongProperties.shininess);

    shader.getUniformMatrix("M").set(toWorld);
    let P = shader.getUniformMatrix("P");
    if (P && this.perspective) {
      P.set(this.perspective);
    }
    shader.getUniformMatrix("V").set(this.lookat);

    this.renderables.get(node).render(shader);
  }

    /**
   * Visits a group node in the camera traversal used in GroupNode Base Class
   * searches für Camera, if found visitCameraNode() is called
   * @param node The node to visit
   */
     visitGroupNodeCamera(node: GroupNode) {

      let mat = this.stack.at(this.stack.length - 1).traverse;
      
      let matTraverse = mat.mul(node.transform.getMatrix());      
      //let matInv = matTraverse.invert();
      this.stack.push({traverse: matTraverse, inverse: node.transform.getInverseMatrix()});

      let cameraFound = false;
      for (let child of node.children) {
        if (cameraFound) {
          break;
        } else if (child instanceof CameraNode) {
          child.accept(this);
          cameraFound = true;
        } else if (child instanceof GroupNode) {
          child.acceptOnlyCamera(this); // Rekursiver Aufruf der exakten Methode s. Group Node Klasse
        }
      }
      this.stack.pop();
    }

    visitCameraNode(node: CameraNode) {
      let m = this.stack.at(this.stack.length - 1).traverse;
      let centerLookat = m.mulVec(node.center);
      let eyePos = m.mulVec(node.eye);
      let upVec = m.mulVec(node.up);
  
      if (node) {
        this.lookat = Matrix.lookat(
            eyePos,
            centerLookat,
            upVec);
  
        this.perspective = Matrix.perspective(
            node.fovy,
            node.aspect,
            node.near,
            node.far
        );
      }
}
}

/** 
 * Class representing a Visitor that sets up buffers 
 * for use by the RasterVisitor 
 * */
export class RasterSetupVisitor {
  /**
   * The created render objects
   */
  public objects: WeakMap<Node, Renderable>

  /**
   * Creates a new RasterSetupVisitor
   * @param context The 3D context in which to create buffers
   */
  constructor(private gl: WebGL2RenderingContext) {
    this.objects = new WeakMap();
  }

  /**
   * Sets up all needed buffers
   * @param rootNode The root node of the Scenegraph
   */
  setup(rootNode: Node) {
    // Clear to white, fully opaque
    this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
    // Clear everything
    this.gl.clearDepth(1.0);
    // Enable depth testing
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.gl.enable(this.gl.CULL_FACE);
    this.gl.cullFace(this.gl.BACK);

    rootNode.accept(this);
  }

  /**
   * Visits a group node
   * @param node The node to visit
   */
  visitGroupNode(node: GroupNode) {
    for (let child of node.children) {
      child.accept(this);
    }
  }

  /**
   * Visits a sphere node
   * @param node - The node to visit
   */
  visitSphereNode(node: SphereNode) {
    this.objects.set(
      node,
      new RasterSphere(this.gl, node.center, node.radius, node.color)
    );
  }

  /**
   * Visits an axis aligned box node
   * @param  {AABoxNode} node - The node to visit
   */
  visitAABoxNode(node: AABoxNode) {
    this.objects.set(
      node,
      new RasterBox(
        this.gl,
        new Vector(-0.5, -0.5, -0.5, 1),
        new Vector(0.5, 0.5, 0.5, 1)
      )
    );
  }

  /**
   * Visits a textured box node. Loads the texture
   * and creates a uv coordinate buffer
   * @param  {TextureBoxNode} node - The node to visit
   */
  visitTextureBoxNode(node: TextureBoxNode) {
    this.objects.set(
      node,
      new RasterTextureBox(
        this.gl,
        new Vector(-0.5, -0.5, -0.5, 1),
        new Vector(0.5, 0.5, 0.5, 1),
        node.texture
      )
    );
  }
  
  /**
   * Visits a group node in camera traversal
   * @param node The node to visit
   */
   visitGroupNodeCamera(node: GroupNode) {

  }

  visitCameraNode(node: CameraNode) {

  }
}