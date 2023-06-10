import { FA, LMR, MutedSmall } from "tonwa-com";
import { roleT } from "./res";
import { useUqAppBase } from "tonwa-app";
import { useAtomValue } from "jotai";

export function Me({ right }: { right?: JSX.Element; }) {
    let uqApp = useUqAppBase();
    let user = useAtomValue(uqApp.user);

    return <LMR className="px-3 py-3 border-bottom align-items-center">
        <span>
            [ <FA name="user-circle" className="me-2 text-danger" /> {roleT('self')} - <MutedSmall>{user.name}</MutedSmall> ]
        </span>
        <span>{right}</span>
    </LMR>;
}
