import { View } from '../lib/View';
import PlaceHolder from './PlaceHolder';

interface RouterOptions {
    [key: string]: (args: string[]) => View
}

class Router extends View {
    private routerOptions: RouterOptions;

    node = document.createElement('div');
    currentView: View = PlaceHolder();

    constructor(options: RouterOptions) {
        super();

        this.node.appendChild(this.currentView.node);
        this.routerOptions = options;

        window.addEventListener('load', this.render);
        window.addEventListener('hashchange', this.render);
    }

    render = () => {
        const currentLocation = this.getLocation();
        this.currentView.remove();

        loop: for (const key of Object.keys(this.routerOptions)) {
            const keyReplaced = key.replace(/^\//u, '').replace(/^$/u, '/')
            const currentLocationReplaced = currentLocation.replace(/^\//u, '').replace(/^$/u, '/')

            if (currentLocationReplaced.startsWith(keyReplaced)) {
                this.currentView =
                    this.routerOptions[key](
                        currentLocation.replace(key, '').split('/').slice(1),
                    );
                    break loop;
            }
        }
        this.node.appendChild(this.currentView.node);
    }

    getLocation = () => 
        location.hash
            .slice(1);
}

export default (options: RouterOptions) => new Router(options);
