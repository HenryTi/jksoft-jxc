import { Route, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { IDView, Page, useModal } from "tonwa-app";
import { UqAction, UqID, UqQuery } from "tonwa-uq";
import { PartProps } from "app/template/Part";
import { UqApp, useUqApp } from "app/UqApp";
import { SheetSale, DetailQPA } from "uqs/JsTicket";
import { PageOriginEdit, PageOriginNew, PartSheet, PartOrigin, PartDetail, PageDetailQPA } from "../../template/Sheet";
import { PageProductSelectForSale, ViewProduct } from "./IDProduct";
import { ChangeEvent, useState } from "react";
import { Band, FormRow, FormRowsView } from "app/coms";
import { FA, LMR } from "tonwa-com";
import { ViewContact } from "./IDContact";

export const captionSale = '销售单';
const pathSaleEdit = 'sale-edit';

export class SheetPartSale extends PartOrigin<SheetSale, DetailQPA>  {
    readonly path: string;

    readonly ID: UqID<any>;
    readonly IDDetail: UqID<any>;
    readonly QueryGetDetails: UqQuery<{ id: number }, { ret: any[] }>;
    readonly ActBookSheet: UqAction<any, any>;
    readonly QuerySearchSheetItem: UqQuery<any, any>;

    readonly caption: string;

    readonly PageDetailItemSelect: () => JSX.Element;
    readonly PageSheetEdit: () => JSX.Element;
    readonly PageSheetDetail: (props: PartProps<PartSheet<SheetSale, DetailQPA>> & { detail: Partial<DetailQPA>; }) => JSX.Element;
    readonly ViewNO: (props: { no: string }) => JSX.Element;
    readonly ViewTarget: (props: { sheet: SheetSale }) => JSX.Element;
    readonly ViewTargetBand: (props: { sheet: SheetSale }) => JSX.Element;
    readonly ViewItemEditRow: ({ row }: { row: any }) => JSX.Element;
    readonly ViewItemSource: ({ id }: { id: number; }) => JSX.Element;
    readonly sourceSearchPlaceholder: string;

    constructor(uqApp: UqApp) {
        super(uqApp);
        this.path = pathSaleEdit;

        const { JsTicket: uq } = uqApp.uqs;
        this.ID = uq.SheetSale;
        this.IDDetail = uq.DetailQPA;
        this.QueryGetDetails = uq.GetDetailQPAs;
        this.ActBookSheet = uq.BookSheetSale;
        this.QuerySearchSheetItem = uq.SearchContact;

        this.PageDetailItemSelect = PageProductSelectForSale;
        this.caption = captionSale;
        this.PageSheetEdit = PageSaleEdit;
        this.PageSheetDetail = PageSheetDetail as any;

        this.ViewItemEditRow = function ({ row }: { row: DetailQPA }) {
            let { item, quantity, price, amount } = row;
            return <LMR className="px-3 py-2">
                <IDView uq={uq} id={item} Template={ViewProduct} />
                <div className="align-self-end text-end d-flex align-items-end">
                    <div>
                        <span><small>单价:</small> {price?.toFixed(4)} <small>金额:</small> {amount.toFixed(4)}</span>
                        <br />
                        <small>数量:</small> <b>{quantity}</b>
                    </div>
                    <FA name="pencil-square-o" className="ms-3 text-info" />
                </div>
            </LMR>;
        }

        this.ViewNO = function ({ no }: { no: string }) {
            return <Band label={'编号'} labelClassName="text-end">
                {no}
            </Band>
        }

        this.ViewTarget = function ({ sheet }: { sheet: SheetSale }) {
            return <IDView id={sheet.target} uq={uq} Template={ViewContact} />;
        }

        this.ViewTargetBand = ({ sheet }: { sheet: SheetSale }) => {
            return <Band labelClassName="text-end" label={'往来单位'}>
                <this.ViewTarget sheet={sheet} />
            </Band>;
        }
    }

    buildSheet(id: number, no: string, target: number): SheetSale {
        return { id, no, target };
    }

    readonly buildDetailFromSelectedItem = (selectedItem: any): any => {
        let detail = { item: selectedItem.id, price: selectedItem.price, };
        return detail;
    }
}

function PageSaleEdit() {
    return <PageOriginEdit Part={SheetPartSale} />;
}

function PageSheetDetail({ detail, Part }: (PartProps<SheetPartSale> & { detail: Partial<DetailQPA> })) {
    /*
    const uqApp = useUqApp();
    const { uq } = uqApp.partOf(Part);
    const { quantity, price, amount, item } = detail;
    const { closeModal } = useModal();
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({ mode: 'onBlur' });
    const [hasValue, setHasValue] = useState(quantity != undefined);
    function onChange(evt: ChangeEvent<HTMLInputElement>) {
        const { value, name } = evt.target;
        let v = Number(value);
        switch (name) {
            case 'quantity': onQuantityChange(v); break;
            case 'price': onPriceChange(v); break;
        }
        setHasValue(!Number.isNaN(v));
    }
    function setAmountValue(amount: number) {
        detail.amount = amount;
        setValue('amount', amount.toFixed(4));
    }
    function onQuantityChange(value: number) {
        // 变通：getValues('price')返回undefined
        setAmountValue(value * (getValues('price') ?? price));
    }
    function onPriceChange(value: number) {
        setAmountValue(value * getValues('quantity'));
    }
    const options = { onChange, valueAsNumber: true };
    let formRows: FormRow[] = [
        { name: 'quantity', label: '数量', type: 'number', options: { ...options, value: quantity } },
        { name: 'price', label: '单价', type: 'number', options: { ...options, value: price, disabled: true } },
        { name: 'amount', label: '金额', type: 'number', options: { ...options, value: amount, disabled: true } },
        { type: 'submit', label: hasValue === true ? '提交' : '关闭' },
    ];

    async function onSubmit(data: any) {
        // closeModal(data);
        // amount 字段disabled。setValue('amount'), 改变了input显示，但是取值没有改变。
        // 只能用下面变通
        let { price, amount } = detail;
        closeModal({ ...data, price, amount });
    }
    return <Page header="明细">
        <div className="container">
            <Band label={'产品'} labelClassName="py-2 fw-bold">
                <IDView uq={uq} id={item} Template={ViewProduct} />
            </Band>
        </div>
        <form className="container" onSubmit={handleSubmit(onSubmit)}>
            <FormRowsView rows={formRows} register={register} errors={errors} />
        </form>
    </Page>;
    */
    return <PageDetailQPA detail={detail} PartSheet={Part as any} Part={DetailPartSale} />;
}

class DetailPartSale extends PartDetail<DetailQPA> {
    get caption(): string { return '明细'; }
    get path(): string { return undefined; }
    get itemCaption(): string { return '产品'; }
    get ViewItemTemplate(): ({ value }: { value: any; }) => JSX.Element {
        return ViewProduct;
    }
    get priceDisabled() { return true; }
}

export const routeSale = <>
    <Route path={`${pathSaleEdit}/:id`} element={<PageSaleEdit />} />
    <Route path={pathSaleEdit} element={<PageSaleEdit />} />
</>;
