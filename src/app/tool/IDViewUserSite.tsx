import { IDView, Page, SelectUser, ViewUserAssigned, useModal } from "tonwa-app";
import { Uq, User } from "tonwa-uq";

export function IDViewUserSite({ uq, userSite, Template }: { uq: Uq; userSite: number; Template?: ({ user, assigned }: { user: User; assigned: string; }) => JSX.Element; }) {
    if (Template === undefined) Template = ViewUserAssigned;
    function ViewUserSite({ value }: { value: any }) {
        const { assigned } = value;
        function ViewUserHere({ value }: { value: any }) {
            return <Template user={value} assigned={assigned} />;
        }
        return <IDView uq={uq} id={value.user} Template={ViewUserHere} />;
    }
    return <IDView uq={uq} id={userSite} Template={ViewUserSite} />
}