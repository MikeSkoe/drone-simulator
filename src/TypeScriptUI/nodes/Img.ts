import { View } from '../lib/View';

class Img extends View<HTMLDivElement> {
    node: HTMLImageElement = document.createElement('img');

    constructor (src: string) {
        super();

        this.node.src = src;
    }
}

export default (src: string) => new Img(src);