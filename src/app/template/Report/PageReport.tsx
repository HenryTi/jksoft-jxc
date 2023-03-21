import { PageQueryMore } from "app/coms";
import { useUqApp } from "app/UqApp";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { PartProps } from "../Part";
import { PartReport } from "./PartReport";

export function PageReport({ Part, children }: PartProps<PartReport> & { children?: ReactNode }) {
    const uqApp = useUqApp();
    const part = uqApp.objectOf(Part);
    const { caption, QueryReport: ReportQuery, sortField, ViewItem, onItemClick } = part;
    const navigate = useNavigate();
    part.navigate = navigate;
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
