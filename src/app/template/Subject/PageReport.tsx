import { PageQueryMore } from "app/coms";
import { useUqApp } from "app/UqApp";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { GenProps } from "app/tool";
import { GenSubject } from "./GenSubject";

export function PageReport({ Gen, children }: GenProps<GenSubject> & { children?: ReactNode }) {
    const uqApp = useUqApp();
    const gen = uqApp.objectOf(Gen);
    const { caption, searchSubjectAtom, sortField, ViewItem, pathStorageHistory } = gen;
    const navigate = useNavigate();
    async function onItemClick(item: any): Promise<void> {
        navigate(`../${pathStorageHistory}/${item.atom}`, { state: item });
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
