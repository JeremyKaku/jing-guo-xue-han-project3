import { loadFull } from "tsparticles";
import particlesConfig from "./config/particles-config";
import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";

const ParticlesBackground = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    console.log(container);
  };

  return (
    <Particles
      id="tsparticles"
      particlesLoaded={particlesLoaded}
      options={particlesConfig}
    />
  );
}

export default ParticlesBackground;
