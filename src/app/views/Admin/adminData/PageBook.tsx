import { BizBud, EntityBook, EntityCombo } from "app/Biz";
import { PageQueryMore } from "app/coms";
import { useUqApp } from "app/UqApp";
import { Page, useModal } from "tonwa-app";
import { ButtonAsync, FA } from "tonwa-com";
import { AdminStore } from "./AdminStore";
import { RowCols, RowColsSm } from "app/hooks/tool";
import { BizPhraseType } from "uqs/UqDefault";
import { ViewBud } from "app/hooks";

export function PageBook({ entity }: { entity: EntityBook; }) {
    const modal = useModal();
    const { uq } = useUqApp();
    const { caption, name, buds } = entity;
    function ViewBudItem({ bud }: { bud: BizBud; }) {
        const { caption, name } = bud;
        function onClick() {
            const store = new AdminStore(modal, entity)
            modal.open(<PageData bud={bud} store={store} />);
        }
        return <div className="px-3 py-2 border-bottom d-flex align-items-center">
            <div>
                <FA name="file" className="me-3 text-info" /> {caption ?? name}
            </div>
            <div className="flex-fill" />
            <div>
                <button className="btn btn-link" onClick={onClick}>
                    <FA name="angle-right" />
                </button>
            </div>
        </div>;
    }
    return <Page header={caption ?? name}>
        {buds.map(v => <ViewBudItem key={v.id} bud={v} />)}
    </Page>;
}

function budCaption(bud: BizBud) {
    const { entity, caption, name } = bud;
    const { caption: entityCaption, name: entityName } = entity;
    return `${entityCaption ?? entityName}.${caption ?? name}`;
}

function PageData({ bud, store }: { bud: BizBud; store: AdminStore; }) {
    const modal = useModal();
    const header = budCaption(bud);
    const { biz } = store;
    async function onClear() {
        await modal.open(<PageClear bud={bud} />);
        modal.close();
        modal.open(<PageData bud={bud} store={store} />);
    }
    const right = <button className="btn btn-sm btn-info me-2" onClick={onClear}>
        清零
    </button>;
    function ViewItem({ value: { i, phrase, value } }: { value: { i: number; phrase: number; value: number; } }) {
        const cnRows = '  row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 ';
        return <div className="px-3 py-2 d-flex">
            <div className="flex-fill">
                <div>ID: {i}</div>
                <div className={cnRows}>
                    {view()}
                </div>
            </div>
            <div className="align-self-end fs-larger w-6c text-end">{value}</div>
        </div>;
        function view() {
            let entity = biz.entityFromId(phrase);
            if (entity === undefined) {
                return null;
            }
            const valColl = store.budsColl[i];
            if (valColl === undefined) return null;
            switch (entity.bizPhraseType) {
                default: return null;
                case BizPhraseType.combo:
                    let { keys } = entity as EntityCombo;
                    return <> {
                        keys.map(key => {
                            const { id } = key;
                            return <div key={id}>
                                <ViewBud bud={key} value={valColl[id]} store={store} />
                            </div>
                        })
                    }</>;
            }
        }
    }
    return <PageQueryMore header={header} right={right}
        query={store.load}
        param={{ bud: bud.id }}
        sortField="i"
        pageSize={100}
        ViewItem={ViewItem}
    >
    </PageQueryMore>;
}

function PageClear({ bud }: { bud: BizBud; }) {
    const modal = useModal();
    const { uq } = useUqApp();
    async function onClear() {
        await uq.ClearBook.submit({ bud: bud.id });
        modal.close();
        const header = budCaption(bud);
        modal.open(<Page header={header}>
            <div className="p-3 text-danger">
                账本[{header}]已经清零!
            </div>
        </Page>);
    }
    return <Page header="账本清零">
        <div className="p-3 border rouned-3 text-danger">
            !!! 清零会破坏数据平衡。仅供调试数据使用 !!!
        </div>
        <div className="p-3">
            <ButtonAsync className="btn btn-danger" onClick={onClear}>我确认清零</ButtonAsync>
        </div>
    </Page>;
}
