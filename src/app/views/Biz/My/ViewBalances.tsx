import { renderNum } from "app/tool";
import { Link } from "react-router-dom";
import { ReturnGetMyBalanceRet } from "uqs/UqDefault";

export function ViewBalances({ balances }: { balances: ReturnGetMyBalanceRet[] }) {
    async function onAccountClick(account: any) {
    }

    return <>{balances.map((v, index) => {
        return <Link key={index}
            to={'PageObjectAccountHistory/accountId'}
            onClick={() => onAccountClick(v)}>
            <ViewBalance balance={v} />
        </Link>
    })}</>;
}

function ViewBalance({ balance }: { balance: ReturnGetMyBalanceRet }) {
    const { obj, post, subject, value } = balance;
    let uom = '元';
    let fixed = 2;
    return <div className="m-2 p-3 border border-3 border-info-subtle rounded rounded-3 bg-white text-center cursor-pointer w-min-12c">
        <div className="mb-1">
            <span className="text-secondary small">{obj} {post} &nbsp;</span>
            <span className="text-primary">{subject}</span>
        </div>
        <div className="fs-larger">{renderNum(value, uom, fixed)}</div>
    </div>;
}
