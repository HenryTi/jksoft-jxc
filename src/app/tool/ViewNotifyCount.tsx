import { useUqApp } from "app/UqApp";
import { useAtomValue } from "jotai";

export function ViewNotifyCount({ phrase }: { phrase: number; }) {
    const uqApp = useUqApp();
    const notifyCounts = useAtomValue(uqApp._notifyCounts);
    let notifyCount = notifyCounts[phrase];
    if (notifyCount > 0) {
        return <span className="ms-3 badge rounded-pill bg-danger">
            {notifyCount > 100 ? '99+' : notifyCount}
            <span className="visually-hidden">unread messages</span>
        </span>
    }
}
