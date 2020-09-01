import { View } from '../lib/View';
import PlaceHolder from './PlaceHolder';
import {default as Observable} from 'zen-observable';

class If extends View<HTMLElement> {
    node = document.createElement('div');
    currentNode: View<HTMLElement | Text> = PlaceHolder();

    constructor(
        pub: Observable<boolean> | boolean,
        element: () => View<HTMLElement | Text>,
        another?: () => View<HTMLElement | Text>,
    ) {
        super();

        if (typeof pub === 'boolean') {
            const newNode = 
                pub
                    ? element()
                : another
                    ? another()
                    : PlaceHolder();
            this.currentNode.remove();
            this.currentNode = newNode;
            this.node.appendChild(newNode.node);
        } else {
            this.pushUnsub(
                pub.subscribe(val => {
                    const newNode = 
                        val
                            ? element()
                        : another
                            ? another()
                            : PlaceHolder();
                    this.currentNode.remove();
                    this.currentNode = newNode;
                    this.node.appendChild(newNode.node);
                }).unsubscribe,
            );
        }
    }
}

export default (
    pub: Observable<boolean> | boolean,
    element: () => View<HTMLElement | Text>,
    another?: () => View<HTMLElement | Text>,
) => new If(pub, element, another);