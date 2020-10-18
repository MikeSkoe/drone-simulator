import { $pressed } from '../state';
import { PressKey } from '../types';

const prevButtons: {[key: number]: [value: number, changed: boolean]} = {};
const prevAxes: {[key: number]: number} = {};

export const Pressed = () => {
  const onKeyPressed = (event: KeyboardEvent) => {
    switch(event.key) {
      case 'z':
        $pressed.next(() => PressKey.Action);
        break;

      case 'x':
        $pressed.next(() => PressKey.Next);
        break;
    }
  };

  window.addEventListener('keydown', onKeyPressed);

  const tick = () => {
    const [gamepad] = navigator.getGamepads();

    for (let index = 0; index < gamepad?.buttons.length ?? 0; index++) {
      const button = gamepad.buttons[index];

      prevButtons[index] = prevButtons[index] || [button.value, false];
      const pressed = button.value !== prevButtons[index][0];

      prevButtons[index] = [
        button.value,
        pressed,
      ];

      if (pressed && button.value > 0) {
        switch (index) {
          case 0:
            $pressed.next(() => PressKey.Action);
            break;

          case 1:
            $pressed.next(() => PressKey.Next);
            break;

          default: break;
        }
      }

      for (let index = 0; index < gamepad?.axes.length ?? 0; index ++) {
        prevAxes[index] = gamepad.axes[index];
      }
    }

    window.requestAnimationFrame(tick);
  }

  window.requestAnimationFrame(tick);

  return [
    () => window.removeEventListener('keydown', onKeyPressed),
  ]
};

export const isButtonDown = (index: number) => (prevButtons[index])?.[0] ?? 0 > 0;
export const isButtonPressed = (index: number) => (prevButtons[index])?.[0] && (prevButtons[index])?.[1];
export const isButtonReleased = (index: number) => (!prevButtons[index])?.[0] && (prevButtons[index])?.[1];
export const getAxe = (index: number) => (prevAxes[index])?.[0] ?? 0;
