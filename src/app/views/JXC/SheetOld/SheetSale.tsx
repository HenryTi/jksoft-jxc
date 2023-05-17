import { Route } from "react-router-dom";
import { GenProps } from "app/tool";
import { UqApp } from "app/UqApp";
import { Detail } from "uqs/UqDefault";
import { PageOriginEdit, GenSheetOld, GenOrigin, GenDetailOld, PageDetailQPA } from "../../../template/SheetOld";
import { ModalSelectGoodsRetailPrice, GenContact } from "../Atom";
import { ViewItemID } from "app/template";
import { QueryMore } from "app/tool";

export class GenSale extends GenOrigin {
    readonly bizEntityName = 'sale';

    readonly QuerySearchItem: QueryMore;

    readonly ModalSelectDetailAtom: () => JSX.Element;
    readonly PageSheetEdit: () => JSX.Element;
    readonly PageSheetDetail: (props: GenProps<GenSheetOld> & { detail: Detail; }) => JSX.Element;
    readonly ViewItemSource: ({ id }: { id: number; }) => JSX.Element;
    readonly sourceSearchPlaceholder: string;

    readonly targetCaption = '客商';

    constructor(uqApp: UqApp) {
        super(uqApp);

        this.QuerySearchItem = uqApp.objectOf(GenContact).searchAtoms;

        this.ModalSelectDetailAtom = ModalSelectGoodsRetailPrice;
        this.PageSheetEdit = PageSaleEdit;
        this.PageSheetDetail = PageSheetDetail as any;
    }

    readonly buildDetailFromSelectedAtom = (selectedItem: any): any => {
        let { id, buds } = selectedItem;
        let detail = { item: id, v1: Number(buds.retailprice), };
        return detail;
    }
}

function PageSaleEdit() {
    return <PageOriginEdit Gen={GenSale} />;
}

function PageSheetDetail({ detail, Gen }: (GenProps<GenSale> & { detail: Detail })) {
    return <PageDetailQPA detail={detail} GenSheet={Gen as any} Gen={GenDetailSale} />;
}

class GenDetailSale extends GenDetailOld {
    get path(): string { return undefined; }
    get itemCaption(): string { return '商品'; }
    get ViewItemTemplate(): ({ value }: { value: any; }) => JSX.Element {
        return ViewItemID;
    }
    get priceDisabled() { return true; }
}

export function routeSale(uqApp: UqApp) {
    let { path } = uqApp.objectOf(GenSale);
    return <>
        <Route path={`${path}/:id`} element={<PageSaleEdit />} />
        <Route path={path} element={<PageSaleEdit />} />
    </>;
}