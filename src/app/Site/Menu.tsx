import { Page } from "tonwa-app";

export function Menu() {
    return <Page >
        <Permit permit={Permit.A菜单_i1, Permit.A菜单_i4}>
            <input type="text" />
        </Permit>
        <Permit permit={Permit.A菜单_i1, Permit.A菜单_i4}>
            <Menus>
                <Menu>aaaa</Menu>
                <Menu>bbb</Menu>
            </Menus>
        </Permit>
    </Page>;

}