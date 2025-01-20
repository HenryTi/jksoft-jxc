import { Page } from "tonwa-app";

export function PageMemo() {
    return <Page header="导入格式说明">
        <div className="my-3">
            <div className="mx-3">导入数据示例</div>
            <pre className="border-top border-bottom text-info mt-3 py-2 px-3">{
                `手机
no,ex,单位,CPU型号,运行内存,机身颜色,机身内存
001, aaa1, 支,a1b1, c1d1, e
002201, aaa2, 盒,a2b2, c2d2,
003, aaa3, 瓶," a3 , "" - "" b3 ", c3d3
004, aaa4, 瓶,a4b4, c4d4
001, aaa1, 瓶,a1b1, c1d1, e
002, aaa2, 瓶,a2b2, c2d2,
003, aaa3, 瓶,a3b3, c3d3
`}
            </pre>
        </div>
        <div className="px-3 pb-3 mb-2 border-bottom">说明</div>
        <ul>
            <li>Atom的第一行，是Atom名称</li>
            <li>数据之间用逗号分开</li>
            <li>Atom的第二行，是列名。第一列必须是no，第二列必须是ex</li>
            <li>随后的每一行都是数据</li>
            <li>单选项的值：选项名称</li>
            <li>多选项的值：选项名称1+选项名称2+选项名称3+...</li>
            <li>Atom值: no</li>
            <li>日期值: 2024-1-3</li>
            <li>如果字段内容含有逗号，则字段内容两边需要加双引号</li>
            <li>如果字段内容含有双引号，则字段内容两边需要加引号，并且内容双引号变成两个</li>
        </ul>
    </Page>;
}
