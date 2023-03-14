import { NavLink, Outlet } from "react-router-dom";
import { FA } from "tonwa-com";

interface PageTabsLayoutProps {
    tabs: { to: string; caption: string; icon: string }[];
}

export function PageTabsLayout({ tabs }: PageTabsLayoutProps) {
    function tabClassName({ isActive }: {
        isActive: boolean;
        isPending: boolean;
    }) {
        return 'flex-fill mx-1 text-center py-1 ' +
            (isActive === true ? 'text-primary' : 'text-secondary');
    }
    let vTabs = <div className="d-flex container">
        {tabs.map(v => {
            const { to, caption, icon } = v;
            return <NavLink key={caption} to={to} className={tabClassName} replace={true}>
                <FA name={icon} /> <br />
                {caption}
            </NavLink>;
        })}
    </div>;

    return <div className='d-flex flex-column flex-fill h-100'>
        <div className='flex-fill d-flex'>
            <Outlet />
        </div>
        <div className='invisible'>
            {vTabs}
        </div>
        <div className='tonwa-bg-gray-3 position-fixed bottom-0 w-100 bottom-top'>
            {vTabs}
        </div>
    </div>;
}
