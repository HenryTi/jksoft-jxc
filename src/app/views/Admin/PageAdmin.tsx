import { Page } from "tonwa-app";
import { Link } from "react-router-dom";
import { pathAchieve } from "./achieve";
import { captionUser, pathUser } from "./user";
import { captionAchieve } from "./achieve";

export const pathAdmin = 'admin';
export function PageAdmin() {
    const cmds = [
        { label: captionAchieve, path: `/${pathAchieve}` },
        { label: captionUser, path: `/${pathUser}` },
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
