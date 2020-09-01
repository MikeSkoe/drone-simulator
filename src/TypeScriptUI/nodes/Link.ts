import { View } from '../lib/View';
import {default as Observable} from 'zen-observable';

class Link extends View<HTMLAnchorElement> {
    node = document.createElement('a');

    private children: View[];

    constructor(href: string | Observable<string>, ...children: View[]) {
        super();

        if (typeof href === 'string') {
            this.node.href = href;
        } else { 
            this.pushUnsub(
                href.subscribe(
                    val => this.node.href = val,
                ).unsubscribe
            );
        }
        children.forEach(child => this.node.appendChild(child.node));
        this.children = children;
    }

    remove () {
        super.remove();

        this.children.forEach(child => child.remove())
    }
}

export default (href: string | Observable<string>, ...children: View[]) =>
    new Link(href, ...children);