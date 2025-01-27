import React, { useEffect, useMemo, useRef, JSX } from "react";
import { Sep, SpinnerSmall, getAtomValue, setAtomValue } from "tonwa-com";
import { UqQuery } from "tonwa-uq";
import { QueryMore } from "app/tool";
import { atom, useAtomValue } from "jotai";

interface PropsMore<P> {
    param: P;
    sortField: string;
    pageStart?: any;
    pageSize?: number;
    pageMoreSize?: number;
    noAutoLoad?: boolean;
}

export interface PropsQueryMore<P, R> extends PropsMore<P> {
    query: UqQuery<P, any> | QueryMore;
    ViewItem?: ({ value }: { value: R; }) => JSX.Element;
    getKey?: (v: R) => string | number;
    sep?: JSX.Element;
}

export interface ReturnsQueryMore<R> {
    view: JSX.Element;
    items: MoreItems<any, R>;
}

export function useQueryMore<P = any, R = any>(props: PropsQueryMore<P, R>): ReturnsQueryMore<R> {
    let { query, ViewItem, getKey, sep } = props;
    const moreItems = useMemo(() => {
        return typeof query === 'function' ? new MoreQuery<P, R>(query, props) : new MoreUqQuery(query, props);
    }, []);
    const { atomItems, atomIsLoading, atomError } = moreItems;
    const items = useAtomValue(atomItems);
    const isLoading = useAtomValue(atomIsLoading);
    const error = useAtomValue(atomError);
    const observerTarget = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    moreItems.load();
                }
            },
            { threshold: 1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }
        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [observerTarget]);

    if (ViewItem === undefined) {
        ViewItem = function ({ value }: { value: any }) {
            return <div>{JSON.stringify(value)}</div>;
        }
    }
    if (sep === undefined) {
        sep = <Sep />;
    }
    let view = <>
        <div>
            {items?.map((v, index) => {
                let key = getKey === undefined ? index : getKey(v);
                let content = <ViewItem value={v} />;
                let s: any;
                if (index > 0) s = sep;
                return <React.Fragment key={key}>{s}{content}</React.Fragment>;
            })}
        </div>
        {isLoading && <Loading elObserver={observerTarget.current} />}
        {error && <p>Error: {error.message}</p>}
        <div ref={observerTarget} style={{ height: "0.5rem" }} className="border border-danger"></div>
    </>;
    return {
        view,
        items: moreItems,
    };
}

function Loading({ elObserver }: { elObserver: HTMLElement }) {
    useEffect(() => {
        elObserver.scrollIntoView();
    });
    return <div className="text-center py-2"><SpinnerSmall /></div>;
}

let id = 1;
export abstract class MoreItems<P, R> {
    private readonly props: PropsMore<P>;
    private pageStart: any;
    private canLoad: boolean;
    id: number;
    atomIsLoading = atom(false);
    atomError = atom(undefined as { message: string; });
    atomItems = atom(undefined as R[]);
    atomAllLoaded = atom(false);

    constructor(props: PropsMore<P>) {
        this.props = props;
        this.canLoad = props.noAutoLoad !== true;
        this.id = id++;
    }

    protected abstract queryCall(valuesParam: P, pageStart: any, pageSize: number): Promise<R[]>;

    private async query(pageSize: number) {
        let isLoading = getAtomValue(this.atomIsLoading);
        if (isLoading === true) return;
        const { param } = this.props;
        let szAsk = pageSize + 1;
        setAtomValue(this.atomIsLoading, true);
        let ret = await this.queryCall(param, this.pageStart, szAsk);
        let { length } = ret;
        if (length < szAsk) {
            setAtomValue(this.atomAllLoaded, true);
        }
        else {
            ret.splice(length - 1, 1);
            length--;
        }
        if (length > 0) {
            this.pageStart = (ret[length - 1] as any)[this.props.sortField];
        }
        setAtomValue(this.atomIsLoading, false);
        let items = getAtomValue(this.atomItems);
        let newItems = this.pageStart === undefined || items === undefined ? ret : [...items, ...ret];
        setAtomValue(this.atomItems, newItems);
    }

    async startLoad() {
        this.canLoad = true;
        setAtomValue(this.atomAllLoaded, false);
        await this.load();
    }

    async load() {
        if (this.canLoad === false) return;
        let allLoaded = getAtomValue(this.atomAllLoaded);
        if (allLoaded === true) return;
        let { pageSize, pageMoreSize } = this.props;
        if (pageSize === undefined) pageSize = 20;
        if (this.pageStart === undefined) {
            await this.query(pageSize);
        }
        else {
            await this.query(pageMoreSize ?? pageSize);
        }
    }

    removeItem(item: R) {
        let items = getAtomValue(this.atomItems);
        let index = items.findIndex(v => v === item);
        if (index >= 0) {
            items.splice(index, 1);
            setAtomValue(this.atomItems, [...items]);
        }
    }
}

class MoreUqQuery<P, R> extends MoreItems<P, R> {
    private uqQuery: UqQuery<P, R>;
    constructor(uqQuery: UqQuery<P, R>, props: PropsMore<P>) {
        super(props);
        this.uqQuery = uqQuery;
    }

    protected override async queryCall(valuesParam: P, pageStart: any, pageSize: number): Promise<R[]> {
        let ret = await this.uqQuery.page(valuesParam, pageStart, pageSize);
        let { $page } = ret as any;
        return $page;
    }
}

class MoreQuery<P, R> extends MoreItems<P, R> {
    private queryMore: QueryMore;
    constructor(queryMore: QueryMore, props: PropsMore<P>) {
        super(props);
        this.queryMore = queryMore;
    }

    protected override async queryCall(valuesParam: P, pageStart: any, pageSize: number): Promise<R[]> {
        let ret = await this.queryMore(valuesParam, pageStart, pageSize);
        return ret;
    }
}
