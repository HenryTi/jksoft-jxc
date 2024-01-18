import { useUqApp } from "app";
import { EntityAtom } from "app/Biz";
import { Page, useModal } from "tonwa-app";
import { CheckAsync } from "tonwa-com";

const cnRowCols = ' row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 ';
const cnCommon = '  ';
const cnItem = cnCommon + ' p-3 cursor-pointer border rounded-2 bg-white ';
export function PageSelectAtomEntity({ outerId, ids }: { outerId: number, ids: Set<number>; }) {
    const { uq, biz } = useUqApp();
    const modal = useModal();
    const { atoms } = biz;
    function ViewAtomEntity({ value }: { value: EntityAtom; }) {
        const { id, caption, name } = value;
        async function onCheckChanged(name: string, checked: boolean) {
            let io: number;
            if (checked === true) {
                await uq.SaveDuo.submit({ i: outerId, x: id });
                io = id;
            }
            else {
                await uq.DelDuo.submit({ id: undefined, i: outerId, x: id });
                io = -id;
            }
            // await uq.BuildIOEndPoint.submit({ outer: 0, app: appId, io });
        }
        return <CheckAsync className="border p-3 w-100" onCheckChanged={onCheckChanged} defaultChecked={ids.has(id)}>
            {caption ?? name}
        </CheckAsync>;
    }
    function onClose() {
        modal.close();
    }
    return <Page header="增删对照表">
        <div className="container my-3">
            <div className={cnRowCols}>
                {atoms.map(v => <div className="col" key={v.id}>
                    <ViewAtomEntity value={v} />
                </div>)}
            </div>
        </div>
        <div className="p-3">
            <button className="btn btn-outline-primary" onClick={onClose}>完成</button>
        </div>
    </Page>
}
