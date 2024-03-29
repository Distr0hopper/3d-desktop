import Vector from "../math/vector";
import GlUtils from "../glUtils";
import Shader from "../shader/shader";
//import {ShaderName} from "../shader/shaderName";

/**
 * Represents a raster mesh object in WebGL.
 */
export default class RasterMeshObject {
    private elements: number
    private vertexBuffer: WebGLBuffer
    private normalBuffer: WebGLBuffer
    private colorBuffer: WebGLBuffer

    /**
     * Creates a new RasterMeshObject.
     * @param gl - The WebGL2 rendering context.
     * @param vertices - The array of vertex positions.
     * @param normals - The array of vertex normals.
     * @param color - The color of the mesh object.
     */
    constructor(
        private gl: WebGL2RenderingContext,
        private vertices: number[],
        private normals: number[],
        private color: Vector
    ) {
        const glu = new GlUtils(gl);
        this.elements = vertices.length / 3
        this.vertexBuffer = glu.createVertexBuffer(vertices)
        this.normalBuffer = glu.createNormalBuffer(normals)
        const colorsArray = glu.getColorsArray(this.color, this.elements);
        this.colorBuffer = glu.createColorBuffer(colorsArray);
    }

    /**
     * Renders the mesh object using the specified shader.
     * @param shader - The shader to use for rendering.
     */
    render(shader: Shader) {

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        const positionLocation = shader.getAttributeLocation("a_position");
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation,
            3, this.gl.FLOAT, false, 0, 0);

        const vertexColorAttribute = shader.getAttributeLocation("a_color") //TODO IN SHADER!
        //console.log("Color:", vertexColorAttribute);

        this.gl.enableVertexAttribArray(vertexColorAttribute);


        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        const normalLocation = shader.getAttributeLocation("a_normal"); //TODO IN SHADER!
        //console.log("Normal:", normalLocation);
        this.gl.enableVertexAttribArray(normalLocation);
        this.gl.vertexAttribPointer(normalLocation,
            3, this.gl.FLOAT, false, 0, 0);


        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer)
        this.gl.vertexAttribPointer(vertexColorAttribute, 3, this.gl.FLOAT, false, 0, 0);
        // TODO bind colour buffer

        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.elements);

        this.gl.disableVertexAttribArray(positionLocation);
        this.gl.disableVertexAttribArray(vertexColorAttribute);
        this.gl.disableVertexAttribArray(normalLocation);
    }
};