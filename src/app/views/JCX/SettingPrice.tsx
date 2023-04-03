import { PageSetting, GenSetting } from "app/template";
import { GenProps } from "app/tool";
import { Route } from "react-router-dom";

export const pathPrice = 'price';

export class GenPrice extends GenSetting {
    readonly itemName = 'product';
    readonly settingNames = ['retailprice'];
    get caption() {
        /*
        const { name, caption } = this.bizItem;
        return caption ?? name;
        */
        return '零售价设置';
    };
}

export function PagePrice(props: GenProps<GenPrice>) {
    const { Gen } = props;
    return <PageSetting Gen={Gen} />
}

export const routePrice = <>
    <Route path={pathPrice} element={<PagePrice Gen={GenPrice} />} />
</>;
