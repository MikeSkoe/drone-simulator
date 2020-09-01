import { View } from '../lib/View';

class Button extends View<HTMLButtonElement> {
    node = document.createElement('button');

    constructor (title: string, onClick?: HTMLButtonElement['onclick']) {
        super();
        this.node.innerText = title;

        if (onClick) {
            this.node.onclick = onClick;
        }
    }

    remove = () => {
        this.node.remove();
    }
}

export default (title: string, onClick?: HTMLButtonElement['onclick']) => new Button(title, onClick);