import { Div, String } from './TypeScriptUI/nodes';
import { initCanvas } from './canvas';
import { MyState } from './types';
import { $dialog } from './state';

const App = () => {
  const state: MyState = {
    health: 1,
    dialog: [],
    movable: true,
  };
  initCanvas(state);

  return Div(
    String(
      $dialog
        .observable
        .map(items =>
          items
            .map(item => item.speach)
            .join('!')
        ),
    ),
  );
};

document.querySelector<HTMLDivElement>('#root')
  .appendChild(
    App().node
  );
