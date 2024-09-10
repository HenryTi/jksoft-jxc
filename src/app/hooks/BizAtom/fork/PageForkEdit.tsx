import { Page, useModal } from "tonwa-app";
import { ViewIDEdit, ViewIDBuds } from "../useBizAtomView";
import { ForkStore, ViewForkTop } from "./ForkStore";
import { RowCols, ViewIDLabel } from "app/hooks/tool";
import { EditAtomField, ViewBud, ViewBudRowProps } from "app/hooks";
import { FA, Sep } from "tonwa-com";

const cnColumns2 = 'gx-0 row row-cols-1 row-cols-md-2 row-cols-lg-3';

export function PageForkEdit({ store, value }: { store: ForkStore; value: any; }) {
    const modal = useModal();
    const { uq, entity } = store;
    const { id, no, ex, buds } = value;
    const { caption, keys, fork } = entity;
    let vTitle: any;
    if (ex) {
        vTitle = <div><b>{ex}</b> {no}</div>;
    }
    else if (no) {
        vTitle = <div><b>{no}</b></div>;
    }
    let vRight: any;
    if (fork !== undefined) {
        vRight = <button className="btn btn-sm btn-success me-2" onClick={() => modal.open(<PageEdit />)}>
            <FA name="pencil" />
        </button>;
    }

    let vTop = <div className="p-3 tonwa-bg-gray-2">
        <ViewForkTop store={store} />
        {vTitle}
        <div><ViewIDLabel />{id}</div>
        <RowCols>
            {keys.map(v => {
                const { id: budId } = v;
                return <ViewBud key={budId} bud={v} value={buds[budId]} />
            })}
        </RowCols>
    </div>;

    return <Page header={caption} right={vRight}>
        {vTop}
        <ViewIDBuds entity={entity} value={value} />
    </Page>;

    function PageEdit() {
        let { caption, exBud, noBud } = entity;
        const fieldRows: ViewBudRowProps[] = [
            { name: 'id', label: <ViewIDLabel />, readonly: true, type: 'number', },
        ];
        if (noBud !== undefined) {
            fieldRows.push({ name: 'no', label: '编号', readonly: true, type: 'string', });
        }
        if (exBud !== undefined) {
            fieldRows.push({ name: 'ex', label: '名称', type: 'string', });
        }
        async function saveField(id: number, name: string, value: string | number) {
            await uq.SaveBudValue.submit({
                phraseId: exBud.id,
                id,
                int: undefined,
                dec: undefined,
                str: value as string,
            });
        }
        const vFieldRows = <div className={cnColumns2}>
            {
                fieldRows.map((v, index) => {
                    const { name } = v;
                    return <div key={index} className="col">
                        <EditAtomField key={index} {...v} id={id} value={value[name]} saveField={saveField} saveBud={undefined} labelSize={0} />
                        <Sep />
                    </div>;
                })
            }
        </div>;
        return <Page header={caption + ' - 详情'}>
            {vFieldRows}
            <ViewIDEdit entity={entity} value={value} />
        </Page>;
    }
}
