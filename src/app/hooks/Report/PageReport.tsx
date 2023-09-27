import { PageQueryMore } from "app/coms";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { pathSubjectHistory, useSubject } from "./useSubject";
// import { EnumTitle } from "uqs/UqDefault";

export function PageReport({ title, bud, children, caption, sortField }: {
    title: string; // EnumTitle;
    bud: string;
    caption: string;
    sortField: string;
    children?: ReactNode;
}) {
    const gen = useSubject({ title, bud });
    const { searchSubjectAtom, ViewItem } = gen;
    const navigate = useNavigate();
    async function onItemClick(item: any): Promise<void> {
        navigate(`../${pathSubjectHistory(title)}/${item.id}`, { state: item });
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
