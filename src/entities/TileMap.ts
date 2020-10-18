import P5 = require('p5');
import { Entity, BaseState, MyState, TileMapLayer } from '../types';

const img = location.href + 'data/block.png';

const drawToBuffer = (
  [width, height]: [number, number],
  layer: TileMapLayer,
  tileBuffer: P5.Graphics,
  imageData: P5.Image,
) => {
    const {gridCellWidth, gridCellHeight, dataCoords2D} = layer;
    const rowSize = width / gridCellWidth;
    const columnSize = height / gridCellHeight;

    tileBuffer.noSmooth();

    for ( let y = 0; y < columnSize; y++) {
      for (let x = 0; x < rowSize; x++) {
        const xPos = x * gridCellWidth;
        const yPos = y * gridCellHeight;
        const [tileX, tileY] = dataCoords2D[y][x];

        tileBuffer.image(
          imageData,
          xPos, yPos,
          gridCellWidth, gridCellHeight,
          tileX * gridCellWidth, tileY * gridCellHeight,
          8, 8,
        );
      }
    }
};

export interface TileMapState extends BaseState {
  setTileMap: (size: [number, number], layer: TileMapLayer) => void;
  buffers: P5.Graphics[];
}

export const TileMap = (
  p5: P5,
  state: MyState,
): Entity<TileMapState> =>{
  const unsubs: (() => void)[] = [];
  const buffers: P5.Graphics[] = [];

  const localState: TileMapState = {
    buffers,
    setTileMap: (size, layer) => {
      p5.loadImage(
        img,
        image => {
          const graphics = p5.createGraphics(...size, 'p2d');

          drawToBuffer(size, layer, graphics, image);
          buffers.push(graphics);
          unsubs.push(graphics.remove);
        }
      );
    },
    unsubs,
  };

  return {
    localState,
    update: () => {},
    draw: () => {
      for (const buffer of buffers) {
        p5.image(buffer, 0, 0);
      }
    },
  };
};

