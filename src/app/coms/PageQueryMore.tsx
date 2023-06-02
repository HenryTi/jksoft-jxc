import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { List, Sep, Spinner, useEffectOnce } from "tonwa-com";
import { isPromise, UqQuery } from "tonwa-uq";
import { ModalContext, Page, PageProps, Scroller } from "tonwa-app";
import { useNavigationType } from "react-router-dom";
import { useUqApp } from "app/UqApp";
import { QueryMore } from "app/tool";

interface PageQueryMoreProps<P, R> extends PageProps {
    query: UqQuery<P, R> | QueryMore;
    param: P;
    sortField: string;
    pageStart?: any;
    pageSize?: number;
    pageMoreSize?: number;
    ViewItem?: ({ value }: { value: any; }) => JSX.Element;
    onItemClick?: (item: any) => Promise<void>;
    onItemSelect?: (item: any, isSelected: boolean) => Promise<void>;
    Top?: (props: { items: any[] }) => JSX.Element; // 根据内容显示Top
    Bottom?: (props: { items: any[] }) => JSX.Element; // 根据内容显示Bottom
    none?: JSX.Element;
    itemKey?: ((item: any) => string | number);
}

export class PageMoreCacheData {
    start: any;
    items: any[];
    constructor(start: any, items: any[]) {
        this.start = start;
        this.items = items;
    }

    getItem<T>(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): T | undefined {
        return this.items.find(predicate);
    }
    removeItem<T>(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any) {
        let index = this.items.findIndex(predicate);
        if (index >= 0) {
            this.items.splice(index, 1);
        }
    }
    addItem(item: any) {
        this.items.unshift(item);
    }
}

export function PageQueryMore<P, R>(props: PageQueryMoreProps<P, R>) {
    const isModal = useContext<boolean>(ModalContext);
    if (isModal === true) {
        return <PageQueryMoreBase {...props} isPopFirst={false} isModal={true} />;
    }
    else {
        return <PageQueryMoreNav {...props} />
    }
    function PageQueryMoreNav(props: PageQueryMoreProps<P, R>) {
        const navAction = useNavigationType();
        return <PageQueryMoreBase {...props} isPopFirst={navAction === 'POP'} isModal={false} />;
    }
}

