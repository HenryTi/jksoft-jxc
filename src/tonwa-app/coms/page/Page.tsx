import { Suspense, useContext, useEffect, useRef } from "react";
import { NavigationType, useLocation, useNavigate, useNavigationType } from "react-router-dom";
import { useAtomValue } from "jotai/react";
import 'font-awesome/css/font-awesome.min.css';
import '../../css/tonwa-page.css';
import { ModalContext, useModal, useUqAppBase } from "../../UqAppBase";
import { PageProps, Scroller } from "./PageProps";
import { ButtonPageBack } from "./ButtonPageBack";
import { PageSpinner } from "./PageSpinner";
import { theme, useEffectOnce } from "tonwa-com";

const scrollTimeGap = 100;
const scrollEdgeGap = 30;

// const theme.bootstrapContainer = ' container ';
// export const theme.bootstrapContainer = ' container-fluid ';
export function PageBase(props: PageProps) {
    const uqApp = useUqAppBase();
    let { children, header, back, right, top, footer, onClosed, hideScroll } = props;
    const divRef = useRef<HTMLDivElement>(undefined);
    useEffectOnce(() => {
        let { current: div } = divRef;
        if (!div) return;
        let elScroll = getScrollableParent(div);
        if (!elScroll) return;
        if (hideScroll === true) {
            //window.onscroll = undefined;
            elScroll.onscroll = undefined;
        }
        else {
            // window.onscroll = onScroll;
            elScroll.onscroll = onScroll;
        }

        let bottomTimeSave = 0;
        let topTimeSave = 0;
        let scrollTopSave = elScroll.scrollTop;
        function onScroll(e: any) {
            let { onScroll: propsOnScroll, onScrollTop, onScrollBottom } = props;
            if (propsOnScroll) propsOnScroll(e);

            // let el = (e.target as Document).scrollingElement as HTMLBaseElement;
            let el = e.target;
            const { scrollTop, offsetHeight, scrollHeight } = el;
            if (scrollTop > scrollTopSave) {
                scrollTopSave = scrollTop;
            }
            const pageCache = uqApp.pageCache.getCache();
            if (pageCache !== undefined && scrollTop > 0) {
                Object.assign(pageCache, { scrollTop });
            }
            let scroller = new Scroller(el);
            if (onScrollTop !== undefined && scrollTop < scrollEdgeGap) {
                let topTime = new Date().getTime();
                if (topTime - topTimeSave > scrollTimeGap) {
                    topTimeSave = topTime;
                    onScrollTop(scroller).then(ret => {
                        // has more
                        if (ret === true) {
                            let sh = scrollHeight;
                            let top = 200;
                            if (top > sh) top = sh;
                            el.scrollTop = top;
                        }
                    });
                }
            }
            if (onScrollBottom !== undefined
                && scrollTop + offsetHeight > scrollHeight - scrollEdgeGap
                && scrollTop >= scrollTopSave) {
                ++scrollTopSave;
                let bottomTime = new Date().getTime();
                if (bottomTime - bottomTimeSave > scrollTimeGap) {
                    bottomTimeSave = bottomTime;
                    setTimeout(() => onScrollBottom(scroller), 50);
                }
            }
        }
        return () => {
            onClosed?.();
        }
    });
    if (header || back || right) {
        // 没有onBack的时候，会引用useNavigate. 如果在Modal方式下，会引发异常。
        header = <div className="d-flex align-items-center">
            <ButtonPageBack {...props} />
            <div className="flex-fill">{header}</div>
            {right}
        </div>;
    }
    return <div ref={divRef} className={'tonwa-page ' + theme.small}>
        <Suspense fallback={<PageSpinner />}>
            <div className='z-3 position-sticky top-0'>
                <div className="tonwa-page-header">
                    <div className={theme.bootstrapContainer + ' px-0 '}>
                        {header}
                    </div>
                </div>
                {top && <div className="tonwa-page-content">
                    <div className={theme.bootstrapContainer + ' px-0 '}>
                        {top}
                    </div>
                </div>}
            </div>
            <div className='tonwa-page-content flex-fill d-flex'>
                <div className={theme.bootstrapContainer + ' px-0 d-flex flex-column '}>
                    {children}
                </div>
            </div>
            <div className='tonwa-page-footer position-sticky bottom-0'>
                <div className={theme.bootstrapContainer + ' px-0 '}>
                    {footer}
                </div>
            </div>
        </Suspense>
    </div>;
}

export function PageModal(props: PageProps) {
    const modal = useModal();
    const modalProps = { ...props, back: 'close', onBack: () => modal.close(undefined) };
    return <PageBase {...modalProps as any} />;
}

function PageNav(props: PageProps) {
    const uqApp = useUqAppBase();
    const navAction = useNavigationType();
    const navigate = useNavigate();
    const { user: userAtom, mustLogin, pathLogin } = uqApp;
    const user = useAtomValue(userAtom);
    const { pathname } = useLocation();
    useEffect(() => {
        if (props.auth === false) return;
        if (mustLogin && !user && pathLogin) {
            navigate(pathLogin, { state: pathname });
        }
    }, [user, mustLogin, pathLogin]);
    if (props.auth !== false && mustLogin && !user) return null;
    useEffectOnce(() => {
        uqApp.pageCache.onNav(navAction, pathname);
        if (navAction !== NavigationType.Pop) return;
        const pageCache = uqApp.pageCache.getCache();
        if (pageCache === undefined) return;
        const { scrollTop } = pageCache;
        if (scrollTop) {
            setTimeout(() => {
                const scrollOptions = { top: scrollTop };
                window.scroll(scrollOptions);
            }, 10);
        }
    });
    return <PageBase {...props} />;
}

export function Page(props: PageProps) {
    const isModal = useContext<boolean>(ModalContext);
    if (isModal === true) {
        return <PageModal {...props} />;
    }
    else {
        return <PageNav {...props} />;
    }
}

function isScrollable(ele: HTMLElement) {
    return ele.classList.contains('tonwa-page');
    const hasScrollableContent = ele.scrollHeight > ele.clientHeight;

    const overflowYStyle = window.getComputedStyle(ele).overflowY;
    const isOverflowHidden = overflowYStyle.indexOf('hidden') !== -1;

    return hasScrollableContent && !isOverflowHidden;
}

function getScrollableParent(ele: HTMLElement): HTMLElement {
    return (!ele || ele === document.body) ?
        document.body
        :
        (
            isScrollable(ele) ?
                ele
                :
                getScrollableParent(ele.parentElement)
        );
}
