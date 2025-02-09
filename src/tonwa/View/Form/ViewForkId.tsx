import { useEffect, useState } from "react";
import { useUqApp } from "app/UqApp";
import { UqExt } from "uqs/UqDefault";
import { BizBud, EntityFork } from "../../Biz";
import { ViewBudEmpty } from "../Common";

export function ViewForkId({ id }: { id: number; }) {
    const { uq, biz } = useUqApp();
    const idObj = cache.get(id);
    const idArr = getIdArr(idObj);
    const [value, setValue] = useState(idArr);
    useEffect(() => {
        (async function () {
            if (id === undefined || id === null) return;
            let obj = cache.get(id);
            if (obj === undefined) {
                try {
                    obj = await idFork(uq, id);
                }
                catch (err) {
                    console.error(err);
                }
                finally {
                    if (obj === undefined) obj = null;
                }
            }
            else {
                obj = getIdArr(obj);
            }
            setValue(obj);
        })();
    }, [id]);
    if (id === undefined || value === undefined) return <ViewBudEmpty />;
    if (value === null) return <>/</>;

    function viewFork(value: any) {
        const { phrase } = value;
        const props = value.value as [number, number | string][];
        const entitySpec = biz.entityFromId<EntityFork>(phrase);
        const { noBud, exBud, showKeys } = entitySpec;
        let content: any;
        function viewContent(bud: BizBud) {
            return <>{(props.find(v => v[0] === bud.id))[1]}</>;
        }
        if (exBud !== undefined) content = viewContent(exBud);
        else if (noBud !== undefined) content = viewContent(noBud);
        else content = showKeys.map(key => {
            return (props.find(v => v[0] === key.id))[1];
        }).join(',');
        return content;
    }

    let contents: any[] = [];
    let { length } = value;
    contents.push(value[0].value[1]);
    for (let i = length - 1; i > 0; i--) {
        let v = value[i];
        contents.push(<span key={v.id}>{viewFork(v)}<small className="text-body-tertiary">/</small></span>);
    }
    return <>{contents}</>;
}

const cachePromise: { [id: number]: Promise<any> } = {};
async function idFork(uq: UqExt, id: number) {
    let obj = cache.get(id);
    if (obj === undefined) {
        let promise = cachePromise[id];
        if (promise === undefined) {
            promise = uq.GetFork.query({ id });
            cachePromise[id] = promise;
        }
        let ret: any;
        try {
            ret = await promise;
        }
        catch (err) {
            console.error(err);
        }
        if (ret !== undefined) {
            for (let prop of ret.props) {
                const { id: forkId } = prop;
                if (forkId === id) {
                    obj = prop;
                }
                cache.add(forkId, prop === undefined ? null : prop);
            }
        }
        else {
            cache.add(id, null);
        }
        delete cachePromise[id];
    }
    return getIdArr(obj);
}

function getIdArr(obj: any) {
    if (obj === undefined) return undefined;
    let arr: any[] = [obj];
    for (; ;) {
        let { base } = obj;
        if (base === 0) break;
        obj = cache.get(base);
        if (obj === undefined) break; // continue;// debugger;
        arr.unshift(obj);
    }
    return arr;
}

class Cache {
    static max = 10000;
    private count = 0;
    private coll: { [id: number]: [number, number, any] } = {};

    get(id: number): any {
        let obj = this.coll[id];
        if (obj === undefined) return undefined;
        obj[0]++;
        return obj[2];
    }

    add(id: number, obj: any) {
        if (this.count >= Cache.max) {
            this.cutHalf();
        }
        this.coll[id] = [1, id, obj];
        this.count++;
    }

    private cutHalf() {
        let arr = Object.values(this.coll);
        arr.sort((a, b) => b[0] - a[0]);
        let half = Math.floor(arr.length / 2);
        for (let i = 0; i < half; i++) {
            let [, id,] = arr[i];
            delete this.coll[id];
        }
        this.count -= half;
    }
}

const cache = new Cache();
