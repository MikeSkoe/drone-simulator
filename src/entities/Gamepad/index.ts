import { $keyPressed, $padKeyPressed } from '../../state';
import { Entity } from '../../types';

const prevButtons: {[key: number]: [value: number, changed: boolean]} = {};
const prevAxes: {[key: number]: number} = {};

export const Gamepad = (): Entity => {
  const onKeyPressed = (event: KeyboardEvent) => {
    $keyPressed.next(() => event.key);
  };

  return {
    localState: {
      unsubs: [
        (
          () => {
            window.addEventListener('keypress', onKeyPressed);

            return () => {
              window.removeEventListener('keypress', onKeyPressed);
            }
          }
        )(),
      ]
    },
    draw: () => {},
    update: () => {
      const [gamepad] = navigator.getGamepads();

      for (let index = 0; index < gamepad?.buttons.length ?? 0; index++) {
        const button = gamepad.buttons[index];

        prevButtons[index] = prevButtons[index] || [button.value, false];
        const pressed = button.value !== prevButtons[index][0];
        prevButtons[index] = [
          button.value,
          pressed,
        ];

        switch (index) {
          case 0: {
            $padKeyPressed.next(() => 'x');
          }
          default: break;
        }
      }

      for (let index = 0; index < gamepad?.axes.length ?? 0; index ++) {
        prevAxes[index] = gamepad.axes[index];
      }
    },
  }
};

export const isButtonDown = (index: number) => (prevButtons[index])?.[0] ?? 0 > 0;
export const isButtonPressed = (index: number) => (prevButtons[index])?.[0] && (prevButtons[index])?.[1];
export const isButtonReleased = (index: number) => (!prevButtons[index])?.[0] && (prevButtons[index])?.[1];

export const getAxe = (index: number) => (prevAxes[index])?.[0] ?? 0;

