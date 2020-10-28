import { $gameState, $pressed } from '../state';
import { LevelPath, PressKey } from '../types';
import { Button, Div, String } from '../TypeScriptUI';

const goToGame = (levelPath: string) => () => $gameState.next(() => ({type: 'game', levelPath}))

export const MenuState = () => Div(
  Div(String('menu')),
  Button( 'Go to level 1', goToGame(LevelPath.First)),
  Button( 'Go to level 2', goToGame(LevelPath.Second)),
)
  .with(
    () => $pressed.observable
        .filter(key => key === PressKey.Next)
        .subscribe(goToGame)
        .unsub,
  );
