import { NavigationType } from "react-router-dom";

interface CacheItem<T = any> {
    prev: CacheItem;
    scrollTop: number;
    data: T;
    pathname: string;
}

export class PageCache {
    private p: CacheItem;
    // private readonly map: Map<string, CacheItem> = new Map();
    // private latest: { url: string; cacheItem: CacheItem; };
    /*
    create(url: string) {
        let uc = this.map.get(url);
        if (!uc) {
            this.map.set(url, { scrollTop: undefined, data: undefined, prevUrl: this.latest?.url });
        }
    }
    
    setScrollTop(url: string, scrollTop: number) {
        let cacheItem = this.map.get(url);
        if (cacheItem) {
            cacheItem.scrollTop = scrollTop;
        }
        else {
            cacheItem = { scrollTop, data: undefined, prevUrl: this.latest?.url };
            this.map.set(url, cacheItem);
        }
        this.latest = { url, cacheItem };
    }
    */
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
    /*
    getData<T = any>(url: string): T {
        let ret = this.map.get(url);
        return ret?.data;
    }
    */
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
