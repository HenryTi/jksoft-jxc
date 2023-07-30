import { useUqApp } from "app/UqApp";
import { renderNum } from "app/tool";
import { Link } from "react-router-dom";

const subjectTitles: { [id: number]: { title: string; metricUnit: string; fixed: number; } } = {
    "1": { title: 'A', metricUnit: '元', fixed: 2 },
    "2": { title: 'B', metricUnit: '元', fixed: 2 },
};
const postTitles: { [id: number]: { title: string } } = {
    "1": { title: '销售员' },
    "2": { title: '组长' },
};

export function ViewSubjects() {
    const uqApp = useUqApp();
    // const nav = useNav();
    let accounts: { post: number, account: number; balance: number }[] = [
        { post: 1, account: 1, balance: 10.01 },
        { post: 2, account: 2, balance: 99.99 },
    ];
    async function onAccountClick(account: any) {
        // nav.open(<PageObjectAccountHistory account={account} />);
    }

    return <>{accounts.map((v, index) => {
        let { post, account, balance } = v;
        let { title, metricUnit, fixed } = subjectTitles[account];
        let postTitle = postTitles[post];
        return <Link key={index}
            className="m-2 p-3 border border-3 border-info-subtle rounded rounded-3 bg-white text-center cursor-pointer w-min-12c"
            to={'PageObjectAccountHistory/accountId'}
            onClick={() => onAccountClick(v)}>
            <div className="mb-1">
                <span className="text-secondary small">{postTitle?.title} &nbsp;</span>
                <span className="text-primary">{title}</span>
            </div>
            <div className="fs-larger">{renderNum(balance, metricUnit, fixed)}</div>
        </Link>
    })}</>;
}
