import { PageQueryMore } from "app/coms";
import { useUqApp } from "app/UqApp";
import { useModal } from "tonwa-app";
import { ReturnSearchAtomAssigns$page, ReturnSearchAtomAssignsBuds } from "uqs/UqDefault";
import { GenProps } from "app/tool";
import { PageAssignEdit } from "./PageAssignEdit";
import { GenAssign } from "./GenAssign";
import React from "react";

export function PageAssign<P extends GenAssign>({ Gen }: GenProps<P>) {
    const { openModal } = useModal();
    const uqApp = useUqApp();
    const gen = uqApp.objectOf(Gen);
    const { caption, searchAtoms, bizEntityName } = gen;
    function ViewItem({ value }: { value: ReturnSearchAtomAssignsBuds & { buds: { [bud: string]: any } }; }) {
        let { buds } = value;
        let { bizAssigns } = gen;
        return <div className="px-3 py-2">
            <div>{JSON.stringify(value)}</div>
            <div className="d-flex align-items-center">
                {
                    bizAssigns.map((v, index) => {
                        let { caption, name } = v;
                        let value = buds[name];
                        return <React.Fragment key={index}>
                            <span className="me-2">{caption ?? name}:</span>
                            {
                                value !== undefined ?
                                    <b className="fs-5">{value}</b>
                                    :
                                    <span className="text-muted small">(无)</span>
                            }
                        </React.Fragment>;
                    })
                }
            </div>
        </div>;
    }
    async function onItemClick(value: ReturnSearchAtomAssigns$page & { buds: { [atom: string]: any } }) {
        let ret = await openModal(<PageAssignEdit Gen={Gen} value={value} />);
        if (ret === undefined) return;
        value.buds = ret;
    }
    // pageSize={20}
    // pageMoreSize={5}
    return <PageQueryMore header={caption}
        query={searchAtoms}
        param={{}}
        sortField="id"
        ViewItem={ViewItem}
        onItemClick={onItemClick}
    >
        <div className="p-3 tonwa-bg-gray-3">{caption}</div>
        <div className="p-3 tonwa-bg-gray-2">{bizEntityName} {caption}</div>
    </PageQueryMore>;
}