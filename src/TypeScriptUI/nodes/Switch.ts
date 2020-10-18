import { View } from '../lib/View';
import PlaceHolder from './PlaceHolder';
import {Observable} from '../lib/Observable';

class Switch<T> extends View<HTMLElement> {
    node = document.createElement('div');
    currentNode: View<HTMLElement | Text> = PlaceHolder();

    constructor(
        pub: Observable<T>,
        render: (value: T) => View<HTMLElement | Text>,
    ) {
        super();

        this.pushUnsub(
            pub.subscribe(val => {
                const newNode = val ? render(val) : PlaceHolder();

                this.currentNode.remove();
                this.currentNode = newNode;
                this.node.appendChild(newNode.node);
            }).unsub,
        );
    }
}

export default <T>(
    pub: Observable<T>,
    render: (val: T) => View<HTMLElement | Text> | null,
) => new Switch(pub, render);
