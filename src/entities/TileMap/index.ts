import P5 = require('p5');
import { Entity, MyState, BaseState, TileMap as TileMapType } from '../../types';
import img from '../../data/block.png';

interface TileMapState extends BaseState { }

export const TileMap = (
  p5: P5,
  state: MyState,
  data: TileMapType,
): Entity<TileMapState> => {
  const imageData = p5.loadImage(img);
  const localState: TileMapState = {
    unsubs: [],
  };
  console.log('hi');

  return {
    localState,
    update: () => {},
    draw: () => {
      // p5.image(imageData, 0, 0);

      p5.push();
      {
        p5.scale(3);
        p5.translate(-50, -50);
        const {width, height, layers} = data;

        for (const layer of layers) {
          const {gridCellWidth, gridCellHeight, dataCoords2D} = layer;
          const rowSize = width / gridCellWidth;
          const columnSize = height / gridCellHeight;

          for ( let y = 0; y < columnSize; y++) {
            for (let x = 0; x < rowSize; x++) {
              const xPos = x * gridCellWidth;
              const yPos = y * gridCellHeight;
              const [tileX, tileY] = dataCoords2D[y][x];

              p5.image(
                imageData,
                xPos, yPos,
                gridCellWidth, gridCellHeight,
                tileX * gridCellWidth, tileY * gridCellHeight,
                8, 8,
              )
            }
          }
        }
      }
      p5.pop();
    }
  };
};

