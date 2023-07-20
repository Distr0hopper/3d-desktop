import "bootstrap";
import "bootstrap/scss/bootstrap.scss";
import MouseVisitor from "./mousevisitor";
import AABoxNode from "./nodes/aabox-node";
import { DriverNode, JumperNode, RotationNode, ScalerNode } from "./nodes/animation-nodes";
import CameraNode from "./nodes/camera-node";
import GroupNode from "./nodes/group-node";
import LightNode from "./nodes/light-node";
import PyramidNode from "./nodes/pyramid-node";
import SphereNode from "./nodes/shere-node";
import PhongProperties from "./phong-properties";
import { RasterSetupVisitor, RasterVisitor } from "./rasterzier/rastervisitor";
import RayVisitor from "./raytracer/rayvisitor";
import phongFragmentShader from "./shader/phong-fragment-shader.glsl";
import phongVertexShader from "./shader/phong-vertex-perspective-shader.glsl";
import Shader from "./shader/shader";
import { EmptyTransformation, Rotation, Scaling, Translation } from "./transformation";
import Vector from "./vector";

let rasterizing: boolean = true;

let phongProperties: PhongProperties;
let light1: LightNode;

let cameraNode: CameraNode;
let sceneGraph: GroupNode;

let rasterVisitor: RasterVisitor;
let rayVisitor: RayVisitor;

let lastTimestamp: number;

let animationActivated: boolean = true;

let phongShader: Shader;
let textureShader: Shader;