function PageQueryMoreBase<P, R>(props: PageQueryMoreProps<P, R> & { isPopFirst: boolean; isModal: boolean }) {
    let { query, param, sortField, pageStart: pageStartParam, pageSize, pageMoreSize
        , ViewItem: ItemView, onItemClick, onItemSelect, children
        , isPopFirst, isModal, Top, Bottom, none, itemKey } = props;
    const [items, setItems] = useState<R[]>(undefined);
    const [loading, setLoading] = useState(false);
    const refValue = useRef({
        param: { ...param },
        pageStart: pageStartParam,
        isPopFirst,
        querying: false,
        items: undefined as any[],
        allLoaded: false,
    });
    const { current } = refValue;
    if (shallowEqual(current.param, param) === false) {
        current.allLoaded = false;
    }
    pageSize = pageSize ?? 20;
    pageMoreSize = pageMoreSize ?? 5;
    const uqApp = useUqApp();
    const callQuery = useCallback(async function callQuery(more: boolean = false) {
        if (param === undefined) {
            setItems(null);
            current.items = null;
            return;
        }
        let valuesParam = await buildValueParam(param);
        let { pageStart, querying, isPopFirst, items, allLoaded } = current;
        if (allLoaded === true) return;
        if (isPopFirst === true) {
            let pageCache = uqApp.pageCache.getCache<PageMoreCacheData>();
            if (pageCache && isModal === false) {
                if (pageCache.data?.start === pageStart && items !== undefined) return;
            }
        }
        if (querying === true) return;
        if (loading === true) return;
        setLoading(true);
        current.querying = true;
        let newItems: any[];
        let arrResult: any[];
        if (current.isPopFirst === true) {
            setTimeout(() => {
                current.isPopFirst = false;
            }, 100);
            let pageCache = uqApp.pageCache.getCache<PageMoreCacheData>();
            let data = pageCache?.data;
            if (pageStart === pageStartParam && data && isModal === false) {
                let { items: result } = data;
                arrResult = result;
                pageCache.data = undefined;
            }
        }
        let length: number;
        if (!arrResult) {
            let sz = more === true ? pageMoreSize : pageSize;
            let szAsk = sz + 1;
            if (typeof query === 'function') {
                let ret = await query(valuesParam, pageStart, szAsk);
                arrResult = ret;
            }
            else {
                let ret = await query.page(valuesParam, pageStart, szAsk);
                let { $page } = ret as any;
                arrResult = $page;
            }
            length = arrResult.length;
            if (length < szAsk) {
                current.allLoaded = true;
            }
            else {
                arrResult.splice(length - 1, 1);
                length--;
            }
        }
        else {
            length = arrResult.length;
        }
        newItems = pageStart === undefined || items === undefined ? arrResult : [...items, ...arrResult];
        setItems(newItems);
        current.items = newItems;
        if (length > 0) {
            current.pageStart = arrResult[length - 1][sortField];
        }
        if (isModal === false) {
            let pageCache = uqApp.pageCache.getCache<PageMoreCacheData>();
            if (pageCache !== undefined) {
                pageCache.data = new PageMoreCacheData(pageStart, newItems);
            }
        }
        setLoading(false);
        current.querying = false;
    }, [param]);
    useEffectOnce(() => {
        callQuery();
    });
    useEffect(() => {
        if (current.isPopFirst === true) return;
        current.pageStart = undefined;
        callQuery();
    }, [param]);
    if (isModal === false) {
        uqApp.onCloseModal = () => {
            let pageCache = uqApp.pageCache.getCache<PageMoreCacheData>();
            if (pageCache === undefined) return;
            let { data } = pageCache;
            if (data === undefined) return;
            let { items } = data
            let newItems = [...items];
            setItems(newItems);
            current.items = newItems;
        }
    }
    let scrolling = false;
    function scrollIntoView(divId: string) {
        setTimeout(() => {
            let div = document.getElementById(divId);
            div?.scrollIntoView();
            scrolling = false;
        }, 20);
    }
    async function onScrollBottom(scroller: Scroller) {
        if (current.isPopFirst === true) return;
        if (scrolling === true) return;
        scrolling = true;
        scrollIntoView('$$bottom');
        await callQuery(true);
    }
    ItemView = ItemView ?? function ({ value }: { value: R; }) {
        return <div className="px-3 py-2">{JSON.stringify(value)}</div>;
    }
    let top: any;
    if (Top) top = <Top items={items} />;
    let bottom: any;
    if (Bottom) bottom = <Bottom items={items} />;

    let content: any;
    if (loading === true && items !== undefined) {
        content = <div>
            <Spinner className="m-3 text-info" />
            <div id="$$bottom" />
        </div>;
    }
    else if (items) {
        if (items.length > 0) {
            content = <>
                <List items={items} ViewItem={ItemView} onItemClick={onItemClick} onItemSelect={onItemSelect} itemKey={itemKey} />
                <Sep />
            </>;
        }
        else {
            content = none ?? <div className="m-3">-</div>;
        }
    }

    return <Page {...props} onScrollBottom={onScrollBottom}>
        <div id="$$top" />
        {children}
        {top}
        {content}
        {bottom}
    </Page>;
}

async function buildValueParam(param: any) {
    if (!param) return param;
    let ret = {} as any;
    let arr: string[] = [];
    let promises: Promise<any>[] = [];
    for (let i in param) {
        let p = param[i];
        if (isPromise(p) === true) {
            arr.push(i);
            promises.push(p);
        }
        else {
            ret[i] = p;
        }
    }
    let len = promises.length;
    if (len > 0) {
        let retPromises = await Promise.all(promises);
        for (let i = 0; i < len; i++) {
            let prop = arr[i];
            ret[prop] = retPromises[i];
        }
    }
    return ret;
}

function shallowEqual(object1: any, object2: any): boolean {
    if (object1 === undefined) {
        if (object2 === undefined) return true;
        else return false;
    }
    else if (object2 === undefined) {
        return false;
    }
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (object1[key] !== object2[key]) {
            return false;
        }
    }

    return true;
}