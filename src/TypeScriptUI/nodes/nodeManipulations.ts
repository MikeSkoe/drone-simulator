import {Observable} from '../lib/Observable';

export const className = (classNames: string) => (node: HTMLElement) => {
  classNames.split(' ').forEach(
    className => node.classList.add(className),
  );
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
    classNames: string,
    $bool: Observable<boolean> | boolean,
) => (
    node: HTMLElement,
 ) => {
    if (typeof $bool === 'boolean') {
        if ($bool) {
            classNames.split(' ').forEach(
                className => node.classList.add(className),
            );
        }
    } else {
        return $bool.subscribe(val => {
            if (val) {
                classNames.split(' ').forEach(
                  className => node.classList.add(className),
                );
            } else {
                classNames.split(' ').forEach(
                  className => node.classList.remove(className),
                );
            }
        }).unsub
    }
}
