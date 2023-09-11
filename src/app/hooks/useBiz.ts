import { useUqApp } from "app/UqApp";
import { useQuery } from "react-query";

export function useBiz() {
    const uqApp = useUqApp();
    const { data: biz } = useQuery('biz', uqApp.loginSite, {
        cacheTime: 100000000000,
        refetchOnWindowFocus: false
    });
    return biz;
}

