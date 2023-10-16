import { useForm } from "react-hook-form";
import { Band, FormRow, FormRowsView } from "app/coms";
import { OptionsUseSheetDetail, UpdateRow, ViewSpec, usePick, useSelectAtomSpec } from "app/hooks";
import { AtomSpec, AtomPhrase, EditingRow, SheetRow, Spec, Bin } from "app/tool";
import { Page, uqAppModal, useModal } from "tonwa-app";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useUqApp } from "app/UqApp";
import { FA, SpinnerSmall, to62 } from "tonwa-com";
import { useAtomValue } from "jotai";
// import { ViewAUSAtom, ViewAtomSpec, ViewUom, ViewSpec, ViewSpecWithLabel } from "../../ViewAUS";
import { UseSheetDetailReturn } from "app/hooks";
import { ViewAtom } from "app/hooks";
import { EntityBin } from "app/Biz/EntitySheet";

const fieldQuantity = 'value';
const fieldPrice = 'price';
const fieldAmount = 'amount';

export interface OptionsUseDetailQPA extends OptionsUseSheetDetail {
}

export function useDetailQPA({ detail: detailName }: OptionsUseDetailQPA): UseSheetDetailReturn {
    const uqApp = useUqApp();
    // const saveAtomSpec = useSaveAtomSpec();
    // const selectAtomSpec = useSelectAtomSpec();
    const { openModal, closeModal } = useModal();
    const pick = usePick();
    const entityDetail = uqApp.biz.entities[detailName] as EntityBin;
    async function addRow(editingRows: EditingRow[]): Promise<SheetRow[]> {
        let pickValue = await pick(entityDetail.i);
        if (pickValue === undefined) return;
        // alert(JSON.stringify(pickValue));
        // let atomSpec = await selectAtomSpec('goods' as EnumAtom);
        // if (atomSpec === undefined) return;
        /*
        let { atom, uom } = atomSpec;
        if (!uom.id) {
            await openModal(<Page header="提示">
                <div className="px-3">
                    <div className="my-3">
                        <ViewAtom value={atom} />
                    </div>
                    <div className="my-3 text-danger">
                        <FA name="times-circle" /> 无计量单位
                    </div>
                    <div className="my-3">
                        <button className="btn btn-outline-primary" onClick={closeModal}>
                            返回
                        </button>
                    </div>
                </div>
            </Page>);
            return;
        }
        let item = await saveAtomSpec(atomSpec);
        atomSpec.id = item;
        */
        const { spec } = pickValue;
        let item = spec;
        let editingRow = editingRowFromAtom(item);
        if (editingRow === undefined) return;
        let ret = await openModal(<PageDetail header={'新增明细'} editingRow={editingRow} entityDetail={entityDetail} />);
        if (ret === undefined) return [];
        return [ret];
    }

    function editingRowFromAtom(i: number): EditingRow {
        if (i === undefined) return;
        let row = {
            i,
        } as Bin;
        let editingRow = new EditingRow(undefined, [row]);
        return editingRow;
    }

    async function editRow(editingRow: EditingRow, updateRow: UpdateRow): Promise<void> {
        const { openModal } = uqAppModal(uqApp);
        let ret = await openModal<SheetRow>(<PageDetail header="修改明细" editingRow={editingRow} entityDetail={entityDetail} />);
        if (ret === undefined) return;
        await updateRow(editingRow, ret.details);
    }

    return {
        detail: entityDetail,
        ViewItemTemplate: ViewAtom,
        ViewRow: ViewDetailQPA,
        addRow,
        editRow,
    }
}

function useSaveAtomSpec() {
    const uqApp = useUqApp();
    const { uq } = uqApp;
    async function saveAtomSpec(atomSpec: AtomSpec): Promise<number> {
        let { atom, spec, uom } = atomSpec;
        let { atomUom } = uom;
        if (atomUom === undefined) {
            let ret = await uq.SaveAtomUom.submit({ atom: atom.id, uom: uom.id });
            atomUom = ret.id;
        }
        let specId = 0;
        if (spec !== undefined) {
            specId = spec.id;
            if (specId === undefined) {
                specId = await saveSpec(atom, spec);
                spec.id = specId;
            }
        }
        let ret = await uq.SaveAtomSpec.submit({
            atomUom,
            spec: specId,
        });
        return ret.id;
    }

    async function saveSpec(atom: AtomPhrase, spec: Spec): Promise<number> {
        let gSpec = uqApp.specFromAtom(atom.phrase);
        let values = gSpec.entity.getSpecValues(spec);
        let ret = await uq.SaveSpec.submit({
            spec: gSpec.name,
            atom: atom.id,
            values
        } as any);
        return ret.id;
    }
    return saveAtomSpec;
}

