import { Page } from "tonwa-app";

export function PageMemo() {
    return <Page header="导入格式说明">
        <div className="my-3">
            <div className="mx-3">导入数据示例</div>
            <pre className="border-top border-bottom text-info mt-3 py-2 px-3">{
                `手机
001; aaa1; a1:b1; c1:d1; e
002; aaa2; a2:b2; c2:d2;
233211003; 苹果15 Pro Max; 持有人:职员.3399001; 重量:3.0; 类型:手机类型.ios
004; aaa4; a4:b4; c4:d4

手机1
001; aaa1; a1:b1; c1:d1; e
002; aaa2; a2:b2; c2:d2;
003; aaa3; a3:b3; c3:d3
004; aaa4; a4:b4; c4:d4

`}
            </pre>
        </div>
        <div className="px-3 pb-3 mb-2 border-bottom">说明</div>
        <ul>
            <li>可以导入多个Atom组，每组之间加一个空行</li>
            <li>Atom的第一行，是Atom名称</li>
            <li>随后的每一行都是数据</li>
            <li>数据之间用分号分开</li>
            <li>每一行的第一个值，是no，也就是唯一编号</li>
            <li>每一行的第二个值，是ex，也就是可读的说明</li>
            <li>随后是以冒号分开的键值对</li>
            <li>键是属性的名称，值是属性的值</li>
            <li>单选项的值：选项定义.选项名称</li>
            <li>多选项的值：选项定义.选项名称1+选项名称2+选项名称3+...</li>
            <li>Atom值: [Atom名称].[Atom no]</li>
            <li>日期值: 2024-1-3</li>
        </ul>
    </Page>;
}
