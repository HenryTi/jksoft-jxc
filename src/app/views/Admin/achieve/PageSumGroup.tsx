import { useUqApp } from "app/UqApp";
import { PageQueryMore } from "app/coms";
import { OptionsUseBizAtom, pathAtom, useBizAtom } from "app/hooks";
import { ViewAtom } from "app/hooks";
import { Link } from "react-router-dom";
import { AtomData } from "tonwa";
import { LinkModal } from "tonwa-app";
import { CheckAsync, FA } from "tonwa-com";
import { Atom, EnumAtom } from "uqs/UqDefault";

export const pathSumGroup = 'admin-sum-group';

const options: OptionsUseBizAtom = {
    atomName: EnumAtom.SumGroup,
};

export function PageSumGroup() {
    const useBizAtomReturn = useBizAtom(options);
    const { entity, searchAtoms } = useBizAtomReturn;
    let entityAtom = entity;
    const right = <Link className="btn btn-sm btn-success me-2" to={`../${pathAtom.new(entityAtom.id)}`}>
        <FA name="plus" />
    </Link>;
    return <PageList />;

    function PageList() {
        let caption = entityAtom.caption;
        let searchParam = {
            atom: entityAtom.id,
            key: undefined as string,
        };
        function ViewItem({ value }: { value: any }) {
            async function openOneGroup() {
                return <PageOneGroup group={value} />
            }
            return <LinkModal modal={openOneGroup}><div className="px-3 py-2" >
                <ViewAtom value={value} />
            </div>
            </LinkModal>;
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

function PageOneGroup({ group }: { group: AtomData; }) {
    const { uq } = useUqApp();
    /*
    const modal = useModal();
    function PageAddPerson() {
        return <Page header="组员">

        </Page>;
    }
    function onAddPerson() {
        modal.open(<PageAddPerson />);
    }
    const right = <button className="btn btn-sm btn-info me-2" onClick={onAddPerson}>
        <FA name="plus" />
    </button>;
    */
    const none = <div className='m-3 small text-muted'>[无]</div>;
    function ViewItemPerson({ value }: { value: AtomData & { selected: number; } }) {
        async function onCheckChanged(name: string, checked: boolean) {
            let act: number = checked === true ? 1 : -1;
            await uq.SetSumGroupPerson.submit({ group: group.id, person: value.id, act, });
        }
        return <CheckAsync className="d-flex px-3 py-2" onCheckChanged={onCheckChanged} defaultChecked={value.selected === 1}>
            <ViewAtom value={value} />
        </CheckAsync>;
    }
    return <PageQueryMore header={`成员`}
        query={uq.SearchGroupPersons}
        param={{ group: group.id, key: undefined, }}
        sortField="id"
        ViewItem={ViewItemPerson}
        none={none}
    >
        <div className="p-3 tonwa-bg-gray-2">
            <ViewAtom value={group} />
        </div>
    </PageQueryMore>;
}
