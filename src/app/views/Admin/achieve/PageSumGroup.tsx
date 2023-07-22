import { EntityAtom } from "app/Biz";
import { PageQueryMore } from "app/coms";
import { OptionsUseBizAtom, pathAtomNew, useBizAtom } from "app/hooks";
import { ViewItemID } from "app/views/JXC/ViewItemID";
import { Link, useParams } from "react-router-dom";
import { Page } from "tonwa-app";
import { FA, List } from "tonwa-com";
import { EnumAtom } from "uqs/UqDefault";

export const pathSumGroup = 'admin-sum-group';

const options: OptionsUseBizAtom = {
    atomName: EnumAtom.SumGroup,
};

export function PageSumGroup() {
    const useBizAtomReturn = useBizAtom(options);
    const { entity, pathList, pathView, searchAtoms } = useBizAtomReturn;
    const { atom: atomName } = useParams();
    let entityAtom = useBizAtomReturn.getEntityAtom(atomName) ?? entity;
    const right = <Link className="btn btn-sm btn-success me-2" to={`../${pathAtomNew(entityAtom.name)}`}>
        <FA name="plus" />
    </Link>;
    return <PageList />;

    function PageList() {
        let caption = entityAtom.caption ?? entityAtom.name;
        let searchParam = {
            atom: entityAtom.phrase,
            key: undefined as string,
        };
        function ViewItem({ value }: { value: any }) {
            return <Link to={`../${pathView}/${value.id}`}>
                <div className="px-3 py-2">
                    <ViewItemID value={value} />
                </div>
            </Link>;
        }
        // pageSize={20}
        // pageMoreSize={1}
        const none = <div className='m-3 small text-muted'>[无{caption}]</div>;
        return <PageQueryMore header={`${caption}列表`} right={right}
            query={searchAtoms}
            param={searchParam}
            sortField="id"
            ViewItem={ViewItem}
            none={none}
        >
        </PageQueryMore>;
    }
}