window.addEventListener("load", () => {
  const canvas_ray = document.getElementById("raytracer") as HTMLCanvasElement;
  const ctx_ray = canvas_ray.getContext("2d");

  const canvas_raster = document.getElementById("rasterizer") as HTMLCanvasElement;
  const ctx_raster = canvas_raster.getContext("webgl2");

  // canvas_raster.addEventListener("mousemove", function (info) {
  //   const x = info.x
  //   const y = info.y
  // });

  canvas_ray.addEventListener("click", function (info) {
    const x = info.offsetX
    const y = info.offsetY
    const mouseVisitor = new MouseVisitor();
    let selectedNode = mouseVisitor.getSelectedNode(sceneGraph, x, y, ctx_ray);
    if (selectedNode != null) {
      console.log(selectedNode);
    }
  });



  // Event listeners for the slider changes
  window.addEventListener("input", function (event) {
    sliderChanged(event);
  });
  /* Call figure toggle if key 2 is pressed */
  document.addEventListener("keydown", (event) => {
    if (event.key === "2") {
      toggleFigure();
    }
  });
  document.getElementById("animationToggle").addEventListener("click", () => {
    toggleAnimation();
  });
  // startAnimation();

  // initialize the phong properties
  phongProperties = new PhongProperties();

  /* Create the scenegraph */
  sceneGraph = new GroupNode(new Translation(new Vector(0, 0, 0, 0)));
  cameraNode = new CameraNode(
    new Vector(0, 0, 0, 1), // eye
    new Vector(0, 0, -1, 1), // center
    new Vector(0, 1, 0, 0), // up
    60, // fov
    canvas_raster.width / canvas_raster.height, // aspect
    0.1, // near
    100
  ); // far
  sceneGraph.add(cameraNode);
  // const gn = new GroupNode(new Translation(new Vector(-1, -1, -4, 0)));
  // sceneGraph.add(gn);
  // gn.add(new SphereNode(new Vector(.4, 0, 0, 1), new Vector(1, 1, 1, 1), 1));
  // gn.add(new SphereNode(new Vector(.4, .7, 0, 1), new Vector(0, 0, 0, 1), 1));
  // gn.add(new SphereNode(new Vector(.4, -.7, .420, 1), new Vector(2, 1, 0, 1), 1));
  // sceneGraph.add(new LightNode(new Vector(0.8, 0.8, 0.8, 1), new Vector(0, 0, 0, 1)));
  // sceneGraph.add(new LightNode(new Vector(0.8, 0.8, 0.8, 1), new Vector(1, -1, 1, 1)));
  // let light1, light2, light3;
  // light1= new LightNode(new Vector(0.8, 0.8, 0.8, 1), new Vector(0, 0, 0, 1));
  // sceneGraph.add(light1);
  // light2 = new LightNode(new Vector(0.8, 0.8, 0.8, 1), new Vector(1, -1, 1, 1));
  // light3 = new LightNode(new Vector(0.8, 0.8, 0.8, 1), new Vector(1, 1, 1, 1));

  // sceneGraph.add(new LightNode(new Vector(0.8, 0.8, 0.8, 1), new Vector(1, 1, 1, 0)));
  // sceneGraph.add(new LightNode(new Vector(0.8, 0.8, 0.8, 1), new Vector(1, 1, -1, 0)));
  // sceneGraph.add(new LightNode(new Vector(0.8, 0.8, 0.8, 1), new Vector(1, -1, 1, 0)));
  // sceneGraph.add(new LightNode(new Vector(0.8, 0.8, 0.8, 1), new Vector(1, -1, -1, 0)));
  // sceneGraph.add(new LightNode(new Vector(0.8, 0.8, 0.8, 1), new Vector(-1, 1, 1, 0)));
  // sceneGraph.add(new LightNode(new Vector(0.8, 0.8, 0.8, 1), new Vector(-1, 1, -1, 0)));
  // sceneGraph.add(new LightNode(new Vector(0.8, 0.8, 0.8, 1), new Vector(-1, -1, 1, 0)));
  // sceneGraph.add(new LightNode(new Vector(0.8, 0.8, 0.8, 1), new Vector(-1, -1, -1, 0)));

  const sg = new GroupNode(new Translation(new Vector(0, 0, -5, 0)));
  const gn = new GroupNode(new Rotation(new Vector(1, 0, 0, 0), 0));
  sg.add(gn);
  const gn1 = new GroupNode(new Translation(new Vector(1.2, 0.5, 0, 0))); //position of the first sphere
  gn.add(gn1);
  // gn1.add(new SphereNode(new Vector(.4, 0, 0, 1), new Vector(0, 0, 0, 1), 1));
  const gn2 = new GroupNode(new Translation(new Vector(-0.8, 1, 1, 0))); //position of the second sphere
  gn.add(gn2);
  const gn3 = new GroupNode(new Scaling(new Vector(0.4, 0.4, 0.4, 0))); //scaling of the second sphere
  gn2.add(gn3);
  gn3.add(new SphereNode(new Vector(0, 0, 0.3, 1), new Vector(0, 0, 0, 1), 1));
  // const lightPositions = [
  //     new Vector(1, 1, 1, 1)
  // ];

  //Add rasterbox
  const rasterBox = new AABoxNode(
    new Vector(1, 2, 1, 0),
    new Vector(1, 0, 1, 1)
  );
  gn1.add(rasterBox);

  //Add pyramid
  const gn4 = new GroupNode(new Translation(new Vector(-1, -2, 1.5, 0))); //position of the third sphere
  gn3.add(gn4);
  const pyramid = new PyramidNode(
    new Vector(2, 2, 2, 0),
    new Vector(1, 0, 1, 1)
  );
  gn4.add(pyramid);

  //Add animation node
  const animationNode = new RotationNode(gn1, new Vector(0, 1, 0, 0));
  const animationNode2 = new JumperNode(gn1, new Vector(0, 1, 0, 0));
  const animationNode3 = new ScalerNode(gn1, new Vector(1, 1, 1, 0));
  const animationNode4 = new DriverNode(gn1);

  //animationNode.toggleActive();

  light1 = new LightNode(new Vector(0.8, 0.8, 0.8, 1), new Vector(1, 1, 1, 0));
  gn.add(light1);

  // add Taskbar to SceneGraph
  const tasbkarRoot = new GroupNode(new EmptyTransformation());
  const taskbarBottom = new GroupNode(new Translation(new Vector(0, -3, -2, 0)));

  tasbkarRoot.add(taskbarBottom)
  const taskBarBox = new AABoxNode(new Vector(10, 1, 1, 0), new Vector(2, 2, 0, 1));
  taskbarBottom.add(taskBarBox)

  sg.add(tasbkarRoot);

  sceneGraph.add(sg);

  // let myBox = new AABoxNode(new Vector(50, 0.8, 0.8, 1));
  // sceneGraph.add(myBox);

  // setup for raytracing rendering
  rayVisitor = new RayVisitor(ctx_ray, canvas_ray.width, canvas_ray.height);

  // setup for raster rendering
  const rasterSetupVisitor = new RasterSetupVisitor(ctx_raster);
  rasterSetupVisitor.setup(sceneGraph);

  phongShader = new Shader(ctx_raster, phongVertexShader, phongFragmentShader);

  textureShader = new Shader(
    ctx_raster,
    //TODO add texture shader
    phongVertexShader,
    phongFragmentShader
  );

  rasterVisitor = new RasterVisitor(
    ctx_raster,
    phongShader,
    textureShader,
    rasterSetupVisitor.objects,
    phongProperties
  );
  phongShader.load();
  rasterVisitor.setupCamera(cameraNode);


  lastTimestamp = performance.now();
  startAnimation();

  function startAnimation() {
    // start animation
    lastTimestamp = 0;
    Promise.all([phongShader.load(), textureShader.load()]).then(() => {
      window.requestAnimationFrame(animate);
    });
  }

  /* animate the scene */
  function animate(timestamp: number) {
    let delta = 0.01;
    if (animationActivated) {
      // console.log("animation loop started");
      if (lastTimestamp === 0) {
        lastTimestamp = timestamp;
      }
      delta = (timestamp - lastTimestamp);
      lastTimestamp = timestamp;
      if (rasterizing) {
        // rasterVisitor.render(sceneGraph, cameraNode, lightPositions);
        rasterVisitor.render(sceneGraph, cameraNode);
      } else {
        // rayVisitor.render(sceneGraph, cameraNode, lightPositions, phongProperties);
        // rayVisitor.render(sceneGraph, cameraNode, phongProperties);
        rayVisitor.render(sceneGraph, phongProperties);
      }
      //requestAnimationFrame(animate);
      // console.log("animation loop ended");
      // console.log("animation loop ended");
      // console.log("animation loop ended");
      //animationNode2.simulate(delta);
      window.requestAnimationFrame(animate);
    }
    //animationNode.simulate(delta);  
    //animationNode2.simulate(delta);

  }

  function toggleAnimation() {
    console.log("toggle animation");
    console.log("Animation Activated old Satus: " + animationActivated);
    animationActivated = !animationActivated;
    console.log("Animation Activated new Satus: " + animationActivated);
    if (animationActivated) {
      document.getElementById("animationToggle").style.background = "green";
      startAnimation();
    } else {
      document.getElementById("animationToggle").style.background = "red";
      lastTimestamp = 0;
    }
  }



  // requestAnimationFrame(animate);

  // let animationHandle: number;

  // let lastTimestamp = 0;
  // let animationTime = 0;
  // let animationHasStarted = true;
  // function animate(timestamp: number) {
  //     let deltaT = timestamp - lastTimestamp;
  //     if (animationHasStarted) {
  //         deltaT = 0;
  //         animationHasStarted = false;
  //     }
  //     animationTime += deltaT;
  //     lastTimestamp = timestamp;
  //     gnRotation.angle = animationTime / 2000;

  //
  //     // animationHandle = window.requestAnimationFrame(animate);
  // }

  // function startAnimation() {
  //     if (animationHandle) {
  //         window.cancelAnimationFrame(animationHandle);
  //     }
  //     animationHasStarted = true;
  //     function animation(t: number) {
  //         animate(t);
  //         animationHandle = window.requestAnimationFrame(animation);
  //     }
  //     animationHandle = window.requestAnimationFrame(animation);
  // }
  // animate(0);

  // document.getElementById("startAnimationBtn").addEventListener(
  //     "click", startAnimation);
  // document.getElementById("stopAnimationBtn").addEventListener(
  //     "click", () => cancelAnimationFrame(animationHandle));
});


