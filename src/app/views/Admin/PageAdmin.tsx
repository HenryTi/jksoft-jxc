import { Page } from "tonwa-app";
import { Link, Route } from "react-router-dom";
import { gUomI } from "./uom";
import { CaptionAtom, pathAtomList } from "app/hooks";
import { EnumAtom } from "uqs/UqDefault";
import { centers } from "../pathes";

export const pathAdmin = 'admin';
function PageAdmin() {
    const { user, achieve } = centers;
    const cmds = [
        { label: achieve.caption, path: achieve.path },
        { label: user.caption, path: user.path },
        { label: <CaptionAtom atom={EnumAtom.UomI} />, path: pathAtomList(gUomI.name) },
    ];
    return <Page header="管理员">
        {cmds.map((v, index) => {
            const { label, path } = v;
            return <Link key={index} to={`../${path}`} className="px-3 py-2 border-bottom align-items-center">
                {label}
            </Link>
        })}
    </Page>;
}

export const routePageAdmin = <>
    <Route path={pathAdmin} element={<PageAdmin />} />
</>;
