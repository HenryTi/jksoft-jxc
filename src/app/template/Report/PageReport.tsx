import { PageQueryMore } from "app/coms";
import { useUqApp } from "app/UqApp";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { GenProps } from "app/tool";
import { GenReport } from "./GenReport";

export function PageReport({ Gen, children }: GenProps<GenReport> & { children?: ReactNode }) {
    const uqApp = useUqApp();
    const gen = uqApp.objectOf(Gen);
    const { caption, searchSubjectAtom, sortField, ViewItem, pathStorageHistory } = gen;
    const navigate = useNavigate();
    //gen.navigate = navigate;
    async function onItemClick(item: any): Promise<void> {
        navigate(`../${pathStorageHistory}/${item.atom}`);
    }
    let param = {};
    return <PageQueryMore
        header={caption}
        param={param}
        query={searchSubjectAtom}
        sortField={sortField}
        ViewItem={ViewItem}
        onItemClick={onItemClick}>
        {children}
    </PageQueryMore>
}
