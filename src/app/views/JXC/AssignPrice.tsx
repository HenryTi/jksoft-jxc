import { PageAssign, GenAssign } from "app/template";
import { GenProps } from "app/tool";
import { Route } from "react-router-dom";

export const pathPrice = 'price';

export class GenPrice extends GenAssign {
    readonly bizEntityName = 'product';
    protected readonly phrases = ['retailprice'];
    get caption() { return '零售价设置'; };
}

export function PagePrice(props: GenProps<GenPrice>) {
    const { Gen } = props;
    return <PageAssign Gen={Gen} />
}

export const routePrice = <>
    <Route path={pathPrice} element={<PagePrice Gen={GenPrice} />} />
</>;
