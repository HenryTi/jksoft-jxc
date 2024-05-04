import { Image } from "tonwa-app";
import { FA } from "tonwa-com";
import { ReturnGetUsers$page } from "uqs/UqDefault";

export function ViewUser({ user }: { user: ReturnGetUsers$page }) {
    const { assigned, tuName, tuNick, tuIcon } = user;
    let image: any;
    if (tuIcon !== undefined) image = <Image src={tuIcon} />;
    else {
        image = <FA name="user-o" size="2x" />;
    }
    return <>
        <div className="me-3 w-2-5c h-2-5c d-flex align-items-center justify-content-center align-self-start">{image}</div>
        <div className="flex-fill">
            <div>
                {assigned ?? tuNick}
            </div>
            <div className="text-body-tertiary small">
                {tuName}
            </div>
        </div>
    </>
}