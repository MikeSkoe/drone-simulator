import {default as Observable} from "zen-observable";

export const className = (className: string) => (node: HTMLElement) => {
    node.classList.add(className);
};

export const event = <K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
) => (
    node: HTMLElement,
) => {
    node.addEventListener(type, listener, options);

    return () => {
        node.removeEventListener(type, listener);
    }
}

export const classNameOn = (
    className: string,
    $bool: Observable<boolean> | boolean,
) => (
    node: HTMLElement,
 ) => {
    if (typeof $bool === 'boolean') {
        if ($bool) {
            node.classList.add(className);
        }
    } else {
        return $bool.subscribe(val => {
            if (val) {
                node.classList.add(className)
            } else {
                node.classList.remove(className)
            }
        }).unsubscribe
    }
}
