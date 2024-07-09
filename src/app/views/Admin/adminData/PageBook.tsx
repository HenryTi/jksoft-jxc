import { BizBud, EntityBook } from "app/Biz";
import { PageQueryMore } from "app/coms";
import { useUqApp } from "app/UqApp";
import { Page, useModal } from "tonwa-app";
import { ButtonAsync, FA } from "tonwa-com";

export function PageBook({ entity }: { entity: EntityBook; }) {
    const modal = useModal();
    const { caption, name, buds } = entity;
    function ViewBudItem({ bud }: { bud: BizBud; }) {
        const { caption, name } = bud;
        function onClick() {
            modal.open(<PageData bud={bud} />);
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

function PageData({ bud }: { bud: BizBud; }) {
    const modal = useModal();
    const { uq } = useUqApp();
    const header = budCaption(bud);
    async function onClear() {
        await modal.open(<PageClear bud={bud} />);
        modal.close();
        modal.open(<PageData bud={bud} />);
    }
    const right = <button className="btn btn-sm btn-info me-2" onClick={onClear}>
        清零
    </button>;
    function ViewItem({ value: { i, value } }: { value: { i: number; value: number; } }) {
        return <div className="px-3 py-2 d-flex">
            <div>ID: {i}</div>
            <div className="flex-fill"></div>
            <div>{value}</div>
        </div>;
    }
    return <PageQueryMore header={header} right={right}
        query={uq.AdminBook}
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
