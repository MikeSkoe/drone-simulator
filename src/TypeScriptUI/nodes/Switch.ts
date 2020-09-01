import { View } from '../lib/View';
import PlaceHolder from './PlaceHolder';
import {default as Observable} from 'zen-observable';

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
                const newNode = render(val);

                this.currentNode.remove();
                this.currentNode = newNode;
                this.node.appendChild(newNode.node);
            }).unsubscribe,
        );
    }
}

export default <T>(
    pub: Observable<T>,
    render: (val: T) => View<HTMLElement | Text>,
) => new Switch(pub, render);