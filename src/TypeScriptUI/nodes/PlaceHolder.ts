import { View } from '../lib/View';

class PlaceHolder extends View<Text> {
    node = document.createTextNode('');
}

export default () => new PlaceHolder();
