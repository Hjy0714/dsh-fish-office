# 大肥鱼办公室 · dsh-fish-office

在 DeepSeek Harness 右侧打开一间像素鲸鱼娘办公室，显示真实任务与多智能体的工作状态。

![大肥鱼办公室](assets/preview.png)

- 一名主管、六名员工，工作时开启工位屏幕，空闲时自由活动。
- 任务气泡、技能书架、咖啡、喂鱼、休息与庭院互动。
- 四时光照、现实时间与动态环境，切换聊天保留办公室。

## 从 GitHub 安装

需要 DSH 0.2.1-rc.2 或同系列后续版本，Node.js 22.19+（22.x）或 24+。

桌面版：打开 DSH 的插件管理，选择安装插件，填写 `github:Hjy0714/dsh-fish-office`。

Web 版：

```sh
npx @deepseek-ai/dsh@0.2.1-rc.2 plugin --profile web add github:Hjy0714/dsh-fish-office
```

安装后重启 DSH，点击“🐋 大肥鱼办公室”。仓库自带构建产物，无需 npm 发布或手动构建。

## 自定义

修改 `~/.dsh/fish-office-config/` 中的 `员工档案.json` 和 `对白库.json`，可更改姓名、介绍与对白，保存后自动生效。设置 DSH_HOME 时，配置位于该目录下的 fish-office-config。

仓库内的默认配置只保留在 `config/`，源码与安装包共用。

## 开发

```sh
npm ci --ignore-scripts
npm run build
npm test
```

源码修改后，同步提交 lib/ 中的构建产物。

## 许可证

[MIT](LICENSE)，代码与随包美术均可使用。
