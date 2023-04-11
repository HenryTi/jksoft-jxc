import { Route } from "react-router-dom";
import { GenProps } from "app/tool";
import { UqApp } from "app/UqApp";
import { Detail } from "uqs/UqDefault";
import { PageOriginEdit, GenSheet, GenOrigin, PageDetailQPA, GenDetail, ViewItemID } from "../../template";
import { ModalSelectProduct } from "./AtomProduct";
import { QueryMore } from "app/tool";
import { GenContact } from "./AtomContact";

export class GenPurchase extends GenOrigin {
    readonly bizEntityName = 'purchase';

    readonly QuerySearchItem: QueryMore;

    readonly ModalSelectDetailAtom: () => JSX.Element;
    readonly PageSheetEdit: () => JSX.Element;
    readonly PageSheetDetail: (props: GenProps<GenSheet> & { detail: Partial<Detail>; }) => JSX.Element;
    readonly ViewItemSource: ({ id }: { id: number; }) => JSX.Element;
    readonly sourceSearchPlaceholder: string;

    readonly targetCaption = '供应商';

    constructor(uqApp: UqApp) {
        super(uqApp);
        this.QuerySearchItem = uqApp.objectOf(GenContact).searchAtoms;

        this.ModalSelectDetailAtom = ModalSelectProduct;
        this.PageSheetEdit = PagePurchaseEdit;
        this.PageSheetDetail = PageSheetDetail as any;
    }

    readonly buildDetailFromSelectedAtom = (selectedItem: any): any => {
        let detail = { item: selectedItem.id };
        return detail;
    }
}

function PagePurchaseEdit() {
    return <PageOriginEdit Gen={GenPurchase} />;
}

function PageSheetDetail({ detail, Gen }: (GenProps<GenPurchase> & { detail: Detail })) {
    return <PageDetailQPA detail={detail} GenSheet={Gen as any} Gen={GenDetailPurchase} />;
}

class GenDetailPurchase extends GenDetail {
    get path(): string { return undefined; }
    get itemCaption(): string { return '产品'; }
    get ViewItemTemplate(): ({ value }: { value: any; }) => JSX.Element {
        return ViewItemID;
    }
}

export function routePurchase(uqApp: UqApp) {
    let { path } = uqApp.objectOf(GenPurchase);
    return <>
        <Route path={`${path}/:id`} element={<PagePurchaseEdit />} />
        <Route path={path} element={<PagePurchaseEdit />} />
    </>;
}
