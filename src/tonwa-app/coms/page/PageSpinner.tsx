import { Spinner } from "tonwa-com";
import { PageBase } from "./Page";

export function PageSpinner({ header }: { header?: string; }) {
    const content = <div className=" tonwa-band-container bg-white d-flex justify-content-center">
        <Spinner className="m-5 text-center text-info" />
    </div>;

    if (header === undefined) return content;
    return <PageBase header={header}>
        {content}
    </PageBase>
}
