import { PageIDList, PageIDNew, PageIDView, IDViewRowProps, PartID, PageIDSelect } from "app/template/ID";
import { BaseID, BaseIDPropUnit } from "app/tool";
import { UqApp, useUqApp } from "app/UqApp";
import { Route } from "react-router-dom";
import { LMR } from "tonwa-com";
import { UqQuery, UqID, Uq } from "tonwa-uq";
import { Product } from "uqs/UqDefault";

export const pathProductNew = 'product-new';
export const pathProductList = 'product-list';
export const pathProductView = 'product-view';
export const pathProductEdit = 'product-edit';

export class IDPartProduct extends PartID {
    readonly path: string;
    readonly baseID: BaseID;
    get caption(): string { return '产品' }

    constructor(uqApp: UqApp) {
        super(uqApp);
        this.baseID = uqApp.objectOf(BaseIDProduct);
    }
}

class BaseIDProduct extends BaseIDPropUnit {
    readonly prop = 'product';
}

class IDPartProductForSale extends IDPartProduct {
    declare readonly ViewItemID: (value: any) => JSX.Element;
    declare readonly query: UqQuery<any, any>;
    constructor(uqApp: UqApp) {
        super(uqApp);
        this.query = this.uq.SearchProductForSale;
        this.ViewItemID = ({ value: { no, name, price } }: { value: Product & { price: number; } }) => {
            return <LMR className="d-block px-3 py-2">
                <div>
                    <div className='small text-muted'>{no}</div>
                    <div><b>{name}</b></div>
                </div>
                <div>{price}元</div>
            </LMR>
        }
    }
}

function PageProductNew() {
    return <PageIDNew Part={IDPartProduct} />;
}

function PageProductView() {
    return <PageIDView Part={IDPartProduct} />;
}

function PageProductList() {
    return <PageIDList Part={IDPartProduct} />
}

export function PageProductSelect() {
    return <PageIDSelect Part={IDPartProduct} />;
}

// show price on product item
export function PageProductSelectForSale() {
    return <PageIDSelect Part={IDPartProductForSale} />;
}

export const routeProduct = <>
    <Route path={pathProductNew} element={<PageProductNew />} />
    <Route path={pathProductList} element={<PageProductList />} />
    <Route path={`${pathProductView}/:id`} element={<PageProductView />} />
</>;
