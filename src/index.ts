import { Div, String } from './TypeScriptUI/nodes';
import { initCanvas } from './canvas';
import { $dialog } from './state';

const App = () => {
  initCanvas();

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
