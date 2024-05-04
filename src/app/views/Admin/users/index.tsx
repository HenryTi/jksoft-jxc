import { centers } from "app/views/center";
import { Route } from "react-router-dom";
import { PageUsers } from "./PageUsers";

export const routeUsers = <>
    <Route path={centers.users.path} element={<PageUsers />} />
</>;
