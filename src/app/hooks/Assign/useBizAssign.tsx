import { EntityAssign } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { useParams } from "react-router-dom";
import { Page } from "tonwa-app";
import { from62, to62 } from "tonwa-com";
import { RowMed, useAtomBudsSearch } from "../BudSelect";
import { useQuery } from "react-query";
import { PageQueryMore } from "app/coms";
import { ViewAtom } from "../BizAtom";
import { FocusEvent, FocusEventHandler, MouseEvent, useState } from "react";

function assignInPath(phrase: number | string) {
    if (typeof phrase === 'string') {
        if (phrase !== ':assign') debugger;
        return phrase;
    }
    return to62(phrase);
}

interface UseBizAssingReturn {
    page: JSX.Element;
}

export function useBizAssign(): UseBizAssingReturn {
    const { assign } = useParams();
    let phraseId = from62(assign);
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const entity = biz.entityIds[phraseId] as EntityAssign;

    return {
        page: <PageAssign />
    }
    function PageAssign() {
        const { name, caption, atoms } = entity;
        const [searchParam, setSearchParam] = useState({ key: undefined as string });
        let atomBudsSearch = useAtomBudsSearch({ entity: atoms[0].name, budNames: undefined });
        async function searchAtoms(param: any, pageStart: any, pageSize: number) {
            let ret = await atomBudsSearch.search(param, pageStart, pageSize);
            return ret;
        }

        function ViewItem({ value }: { value: RowMed }) {
            function onBlur(evt: FocusEvent<HTMLInputElement>) {
                let { value } = evt.currentTarget;
            }
            return <div className="px-3 py-2 d-flex">
                <div className="flex-grow-1">
                    <ViewAtom value={value.atom} />
                </div>
                {entity.titles.map((v, index) => <input key={index} onBlur={onBlur}
                    className="w-8c form-control ms-3 text-end" type="number" />)}
            </div>;
        }
        const titleCaptions = entity.titles.map(v => v.caption ?? v.name);
        return <PageQueryMore header={caption ?? name}
            query={searchAtoms}
            param={searchParam}
            sortField="id"
            ViewItem={ViewItem}
        >
            <div className="px-3 my-3">{entity.atoms.map(v => (v.caption ?? v.name)).join(', ')}</div>
            <div className="px-3 my-3">{entity.titles.map(v => (v.caption ?? v.name)).join(', ')}</div>
            <div className="d-flex px-3">
                <div className="flex-grow-1"></div>
                {titleCaptions.map((v, index) => <div key={index} className="w-8c text-end ms-3">{v}</div>)}
            </div>
        </PageQueryMore>;
    }
}

export function pathAssign(phrase: number | string) {
    return `assign/${assignInPath(phrase)}`;
}
