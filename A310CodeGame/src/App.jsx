import React, { useState, useEffect, useRef } from "react";

function App() {
  const [isHopping, setIsHopping] = useState(false);
  const rigRef = useRef(null);

  useEffect(() => {
    const tryRegister = () => {
      if (!window.AFRAME) return false;

      if (!AFRAME.components["mouse-look-rig"]) {
        AFRAME.registerComponent("mouse-look-rig", {
          schema: { sensitivity: { type: "number", default: 0.002 } },
          init() {
            this.yaw = 0;
            this.pitch = 0;
            this.maxPitch = 0.5;
            this.camPivot = null;

            this.onMouseMove = (e) => {
              if (!document.pointerLockElement) return;
              const dx = e.movementX || 0;
              const dy = e.movementY || 0;

              this.yaw -= dx * this.data.sensitivity;
              this.pitch -= dy * this.data.sensitivity;
              this.pitch = Math.max(-0.2, Math.min(this.maxPitch, this.pitch));
            };

            this.el.sceneEl.addEventListener("mousedown", () => {
              this.el.sceneEl.canvas?.requestPointerLock?.();
            });
            window.addEventListener("mousemove", this.onMouseMove);
          },
          tick() {
            if (!this.camPivot) {
              this.camPivot = this.el.sceneEl.querySelector("#cameraPivot");
              if (!this.camPivot) return;
            }

            if (this.el.body) {
              this.el.body.angularVelocity.set(0, 0, 0);
              this.el.body.quaternion.setFromAxisAngle(
                new CANNON.Vec3(0, 1, 0),
                this.yaw,
              );
            }

            this.el.object3D.rotation.set(0, this.yaw, 0);
            this.camPivot.object3D.rotation.set(this.pitch, 0, 0);
          },
        });
      }

      if (!AFRAME.components["character-controller"]) {
        AFRAME.registerComponent("character-controller", {
          schema: { speed: { type: "number", default: 5.0 } },
          init() {
            this.keys = {};
            window.addEventListener("keydown", (e) => {
              this.keys[e.code] = true;
            });
            window.addEventListener("keyup", (e) => {
              this.keys[e.code] = false;
            });
          },
          tick() {
            if (!this.el.body) return;
            const body = this.el.body;
            let vx = 0;
            let vz = 0;
            const yaw = this.el.object3D.rotation.y;

            if (this.keys["KeyW"]) {
              vx -= Math.sin(yaw);
              vz -= Math.cos(yaw);
            }
            if (this.keys["KeyS"]) {
              vx += Math.sin(yaw);
              vz += Math.cos(yaw);
            }
            if (this.keys["KeyA"]) {
              vx -= Math.cos(yaw);
              vz += Math.sin(yaw);
            }
            if (this.keys["KeyD"]) {
              vx += Math.cos(yaw);
              vz -= Math.sin(yaw);
            }

            const mag = Math.sqrt(vx * vx + vz * vz);
            if (mag > 0) {
              body.velocity.x = (vx / mag) * this.data.speed;
              body.velocity.z = (vz / mag) * this.data.speed;
            } else {
              body.velocity.x *= 0.8;
              body.velocity.z *= 0.8;
            }

            if (body.velocity.y > 2) body.velocity.y = 2;

            body.angularVelocity.set(0, 0, 0);
          },
        });
      }

      if (rigRef.current) {
        rigRef.current.setAttribute("mouse-look-rig", "");
        rigRef.current.setAttribute("character-controller", "speed: 6.0");
      }
      return true;
    };

    const id = setInterval(() => {
      if (tryRegister()) clearInterval(id);
    }, 50);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === " " && !isHopping) {
        setIsHopping(true);
        setTimeout(() => setIsHopping(false), 300);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isHopping]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <a-scene
        vr-mode-ui="enabled: false"
        physics="debug: true; gravity: 0 -22 0; friction: 0.1; restitution: 0;"
      >
        <a-sky color="#0a192f"></a-sky>
        <a-light type="ambient" intensity="0.8"></a-light>
        <a-light type="directional" position="1 1 1" intensity="0.5"></a-light>

        <a-cylinder
          static-body
          position="3 4.2 -9"
          rotation="0 0 90"
          radius="0.2"
          height="6"
          color="#e5e7eb"
        ></a-cylinder>
        <a-cylinder
          static-body
          position="3 4.2 0"
          rotation="0 0 90"
          radius="0.2"
          height="6"
          color="#e5e7eb"
        ></a-cylinder>
        <a-cylinder
          static-body
          position="3 4.2 9"
          rotation="0 0 90"
          radius="0.2"
          height="6"
          color="#e5e7eb"
        ></a-cylinder>

        {/* Teacher station + BIG collider */}
        <a-entity position="-3.5 0 -8.5">
          <a-box
            static-body
            width="3.4"
            height="1.2"
            depth="2.4"
            position="0 0.6 0"
            visible="false"
          ></a-box>

          <a-box
            static-body
            width="3"
            height="0.1"
            depth="1.3"
            position="0 0.9 0"
            color="white"
          ></a-box>
          <a-box
            static-body
            width="0.1"
            height="0.9"
            depth="0.1"
            position="-1.4 0.45 0.5"
            color="#999"
          ></a-box>
          <a-box
            static-body
            width="0.1"
            height="0.9"
            depth="0.1"
            position="1.4 0.45 0.5"
            color="#999"
          ></a-box>
          <a-box
            static-body
            width="0.1"
            height="0.9"
            depth="0.1"
            position="-1.4 0.45 -0.5"
            color="#999"
          ></a-box>
          <a-box
            static-body
            width="0.1"
            height="0.9"
            depth="0.1"
            position="1.4 0.45 -0.5"
            color="#999"
          ></a-box>
          <a-box
            static-body
            width="1.0"
            height="0.65"
            depth="0.05"
            position="-0.55 1.35 0.2"
            rotation="0 195 0"
            color="#111"
          ></a-box>
          <a-box
            static-body
            width="1.1"
            height="0.65"
            depth="0.05"
            position="0.55 1.35 0.2"
            rotation="0 165 0"
            color="#111"
          ></a-box>
          <a-cylinder
            static-body
            radius="0.35"
            height="0.5"
            position="0 0.25 -1"
            color="#333"
          ></a-cylinder>
        </a-entity>

        <a-entity position="-2.0 0 -7.0">
          <a-box
            static-body
            width="0.8"
            height="1.8"
            depth="0.8"
            position="0 0.9 0"
            visible="false"
          ></a-box>
          <a-entity
            id="teacher"
            gltf-model="url(/assets/Staff.glb)"
            position="0 0.8 0"
            scale="3.8 4.8 3.8"
            rotation="0 0 0"
          ></a-entity>
        </a-entity>

        <a-box
          static-body
          position="0 -0.1 0"
          width="12"
          height="0.2"
          depth="22"
          color="#d1d5db"
        ></a-box>
        <a-plane
          static-body
          position="0 5 0"
          rotation="90 0 0"
          width="12"
          height="22"
          color="#ffffff"
        ></a-plane>
        <a-box
          static-body
          position="0 2.5 -11"
          width="12"
          height="5"
          depth="0.2"
          color="#f3f4f6"
        >
          <a-plane
            position="0 0.5 0.11"
            width="7"
            height="3"
            color="white"
          ></a-plane>
        </a-box>
        <a-box
          static-body
          position="0 2.5 11"
          width="12"
          height="5"
          depth="0.2"
          color="#f3f4f6"
        ></a-box>
        <a-box
          static-body
          position="6 2.5 0"
          rotation="0 -90 0"
          width="22"
          height="5"
          depth="0.2"
          color="#f3f4f6"
        >
          <a-box
            static-body
            id="door"
            position="-8.5 -0.8 0.15"
            width="1.8"
            height="3.2"
            depth="0.1"
            color="#333"
          ></a-box>
        </a-box>

        <a-entity position="-6 2.5 0" rotation="0 90 0">
          <a-box
            static-body
            position="0 -1.5 0"
            width="22"
            height="2"
            depth="0.2"
            color="#a5b4fc"
          ></a-box>
          <a-box
            static-body
            position="0 2 0"
            width="22"
            height="1"
            depth="0.2"
            color="#a5b4fc"
          ></a-box>
          {[-10.9, -4.5, -1.5, 1.5, 4.5, 10.9].map((pos) => (
            <a-box
              key={pos}
              static-body
              position={`${pos} 0 0`}
              width="0.3"
              height="5"
              depth="0.25"
              color="#a5b4fc"
            ></a-box>
          ))}
        </a-entity>

        {/* Student pods with BIG collider */}
        {[-2.8, 2.8].map((xSide) =>
          [-4.5, 2, 8.5].map((zOffset) => (
            <a-entity
              key={`${xSide}-${zOffset}`}
              position={`${xSide} 0 ${zOffset}`}
              rotation="0 90 0"
            >
              <a-box
                static-body
                width="4.0"
                height="1.4"
                depth="2.6"
                position="0 0.7 0"
                visible="false"
              ></a-box>

              {[-0.7, 0.7].map((zFace) => (
                <a-entity
                  key={zFace}
                  position={`0 0 ${zFace}`}
                  rotation={`0 ${zFace > 0 ? 0 : 180} 0`}
                >
                  <a-box
                    static-body
                    width="3.6"
                    height="0.12"
                    depth="1.4"
                    position="0 0.9 0"
                    color="white"
                  ></a-box>
                  <a-box
                    static-body
                    width="0.05"
                    height="0.9"
                    depth="0.05"
                    position="-1.7 0.45 0.6"
                    color="#666"
                  ></a-box>
                  <a-box
                    static-body
                    width="0.05"
                    height="0.9"
                    depth="0.05"
                    position="1.7 0.45 0.6"
                    color="#666"
                  ></a-box>

                  {[-0.9, 0.9].map((xShift) => (
                    <a-entity key={xShift} position={`${xShift} 0 0`}>
                      <a-box
                        static-body
                        width="0.95"
                        height="0.65"
                        depth="0.05"
                        position="-0.5 1.4 -0.2"
                        rotation="0 15 0"
                        color="#111"
                      ></a-box>
                      <a-box
                        static-body
                        width="0.95"
                        height="0.65"
                        depth="0.05"
                        position="0.5 1.4 -0.2"
                        rotation="0 -15 0"
                        color="#111"
                      ></a-box>

                      <a-entity position="0 0 0.9">
                        <a-box
                          static-body
                          width="0.8"
                          height="1.0"
                          depth="0.8"
                          position={xSide < 0 ? "0 0.5 0.2" : "0 0.5 0.1"}
                          visible="false"
                        ></a-box>
                        <a-entity
                          gltf-model={`url(/assets/${xSide < 0 ? "OfficeChair.glb" : "DeskChair.glb"})`}
                          scale={xSide < 0 ? "0.9 0.9 0.9" : "1.8 1.8 1.8"}
                          rotation={xSide < 0 ? "0 180 0" : "0 0 0"}
                        ></a-entity>
                      </a-entity>
                    </a-entity>
                  ))}
                </a-entity>
              ))}
            </a-entity>
          )),
        )}

        <a-entity
          ref={rigRef}
          id="rig"
          position="0 0.5 5"
          dynamic-body="shape: sphere; sphereRadius: 0.4; mass: 5; linearDamping: 0.5; angularDamping: 1"
        >
          <a-entity id="cameraPivot" position="0 1.6 0">
            <a-entity id="playerCam" position="0 0.2 4.0" rotation="-10 0 0">
              <a-camera
                wasd-controls-enabled="false"
                look-controls-enabled="false"
              ></a-camera>
            </a-entity>
          </a-entity>

          <a-entity
            id="playerCharacter"
            gltf-model="url(/assets/Student.glb)"
            scale="3.8 4.8 3.8"
            position={isHopping ? "0 0.8 0" : "0 0.4 0"}
            rotation="0 90 0"
          ></a-entity>
        </a-entity>
      </a-scene>
    </div>
  );
}

export default App;
