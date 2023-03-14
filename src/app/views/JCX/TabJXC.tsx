import { Link } from "react-router-dom";
import { Page } from "tonwa-app";
import { FA, LMR, Sep } from "tonwa-com";
import { pathIDCenter } from "./IDCenter";
import { pathContactList, pathContactNew } from "./IDContact";
import { pathProductList, pathProductNew } from "./IDProduct";
import { pathReportCenter } from "./ReportCenter";
import { pathSheetCenter } from "./SheetCenter";

interface Cmd {
    to: string;
    caption: string;
}
export function TabJXC() {
    const cmdProducts: Cmd[] = [
        { to: pathProductNew, caption: '新建产品' },
        { to: pathProductNew, caption: '新建产品2' },
    ]
    const cmdContacts: Cmd[] = [
        { to: pathContactNew, caption: '新建往来单位' },
        { to: pathContactNew, caption: '新建往来单位2' },
    ]
    function LinkCmd(cmd: Cmd, index: number) {
        const { to, caption } = cmd;
        return <Link key={index} to={to} className="px-3 py-3 border-bottom ">
            <FA name="chevron-circle-right" className="me-2 text-secondary" />
            {caption}
        </Link>;
    }
    const arr: { label: string; path: string; }[] = [
        { label: '单据中心', path: pathSheetCenter },
        { label: '档案中心', path: pathIDCenter },
        { label: '报表中心', path: pathReportCenter },
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
