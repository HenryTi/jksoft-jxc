import { Link } from "react-router-dom";
import { Page } from "tonwa-app";
import { pathAtomCenter } from "./Atom/AtomCenter";
import { pathReportCenter } from "./Subject/SubjectCenter";
import { pathPrice } from "./AssignPrice";
import { pathSheetCenterOld } from "./SheetOld/SheetCenterOld";
import { pathSheetCenter } from "./Sheet";

export function TabJXC() {
    const arr: { label: string; path: string; }[] = [
        { label: '单据中心', path: pathSheetCenter },
        { label: '单据中心-旧', path: pathSheetCenterOld },
        { label: '档案中心', path: pathAtomCenter },
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