function PageDetail({ header, editingRow, entityDetail }: {
    header?: string;
    editingRow?: EditingRow;
    entityDetail: EntityBin;
}): JSX.Element {
    const caption = '明细';
    const itemCaption = '商品';
    editingRow = editingRow ?? new EditingRow(undefined, undefined);
    const { atomDetails } = editingRow;
    let details = useAtomValue(atomDetails);
    let refDetail = useRef<Bin>(details === undefined ? {} as Bin : { ...details[0] });
    let detail = refDetail.current;
    const { value, price: price, amount: amount, i } = detail;
    const { closeModal } = useModal();
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({ mode: 'onBlur' });
    const [hasValue, setHasValue] = useState(value != undefined);
    let valueDisabled: boolean = false;

    function buildFormRows(detial: Bin): FormRow[] {
        let { value, price: price, amount: amount } = detial;
        return [
            buildValueRow(value),
            buildPriceRow(price),
            buildAmountRow(amount),
        ];
    }

    function buildValueRow(value: number): FormRow {
        return { name: fieldQuantity, label: '数量', type: 'number', options: { value, disabled: valueDisabled } };
    }
    let priceDisabled: boolean = false;
    function buildPriceRow(value: number, disabled: boolean = false): FormRow {
        return { name: fieldPrice, label: '单价', type: 'number', options: { value, disabled: priceDisabled } };
    }
    let amountDisabled: boolean = true;
    function buildAmountRow(value: number, disabled: boolean = false): FormRow {
        return { name: fieldAmount, label: '金额', type: 'number', options: { value, disabled: amountDisabled } };
    }

    function onChange(evt: ChangeEvent<HTMLInputElement>) {
        const { value, name } = evt.target;
        if (value.trim().length === 0) {
            (detail as any)[name] = undefined;
        }
        else {
            let v = Number(value);
            (detail as any)[name] = Number.isNaN(v) === true ? undefined : v;
        }
        switch (name) {
            case fieldQuantity: onQuantityChange(detail.value); break;
            case fieldPrice: onPriceChange(detail.price); break;
        }
        const { price: price, amount: amount, value: quantity } = detail;
        let hv = amount !== undefined && price !== undefined && quantity !== undefined;
        setHasValue(hv);
    }
    function setAmountValue(quantity: number, price: number) {
        if (quantity === undefined || price === undefined) {
            detail.amount = undefined;
            setValue(fieldAmount, '');
        }
        let amount = quantity * price;
        detail.amount = amount;
        setValue(fieldAmount, amount.toFixed(4));
    }
    function onQuantityChange(value: number) {
        detail.value = value;
        let p = getValues(fieldPrice) ?? price;
        if (!p) return;
        setAmountValue(value, p);
    }
    function onPriceChange(value: number) {
        detail.price = value;
        let q = getValues(fieldQuantity) ?? value;
        if (!q) return;
        setAmountValue(q, value);
    }
    const options = { onChange, valueAsNumber: true };
    const formRows = buildFormRows(detail);
    formRows.forEach(v => (v as any).options = { ...(v as any).options, ...options });
    formRows.push({ type: 'submit', label: '提交', options: { disabled: hasValue === false } });

    async function onSubmit(data: any) {
        // closeModal(data);
        // amount 字段disabled。setValue('amount'), 改变了input显示，但是取值没有改变。
        // 只能用下面变通
        let ret: SheetRow = {
            origin: undefined,
            details: [detail],
        }
        closeModal(ret);
    }

    let { id: entityId } = entityDetail;
    let base62 = to62(entityId);
    return <Page header={header ?? caption}>
        <div className="pt-3 tonwa-bg-gray-2 mb-3 container">
            <div>entityId:{entityId} base62: {base62}</div>
            <Band label="商品">
                <div className="">
                    <ViewSpec id={i} />
                </div>
            </Band>
        </div>
        <form className="container" onSubmit={handleSubmit(onSubmit)}>
            <FormRowsView rows={formRows} register={register} errors={errors} />
        </form>
    </Page>;
}

const cnCol = ' col py-2 ';
function ViewDetailQPA({ editingRow }: { editingRow: EditingRow; updateRow: UpdateRow; }): JSX.Element {
    const { atomDetails } = editingRow;
    const details = useAtomValue(atomDetails);
    if (details === undefined || details.length === 0) {
        return <div className={cnCol}>
            ViewDetailQPA editingRow rows === undefined || rows.length = 0;
        </div>
    }
    const { i, value, price: price, amount: amount } = details[0];
    return <div className="container">
        <div className="row">
            <ViewSpec id={i} />
            <div className={cnCol + ' d-flex justify-content-end align-items-end'}>
                <div className="text-end">
                    <span><small>单价:</small> {price?.toFixed(4)} <small>金额:</small> {amount?.toFixed(4)}</span>
                    <br />
                    <small>数量:</small> <b>{value}</b>
                </div>
                <FA name="pencil-square-o" className="ms-3 text-info" />
            </div>
        </div>
    </div>;
}
