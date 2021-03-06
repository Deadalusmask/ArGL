import { IMaterial, UniformType } from './interfaces'

const i = new Image()
i.src =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2PYtGnTfwAHRgMW7aoU3gAAAABJRU5ErkJggg=='

export default (gl: WebGL2RenderingContext): IMaterial => {
  const dt = () => {
    const texture = gl.createTexture()
    if (!texture) {
      throw new Error('glTFLoader: create texture failed')
    }
    const defaultSampler = {
      magFilter: WebGL2RenderingContext.LINEAR,
      minFilter: WebGL2RenderingContext.LINEAR,
      wrapS: WebGL2RenderingContext.REPEAT,
      wrapT: WebGL2RenderingContext.REPEAT
    }
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, i)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, defaultSampler.wrapS)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, defaultSampler.wrapT)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, defaultSampler.minFilter)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, defaultSampler.magFilter)
    return texture
  }
  return {
    uniforms: [
      {
        name: 'u_BaseColorFactor',
        type: 'VEC4' as UniformType,
        value: new Float32Array([1, 1, 1, 1])
      },
      {
        name: 'u_BaseColorSampler',
        type: 'INT' as UniformType,
        value: 0
      }
    ],
    textures: [dt()]
  }
}
