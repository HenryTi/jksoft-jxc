import { Route } from "react-router-dom";
import { UqAction } from "tonwa-uq";
import { PartProps } from "app/template/Part";
import { UqApp } from "app/UqApp";
import { Detail, Sheet, SheetType } from "uqs/UqDefault";
import { PageOriginEdit, PartSheet, PartOrigin, PartDetail, PageDetailQPA } from "../../template/Sheet";
import { PageProductSelectForSale } from "./IDProduct";
import { ViewItemID } from "app/template";
import { QueryMore, SeedSheet } from "app/tool";
import { IDPartContact } from "./IDContact";

const captionSale = '销售单';
const pathSaleEdit = 'sale-edit';

class SeedSale extends SeedSheet {
    readonly sheet = SheetType.Sale;
}

export class PartSheetSale extends PartOrigin {
    readonly sheetType = SheetType.Sale;
    readonly path: string;

    readonly ActBookSheet: UqAction<any, any>;
    readonly QuerySearchItem: QueryMore;

    readonly seed: SeedSheet;
    readonly caption: string;

    readonly PageDetailItemSelect: () => JSX.Element;
    readonly PageSheetEdit: () => JSX.Element;
    readonly PageSheetDetail: (props: PartProps<PartSheet> & { detail: Detail; }) => JSX.Element;
    readonly ViewItemSource: ({ id }: { id: number; }) => JSX.Element;
    readonly sourceSearchPlaceholder: string;

    constructor(uqApp: UqApp) {
        super(uqApp);
        this.caption = captionSale;
        this.path = pathSaleEdit;
        this.seed = uqApp.objectOf(SeedSale);

        const { UqDefault: uq } = uqApp.uqs;
        this.ActBookSheet = uq.BookSheet;
        this.QuerySearchItem = uqApp.objectOf(IDPartContact).searchItems;

        this.PageDetailItemSelect = PageProductSelectForSale;
        this.PageSheetEdit = PageSaleEdit;
        this.PageSheetDetail = PageSheetDetail as any;
    }

    readonly buildDetailFromSelectedItem = (selectedItem: any): any => {
        let detail = { item: selectedItem.id, v1: selectedItem.v1, };
        return detail;
    }
}

function PageSaleEdit() {
    return <PageOriginEdit Part={PartSheetSale} />;
}

function PageSheetDetail({ detail, Part }: (PartProps<PartSheetSale> & { detail: Detail })) {
    return <PageDetailQPA detail={detail} PartSheet={Part as any} Part={DetailPartSale} />;
}

class DetailPartSale extends PartDetail {
    get caption(): string { return '明细'; }
    get path(): string { return undefined; }
    get itemCaption(): string { return '产品'; }
    get ViewItemTemplate(): ({ value }: { value: any; }) => JSX.Element {
        return ViewItemID;
    }
    get priceDisabled() { return true; }
}

export const routeSale = <>
    <Route path={`${pathSaleEdit}/:id`} element={<PageSaleEdit />} />
    <Route path={pathSaleEdit} element={<PageSaleEdit />} />
</>;
