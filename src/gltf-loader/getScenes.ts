import { GlTF } from '../types/glTF'
import { IScene, INode, IMesh } from './interfaces'
import { mat4, quat } from 'gl-matrix'

const tmp = mat4.create()

export default (json: GlTF, meshes: IMesh[]) => {
  if (!json.scenes) {
    return []
  }

  const getNodes = (nodeIndexes: number[]): INode[] => {
    if (!nodeIndexes || !json.nodes) {
      return []
    }
    const nodes = json.nodes
    return nodeIndexes.map((v):INode => {
      const node = nodes[v]
      let matrix
      if (node.matrix) {
        matrix = new Float32Array(node.matrix) // TODO: to row major order?
      } else {
        matrix = mat4.create()
        if (node.translation) {
          mat4.translate(matrix, matrix, node.translation)
        }
        if (node.rotation) {
          mat4.fromQuat(tmp, quat.fromValues.apply(quat, node.rotation))
          mat4.mul(matrix, matrix, tmp)
        }
        if (node.scale) {
          mat4.scale(matrix, matrix, node.scale)
        }
      }
      return {
        name: node.name || '',
        matrix,
        mesh: node.mesh !== undefined ? meshes[node.mesh] : undefined,
        children: node.children !== undefined ? getNodes(node.children) : undefined,
        tempMatrix: mat4.create()
      }
    })
  }

  return json.scenes.map((scene):IScene => {
    return {
      name: scene.name || '',
      nodes: scene.nodes ? getNodes(scene.nodes) : undefined
    }
  })
}
