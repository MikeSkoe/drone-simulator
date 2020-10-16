import { Switch, Div } from './TypeScriptUI';
import { initCanvas } from './canvas';
import { $gameState } from './state';
import { GameState } from './components/GameState';
import { MenuState } from './components/MenuState';

const App = () => {
  initCanvas();

  return Div(
    Switch(
      $gameState.observable.map(gameState => gameState.type),
      type => {
        switch(type) {
          case 'game':
            return GameState();

          case 'menu':
            return MenuState();
        }
      }
    )
  );
};

document.querySelector<HTMLDivElement>('#root')
  .appendChild(
    App().node
  );
