import { Route } from "react-router-dom";
import { LMR } from "tonwa-com";
import { PageAtomList, PageAtomNew, PageAtomView, GenAtom, PageAtomSelect } from "app/template/Atom";
import { Atom } from "uqs/UqDefault";

export const pathProductNew = 'product-new';
export const pathProductList = 'product-list';
export const pathProductView = 'product-view';
export const pathProductEdit = 'product-edit';

export class GenProduct extends GenAtom {
    readonly atomName = 'product';
    readonly path: string;
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
    atoms: { retailprice: number; }
}

function ViewItemProductRetailPrice({ value }: { value: ProductRetailPrice; }) {
    let { no, ex, atoms: { retailprice } } = value;
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

export const routeProduct = <>
    <Route path={pathProductNew} element={<PageAtomNew Gen={GenProduct} />} />
    <Route path={pathProductList} element={<PageAtomList Gen={GenProduct} />} />
    <Route path={`${pathProductView}/:id`} element={<PageAtomView Gen={GenProduct} />} />
</>;
