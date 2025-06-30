"use client";
import {
  Environment,
  OrthographicCamera,
  Sky,

} from "@react-three/drei";
import { useRef } from "react";
import { Physics } from "@react-three/rapier";
import CharacterController from "./CharacterController";
import Plane from "./Plane";
import {  InstancedGrass } from "./Grass";
import { Fog } from "three";

export const Experience = () => {
  const shadowCameraRef = useRef();

  return (
    <>
      <Environment preset="sunset" />
      <Sky
        distance={450000}
        sunPosition={[100, 50, 100]}
        inclination={0.49}
        azimuth={0.25}
      />

      <directionalLight
        intensity={0.65}
        castShadow
        position={[-15, 10, 15]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.00005}
      >
        <OrthographicCamera
          left={-22}
          right={15}
          top={10}
          bottom={-20}
          ref={shadowCameraRef}
          attach={"shadow-camera"}
        />
      </directionalLight>

      <Physics debug >

        {/* Ground Plane */}
        <Plane/>

        <CharacterController />

        {/* <fogExp2 attach="fog" color="#cad4db" density={0.1} /> */}

      </Physics>
      {/* <mesh>
        <boxGeometry args={[100, 100, 100]} />
        <meshStandardMaterial color="#78623b" side={2}/>
      </mesh> */}
      <InstancedGrass/>

    </>
  );
};
