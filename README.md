# 🤖 Mot Ai Bot

[![MIT&Additional Statement License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-v1-green.svg)](https://github.com/xigiy/Mot-Ai-Bot)
![GitHub last commit](https://img.shields.io/github/last-commit/xigiy/Mot-Ai-Bot)

> "你说得对，但是「Mot-Ai-Bot」是由B站UP主FL-xigiy基于通用AI聊天框架开发的智能对话机器人。机器人运行在一个被称作「[Tampermonkey](https://www.tampermonkey.net/)」的脚本管理器中，在这里，被选中的网页将被授予「自动回复」之力。你将扮演一位名为「用户」的神秘访客，在自由的聊天中邂逅不同风格、各有千秋独特的AI角色，和它们一起交流，探索智能对话的乐趣，同时逐步发掘「API调用」的真相。"

>✨ 版本说明:Mot-Ai-Bot是一个运行在[Tampermonkey](https://www.tampermonkey.net/)上的通用AI聊天机器人。它基于OpenAI API，支持多角色切换、对话记忆、手动添加记忆等功能。你可以把它装在任何网页上，让它成为你的智能聊天伙伴。一个可以装在任何网页上的AI聊天机器人，想聊就聊，想换角色就换角色。

>[介绍灵感来源](https://github.com/FCL-Team/FoldCraftLauncher) 求你了我已经改了

## 使用前请先阅读**[DISCLAIMER.md](https://github.com/xigiy/Mot-Ai-Bot/blob/main/DISCLAIMER.md)**

使用本代码前，请**务必**阅读**完整的**[**免责声明与风险告知书/DISCLAIMER.md**](DISCLAIMER.md)。

本代码为脚本性质，使用**可能违反网站用户协议**，导致**账号封禁**。使用者**需自行承担一切风险**。

## 附加声明/重要内容(已包含在LICENSE中)

```LICENSE附加条款
// Additional Statement (English):
// 1. This agreement applies to all published and unpublished versions.
// 2. If you have any questions or requirements, please contact the author: Bilibili FL-xigiy.
// 3. This statement does not affect the legal validity of the MIT License.
// 4. Due to the nature and purpose of the code, secondary distribution is not recommended but not prohibited.

// 附加声明（中文）：
// 1. 本协议适用于所有已发布及未发布的版本。
// 2. 如有疑问或需求，可联系作者：B站 FL-xigiy。
// 3. 本声明不影响 MIT 许可证的法律效力。
// 4. 由于代码性质与用途原因，不建议但不禁止任何形式的二次分发。

```


## ⚠️ 高风险警示 / High-Risk Warning

**本代码为脚本性质，仅供学习研究使用。**
**This code is script-based and for educational purposes only.**

### 🚨 使用风险 / Usage Risks
- 本脚本可能**违反部分网站的用户协议**，使用后可能导致**账号功能受限、封号或其他处罚**。
  This script may **violate the terms of service of certain websites**, which could result in **account restrictions, bans, or other penalties**.

### 📌 使用建议 / Recommendations
- 请在使用前**充分理解代码逻辑**。
  Please **fully understand the code logic** before use.
- 建议在**测试环境**中验证，**谨慎用于实际账号**。
  It is recommended to test in a **safe environment** and use with caution on real accounts.
- 因**盲目修改或不当使用**导致的后果，由使用者自行承担。
  Users assume all consequences resulting from **blind modification or improper use**.

## 📦 功能特点

- 🎭 **多角色切换**：内置多个角色（通用助手、翻译助手、代码专家、心理咨询师），可自由切换
- 💾 **对话记忆**：自动记住最近N轮对话（默认5轮）
- 📝 **手动添加记忆**：为指定用户注入预设对话历史
- ⏱️ **智能冷却**：个人冷却、全局冷却双重防护，避免刷屏
- 🔧 **高度可配置**：所有参数均可自由调整
- 🌐 **跨网站兼容**：通过配置选择器适配任意网站

## 🚀 快速开始

### 前置要求

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 浏览器插件
2. 注册 [OpenAI](https://platform.openai.com/) 账号并获取API密钥
3. 注:也可以使用如 [MistralAi](https://mistral.ai/) 之类api，但须遵守**相关条款与免责协议**等文件(免责协议中统一用OpenAi Api等指代)

### 安装步骤

1. 点击Tampermonkey图标 → "添加新脚本"
2. 清空编辑器，粘贴完整代码
3. 修改配置区（见下方说明）
4. 保存脚本（Ctrl+S）
5. 刷新目标网页

## ⚙️ 配置说明

### 必需配置

```javascript
// OpenAI API密钥（必填）
const AI_API_KEY = 'sk-xxxxxxxxxxxxxxxxxxxx';

// 页面元素选择器（根据目标网站修改）
const MESSAGE_CONTAINER_SELECTOR = '.message-list';     // 消息列表容器
const INPUT_SELECTOR = '.chat-input';                    // 输入框
const SEND_BUTTON_SELECTOR = '.send-btn';                // 发送按钮

// 消息解析配置
const MESSAGE_CONFIG = {
    nodeSelector: '.message-item',        // 单条消息的选择器
    senderSelector: '.username',           // 发送者名字元素
    contentSelector: '.content',            // 消息内容元素
    isPlainText: false,                     // 是否为纯文本格式
    textSeparator: ':'                       // 纯文本分隔符
};
```

### 可选配置

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `BOT_NAME` | 机器人名字 | 'AI助手' |
| `TRIGGER_WORDS` | 触发词列表 | ['AI', '助手', 'help'] |
| `MODEL_NAME` | OpenAI模型 | 'gpt-3.5-turbo' |
| `MAX_HISTORY` | 记忆轮数 | 5 |
| `RATE_LIMIT_SECONDS` | 个人操作间隔 | 3秒 |
| `GLOBAL_COOLDOWN_SECONDS` | 全局冷却 | 2秒 |

## 📖 使用指南

### 基础对话

发送包含触发词的消息即可触发AI回复：
- `AI你好`
- `助手在吗`
- `help me`

### 指令列表

| 指令 | 功能 | 示例 |
|------|------|------|
| `/help` | 查看帮助 | `/help` |
| `/roles` | 查看可用角色 | `/roles` |
| `/role 角色名` | 切换角色 | `/role 翻译助手` |
| `/memory` | 查看记忆轮数 | `/memory` |
| `/clear` | 清除记忆 | `/clear` |
| `/addmemory 目标用户 角色名 [用户]内容[AI]回复...` | 手动添加记忆 | `/addmemory user1 通用助手 [用户]你好[AI]你好！` |

### 角色列表

| 角色名 | 说明 | 开场白 |
|--------|------|--------|
| 通用助手 | 友好的AI助手 | 你好！我是你的AI助手，有什么可以帮你的吗？ |
| 翻译助手 | 专业翻译 | 你好！我是翻译助手，需要翻译什么内容？ |
| 代码专家 | 编程专家 | 你好！我是代码专家，有什么编程问题需要帮助？ |
| 心理咨询师 | 温暖的心理咨询师 | 你好！我是心理咨询师，愿意倾听你的烦恼。 |

## 🔧 配置指南：如何查找页面元素

### 打开开发者工具

按 `F12` 或右键 → "检查"

### 查找消息容器

1. 点击开发者工具左上角的元素选择器（🖱️）
2. 点击任意一条消息
3. 在HTML中向上查找包含所有消息的父元素
4. 记录其class或id

### 测试选择器

在控制台输入以下命令测试：
```javascript
document.querySelector('.your-selector')
```
返回元素说明选择器正确，返回 `null` 说明需要调整。

## ⚠️ 注意事项

1. **API密钥安全**：切勿公开分享你的API密钥
2. **费用注意**：使用OpenAI API会产生费用，请留意用量
3. **冷却机制**：各操作均有冷却时间，避免频繁触发
4. **记忆上限**：默认保留最近5轮对话
5. **长度限制**：消息超过500字符会自动截断

## 🐛 故障排查

| 问题 | 可能原因 | 解决方法 |
|------|----------|----------|
| 无响应 | API密钥无效 | 检查 `AI_API_KEY` 是否正确 |
| 401错误 | 密钥格式错误 | OpenAI密钥以 `sk-` 开头 |
| 找不到元素 | 选择器错误 | 重新检查页面元素选择器 |
| 只回复自己 | 未过滤自己 | 检查 `BOT_NAME` 是否匹配 |
| 消息发不出去 | 按钮选择器错误 | 测试按钮选择器，或启用回车后备 |

详细见[FAQ](https://github.com/xigiy/Mot-Ai-Bot/blob/main/FAQ.md)

## 📄 许可证

本项目采用 MIT 许可证开源。使用本代码即表示您已阅读、理解并同意相关条款。

**原作者**：B站 FL-xigiy

## 🤝 贡献

欢迎提交Issue和PR，共同改进这个项目。

## 📮 联系

- B站：[FL-xigiy](https://b23.tv/sRYhytP)
- 如有问题，请在B站私信或评论区留言
