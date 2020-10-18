import { Div, String, Switch, className, Button, If } from '../TypeScriptUI';
import { $dialog, $gameState, $nrg, $pause } from '../state';
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
      Div(String(">"))
        .with(className("next inner-box")),
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
        'Go to menu',
        () => {
            $gameState.next(() => ({type: 'menu'}));
        },
    ),
);

const pause = () => Div(
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

export const GameState = () =>
  Div(
    Switch(
      $dialog.observable.map(items => items[0]),
      Dialog,
    ),
    Health(),
    GoToMenu(),
    pause(),
  );
