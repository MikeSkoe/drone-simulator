
export abstract class View<E extends (HTMLElement | Text) = (HTMLElement | Text)> {
    abstract node: E;
    private unsubs: (() => void)[] = [];
    protected pushUnsub = (fn: () => void) => {
        this.unsubs.push(fn);
    };

    remove () {
        this.node.remove();
        this.unsubs.forEach(unsub => unsub());
    }

    with = (fn: (node: E) => (() => void) | void) => {
        const callback = fn(this.node);

        if (callback) {
            this.onRemove(callback);
        }

        return this;
    }

    onRemove = (fn: () => void) => {
        this.pushUnsub(fn);

        return this;
    }

}