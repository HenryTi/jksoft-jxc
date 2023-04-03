import { PageQueryMore } from "app/coms";
import { useUqApp } from "app/UqApp";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { GenProps } from "app/tool";
import { GenReport } from "./GenReport";

export function PageReport({ Gen, children }: GenProps<GenReport> & { children?: ReactNode }) {
    const uqApp = useUqApp();
    const gen = uqApp.objectOf(Gen);
    const { caption, QueryReport: ReportQuery, sortField, ViewItem, onItemClick } = gen;
    const navigate = useNavigate();
    gen.navigate = navigate;
    let param = {};
    return <PageQueryMore
        header={caption}
        param={param}
        query={ReportQuery}
        sortField={sortField}
        ViewItem={ViewItem}
        onItemClick={onItemClick}>
        {children}
    </PageQueryMore>
}
