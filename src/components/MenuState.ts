import { $gameState, $pressed } from '../state';
import { LevelPath, PressKey } from '../types';
import { Button, Div, String } from '../TypeScriptUI';

const goToGame = () => $gameState.next(() => ({type: 'game', levelPath: LevelPath.First}))

export const MenuState = () => Div(
  Div(String('menu')),
  Button( 'Go to game', goToGame)
)
  .with(
    () => $pressed.observable
        .filter(key => key === PressKey.Next)
        .subscribe(goToGame)
        .unsub,
  );
