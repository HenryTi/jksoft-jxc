import { useState } from "react";
import { useEffectOnce } from "tonwa-com";
import { PageSpinner } from "./PageSpinner";

export interface PageLoaderProps {
    loader: () => Promise<void>;
    page: JSX.Element;
}

export function PageLoader({ loader, page }: PageLoaderProps) {
    const [loading, setLoading] = useState(true);
    useEffectOnce(() => {
        (async function () {
            await loader();
            setLoading(false);
        })();
    });
    if (loading === true) return <PageSpinner />;
    return page;
}
