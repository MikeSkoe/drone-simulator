import { View } from '../lib/View';
import PushStream from 'zen-push';

class String extends View<HTMLDivElement> {
    node = document.createElement('div');

    constructor(str: PushStream<string> | string) {
        super();

        if (typeof str === 'string') {
            this.node.innerHTML = str;
        } else {
            this.pushUnsub(
                str.observable.subscribe(val => this.node.innerHTML = val).unsubscribe,
            )
        }
    }
}

export default (str: PushStream<string> | string) => new String(str);
