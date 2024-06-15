import { BizBud, EntitySpec } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { ViewBudEmpty } from "app/hooks/tool";
import { useEffect, useState } from "react";

export function ViewSpecId({ id }: { id: number; }) {
    const { uq, biz } = useUqApp();
    const idValue = uq.idCache<any>(id);
    const [value, setValue] = useState(idValue);
    useEffect(() => {
        (async function () {
            if (id === undefined || id === null) return;
            let obj = uq.idCache<any>(id);
            if (obj === undefined) {
                try {
                    obj = await uq.GetSpec.query({ id });
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
    }, [id, idValue]);
    if (id === undefined || value === undefined) return <ViewBudEmpty />;
    const valueArr = (value.props as any[]);
    let val = valueArr.find(v => v.id === id);
    if (val === undefined) return <ViewBudEmpty />;
    const { phrase } = val;
    const props = val.value as [number, number | string][];
    const entitySpec = biz.entityFromId<EntitySpec>(phrase);
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
