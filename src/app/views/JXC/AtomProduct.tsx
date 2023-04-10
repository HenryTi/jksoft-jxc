import { Route } from "react-router-dom";
import { LMR } from "tonwa-com";
import { PageAtomList, PageAtomNew, PageAtomView, GenAtom, PageAtomSelect } from "app/template/Atom";
import { Atom, uqSchema } from "uqs/UqDefault";
import { UqApp } from "app/UqApp";

export class GenProduct extends GenAtom {
    readonly bizEntityName = uqSchema.$biz.product.name;
    get exLabel(): string { return '描述' }
}

function ViewItemProduct({ value }: { value: Atom; }) {
    let { no, ex } = value;
    return <LMR className="d-block px-3 py-2">
        <div>
            <div className='small text-muted'>{no}</div>
            <div><b>{ex}</b></div>
        </div>
    </LMR>
}

export function ModalSelectProduct() {
    return <PageAtomSelect Gen={GenProduct} ViewItem={ViewItemProduct} />;
}

export interface ProductRetailPrice extends Atom {
    buds: { retailprice: number; }
}

function ViewItemProductRetailPrice({ value }: { value: ProductRetailPrice; }) {
    let { no, ex, buds: { retailprice } } = value;
    return <LMR className="d-block px-3 py-2">
        <div>
            <div className='small text-muted'>{no}</div>
            <div><b>{ex}</b></div>
        </div>
        <div>{retailprice}元</div>
    </LMR>
}

export function ModalSelectProductRetailPrice() {
    return <PageAtomSelect
        Gen={GenProduct}
        ViewItem={ViewItemProductRetailPrice}
        assigns={['retailprice']} />;
}

export function routeProduct(uqApp: UqApp) {
    let gen = uqApp.objectOf(GenProduct);
    return <>
        <Route path={gen.pathNew} element={<PageAtomNew Gen={GenProduct} />} />
        <Route path={gen.pathList} element={<PageAtomList Gen={GenProduct} />} />
        <Route path={`${gen.pathView}/:id`} element={<PageAtomView Gen={GenProduct} />} />
    </>;
};