/* Toggle visability between the raytracer and rasterizer canvas */
function toggleFigure() {
  const ray_canvas = document.getElementById("raytracer_fig");
  const raster_canvas = document.getElementById("rasterizer_fig");
  if (ray_canvas.style.display === "none") {
    ray_canvas.style.display = "block";
    raster_canvas.style.display = "none";
    rasterizing = !rasterizing;
  } else {
    ray_canvas.style.display = "none";
    raster_canvas.style.display = "block";
    rasterizing = !rasterizing;
  }
}

/* update the phong properties if a slider is changed */
function sliderChanged(event: any) {
  const slider = event.target;
  const value = slider.value;
  const id = slider.id;
  switch (id) {
    case "ambient_value":
      phongProperties.ambient = value;
      console.log("Ambient: " + value);
      break;
    case "diffuse_value":
      phongProperties.diffuse = value;
      console.log("Diffuse: " + value);
      break;
    case "specular_value":
      phongProperties.specular = value;
      console.log("Specular: " + value);
      break;
    case "shininess_value":
      phongProperties.shininess = value;
      console.log("Shininess: " + value);
      break;
    case "fov_value":
      cameraNode.fovy = value;
      console.log("FOV: " + value);
      break;
    case "light1_x_value":
      light1.position.x = value;
      console.log("Light1 x: " + value);
      break;
    case "light1_y_value":
      light1.position.y = value;
      console.log("Light1 y: " + value);
      break;
    case "light1_z_value":
      light1.position.z = value;
      console.log("Light1 z: " + value);
      break;
    default:
      console.log("Unknown slider: " + id);
      break;
  }
}

