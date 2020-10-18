import { View } from '../lib/View';
import {Observable} from '../lib/Observable';

const isObservable = <T>(value: any): value is Observable<T> =>
    Object.keys(value).includes('_subscriber');

class String extends View<Text> {
    node = document.createTextNode('');

    constructor(str: Observable<unknown> | string | number) {
        super();

        if (isObservable(str)) {
            this.pushUnsub(
                str.subscribe(
                    str => this.node.textContent = `${str}`,
                ).unsub,
            )
        } else {
            this.node.textContent = `${str}`;
        }
    }
}

export default (str: Observable<unknown> | string | number) => new String(str);
