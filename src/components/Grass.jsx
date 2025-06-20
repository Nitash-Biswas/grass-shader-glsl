import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import grassVertexShader from "../shaders/vertex.glsl";
import grassFragmentShader from "../shaders/fragment.glsl";
import { useControls } from "leva";

export const InstancedGrass = () => {

  const instanceRef = useRef();
  const { clock } = useThree();
  const COUNT = 200000;
  const GRASSWIDTH = 60;
  const GRASSLENGTH = 60;
  const halfWidth = 0.06;
  const height = 1;

  const { tipColor, baseColor } = useControls({ tipColor: '#d9c88b', baseColor: '#404709' })

  // Grass blade geometry
  const grassGeometry = useMemo(() => {
    const segments = 7;


    const taper = 0.005;
    const positions = [];

    for (let i = 0; i < segments - 1; i++) {
      const y0 = (i / segments) * height;
      const y1 = ((i + 1) / segments) * height;

      positions.push(
        -halfWidth + taper * i, y0, 0,  // bottom left
        halfWidth - taper * i, y0, 0, // bottom right
        -halfWidth + taper * (i + 1), y1, 0, // top left

        -halfWidth + taper * (i + 1), y1, 0, // top left
        halfWidth - taper * i, y0, 0, // bottom right
        halfWidth - taper * (i + 1), y1, 0 // top right
      );
    }

    // top traingle
    positions.push(
      -halfWidth + taper * (segments - 1), ((segments - 1) / segments) * height, 0,
      halfWidth - taper * (segments - 1), ((segments - 1) / segments) * height, 0,
      0, height, 0
    );

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
    // create normals
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Grass blade material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: grassVertexShader,
      fragmentShader: grassFragmentShader,
      uniforms: {
        uFrequency: { value: new THREE.Vector2(5, 5) },
        uTime: { value: 0 },
        uSpeed: { value: 3 },
        uTipColor: { value: new THREE.Color(tipColor) },
        uBaseColor: { value: new THREE.Color(baseColor) },
        uHalfWidth: { value: halfWidth },
        uBladeHeight: { value: height },
      },
      side: THREE.DoubleSide,
    });
  }, []);

  // Animate uTime
  useFrame(() => {
  material.uniforms.uTime.value = clock.getElapsedTime();

});

useEffect(() => {
  if (material) {
    material.uniforms.uTipColor.value.set(tipColor);
    material.uniforms.uBaseColor.value.set(baseColor);
  }
}, [tipColor, baseColor, material]);


  // 🌱 Setup the 10x10 grass blades after the instancedMesh is mounted
  useEffect(() => {
  if (!instanceRef.current) return;

  const dummy = new THREE.Object3D();
  for (let i = 0; i < COUNT; i++) {
  const x = (Math.random() - 0.5) * GRASSLENGTH;
  const z = (Math.random() - 0.5) * GRASSWIDTH;
  dummy.position.set(x, 0, z);
  dummy.rotation.y = Math.random() * Math.PI * 2;
  dummy.updateMatrix();
  instanceRef.current.setMatrixAt(i, dummy.matrix);
}

  instanceRef.current.instanceMatrix.needsUpdate = true;
}, []);

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const planeGeometry = new THREE.PlaneGeometry(1, 1);
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);



  return (
    <instancedMesh
      ref={instanceRef}
      args={[grassGeometry, material, COUNT]}
    />
  );
};
