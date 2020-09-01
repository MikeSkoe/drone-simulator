import { Button, Div, Range, String, List } from './TypeScriptUI/nodes';
import createState from './TypeScriptUI/lib/ZenPushStream';
import { initCanvas } from './canvas';
import { className, event } from './TypeScriptUI/nodes/nodeManipulations';
import { $dialog, $currentMission, $missionDetail, $doneMissions, $health } from './state';
import If from './TypeScriptUI/nodes/If';
import { Mission } from './types';

const App = () => {
  const $progress = createState<Mission['progress']>('new');

  $missionDetail.observable.subscribe(
    ([missionDetail]) => {
      if (!missionDetail) {
        $progress.next(() => 'new');

        return;
      }

      $currentMission.next(
        currentMissions => {
          const [currentMission] = currentMissions;

          if (currentMission && currentMission.id === missionDetail.id) {
            $progress.next(() => currentMission.progress);
          } else {
            $progress.next(() => 'new');
          }

          return currentMissions;
        }
      )
    }
  );

  initCanvas();

  return Div(
    Range(
      $health.observable,
      $health.next,
      0, 1,
      'progress',
    ),

    // dialog
    If(
      $dialog.observable.map(dialog => dialog.length > 0),

      () => Div(
        Div(String(
          $dialog.observable
            .map(items => items[0]?.speaker ?? '')
        )).with(className('name')),

        Div(String(
          $dialog.observable
            .map(items => items[0]?.speach ?? '')
        )),

        Button('next', () => {
          $dialog.next(dialog => dialog.slice(1));
        })

      ).with(className('dialog-box')),
    ),

    // mission detail
    List(
      $missionDetail.observable,

      mission => {
        return Div(
          Div(
            String(mission?.title ?? ''),
          )
            .with(className('mission'))
            .with(
              event(
                'click',
                () => {
                  $missionDetail.next(() => []);
                  $currentMission.next(() => ([{
                    ...mission,
                    progress: 'progress',
                  }]));
                }
              ),
            ),

          If(
            $progress.observable.map(progress => progress === 'progress'),
            () => Button(
              'cancel',
              () => {
                $currentMission.next(() => []);
                $missionDetail.next(() => []);
              },
            ),
          ),

          If(
            $progress.observable.map(progress => progress === 'done'),
            () => Button(
              'done',
              () => {
                $currentMission.next(([currentMission]) => {
                  $doneMissions.next(doneMissions => doneMissions.concat(currentMission));

                  return [];
                });
                $missionDetail.next(() => []);
              },
            ),
          ),
          // specific buttons if the mission is in progress or done
        ).with(className('mission-selection'));
      },
    ),
  );
};

document.querySelector<HTMLDivElement>('#root')
  .appendChild(
    App().node
  );
