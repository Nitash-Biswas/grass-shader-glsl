/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 public/models/character.glb
*/

import React, { useEffect } from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three'

const Character = ({animation, ...props}) => {
  const group = React.useRef()
  const { scene, animations } = useGLTF('./models/character.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions, names } = useAnimations(animations, group)


  // Use a single normal material for all meshes
  const normalMaterial = React.useMemo(() => new THREE.MeshNormalMaterial(), [])

  useEffect(() => {
    actions[animation]?.reset().fadeIn(0.24).play();
    return () => actions?.[animation]?.fadeOut(0.24);
  }, [animation]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Idle" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={nodes.mixamorigHips} />
          {/* <skinnedMesh castShadow name="Alpha_Joints" geometry={nodes.Alpha_Joints.geometry} material={normalMaterial} skeleton={nodes.Alpha_Joints.skeleton} />
          <skinnedMesh castShadow name="Alpha_Surface" geometry={nodes.Alpha_Surface.geometry} material={normalMaterial} skeleton={nodes.Alpha_Surface.skeleton} /> */}
          <skinnedMesh castShadow name="Alpha_Joints" geometry={nodes.Alpha_Joints.geometry} material={materials.Alpha_Joints_MAT} skeleton={nodes.Alpha_Joints.skeleton} />
          <skinnedMesh castShadow name="Alpha_Surface" geometry={nodes.Alpha_Surface.geometry} material={materials.Alpha_Body_MAT} skeleton={nodes.Alpha_Surface.skeleton} />
        </group>
      </group>
    </group>
  )
}

export default Character
useGLTF.preload('./models/character.glb')
