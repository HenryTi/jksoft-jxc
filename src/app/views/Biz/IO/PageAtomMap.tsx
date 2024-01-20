import { useUqApp } from "app";
import { EntityAtom, IOAppID } from "app/Biz";
import { ButtonRight, ButtonRightAdd, PageQueryMore } from "app/coms";
import { ViewAtom, getAtomWithProps, useSelectAtom } from "app/hooks";
import { FormEvent, useState } from "react";
import { useQuery } from "react-query";
import { Page, PageConfirm, useModal } from "tonwa-app";
import { FA, List } from "tonwa-com";

export function PageAtomMap({ outerId, ioAppID }: { outerId: number; ioAppID: IOAppID; }) {
    const { uq, biz } = useUqApp();
    const modal = useModal();
    const selectAtom = useSelectAtom();
    const entity = ioAppID.atoms[0];
    const { data: { outer } } = useQuery(['getAtom in AtomMap', outerId], async () => {
        let promises = [
            getAtomWithProps(biz, biz.uq, outerId),
        ];
        let [outer] = await Promise.all(promises);
        return { outer };
    });
    const [items, setItems] = useState([]);
    async function onAdd() {
        let itemsAdd = [];
        for (; ;) {
            let atomValue = await selectAtom(entity);
            if (atomValue === undefined) break;
            let ret = await modal.open(<PageEdit atomValue={atomValue} no={undefined} />);
            if (ret === undefined) break;
            let retSave = await uq.SaveIOAtom.submit({
                id: undefined,
                outer: outerId,
                phrase: entity.id,
                no: ret,
                atom: atomValue.id,
            });
            let { id: retSaveId } = retSave;
            if (retSaveId === undefined) break;
            let index = items.findIndex(v => v.id === retSaveId);
            if (index >= 0) {
                items.splice(index, 1);
            }
            itemsAdd.unshift({
                id: retSaveId,
                atom: atomValue.id,
                atomNo: atomValue.no,
                atomEx: atomValue.ex,
                no: ret,
            });
        }
        setItems([...itemsAdd, ...items]);
    }
    function ViewItem({ value }: { value: any }) {
        const { id, atom, atomNo, atomEx, no } = value;
        async function onEdit() {
            let atomValue = { id: atom, no: atomNo, ex: atomEx };
            let ret = await modal.open(<PageEdit atomValue={atomValue} no={no} />);
            if (ret === undefined) return;
            let retSave = await uq.SaveIOAtom.submit({
                id,
                outer: outerId,
                phrase: entity.id,
                no: ret,
                atom: atomValue.id,
            });
            let { id: retSaveId } = retSave;
            if (retSaveId === undefined) return;
            let index = items.findIndex(v => v.id === retSaveId);
            if (index >= 0) {
                if (ret === null) {
                    items.splice(index, 1);
                }
                else {
                    items[index].no = ret;
                }
            }
            setItems([...items]);
        }
        return <div className="px-3 py-2">
            <div className="row cursor-pointer" onClick={onEdit}>
                <div className="col">
                    <div>{atomEx}</div>
                    <div className="small text-secondary">id:{atom} &nbsp; 编号:{atomNo}</div>
                </div>
                <div className="col d-flex">
                    <div>{no}</div>
                    <div className="flex-grow-1" />
                    <div><FA name="angle-right" className="px-3" /></div>
                </div>
            </div>
        </div>;
    }
    return <PageQueryMore
        header={`${outer.ex} ${entity.caption ?? entity.name}`}
        query={uq.GetIOAtoms}
        param={{ outer: outerId, phrase: entity.id }}
        sortField="atom"
        ViewItem={ViewItem}
        right={<ButtonRightAdd onClick={onAdd} />}
        none={items.length > 0 ? null : undefined}
    >
        <List items={items} ViewItem={ViewItem} none={null} />
    </PageQueryMore>;
}

function PageEdit({ atomValue, no }: { atomValue: any; no: string; }) {
    const modal = useModal();
    function onSubmit(evt: FormEvent<HTMLFormElement>) {
        evt.preventDefault();
        let input = evt.currentTarget.elements.namedItem('code') as HTMLInputElement;
        modal.close(input.value);
    }

    function onExit() {
        modal.close();
    }
    const { id, no: atomNo, ex: atomEx } = atomValue;
    let vBtnExit: any, vSubmitCaption: any;
    if (no === undefined) {
        vSubmitCaption = '提交并继续';
        vBtnExit = <div className="m-3">
            <button className="btn btn-outline-primary" type="button" onClick={onExit}>退出</button>
        </div>;
    }
    else {
        vSubmitCaption = '提交';
    }
    async function onDel() {
        if (await modal.open(<PageConfirm header="删除对照" message="真的要删除对照吗？" yes="删除" no="不删除" />) !== true) return;
        modal.close(null);
    }
    const right = <ButtonRight onClick={onDel}><FA name="trash" /></ButtonRight>;
    return <Page header="新增对照" right={right}>
        <div className="p-3">
            <div className="small text-secondary">id:{id} &nbsp; 编号:{atomNo}</div>
            <div className="">{atomEx}</div>
            <div className="small text-secondary"></div>
        </div>
        <div className="m-3">
            <form className="row gy-2 gx-3 align-items-center" onSubmit={onSubmit}>
                <div className="col-auto">
                    <input name="code" type="text"
                        maxLength={20} className="form-control"
                        placeholder="对照码" defaultValue={no} />
                </div>
                <div className="col-auto">
                    <button className="btn btn-primary" type="submit">{vSubmitCaption}</button>
                </div>
            </form>
        </div>
        {vBtnExit}
    </Page>;
}