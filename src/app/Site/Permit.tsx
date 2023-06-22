import { useUqApp } from "app/UqApp";

export function Permit({ permit, children }: { permit?: string | string[]; children: React.ReactNode; }) {
    let uqApp = useUqApp();
    let { uqSites: uqUnit } = uqApp;
    if (uqUnit === undefined) return null;
    let { userSite } = uqUnit;
    if (userSite === undefined) return null;
    let { permits, isAdmin } = userSite;
    let show = isAdmin;
    if (permit !== undefined) {
        if (typeof permit === 'string') {
            if (permits[permit] === true) {
                show = true;
            }
        }
        else {
            for (let p of permit) {
                if (permits[p] === true) {
                    show = true;
                    break;
                }
            }
        }
    }
    if (show === true) {
        return <>
            {children}
        </>
    };
}
