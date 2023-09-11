import { Link } from "react-router-dom";
import { Page } from "tonwa-app";
import { pathAtomCenter } from "./Atom/AtomCenter";
import { pathReportCenter } from "./Subject/SubjectCenter";
import { pathPrice } from "./AssignPrice";
import { pathPermits } from "./Permits";
import { useSelectAtom } from "app/hooks";
import { useUqApp } from "app/UqApp";
import { EnumAtom } from "uqs/UqDefault";
import { pathMy } from "./My";
import { pathSheetCenter } from "./Sheet";

export function TabJXC() {
    const uqApp = useUqApp();
    const selectAtom = useSelectAtom();
    const arr: { label: string; path: string; }[] = [
        { label: '单据中心', path: pathSheetCenter },
        { label: '档案中心', path: pathAtomCenter },
        { label: '报表中心', path: pathReportCenter },
        { label: '设置价格', path: pathPrice },
        { label: '权限演示', path: pathPermits },
        { label: '我的', path: pathMy },
    ];
    const cn = ' px-3 py-2 border-bottom align-items-center ';
    return <Page header="测试" back="none">
        <div className="px-3 py-2 border-bottom small tonwa-bg-gray-1">测试页面</div>
        {arr.map((v, index) => {
            const { label, path } = v;
            return <Link key={index} to={path} className={cn}>
                {label}
            </Link>
        })}
        <div className={cn} onClick={onFunc} role="button">
            功能试验
        </div>
    </Page>;

    async function onFunc() {
        let ret = await selectAtom(EnumAtom.Contact);
        alert(JSON.stringify(ret));
    }
}
