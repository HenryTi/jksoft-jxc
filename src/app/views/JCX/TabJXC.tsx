import { Link } from "react-router-dom";
import { Page } from "tonwa-app";
import { pathIDCenter } from "./IDCenter";
import { pathReportCenter } from "./ReportCenter";
import { pathPrice } from "./SettingPrice";
import { pathSheetCenter } from "./SheetCenter";

interface Cmd {
    to: string;
    caption: string;
}
export function TabJXC() {
    const arr: { label: string; path: string; }[] = [
        { label: '单据中心', path: pathSheetCenter },
        { label: '档案中心', path: pathIDCenter },
        { label: '报表中心', path: pathReportCenter },
        { label: '设置价格', path: pathPrice },
    ];
    return <Page header="测试" back="none">
        <div className="px-3 py-2 border-bottom small tonwa-bg-gray-1">测试页面</div>
        {arr.map((v, index) => {
            const { label, path } = v;
            return <Link key={index} to={path} className="px-3 py-2 border-bottom align-items-center">
                {label}
            </Link>
        })}
    </Page>;
}
