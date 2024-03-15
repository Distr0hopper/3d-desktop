# Interactive Computer Graphics Project - Group 5

<!-- Ein Bild der Anwendung muss im Ordner ./img relativ zu dieser Datei liegen -->

<!-- <img src="img/Ducktales.webp" width="75%"> -->

This repository contains the project of the course "Interactive Computer Graphics" by Lorenz Bauer, Julius Arzberger, Marius Röhm.
![image](https://github.com/Distr0hopper/3d-desktop/assets/100717485/5620bb33-9457-48c7-90b9-42ce23a3a400)


# Project Structur

```
.
.
├── --charset
├── dist
│   ├── brickwall-normal.jpg
│   ├── cube.obj
│   ├── fish.mp4
│   ├── hci-logo.png
│   ├── index.html
│   ├── monkey.obj
│   ├── normalneutral.png
│   ├── psychoandreas.png
│   ├── source-missing-texture.png
│   ├── tictactoe.png
├── Finale Abgabe Modul Interaktive Computergraphik Übung.pdf
├── fragen.md
├── img
│   └── SceneGraphDiagramm.drawio.png
├── package.json
├── package-lock.json
├── README.md
├── src
│   ├── boxSharedProperties.ts
│   ├── glUtils.ts
│   ├── index.ts
│   ├── jsonLoader.ts
│   ├── jsonVisitor.ts
│   ├── math
│   │   ├── matrix.ts
│   │   ├── transformation.ts
│   │   └── vector.ts
│   ├── mousevisitor.ts
│   ├── nodes
│   │   ├── aabox-node.ts
│   │   ├── animation-nodes.ts
│   │   ├── camera-node.ts
│   │   ├── group-node.ts
│   │   ├── light-node.ts
│   │   ├── mesh-node.ts
│   │   ├── node.ts
│   │   ├── pyramid-node.ts
│   │   ├── sphere-node.ts
│   │   ├── texture-box-node.ts
│   │   ├── texture-text-box-node.ts
│   │   ├── texture-video-box-node.ts
│   │   └── window-node.ts
│   ├── OBJLoader.ts
│   ├── phong-properties.ts
│   ├── rasterzier
│   │   ├── raster-box.ts
│   │   ├── raster-mesh-object.ts
│   │   ├── raster-Pyramid.ts
│   │   ├── raster-sphere.ts
│   │   ├── raster-texture-box-text.ts
│   │   ├── raster-texture-box.ts
│   │   ├── raster-texture-box-video.ts
│   │   └── rastervisitor.ts
│   ├── raytracer
│   │   ├── aabox.ts
│   │   ├── intersection.ts
│   │   ├── meshObject.ts
│   │   ├── phong.ts
│   │   ├── polygon.ts
│   │   ├── pyramid.ts
│   │   ├── ray-sphere.ts
│   │   ├── ray.ts
│   │   └── rayvisitor.ts
│   ├── scenegraph-boilerplate.ts
│   ├── scenegraph.ts
│   ├── shader
│   │   ├── glsl.d.ts
│   │   ├── phong-fragment-shader.glsl
│   │   ├── phong-vertex-perspective-shader.glsl
│   │   ├── shader.ts
│   │   ├── texture-fragment-shader.glsl
│   │   └── texture-vertex-perspective-shader.glsl
│   ├── ticTacToe.ts
│   └── visitor.ts
├── tree.txt
├── tsconfig.json
└── webpack.config.js

```

The project is divided thematically into several folders.
`dist` contains resources that are used directly in the browser including `obj` files that can be loaded into the scene by our OBJ loader.
`src` contains all source files that are transpiled by `webgl` or the `raytracer`.
We have structured the packages according to their functions:

- `math` includes the methods for calculating with vectors, matrices and transformations.
- `nodes` includes the nodes used by the scene-graph.
- `rasterizer` includes the rastervisitor traversing the scenegraph and accepting the nodes as well as all object-classes created when visiting a node.
- `raytracer` includes the rayvisitor traversing the scenegraph and accepting the nodes as well as all object-classes created when visiting a node. Also contains the phong lighting model for the raytracer and the ray class representing a ray shot from the camera to the canvas.
- `shader` includes the shaders in WebGL, consisting of a vertex and fragment shader for phong lighting and a vertex and fragment shader for textures.

The following classes are not structured in packages, their functionalities are explained below:

- `Scenegraph.ts` creates the scenegraph with all nodes, including object-nodes, transformations and animations.
- `Scenegraph-boilerplate.ts` functions as index.ts class. Loading the scenegraph and holding event listeners for manipulating the scene. Also starts the rendering of the raytracer or rasterizer after initializing the scene.
- `visitors.ts` interface for the visitor-pattern.
- `ticTacToe.ts` creates a TicTacToe game consisting of 9 Texture-Text-Boxes. Also containing methods for playing the game and clearing.
- `OBJLoader.ts` class for loading a .obj file into the scene.
- `mousevisitor.ts` is a class for shooting a ray at the mouse position, checking for intersection of the clicked 3D-Object.
- `phong-properties.ts` holds the phong lighting properties from the HTML-Document.
- `boxSharedProperties.ts` contains vertices and normals for all raster-box objects.
- `glUtils.ts` is a utility class for creating and binding buffers for WebGL.
- `jsonVisitor.ts` saves the current state of the scenegraph as JSON file by visiting each node and saving its attributes.
- `jsonLoader.ts` loads a JSON file containing the scenegraph.
- `animationVisitor.ts` visits all animation nodes if a JSON file is uploaded.
- `index.ts` has bootstrap imports.

# Installation

Use a console to change to the root directory of this file and run

```
npm install
```

### Execution

Then enter

```bash
npm start
```

and call up the server's website via to `0.0.0.0:<port>` or `localhost:<port>` in the browser. The port must be replaced from the console output.

---

# How-To

## General operation:

Switch between rasterizer and raytracer with key _2_.

The _p_ key can be used to start and stop the animation of the animation nodes.

## Scene Manipulation

Buttons for the following functions are located below the render canvas:

- _Animation on/off_: Starts and stops the animations of the entire scene (incl. video and game).

- _Clear Canvas_: Deletes the content of the blue drawing canvas on the right.

- _Clear Game_: Deletes the content of the TicTacToe game.

- _Download JSON_: Saves the current scene as a JSON file.

- _Upload JSON_: Loads a scene from a JSON file. A uploaded scene cannot be downloaded and uploaded again!

The Phong shading parameters can be set using the sliders below the render canvas.

Use keys "W,A,S,D" to translate the pyramid in their respective directions and "r,f" for translating it forward/backwards in the z-direction.

## Interaction with Objects

On the Bottom of the canvas, there is a taskbar with two clickable boxes linked to the corresponding windows above.
By clicking these boxes the user can minimize or maximize the windows.

Minimizing and maximizing the windows can also be achieved by clicking the **rightmost** sphere.

Zooming in and out to focus a single window can be achieved by clicking the **leftmost** sphere.

The right window displays a tic-tac-toe game. The user can click on the boxes to alternately place a cross or a circle on the playing field.

### Functions

| Nummer | Punkte | Beschreibung                                                      | bearbeitet               | Verantwortliche/r                           |
| ------ | ------ | ----------------------------------------------------------------- | ------------------------ | ------------------------------------------- |
| M1     | 5      | Szenengraph                                                       | <ul><li>- [X] </li></ul> | Julius Arzberger, Marius Röhm, Lorenz Bauer |
| M2     | 10     | Rasteriser & Ray Tracer                                           | <ul><li>- [X] </li></ul> | Julius Arzberger, Marius Röhm, Lorenz Bauer |
| M3     | 3      | min. drei eingebundene Objekte                                    | <ul><li>- [X] </li></ul> | Julius Arzberger, Marius Röhm, Lorenz Bauer |
| M4     | 8      | min. drei verschiedene Animationsknoten                           | <ul><li>- [X] </li></ul> | Julius Arzberger, Marius Röhm               |
| M5     | 4      | Objekte mit Textur                                                | <ul><li>- [X] </li></ul> | Marius Röhm, Lorenz Bauer                   |
| M6     | 5      | mathematische Bibliothek                                          | <ul><li>- [X] </li></ul> | Julius Arzberger, Marius Röhm               |
| M7     | 4      | Phong Shader                                                      | <ul><li>- [X] </li></ul> | Julius Arzberger, Marius Röhm               |
| M8     | 2      | Zwei Anwendungsfenster                                            | <ul><li>- [X] </li></ul> | Julius Arzberger, Marius Röhm, Lorenz Bauer |
| M9     | 4      | Taskleiste mit Icons                                              | <ul><li>- [X] </li></ul> | Julius Arzberger, Marius Röhm, Lorenz Bauer |
| M10    | 5      | Auswahl & Manipulation per Maus                                   | <ul><li>- [X] </li></ul> | Julius Arzberger, Marius Röhm               |
| O1     | 7      | Materials for phong shading                                       | <ul><li>- [ ] </li></ul>  |                                             |
| O2     | 3      | Videos and Text as texture                                        | <ul><li>- [X] </li></ul> | Julius Arzberger                            |
| O3     | 8      | OBJ Loader                                                        | <ul><li>- [X] </li></ul> | Julius Arzberger                            |
| O4     | 4      | Multiple moving light sources                                     | <ul><li>- [X] </li></ul> | Julius Arzberger, Marius Röhm               |
| O5     | 6      | Magnifying glass effect                                           | <ul><li>- [ ] </li></ul> |                                             |
| O6     | 4      | Animation when clicking an object                                 | <ul><li>- [X] </li></ul> | Julius Arzberger, Marius Röhm, Lorenz Bauer |
| O7     | 8      | Camera Nodes as part of the scene grap                            | <ul><li>- [X] </li></ul> | Marius Röhm, Lorenz Bauer                   |
| O8     | 5      | Bounding Volumes                                                  | <ul><li>- [X] </li></ul> | Marius Röhm, Julius Arzberger               |
| O9     | 8      | JSON Loader                                                       | <ul><li>- [X] </li></ul> | Lorenz Bauer                                |
| 10     | 7      | Ractracing of all Objects from triangles                          | <ul><li>- [X] </li></ul> | Julius Arzberger, Marius Röhm               |
| 11     | 10     | Shadow mapping in WebGL                                           | <ul><li>- [ ] </li></ul>  |                                             |
| 12     | 10     | Second, interactive scene as display content of the drawing area. | <ul><li>- [ ] </li></ul>  |                                             |
| 13     | 5      | Simple application in the drawing area                            | <ul><li>- [X] </li></ul> | Julius Arzberger, Marius Röhm               |
| 14     | 5      | Own suggestion for an extension of the application                | <ul><li>- [ ] </li></ul> |                                             |
| 15     | 5      | Exceptional implementation of requirements                        | <ul><li>- [ ] </li></ul> |                                             |

### Compatibility

The project was tested with the following configurations:

<!-- Nur die Konfigurationen angeben die ihr wirklich getestet habt. Eine gängige Kombination ist hier schon ausreichend-->

- Windows 10 Build Version <22H2 19045.4046> mit

  - Firefox Version <123.0 (64-Bit)>
  - node js Version <v16.15.1></v16.15.1>

- Ubuntu Linux Build Version <22.04.4> with

  - Firefox Version <123.0>
  - node js Version <v12.22.9>

- PopOs Linux Build Version <22.04> with

  - Firefox Version <123.0>
  - node js Version <v12.22.9>

- Fedora Linux Build Version <39 6.7.5-200.fc39.x86_64> mit

  - Firefox Version <122.0.1 (64-Bit)>
  - node js Version <v20.10.0>
  <!-- - macOs Build Version <> mit


  - Firefox Version <>
  - Chrome Version <>
  - Safari Version <>
  - Chromium Version <>
  - node js Version <>
    -->
