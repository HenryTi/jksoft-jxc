import { useRef } from "react";
import { getAtomValue, List, ListPropsWithoutItems, setAtomValue } from "tonwa-com";
import { atom, useAtomValue, WritableAtom } from 'jotai';

interface Props<T> extends ListPropsWithoutItems<T> {
    context: ListEditContext<T>;
}

export class ListEditContext<T> {
    private readonly keyCompareFunc: (item1: T, item2: T) => boolean;
    readonly atomItems: WritableAtom<T[], any, any>;
    constructor(items: T[], keyCompare: string | ((item1: T, item2: T) => boolean)) {
        //this.response = proxy({ items });
        this.atomItems = atom(items);
        this.keyCompareFunc = (typeof keyCompare === 'string') ?
            (item1: T, item2: T) => (item1 as any)[keyCompare] === (item2 as any)[keyCompare]
            :
            keyCompare;
    }

    protected keyCompare(item1: T, item2: T): boolean {
        return this.keyCompareFunc(item1, item2);
    }

    get items() {
        return getAtomValue(this.atomItems);
    }

    private findIndex(item: T): number {
        let items = this.items;
        let p = items.findIndex(v => this.keyCompare(v, item));
        return p;
    }

    onItemChanged(item: T) {
        let p = this.findIndex(item);
        let items = this.items;
        if (p >= 0) {
            Object.assign(items[p], item);
        }
        else {
            items.unshift(item);
        }
    }

    onItemDeleted(item: T) {
        let items = this.items;
        let p = this.findIndex(item);
        if (p >= 0) this.items.splice(p, 1);
    }

    moveItemToFirst(item: T) {
        let items = this.items;
        let p = this.findIndex(item);
        if (p >= 0) items.splice(p, 1);
        items.unshift(item);
        setAtomValue(this.atomItems, [...items]);
    }

    moveItemToLast(item: T) {
        let items = this.items;
        let p = this.findIndex(item);
        if (p >= 0) items.splice(p, 1);
        items.push(item);
        setAtomValue(this.atomItems, [...items]);
    }
}

export function ListEdit<T>(props: Props<T>) {
    let { context } = props;
    let items = useAtomValue(context.atomItems);
    return <List {...props} items={items as any} />;
}

export function useListEdit<T>(items: T[], keyCompare: (item1: T, item2: T) => boolean) {
    let { current } = useRef(new ListEditContext<T>(items, keyCompare));
    return current;
}
