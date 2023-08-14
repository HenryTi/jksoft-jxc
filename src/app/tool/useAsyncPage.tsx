import { useCallback, useState } from "react";
import { PageSpinner } from "tonwa-app";
import { useEffectOnce } from "tonwa-com";

export function useAsyncPage<T = any>(fn: () => Promise<T>, P: (props: { result: T; }) => JSX.Element): JSX.Element {
    const [result, setResult] = useState<T>();
    let callback = useCallback(fn, []);
    useEffectOnce(() => {
        (async () => {
            let r = await callback();
            setResult(r);
        })();
    });
    if (result === undefined) return <PageSpinner />;
    return <P result={result} />;
}
