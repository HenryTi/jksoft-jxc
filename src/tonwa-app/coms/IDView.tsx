import { useEffect, useState } from "react";
import { Uq } from "tonwa-uq";

interface Props<T> {
    id: number;
    uq: Uq;
    Template?: (props: { value: T; }) => JSX.Element;
}

export function IDView<T>({ id, uq, Template }: Props<T>) {
    /*
    let { data: value } = useQuery(['IDView', id], async () => {
        return await uq.idObj(id);
    }, { cacheTime: 0, refetchOnWindowFocus: false });
    */
    let obj = uq.idCache<any>(id);
    const [value, setValue] = useState(obj);
    useEffect(() => {
        (async function () {
            if (id === undefined || id === null) return;
            if (value !== undefined) return;
            let ret = await uq.idObj(id);
            setValue(ret);
        })();
    }, [id]);
    if (id === undefined || id === null) return null;
    if (value === undefined) return null;
    if (Template) {
        return <Template value={value} />;
    }
    return <>{JSON.stringify(value)}</>;
}
