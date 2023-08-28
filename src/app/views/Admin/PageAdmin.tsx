import { Page } from "tonwa-app";
import { Link, Route } from "react-router-dom";
import { pathAchieve } from "./achieve";
import { captionUser, pathUser } from "./user";
import { captionAchieve } from "./achieve";
import { gUomI } from "./uom";
import { CaptionAtom, pathAtomList } from "app/hooks";
import { EnumAtom } from "uqs/UqDefault";

export const pathAdmin = 'admin';
function PageAdmin() {
    const cmds = [
        { label: captionAchieve, path: pathAchieve },
        { label: captionUser, path: pathUser },
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
