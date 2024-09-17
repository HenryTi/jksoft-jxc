import { BizBud, BudID, EntityAtom } from "app/Biz";
import { PageQueryMore } from "app/coms";
import { EntityStore } from "app/tool";
import { useRef, useState } from "react";
import { Modal, Page, useModal } from "tonwa-app";
import { Atom, ParamGetIDList } from "uqs/UqDefault";
import { BudEditing, ViewBud, ViewSpecAtomBold } from "..";
import { ViewAtomTitles, ViewShowBuds } from "../tool";
import { SearchBox } from "tonwa-com";

export async function pickBudID(modal: Modal, budEditing: BudEditing) {
    return await modal.open(<PagePickBudID budEditing={budEditing} />);
}

class BudIDStore extends EntityStore {
    constructor(modal: Modal, bud: BizBud) {
        super(modal, bud.entity);
    }
    query = async (param: any, pageStart: any, pageSize: number): Promise<any[]> => {
        const { $page, props, atoms, specs } = await this.uq.GetIDList.page(param, pageStart, pageSize);
        this.cacheIdAndBuds(props, atoms, specs);
        return $page;
    }
}

function ViewID({ id, store }: { id: number; store: EntityStore; }) {
    const cnRow = ' px-3 py-2 ';
    return <div className={cnRow}>
        <div>
            <ViewSpecAtomBold id={id} store={store} />
            <ViewAtomTitles id={id} store={store} />
        </div>
        <ViewShowBuds id={id} store={store} />
    </div>;
}

function PagePickBudID({ budEditing }: { budEditing: BudEditing; }) {
    const { bizBud } = budEditing;
    const modal = useModal();
    const { caption, budDataType, tie: budTie } = bizBud;
    const budID = budDataType as BudID;
    const { current: store } = useRef(new BudIDStore(modal, bizBud));
    const defaultParam: ParamGetIDList = {
        phrase: budID.entityID.id,
        tie: undefined,
        i: undefined,
        searchKey: undefined
    };
    if (budTie !== undefined) {
        const { tie, on } = budTie;
        defaultParam.tie = tie.id;
        defaultParam.i = budEditing.calcValue(on) as number;
    }
    const [param, setParam] = useState<ParamGetIDList>(defaultParam);
    function ViewItem({ value }: { value: any; }) {
        return <ViewID id={value.id} store={store} />;
    }
    async function onSearch(key: string) {
        setParam({
            ...param,
            searchKey: key,
        });
    }
    return <PageQueryMore header={caption}
        query={store.query}
        ViewItem={ViewItem}
        sortField="id"
        param={param}
    >
        <SearchBox onSearch={onSearch} allowEmptySearch={true}
            className="px-3 py-1 border-bottom"
            size="sm"
            placeholder={caption + ' 编号，名称'} />
    </PageQueryMore>;
}

function ViewBudTie({ bud }: { bud: BizBud; }) {
    const { tie: budTie } = bud;
    if (budTie === undefined) return null;
    const { tie, on } = budTie;
    return <div>
        <div>tie: {tie.id}</div>
        <div>on: {on}</div>
    </div>;
}
