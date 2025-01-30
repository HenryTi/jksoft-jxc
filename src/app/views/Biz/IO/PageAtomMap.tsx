import { useUqApp } from "app";
import { EntityIOApp, EntityIOSite, IOAppID } from "tonwa";
import { ButtonRight, ButtonRightAdd, PageQueryMore } from "app/coms";
import { useIDSelect } from "app/hooks";
import { AtomData } from "app/tool";
import { FormEvent, useState, JSX } from "react";
import { Page, PageConfirm, useModal } from "tonwa-app";
import { FA, List } from "tonwa-com";
import { ParamGetIOAtoms } from "uqs/UqDefault";

interface Props {
    header: JSX.Element;
    ioSite: EntityIOSite;
    ioApp: EntityIOApp;
    atom: AtomData;
    ioAppID: IOAppID;
}
export function PageAtomMap({ header, ioSite, ioApp, atom, ioAppID }: Props) {
    const { uq } = useUqApp();
    const modal = useModal();
    const IDSelect = useIDSelect();
    const entity = ioAppID.atoms[0];

    const param: ParamGetIOAtoms = {
        ioSite: ioSite.id,
        siteAtom: atom.id,                  // the site atom id
        ioApp: ioApp.id,
        ioAppID: ioAppID.id,
    }
    async function getIOAtoms(param: ParamGetIOAtoms, pageStart: any, pageSize: number): Promise<any[]> {
        let ret = await uq.GetIOAtoms.page(param, pageStart, pageSize);
        return ret.$page;
    }
    async function saveIOAtom(no: string, atom: number) {
        let retSave = await uq.SaveIOAtom.submit({
            id: undefined,
            no,
            atom,
            ...param,
        });
        let { id: retSaveId } = retSave;
        return retSaveId;
    }
    const [items, setItems] = useState([]);
    async function onAdd() {
        let itemsAdd = [];
        for (; ;) {
            let atomValue = await IDSelect(entity);
            if (atomValue === undefined) break;
            let ret = await modal.open(<PageEdit atomValue={atomValue} no={undefined} />);
            if (ret === undefined) break;
            let retSaveId = await saveIOAtom(ret, atomValue.id);
            if (retSaveId === undefined) {
                // error
                debugger;
                break;
            }
            if (retSaveId < 0) {
                alert(`${ret} 重复`);
                continue;
            }
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
            let retSaveId = await saveIOAtom(ret, atomValue.id);
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
        header={header}
        query={getIOAtoms}
        param={param}
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