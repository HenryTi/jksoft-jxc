import { Link } from "react-router-dom";
import { Page } from "tonwa-app";
import { Sep } from "tonwa-com";
import { pathSumGroup } from "./PageSumGroup";
import { useUqApp } from "app/UqApp";

export const pathAchieve = 'admin-achieve';

export function PageAchieve() {
    const uqApp = useUqApp();
    return <Page header="业绩设置">
        <Sep sep={3} />
        <Link to={`../${pathSumGroup}`} className="px-3 py-2 border-bottom align-items-center">
            小组
        </Link>
        <Sep />
    </Page>;
}
