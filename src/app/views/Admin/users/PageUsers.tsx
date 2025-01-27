import { centers } from "app/views/center";
import { useUsersStore } from "./UsersStore";
import { PageQueryMore } from "app/coms";
import { ReturnGetUsers$page } from "uqs/UqDefault";
import { Image, useModal } from "tonwa-app";
import { FA } from "tonwa-com";
import { PageUser } from "./PageUser";
import { ViewUser } from "./ViewUser";
import { ViewCurSiteHeader } from "app/views/Site";

export function PageUsers() {
    const modal = useModal();
    const { users } = centers;
    const usersStore = useUsersStore();
    async function onItemClick(item: any) {
        await usersStore.loadUserBuds(item.userSite);
        modal.open(<PageUser user={item} usersStore={usersStore} />);
    }
    return <PageQueryMore header={<ViewCurSiteHeader caption={users.caption} />}
        query={usersStore.getUserBuds}
        param={{}}
        sortField="id"
        ViewItem={ViewUserItem}
        onItemClick={onItemClick}
    >
    </PageQueryMore>
}

function ViewUserItem({ value }: { value: ReturnGetUsers$page }) {
    return <div className="px-3 py-2 d-flex align-items-center cursor-pointer">
        <ViewUser user={value} />
        <div>
            <FA name="angle-right" />
        </div>
    </div>
}