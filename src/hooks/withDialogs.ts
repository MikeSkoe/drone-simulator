import { $dialog, $pressed } from "../state";
import { MyState, PressKey } from "../types";

export const withDialogs = (
  state: MyState,
) => [
  $pressed.observable
    .filter(key => key === PressKey.Next)
    .subscribe(() => {
      $dialog.next(dialog => {
        const newDialog = dialog.slice(1);

        return newDialog;
      })
    })
    .unsub,

  $dialog.observable
    .subscribe(dialog => {
      if (dialog.length > 0) {
        state.movable = false;
      } else {
        state.movable = true;
      }
    })
    .unsub,
];

