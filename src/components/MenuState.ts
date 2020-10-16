import { $gameState } from "../state";
import { LevelPath } from "../types";
import { Button, Div, String } from "../TypeScriptUI";

export const MenuState = () => Div(
    Div(String('menu')),
    Button(
        'Go to game',
        () => {
            $gameState.next(() => ({type: 'game', levelPath: LevelPath.First}));
        }
    )
);
