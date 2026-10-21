# 大肥鱼办公室 · dsh-fish-office

本插件支持在 DeepSeek Harness 右侧打开一间像素风格的鲸鱼娘办公室，显示真实任务与多智能体的工作状态。

<table>
  <tr>
    <th align="center">白天</th>
    <th align="center">黄昏</th>
    <th align="center">夜晚</th>
  </tr>
  <tr>
    <td width="33%" valign="top"><img src="assets/白天.png" alt="大肥鱼办公室 · 白天" width="100%"></td>
    <td width="33%" valign="top"><img src="assets/黄昏.png" alt="大肥鱼办公室 · 黄昏" width="100%"></td>
    <td width="33%" valign="top"><img src="assets/夜晚.png" alt="大肥鱼办公室 · 夜晚" width="100%"></td>
  </tr>
</table>

## 员工图鉴

![大肥鱼办公室员工海报：鲸理、小D、小E、小P、小S、小K与小C的形象和中文简历](assets/员工海报.png)

## DeepSeek Harness 插件效果
![插件效果](assets/DSH显示.png)

## 从 GitHub 安装

需要 DSH 0.2.1-rc.2 或同系列后续版本，Node.js 22.19+（22.x）或 24+。

桌面版：打开 DSH 的插件管理，选择安装插件，填写 `github:Hjy0714/dsh-fish-office`。

Web 版：

```sh
npx @deepseek-ai/dsh@0.2.1-rc.2 plugin --profile web add github:Hjy0714/dsh-fish-office
```

安装后重启 DSH，点击“🐋 大肥鱼办公室”。

## 自定义

员工姓名、介绍和对白统一在插件自身 `config/` 下的 `员工档案.json` 与 `对白库.json` 中修改，保存后自动生效。

## 许可证

[MIT](LICENSE)，代码与随包美术均可使用。
