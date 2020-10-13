import { className, Switch, Div, String } from './TypeScriptUI';
import { initCanvas } from './canvas';
import { $dialog, $nrg } from './state';
import { DialogItem } from './types';

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

const Health = Div(
  String("energy"),
  Div(
  Div()
    .with(className("progress-handle"))
    .with(node => 
      $nrg.observable
        .subscribe(nrg => node.style.width = `${nrg * 80}px`)
        .unsubscribe
    )
  ).with(className("progress-track"))
).with(className("health"))

const App = () => {
  initCanvas('/data/level1.json');

  return Div(

    Switch(
      $dialog.observable.map(items => items[0]),
      Dialog,
    ),

    Health,
  );
};

document.querySelector<HTMLDivElement>('#root')
  .appendChild(
    App().node
  );
