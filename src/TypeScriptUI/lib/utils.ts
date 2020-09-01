export interface WithId {
    id: string | number;
}

export const compose = <T>(...fns: ((...args: T[]) => T)[]) =>
    fns.reduceRight((prevFn, nextFn) =>
       (...arg: T[]) => nextFn(prevFn(...arg)),
       val => val,
    );

export const mem = <T, R>(fn: (args: T) => R) => {
    let prev: T | null = null;

    return (arg: T) => {
        if (prev !== arg) {
            prev = arg;
            fn(arg);
        }
    }
};

export const isIn = (arr: WithId[]) => (item: WithId) => arr.some(i => Number(i.id) === Number(item.id));
export const notIn = (arr: WithId[]) => (item: WithId) => !arr.some(i => Number(i.id) == Number(item.id));
