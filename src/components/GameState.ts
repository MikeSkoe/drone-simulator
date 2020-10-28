import { Div, String, Switch, className, Button, If } from '../TypeScriptUI';
import { $canInteract, $dialog, $gameState, $nrg, $pause } from '../state';
import { DialogItem, LevelPath } from '../types';

const Dialog = (item?: DialogItem) =>
  !item
    ? null
    : Div(
      Div(
        Div(String(item.speaker))
          .with(className("title")),
        Div(String(item.speach))
          .with(className("text")),
      ),
    ).with(className("dialog outer-box"));

const Health = () => Div(
  String("energy"),
  Div(
    Div()
      .with(className("progress-handle"))
      .with(node => 
        $nrg.observable
          .subscribe(nrg => node.style.width = `${nrg * 80}px`)
          .unsub,
      ),
  ).with(className("progress-track")),
).with(className("health"))

const GoToMenu = () => Div(
    Button(
        'Go to level list',
        () => {
            $gameState.next(() => ({type: 'menu'}));
        },
    ),
);

const Pause = () => Div(
  If($pause.observable,
    () => Button(
      'play',
      () => $pause.next(() => false),
    ),
    () => Button(
      'pause',
      () => $pause.next(() => true),
    ),
  ),
);

const Sugestions = () => Div(
  If($canInteract.observable,
    () => Div(String('press [Action] key to interact')),
  ),
  If($dialog.observable.map(dialog => dialog.length > 0),
    () => Div(String('press [Next] to see next phrase')),
  ),
).with(className('suggestion'));

export const GameState = () =>
  Div(
    Switch(
      $dialog.observable.map(items => items[0]),
      Dialog,
    ),
    Health(),
    GoToMenu(),
    Pause(),
    Sugestions(),
  );
