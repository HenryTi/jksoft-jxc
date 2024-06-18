import { ReactNode } from "react";
import { Page } from "./Page";
import { FA } from "tonwa-com";

export function PageError({ children }: { children: ReactNode; }) {
    return <Page header="错误">
        <div className="p-3">
            <div className="mb-3">
                <FA name="exclamation-circle" className="text-danger me-3" />
                <span>发生错误</span>
            </div>
            <div>{children}</div>
        </div>
    </Page>
}
