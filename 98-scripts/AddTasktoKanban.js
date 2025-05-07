// module.exports = async (params) => {
//     // 1. 获取用户输入的任务名称
//     const taskName = await params.quickAddApi.inputPrompt("📝 输入任务名称");
//     if (!taskName?.trim()) {
//         new Notice("❌ 任务名称不能为空！", 3000);
//         return;
//     }

//     // const priority = await params.quickAddApi.suggester(
//     // ["⏬ 最低", "🔽 低", "一般", "🔼 中等", "⏫ 高", "🔺 最高"],
//     // ["⏬", "🔽", "", "🔼", "⏫", "🔺"],
//     // true,
//     // "选择任务优先级"
//     // );
//     // 2. 优先级选择（已添加提示语）
//     const priority = await params.quickAddApi.suggester(
//         [
//             "⏬ 最低（可延后处理）", 
//             "🔽 低（3天内完成）", 
//             "一般（本周完成）", 
//             "🔼 中等（优先处理）", 
//             "⏫ 高（紧急）", 
//             "🔺 最高（立刻处理）"
//         ],
//         ["⏬", "🔽", "", "🔼", "⏫", "🔺"],
//         false,  // 禁用多选
//         "🎯 请选择任务优先级："  // 提示语
//     );

//     // 2. 生成任务文本（带当前日期）
//     const newTask = `- [ ] ${taskName.trim()} ${priority} 📅 ${new Date().toISOString().split('T')[0]}`;

//     // 3. 定位目标文件（任务看板.md）
//     const targetFile = app.vault.getAbstractFileByPath("任务看板.md");
//     if (!targetFile) {
//         new Notice("❌ 未找到文件：任务看板.md", 5000);
//         return;
//     }

//     // 4. 读取文件内容
//     let content = await app.vault.read(targetFile);

//     // 5. 找到 ## Todo 标题的位置
//     const todoHeader = "## Todo";
//     const todoIndex = content.indexOf(todoHeader);
//     if (todoIndex === -1) {
//         new Notice("❌ 文件中未找到 '## Todo' 标题", 5000);
//         return;
//     }

//     // 6. 在 ## Todo 下方插入任务
//     const insertPosition = todoIndex + todoHeader.length;
//     const newContent = 
//         content.slice(0, insertPosition) + 
//         `\n${newTask}` + 
//         content.slice(insertPosition);

//     // 7. 写入文件
//     await app.vault.modify(targetFile, newContent);
//     new Notice("✅ 任务已添加到看板！", 3000);
// };

// module.exports = async (params) => {
//     // ===== 1. 获取 Templater API =====
//     const templater = app.plugins.plugins["templater-obsidian"];
//     if (!templater) {
//         new Notice("❌ 需要安装 Templater 插件！");
//         return;
//     }
//     const tp = templater.create_tp(params.app, params.variables);

//     // ===== 2. 输入任务名称 =====
//     const taskName = await params.quickAddApi.inputPrompt(
//         "📝 任务名称",
//         "",
//         "例如：完成项目会议记录"
//     );
//     if (!taskName?.trim()) {
//         new Notice("❌ 必须输入任务名称！");
//         return;
//     }

//     // ===== 3. 调用 Templater 日期选择器 =====
//     const dueDate = await tp.system.prompt(
//         "📅 选择截止日期",
//         "",
//         false, // 禁用多行输入
//         tp.date.now("YYYY-MM-DD") // 关键！触发日历弹窗
//     );
//     if (!dueDate) {
//         new Notice("❌ 必须选择日期！");
//         return;
//     }

//     // ===== 4. 生成 Tasks 规范格式 =====
//     const createdDate = tp.date.now("YYYY-MM-DD"); // 创建日期
//     const taskLine = `- [ ] ${taskName.trim()} ➕ ${createdDate} 📅 ${dueDate}`;

//     // ===== 5. 写入文件 =====
//     const targetFile = app.workspace.getActiveFile() || 
//         app.vault.getAbstractFileByPath("待办事项.md");
//     await app.vault.append(targetFile, `\n${taskLine}`);
//     new Notice(`✅ 任务已添加到 ${targetFile.basename}`);
// };

module.exports = async (params) => {
    // ===== 1. 获取 Templater API =====
    const newTask = await app.plugins.plugins["obsidian-tasks-plugin"].apiV1.createTaskLineModal();;
    if (!newTask) {
        new Notice("创建任务失败");
        return;
    }
    const tag = "#task";
    const targetFile = app.vault.getAbstractFileByPath("任务看板.md");
    if (!targetFile) {
        new Notice("❌ 未找到文件：任务看板.md", 5000);
        return;
    }

    // 4. 读取文件内容
    let content = await app.vault.read(targetFile);

    // 5. 找到 ## Todo 标题的位置
    const todoHeader = "## Todo";
    const todoIndex = content.indexOf(todoHeader);
    if (todoIndex === -1) {
        new Notice("❌ 文件中未找到 '## Todo' 标题", 5000);
        return;
    }

    // 6. 在 ## Todo 下方插入任务
    const insertPosition = todoIndex + todoHeader.length;
    const newContent = 
        content.slice(0, insertPosition) + 
        `\n${newTask} ${tag}` + 
        content.slice(insertPosition);

    // 7. 写入文件
    await app.vault.modify(targetFile, newContent);
    new Notice("✅ 任务已添加到看板！", 3000);
};