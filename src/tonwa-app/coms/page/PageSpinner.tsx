import { Spinner } from "tonwa-com";
import { PageBase } from "./Page";

export function PageSpinner({ header }: { header?: string; }) {
    let content = <ViewSpinner />;
    if (header === null) return content;
    if (header === undefined) header = '...';
    return <PageBase header={header} back="none">
        {content}
    </PageBase>
}

export function ViewSpinner() {
    return <div className=" tonwa-band-container bg-white d-flex justify-content-center">
        <Spinner className="m-5 text-center text-info" />
    </div>;
}