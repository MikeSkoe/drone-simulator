import { View } from '../lib/View';

class Div extends View<HTMLDivElement> {
    node: HTMLDivElement = document.createElement('div');

    private children: View[];

    constructor (...children: View[]) {
        super();

        children.forEach(child => this.node.appendChild(child.node));
        this.children = children;
    }
    
    remove () {
        super.remove();

        this.children.forEach(child => child.remove())
    };

}

export default (...children: View[]) => new Div(...children);