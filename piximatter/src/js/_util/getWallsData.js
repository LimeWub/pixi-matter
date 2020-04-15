export const wallsElementId = `walls`;

export const getWallsData = ({ width, height, matter_config = {}, pixi_config = {} }) => {
  const thicc = width + height; // we want walls to be good thicc to block elements from flying through
  const _matter_config = {
    isStatic: true,
    restitution: 1,
    ...matter_config
  };
  const _pixi_config = {
    fill: {
      color: "0x00ffff"
    },
    ...pixi_config
  };

  return [
    {
      id: wallsElementId,
      type: "collection",
      config: {
        bodies: [
          {
            id: "top",
            type: "rectangle",
            config: {
              width: width + thicc,
              height: thicc,
              position: {
                x: width / 2,
                y: -thicc / 2 + 1
              },
              matter_config: _matter_config,
              pixi_config: _pixi_config
            }
          },
          {
            id: "bottom",
            type: "rectangle",
            config: {
              width: width + thicc,
              height: thicc,
              position: {
                x: width / 2,
                y: height + thicc / 2 - 1
              },
              matter_config: _matter_config,
              pixi_config: _pixi_config
            }
          },
          {
            id: "left",
            type: "rectangle",
            config: {
              width: thicc,
              height: height + thicc,
              position: {
                x: -thicc / 2 + 1,
                y: height / 2
              },
              matter_config: _matter_config,
              pixi_config: _pixi_config
            }
          },
          {
            id: "right",
            type: "rectangle",
            config: {
              width: thicc,
              height: height + thicc,
              position: {
                x: width + thicc / 2 - 1,
                y: height / 2
              },
              matter_config: _matter_config,
              pixi_config: _pixi_config
            }
          }
        ]
      }
    }
  ];
};
