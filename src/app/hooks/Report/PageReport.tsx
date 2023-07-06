import { PageQueryMore } from "app/coms";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { pathSubjectHistory, useSubject } from "./useSubject";
import { EnumSubject } from "uqs/UqDefault";

export function PageReport({ subject, children, caption, sortField }: {
    subject: EnumSubject;
    caption: string;
    sortField: string;
    children?: ReactNode;
}) {
    const gen = useSubject({ subject });
    const { searchSubjectAtom, ViewItem } = gen;
    const navigate = useNavigate();
    async function onItemClick(item: any): Promise<void> {
        navigate(`../${pathSubjectHistory(subject)}/${item.atom}`, { state: item });
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
