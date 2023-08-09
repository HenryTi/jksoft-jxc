import { useState } from "react";
import { useUqApp } from "app/UqApp";
import { Page, useModal } from "tonwa-app";
import { ButtonAsync, CheckAsync, FA, LabelRow, List, Sep, useEffectOnce, wait } from "tonwa-com";
import { EnumAtom, ReturnGetAtomUomUomI, ReturnGetAtomUomUomX } from "uqs/UqDefault";
import { useAtomUom } from "./useAtomUom";
import { selectAtom } from "../BizAtom";

export interface ViewUomProps {
    id: number;
    className?: string;
}

export function ViewUom({ id, className }: ViewUomProps) {
    const uqApp = useUqApp();
    const { getAtomUom, saveAtomUom, hideAtomUom, deleteAtomUomI } = useAtomUom();
    const { openModal, closeModal } = useModal();
    const [uomI, setUomI] = useState<ReturnGetAtomUomUomI>();
    const [uomXs, setUomXs] = useState<ReturnGetAtomUomUomX[]>(undefined);
    const [atomUomXs, setAtomUomXs] = useState<ReturnGetAtomUomUomX[]>(undefined);
    useEffectOnce(() => {
        loadUom();
    });

    async function loadUom(): Promise<{ uomI: any; uomXs: any[]; }> {
        let { uomI, uomX } = await getAtomUom(id);
        setUomI(uomI);
        setUomXs(uomX);
        setAtomUomXs(uomX.filter(v => v.atomUom !== undefined));
        return {
            uomI,
            uomXs: uomX,
        };
    }
    async function onEditUom() {
        let uomIOnAdd = uomI;
        let uomXsOnAdd = uomXs;
        if (uomI === undefined) {
            let retUomI = await selectAtom(uqApp, EnumAtom.UomI);
            if (retUomI === undefined) return;
            await saveAtomUom({ atom: id, uom: retUomI.id });
            const { uomI: uomILoad, uomXs: uomXsLoad } = await loadUom();
            uomIOnAdd = uomILoad;
            uomXsOnAdd = uomXsLoad;
        }
        async function onUomXChecked(uomX: ReturnGetAtomUomUomX, checked: boolean) {
            const { id: checkedId, atomUom } = uomX;
            let index = uomXsOnAdd.findIndex(v => v.id === checkedId);
            if (index >= 0) {
                let x = uomXsOnAdd[index];
                if (checked === true) {
                    let atomUomId = await saveAtomUom({ atom: id, uom: checkedId })
                    x.atomUom = atomUomId;
                }
                else {
                    await hideAtomUom(atomUom);
                    x.atomUom = undefined;
                }
                setAtomUomXs(uomXsOnAdd.filter(v => v.atomUom !== undefined));
            }
        }
        await openModal(<PageSelectUomXs
            uomI={uomIOnAdd}
            uomXs={uomXsOnAdd}
            onUomXChecked={onUomXChecked}
            onUomIDelete={onUomIDelete} />);
    }
    async function onUomIDelete(uomI: ReturnGetAtomUomUomI) {
        await deleteAtomUomI(id, uomI.id);
        setUomXs([]);
        setUomI(undefined);
        closeModal();
    }
    function ViewItem({ value }: { value: ReturnGetAtomUomUomX; }) {
        return <ViewUomX uomI={uomI} uomX={value} />;
    }
    let viewUomI: any;
    if (atomUomXs === undefined) {
        viewUomI = null;
    }
    else if (uomI === undefined) {
        viewUomI = <LabelRow>
            <span />
            <span className="text-secondary small p-3 ">[无]</span>
            <span />
        </LabelRow>;
    }
    else {
        viewUomI = <ViewUomI uomI={uomI} />;
    }
    return <div className={className}>
        <div className="border-bottom">
            <LabelRow labelClassName="px-3 py-1 small text-muted">
                <div>计量单位</div>
                <div />
                <div className="p-3 text-info cursor-pointer" onClick={onEditUom}>
                    <FA name="pencil" className="me-1" />
                </div>
            </LabelRow>
        </div>
        <div>
            {viewUomI}
            <Sep />
            <List items={atomUomXs} ViewItem={ViewItem} none={null} />
            <Sep />
        </div>
    </div>
}

function ViewUomI({ uomI, onDelete }: { uomI: ReturnGetAtomUomUomI; onDelete?: (umoI: ReturnGetAtomUomUomI) => Promise<void> }) {
    async function onDelUomI() {
        await onDelete(uomI);
    }
    const right = onDelete === undefined ?
        <span />
        :
        <ButtonAsync className="p-3 cursor-pointer" onClick={onDelUomI} tag="div">
            <FA name="trash" className="text-info" />
        </ButtonAsync>;
    return <LabelRow>
        <span>{uomI.ex}</span>
        <span className={' p-3 text-info '}>(基本单位)</span>
        {right}
    </LabelRow>;
}

function ViewUomX({ uomI, uomX, checkBox }: { uomI: ReturnGetAtomUomUomI; uomX: ReturnGetAtomUomUomX; checkBox?: JSX.Element; }) {
    if (uomI === undefined) return null;
    const { ex, ratio, prevEx, prevRatio } = uomX;
    const { ex: uomIEx } = uomI;
    let content = <>= {prevRatio} {prevEx ?? uomIEx} = {ratio} {uomIEx}</>;
    if (checkBox !== undefined) {
        content = <label>{checkBox} {content}</label>
    }
    return <LabelRow>
        <span>{ex}</span>
        <span className="p-3">{content}</span>
        <span></span>
    </LabelRow>
}

function PageSelectUomXs({ uomI, uomXs, onUomXChecked, onUomIDelete }: {
    uomI: any;
    uomXs: any[];
    onUomXChecked: (uomX: ReturnGetAtomUomUomX, checked: boolean) => Promise<void>;
    onUomIDelete: (uomI: ReturnGetAtomUomUomI) => Promise<void>;
}) {
    function ViewItem({ value }: { value: ReturnGetAtomUomUomX; }) {
        async function onCheckChanged(name: string, checked: boolean) {
            console.log('onCheckChanged');
            await onUomXChecked(value, checked);
            console.log('onCheckChanged after saved');
        }
        let checkBox = <CheckAsync
            className="form-check-input me-3"
            defaultChecked={value.atomUom !== undefined}
            onCheckChanged={onCheckChanged}>

        </CheckAsync>;
        return <ViewUomX uomI={uomI} uomX={value} checkBox={checkBox} />;
    }
    return <Page header="编辑计量单位">
        <ViewUomI uomI={uomI} onDelete={onUomIDelete} />
        <Sep />
        <List items={uomXs} ViewItem={ViewItem} />
        <Sep />
    </Page>;
}