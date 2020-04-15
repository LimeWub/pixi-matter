// Bad name - could be more generic
// group is just another container, shout accept a name and any amount of shapes
function initParticles(options) {
  const particles = new PIXI.Container();
  app.stage.addChild(particles);
  const tints = ["FF1B1C", "FF7F11", "06AED5", "F3B700", "02d675"];

  for (let i = 0; i < options.shapes_count; i++) {
    particles.addChild(
      Shape_element({
        graphic_settings: {
          fill: {
            color: `0x${tints[Math.floor(Math.random() * tints.length)]}`
          }
        }
      })
    );
  }

  for (let i = 0; i < options.rectangles_count; i++) {
    particles.addChild(
      Rectangle_element({
        width: 5 * vw() + 5 * Math.random() * vw(),
        height: 5 * vw() + 5 * Math.random() * vw(),
        graphic_settings: {
          //?????
          line: {
            width: vw(),
            color: `0x${tints[Math.floor(Math.random() * tints.length)]}`
          }
        }
      })
    );
  }

  for (let i = 0; i < options.circles_count; i++) {
    particles.addChild(
      Circle_element({
        diameter: 5 * vw() + 5 * Math.random() * vw(),
        graphic_settings: {
          line: {
            width: vw(),
            color: `0x${tints[Math.floor(Math.random() * tints.length)]}`
          }
        }
      })
    );
  }

  for (let i = 0; i < options.dot_count; i++) {
    particles.addChild(
      Circle_element({
        diameter: 3 * vw(),
        graphic_settings: {
          fill: {
            color: `0x${tints[Math.floor(Math.random() * tints.length)]}`
          }
        }
      })
    );
  }

  particles.onTick = function(delta) {
    const particlesChildren = particles.children;
    for (let i = 0; i < particlesChildren.length; i++) {
      //If they have a tick function then
      // trigger that
      if (
        particlesChildren[i].onTick &&
        typeof particlesChildren[i].onTick === "function"
      ) {
        // delta is 1 if running at 100% performance
        // creates frame-independent transformation
        particlesChildren[i].onTick(delta);
      }
    }
  };
}
