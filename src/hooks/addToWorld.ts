import * as Matter from 'matter-js';

export const addToWorld = (engine: Matter.Engine, bodies: Matter.Body[]) => {
  Matter.World.add(
    engine.world,
    bodies,
  );

  return () => {
    bodies.forEach(body => {
      Matter.Composite.remove(
        engine.world,
        body,
      );
    })
  }
};

