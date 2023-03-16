import { NavigationType } from "react-router-dom";

interface CacheItem<T = any> {
    prev: CacheItem;
    scrollTop: number;
    data: T;
    pathname: string;
}

export class PageCache {
    private p: CacheItem;
    onNav(navAction: NavigationType, pathname: string) {
        let prev: CacheItem;
        switch (navAction) {
            case NavigationType.Push:
                prev = this.p;
                break;
            case NavigationType.Pop:
                this.p = this.p?.prev;
                if (this.p !== undefined) return;
                break;
            case NavigationType.Replace:
                prev = this.p?.prev;
                break;
        }
        this.p = {
            prev,
            scrollTop: undefined,
            data: undefined,
            pathname,
        }
    }
    setData<T = any>(data: T) {
        if (this.p === undefined) return;
        this.p.data = data;
    }
    setScrollTop(top: number) {
        if (this.p === undefined) return;
        this.p.scrollTop = top;
    }
    getCache<T>(): CacheItem<T> {
        return this.p;
    }
    getPrev<T>(): CacheItem<T> {
        return this.p?.prev;
    }
    getData<T>(): T {
        return this.p?.data;
    }
    getPrevData<T>(): T {
        return this.p?.prev?.data;
    }
}
