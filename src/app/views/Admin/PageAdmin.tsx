import { Page } from "tonwa-app";
import { Link, Route } from "react-router-dom";
import { centers } from "../center";

export const pathAdmin = 'admin';
function PageAdmin() {
    const { userSum, achieve } = centers;
    const cmds = [
        { label: achieve.caption, path: achieve.path },
        { label: userSum.caption, path: userSum.path },
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
