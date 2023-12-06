### 项目说明
1. 建立一个 /projects 目录
2. 在 /projects 目录下，建/ts-uq子目录。
    1. 从github获取。
    2. https://github.com/HenryTi/ts-uq.git
3. 在 /projects 目录下，建/mixi子目录。
    1. 从github获取。
    2. https://github.com/HenryTi/mixi.git
4. 生成uq接口代码
    1. 在/mixi/src/uqconfig.json中，包含要用到uq名称的定义。
    2. 在/mixi子目录下，运行 node ../../ts-uq/out/index.js。生成的接口代码，在/mixi/src/uqs子目录下
5. 项目建立使用vite
---

### 页面导航
1. react-router-dom导航页面。在浏览器地址栏，会显示页面路径
2. useModal方式，相当于模式对话框。没有页面路径。
    1. let { openModal, closeModal } = useModal();
    2. let result = await openModal(<div>对话框</div>, '标题'); 可以直接返回对话框的结果值
    3. 模式对话框里面，不能调用跟react-router-dom相关的导航操作。也不能用Link。
    4. 模式对话框，仅用来显示信息，或者用户输入信息。
3. tonwa-app库里面，/auth子目录下，有混合页面导航和modal的实例。用到的form以后改成react-hook-form
---

### LabelRow 和 LabelRowEdit
1. LabelRow在一行上带label显示值，并可以点击进入下一个页面
2. LabelRowEdit在一行带label显示值，点击进入新页面，可以修改值。返回之后，值自动改变。
3. 多个LabelRow，可以共享一样的显示模板。
4. \mixi\src\app\views\Me\PageEditMe.tsx 有示例
---

### Form
1. 主要使用 react-hook-form
2. react-hook-form是目前思路最清晰的form组件。功能强大，使用方便，逻辑顺畅。
3. 简化form的编程，可以用tonwa-app库中的FormRowsView。用json描述form格式和校验。类似于之前tonwa-com里form的思路
---

### 状态
1. jotai，atom方式来保存和提取状态，实现view的自动更新
2. 在组件外直接读写值。也可以在组件内容，用useAtom来读写。
3. 概念清晰。用atom做状态，不容易乱。
4. 整个包，js压缩代码只有不到3k
5. 之前用过valtio。valtio和jotai是同一个作者写的。jotai刚出2.0，全面转jotai
6. 以前用valtio的代码，以后都改jotai。valtio也很小，也只有不到3k
7. jotai支持异步读写数据。在view中，会大大简化编程

### 分页查询页面
1. PageQueryMore，/mixi/src/app/coms/PageQueryMore.tsx
2. 直接把uq里面的分页查询，用页面滚动到底自动增加数据的方式，实现分页增量查询
3. 仅仅需要写每一行的显示组件
4. <PageQueryMore ...>content</PageQueryMore>，content会显示在页的上部
