import { View } from '../lib/View';
import {Observable} from '../lib/Observable';

class Range extends View<HTMLInputElement | HTMLProgressElement> {
    node: HTMLInputElement | HTMLProgressElement;

    constructor(
        range: Observable<number>,
        update: (fn: (newVal: number) => number) => void,
        min = '0',
        max = '1',
        type: 'range' | 'progress' = 'range',
    ) {
        super();

        if (type === 'progress') {
            this.node = document.createElement('progress');
        } else {
            this.node = document.createElement('input');
            this.node.type = 'range';
            this.node.min = min;
            this.node.step = 'any';
        }
        this.node.max = max;

        this.pushUnsub(
            range.subscribe(
                value => this.node.value = `${value}`
            ).unsub,
        );

        this.node.oninput = (event: InputEvent) => {
            update(
                () => Number((<HTMLInputElement>event.target).value)
            );
        }
    }
}

export default (
    range: Observable<number>,
    update: (fn: (newVal: number) => number) => void,
    min = 0,
    max = 1,
    type: 'range' | 'progress' = 'range',
) => new Range(range, update, min.toString(), max.toString(), type);

