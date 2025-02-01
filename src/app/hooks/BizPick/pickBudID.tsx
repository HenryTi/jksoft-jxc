import { BizBud, BudID, EntityAtom, StoreEntity } from "tonwa";
import { FormContext, PageQueryMore } from "app/coms";
import { useRef, useState } from "react";
import { Modal, useModal } from "tonwa-app";
import { BizPhraseType, ParamGetIDList } from "uqs/UqDefault";
import { BudEditing, ViewForkAtomBold } from "..";
import { RowColsSm, ViewAtomTitles, ViewShowBuds } from "../tool";
import { FA, SearchBox } from "tonwa-com";
import { AtomStore } from "../BizAtom";

export async function pickBudID(modal: Modal, budEditing: BudEditing) {
    return await modal.open(<PagePickBudID budEditing={budEditing} />);
}
/*
class BudIDStore extends EntityStore {
    constructor(modal: Modal, bud: BizBud) {
        super(modal, bud.entity);
    }
    query = async (param: any, pageStart: any, pageSize: number): Promise<any[]> => {
        const { $page, props, atoms, forks } = await this.uq.GetIDList.page(param, pageStart, pageSize);
        this.cacheIdAndBuds(props, atoms, forks);
        return $page;
    }
}
*/
function ViewID({ id, store }: { id: number; store: StoreEntity; }) {
    const cnRow = ' px-3 py-2 cursor-pointer ';
    return <div className={cnRow}>
        <div>
            <ViewForkAtomBold id={id} store={store} />
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
    const { budDataType, tie: budTie } = bizBud;
    const budID = budDataType as BudID;
    const { entityID } = budID;
    let [entityAtom, setEntityAtom] = useState(entityID);
    const [searchKey, setSearchKey] = useState<string>();
    const { caption } = entityAtom;
    const { current: store } = useRef(new AtomStore(modal, entityID));
    const defaultParam: ParamGetIDList = {
        phrase: entityID.id,
        tie: undefined,
        i: undefined,
        searchKey: searchKey
    };
    if (budTie !== undefined) {
        const { tie, on } = budTie;
        defaultParam.tie = tie.id;
        defaultParam.i = budEditing.calcValue(on) as number;
    }
    const [param, setParam] = useState<ParamGetIDList>(defaultParam);
    let vTree: any;
    if (entityID.bizPhraseType === BizPhraseType.atom) {
        vTree = <ViewAtomTree eAtom={entityAtom} onAtomChanged={onAtomChanged} />;
    }
    function onAtomChanged(eAtom: EntityAtom) {
        entityAtom = eAtom;
        setEntityAtom(eAtom);
        // setParam({ ...param, searchKey });
        onSearch(searchKey ?? '');
    }
    function ViewItem({ value }: { value: any; }) {
        return <ViewID id={value.id} store={store} />;
    }
    async function onSearch(key: string) {
        setSearchKey(key);
        setParam({
            ...param,
            phrase: entityAtom.id,
            searchKey: key,
        });
    }
    async function onItemSelect(item: any) {
        modal.close(item);
    }
    return <PageQueryMore header={caption}
        query={store.searchItems}
        ViewItem={ViewItem}
        sortField="id"
        param={param}
        onItemSelect={onItemSelect}
    >
        {vTree}
        <SearchBox onSearch={onSearch} allowEmptySearch={true}
            className="px-3 py-1 border-bottom"
            size="sm"
            placeholder={caption + ' 编号，名称'} />
    </PageQueryMore>;
}

function ViewAtomTree({ eAtom, onAtomChanged }: { eAtom: EntityAtom; onAtomChanged: (eAtom: EntityAtom) => void }) {
    const { superClass, subClasses } = eAtom;
    let vSuper: any, vSubs: any;
    const vSep = <FA className="mx-2" name="angle-right" />;
    if (superClass !== undefined) {
        vSuper = <><ViewAtomEntity atomEntity={superClass} /> {vSep} </>;
    }
    if (subClasses.length > 0) {
        vSubs = <> {vSep} {subClasses.map(v => <ViewAtomEntity key={v.id} atomEntity={v} />)}</>;
    };
    function ViewAtomEntity({ atomEntity }: { atomEntity: EntityAtom; }) {
        function onClick() {
            onAtomChanged(atomEntity);
        }
        return <button className="btn btn-sm btn-link" onClick={onClick}>{atomEntity.caption}</button>
    }
    if (vSuper === undefined && vSubs === undefined) return null;
    return <div className="p-3 d-flex align-items-center">{vSuper} <b>{eAtom.caption}</b> {vSubs}</div>;
}
