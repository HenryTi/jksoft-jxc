import { BizBud, EntityFork } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { ViewBudEmpty } from "app/hooks/tool";
import { useEffect, useState } from "react";
import { UqExt } from "uqs/UqDefault";

export function ViewSpecId({ id }: { id: number; }) {
    const { uq, biz } = useUqApp();
    const idValue = cache.get(id);
    const [value, setValue] = useState(idValue);
    useEffect(() => {
        (async function () {
            if (id === undefined || id === null) return;
            let obj = cache.get(id);
            if (obj === undefined) {
                try {
                    obj = await idSpec(uq, id);
                }
                catch (err) {
                    console.error(err);
                }
                finally {
                    if (obj === undefined) obj = null;
                }
            }
            setValue(obj);
        })();
    }, [id]);
    if (id === undefined || value === undefined) return <ViewBudEmpty />;
    if (value === null) return <>null</>;
    const { phrase } = value;
    const props = value.value as [number, number | string][];
    const entitySpec = biz.entityFromId<EntityFork>(phrase);
    const { noBud, exBud, showKeys } = entitySpec;
    function ViewContent({ bud }: { bud: BizBud; }) {
        return <>{(props.find(v => v[0] === bud.id))[1]}</>;
    }
    if (exBud !== undefined) return <ViewContent bud={exBud} />;
    if (noBud !== undefined) return <ViewContent bud={noBud} />;
    return <>{showKeys.map(key => {
        return (props.find(v => v[0] === key.id))[1];
    }).join(',')}</>;
}

const cachePromise: { [id: number]: Promise<any> } = {};
async function idSpec(uq: UqExt, id: number) {
    let obj = cache.get(id);
    if (obj === undefined) {
        let promise = cachePromise[id];
        if (promise === undefined) {
            promise = uq.GetSpec.query({ id });
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
                if (prop.id === id) {
                    obj = prop;
                    break;
                }
            }
            cache.add(id, obj === undefined ? null : obj);
        }
        else {
            cache.add(id, null);
        }
        delete cachePromise[id];
    }
    return obj;
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
