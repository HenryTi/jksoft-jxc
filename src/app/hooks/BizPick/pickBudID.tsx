import { BizBud, BudID } from "app/Biz";
import { FormContext, PageQueryMore } from "app/coms";
import { EntityStore } from "app/tool";
import { useRef, useState } from "react";
import { Modal, useModal } from "tonwa-app";
import { ParamGetIDList } from "uqs/UqDefault";
import { BudEditing, ViewSpecAtomBold } from "..";
import { RowColsSm, ViewAtomTitles, ViewShowBuds } from "../tool";
import { SearchBox } from "tonwa-com";

export async function pickBudID(modal: Modal, budEditing: BudEditing) {
    return await modal.open(<PagePickBudID budEditing={budEditing} />);
}

export async function pickBudIDinFormContext(modal: Modal, formContext: FormContext, bud: BizBud) {
    let budEditing = new BudEditing(formContext, bud);
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
    const cnRow = ' px-3 py-2 cursor-pointer ';
    return <div className={cnRow}>
        <div>
            <ViewSpecAtomBold id={id} store={store} />
            <ViewAtomTitles id={id} store={store} />
        </div>
        <RowColsSm>
            <ViewShowBuds id={id} store={store} />
        </RowColsSm>
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
    async function onItemSelect(item: any) {
        modal.close(item);
    }
    return <PageQueryMore header={caption}
        query={store.query}
        ViewItem={ViewItem}
        sortField="id"
        param={param}
        onItemSelect={onItemSelect}
    >
        <SearchBox onSearch={onSearch} allowEmptySearch={true}
            className="px-3 py-1 border-bottom"
            size="sm"
            placeholder={caption + ' 编号，名称'} />
    </PageQueryMore>;
}
