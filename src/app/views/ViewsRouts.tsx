import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Page, PageTabsLayout, PageSpinner } from 'tonwa-app';
import { AppLogin, AppRegister } from '../tool';
import { pathMe, routeMe, TabMe } from './Me';
import { routePrivacy } from 'app/tool';
import { pathJXC, routeJCX, TabJXC } from './JCX';
import { pathSetup, routeSetup, TabSetup } from 'app/setup';

export function ViewsRoutes() {
    const homeLayout = <PageTabsLayout tabs={[
        { to: '/' + pathJXC, caption: '首页', icon: 'home' },
        { to: '/' + pathSetup, caption: '设置', icon: 'wrench' },
        { to: '/' + pathMe, caption: '我的', icon: 'user' },
    ]} />;

    return <Suspense fallback={<PageSpinner />}>
        <BrowserRouter basename='jksoft-jxc'>
            <Routes>
                <Route path="/" element={homeLayout}>
                    <Route index element={<TabJXC />} />
                    <Route path={pathJXC + '/*'} element={<TabJXC />} />
                    <Route path={pathSetup + '/*'} element={<TabSetup />} />
                    <Route path={pathMe + '/*'} element={<TabMe />} />
                </Route>
                {routeMe}
                {routeJCX}
                {routeSetup}
                <Route path="/test" element={<Page header="Test">test</Page>} />
                <Route path="/login/*" element={<AppLogin />} />
                <Route path="/register" element={<AppRegister />} />
                {routePrivacy}
            </Routes>
        </BrowserRouter>
    </Suspense>;
}
