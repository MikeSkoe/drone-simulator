import {default as Observable} from 'zen-observable';

type Message = 'next' | 'error' | 'complete';
  
export class ZenPushStream<T> {
    private observer: ZenObservable.SubscriptionObserver<T> = null;
    private observers: Set<ZenObservable.SubscriptionObserver<T>> = null;
    observable: Observable<T>;
    private lastValue: T;

    constructor(initialValue?: T) {
        this.lastValue = initialValue;
        this.observable = new Observable(observer => {
            this.addObserver(observer);
            if (initialValue !== undefined) {
                observer.next(this.lastValue);
            }

            return () => {
                this.deleteObserver(observer);
            }
        })
    }

    next = (fn: (prevValue: T) => T) => {
        this.lastValue = fn(this.lastValue);
        this.send('next', this.lastValue);
    }

    // error: function(e) { send(this, 'error', e); },
    // complete: function() { send(this, 'complete'); },

    send = (message: Message, value: T) => {
        if (this.observer) {
            this.sendMessage(this.observer, message, value);
        } else if (this.observers) {
            var list = [];
            this.observers.forEach(to => list.push(to));
            list.forEach(to => this.sendMessage(to, message, value));
        }
    }
  
    sendMessage = (
        observer: ZenObservable.SubscriptionObserver<T>,
        message: Message,
        value: T,
    ) => {
        if (observer.closed) {
            return;
        }
        switch (message) {
            case 'next': return observer.next(value);
            case 'error': return observer.error(value);
            case 'complete': return observer.complete();
        }
    }

    addObserver =(observer: ZenObservable.SubscriptionObserver<T>) =>{
        if (this.observers) {
            this.observers.add(observer);
        } else if (!this.observer) {
            this.observer = observer;
        } else {
            this.observers = new Set();
            this.observers.add(this.observer);
            this.observers.add(observer);
            this.observer = null;
        }
    }

    deleteObserver(observer: ZenObservable.SubscriptionObserver<T>) {
        if (this.observers) {
            this.observers.delete(observer);
        } else if (this.observer === observer) {
            this.observer = null;
        }
    }
}

const createState = <T>(initialValue?: T) => new ZenPushStream(initialValue);

export default createState;