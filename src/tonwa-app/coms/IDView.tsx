import { useEffect, useState } from "react";
import { Spinner } from "tonwa-com";
import { Uq } from "tonwa-uq";

interface Props<T> {
    id: number;
    uq: Uq;
    Template?: (props: { value: T; }) => JSX.Element;
}

export function IDView<T>({ id, uq, Template }: Props<T>) {
    const idValue = uq.idCache<any>(id);
    const [value, setValue] = useState(idValue);
    useEffect(() => {
        (async function () {
            if (id === undefined || id === null) return;
            let obj = uq.idCache<any>(id);
            if (obj === undefined) {
                try {
                    obj = await uq.idObj(id);
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
    if (id === undefined || id === null) return null;
    if (value === undefined) {
        return <Spinner className="text-info spinner-border-sm" />;
    }
    if (value === null) {
        return <div>id {id} is invalid</div>;
    }
    if (Template) {
        return <Template value={value} />;
    }
    return <>{JSON.stringify(value)}</>;
}
