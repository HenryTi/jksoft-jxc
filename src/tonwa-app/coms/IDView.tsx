import { useEffect, useState } from "react";
import { Uq } from "tonwa-uq";

interface Props<T> {
    id: number;
    uq: Uq;
    Template?: (props: { value: T; }) => JSX.Element;
}

export function IDView<T>({ id, uq, Template }: Props<T>) {
    const [value, setValue] = useState(uq.idCache<any>(id));
    useEffect(() => {
        (async function () {
            if (id === undefined || id === null) return;
            let obj = uq.idCache<any>(id);
            if (obj === undefined) {
                obj = await uq.idObj(id);
            }
            setValue(obj);
        })();
    }, [id]);
    if (id === undefined || id === null) return null;
    if (value === undefined) return null;
    if (value === null) {
        return <div>id {id} is invalid</div>;
    }
    if (Template) {
        return <Template value={value} />;
    }
    return <>{JSON.stringify(value)}</>;
}
