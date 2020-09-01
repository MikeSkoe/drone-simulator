import { View } from '../lib/View';
import { ZenPushStream } from '../lib/ZenPushStream';

class Input extends View<HTMLInputElement>{
    node = document.createElement('input');

    constructor(pub: ZenPushStream<string>) {
        super();

        this.pushUnsub(
            pub.observable.subscribe(value => this.node.value = value).unsubscribe,
        );
        this.node.oninput = (event: InputEvent) => {
            pub.next(() => (<HTMLInputElement>event.target).value);
        }
    }

}

export default (pub: ZenPushStream<string>) => new Input(pub);
