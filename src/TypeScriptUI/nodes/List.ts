import { WithId, isIn, notIn } from '../lib/utils';
import { View } from '../lib/View';
import {default as Observable} from 'zen-observable';

const setKey = (
    key: string,
) => (
    node: View<HTMLElement>,
) => {
    node.node.dataset['key'] = key;

    return node;
}

class List<T extends WithId> extends View<HTMLDivElement> {
    node = document.createElement('div');

    private prevArr: T[] = [];
    private viewArray: View<HTMLElement>[] = [];

    constructor(
        data: Observable<T[]>,
        render: (item: T) => View<HTMLElement>,
    ) {
        super();
        this.node.className = 'list';

        this.pushUnsub(
            data.subscribe(newArr => {
                console.log('newArr', newArr);
                const addedVals = newArr.filter(notIn(this.prevArr));
                const removedVals = this.prevArr.filter(notIn(newArr));
                const oldWithoutRemoved = newArr.filter(notIn(removedVals));
                const newWithoutAdded = newArr.filter(notIn(addedVals));

                // const children = [...this.node.childNodes.values()];

                // remove deleted items
                const isInRemoved = isIn(removedVals);
                
                this.viewArray = this.viewArray.filter(child => {
                    if (isInRemoved({ id: child.node.dataset['key'] })) {
                        child.remove();
                        return false;
                    }

                    return true;
                })

                // update moved
                newWithoutAdded.forEach(
                    (newVal, index) => {
                        if (
                            newVal.id !== oldWithoutRemoved[index].id
                        ) {
                            this.viewArray = this.viewArray.map(
                                child => {
                                    if (newVal.id === child.node.dataset['key']) {
                                        const newItem = setKey(`${newVal.id}`)(render(newVal));
                                        child.node.replaceWith(newItem.node);
                                        return newItem;
                                    }
                                    return child;
                                }
                            );
                        }
                    }
                );

                // add new
                addedVals.forEach(
                    newVal => {
                        const newItem = setKey(`${newVal.id}`)(render(newVal));
                        const indexOfAfter = newArr.findIndex(item => item.id === newVal.id);
                        const nextElement = this.viewArray[indexOfAfter];
                        if (nextElement) {
                            nextElement.node.before(newItem.node);
                            this.viewArray.splice(indexOfAfter, 0, newItem);
                        } else {
                            if (indexOfAfter === 0) {
                                this.node.prepend(newItem.node);
                                this.viewArray.unshift(newItem);
                            } else {
                                this.node.appendChild(newItem.node);
                                this.viewArray.push(newItem);
                            }
                        }
                    }
                )

                this.prevArr = newArr;
            }).unsubscribe
        )
    }

    remove () {
        super.remove();

        this.node.childNodes.forEach(child => child.remove());
    }
}

export default <T extends WithId>(
    data: Observable<T[]>,
    render: (item: T) => View<HTMLElement>,
) => new List(data, render);
