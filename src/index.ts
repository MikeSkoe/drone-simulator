import { className, Switch, ZenPushStream, Div, String, Range } from './TypeScriptUI';
import { initCanvas } from './canvas';
import { $dialog } from './state';
import { DialogItem } from './types';

export const Observables = (
  streams: [name: string, stream: ZenPushStream<number>][],
) => streams.map(([name, $stream]) =>
  Div(
    String(
      name,
    ),
    Range(
      $stream.observable,
      $stream.next,
    ),
    String(
      $stream.observable,
    ),
  ),
);

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
      Div(String("next"))
        .with(className("next inner-box")),
    ).with(className("dialog outer-box"));

const App = () => {
  fetch('/data/level1.json')
    .then(data => data.json())
    .then(initCanvas)
    .catch(console.log);

  return Div(

    Switch(
      $dialog.observable.map(items => items[0]),
      Dialog,
    ),
  );
};

document.querySelector<HTMLDivElement>('#root')
  .appendChild(
    App().node
  );
