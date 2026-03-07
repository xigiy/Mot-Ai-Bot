# 🤖 Mot Ai Bot

[![MIT&Additional Statement License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-v1-green.svg)](https://github.com/xigiy/Mot-Ai-Bot)
![GitHub last commit](https://img.shields.io/github/last-commit/xigiy/Mot-Ai-Bot)
![GitHub stars](https://img.shields.io/github/stars/xigiy/Mot-Ai-Bot?style=social)
![GitHub forks](https://img.shields.io/github/forks/xigiy/Mot-Ai-Bot?style=social)
![GitHub issues](https://img.shields.io/github/issues/xigiy/Mot-Ai-Bot)
![GitHub pull requests](https://img.shields.io/github/issues-pr/xigiy/Mot-Ai-Bot)
![Text](https://img.shields.io/badge/Made_by-Deepseek-blue)

## 🌏 Language / 语言

[![中文](https://img.shields.io/badge/Lang-中文-red.svg)](README.md)
[![English](https://img.shields.io/badge/Lang-English-blue.svg)](README-en.md)

> "You see, 'Mot-Ai-Bot' is an intelligent chatbot developed by Bilibili UP FL-xigiy based on a general AI chat framework. The bot runs in a script manager called '[Tampermonkey](https://www.tampermonkey.net/)'. Here, selected web pages are granted the power of 'auto-reply'. You will play the role of a mysterious visitor named 'User', encountering different AI characters with unique styles in free chat, exploring the joy of intelligent conversations, and gradually uncovering the truth of 'API calls'."

> ✨ Version Description: Mot-Ai-Bot is a universal AI chatbot running on [Tampermonkey](https://www.tampermonkey.net/). It is based on the OpenAI API and supports multi-role switching, conversation memory, and manual memory injection. You can install it on any website and make it your intelligent chat partner. An AI chatbot that can be installed on any website, chat whenever you want, switch roles whenever you want.

> [Inspiration Source](https://github.com/FCL-Team/FoldCraftLauncher) | Please, I've already changed it 🙏

## 💡 Tips
This code is written by AI, supervised by humans, guaranteed to work～
> Writing itself? That's hilarious()

>(By the way, this suggestion was also written by AI, the nesting continues 😉)

## Please read **[DISCLAIMER.md](https://github.com/xigiy/Mot-Ai-Bot/blob/main/DISCLAIMER.md)** before use

Before using this code, **please** read the **complete** **[Disclaimer and Risk Notice/DISCLAIMER.md](DISCLAIMER.md)**.

This code is script-based. Using it **may violate website terms of service** and could result in **account bans**. Users **assume all risks**.

## Additional Statement (Already included in LICENSE)

```LICENSE附加条款
// Additional Statement (English):
// 1. This agreement applies to all published and unpublished versions.
// 2. If you have any questions or requirements, please contact the author: Bilibili FL-xigiy.
// 3. This statement does not affect the legal validity of the MIT License.
// 4. Due to the nature and purpose of the code, secondary distribution is not recommended but not prohibited.

// Additional Statement (Chinese):
// 1. 本协议适用于所有已发布及未发布的版本。
// 2. 如有疑问或需求，可联系作者：B站 FL-xigiy。
// 3. 本声明不影响 MIT 许可证的法律效力。
// 4. 由于代码性质与用途原因，不建议但不禁止任何形式的二次分发。
```

⚠️ High-Risk Warning

This code is script-based and for educational purposes only.

🚨 Usage Risks

· This script may violate the terms of service of certain websites, which could result in account restrictions, bans, or other penalties.

📌 Recommendations

· Please fully understand the code logic before use.
· It is recommended to test in a safe environment and use with caution on real accounts.
· Users assume all consequences resulting from blind modification or improper use.

📦 Features

· 🎭 Multi-role Switching: Built-in multiple roles (General Assistant, Translation Assistant, Code Expert, Psychological Counselor), freely switchable
· 💾 Conversation Memory: Automatically remembers recent N rounds of dialogue (default 5 rounds)
· 📝 Manual Memory Injection: Inject preset conversation history for specified users
· ⏱️ Smart Cooldown: Dual protection with personal and global cooldowns to prevent spamming
· 🔧 Highly Configurable: All parameters can be freely adjusted
· 🌐 Cross-site Compatibility: Adapt to any website by configuring selectors

🚀 Quick Start

Prerequisites

1. Install Tampermonkey browser extension
2. Register for an OpenAI account and get an API key
3. Note: You can also use APIs like MistralAi, but must comply with relevant terms and disclaimer agreements (disclaimers uniformly refer to OpenAI Api, etc.)

Installation Steps

1. Click the Tampermonkey icon → "Create a new script"
2. Clear the editor and paste the complete code
3. Modify the configuration area (see instructions below)
4. Save the script (Ctrl+S)
5. Refresh the target webpage

⚙️ Configuration Guide

Required Configuration

```javascript
// OpenAI API key (required)
const AI_API_KEY = 'sk-xxxxxxxxxxxxxxxxxxxx';

// Page element selectors (modify according to target website)
const MESSAGE_CONTAINER_SELECTOR = '.message-list';     // Message list container
const INPUT_SELECTOR = '.chat-input';                    // Input box
const SEND_BUTTON_SELECTOR = '.send-btn';                // Send button

// Message parsing configuration
const MESSAGE_CONFIG = {
    nodeSelector: '.message-item',        // Selector for individual message
    senderSelector: '.username',           // Selector for sender name element
    contentSelector: '.content',            // Selector for message content element
    isPlainText: false,                     // Whether it's plain text format
    r: ':'                       // Separator for plain text
};
```

Optional Configuration

Configuration Description Default Value
BOT_NAME Bot name 'AI Assistant'
TRIGGER_WORDS Trigger words list ['AI', 'assistant', 'help']
MODEL_NAME OpenAI model 'gpt-3.5-turbo'
MAX_HISTORY Memory rounds 5
RATE_LIMIT_SECONDS Personal operation interval 3 seconds
GLOBAL_COOLDOWN_SECONDS Global cooldown 2 seconds

📖 User Guide

Basic Conversation

Send messages containing trigger words to trigger AI replies:

· AI hello
· assistant
· help me

Command List

Command Function Example
/help View help /help
/roles View available roles /roles
/role role_name Switch role /role Translation Assistant
/memory View memory rounds /memory
/clear Clear memory /clear
/addmemory target_user role_name [user]content[AI]reply... Manually add memory /addmemory user1 General Assistant [user]hello[AI]hi!

Role List

Role Name Description Opening Line
General Assistant Friendly AI assistant Hello! I'm your AI assistant, how can I help you?
Translation Assistant Professional translator Hello! I'm a translation assistant, what would you like me to translate?
Code Expert Programming expert Hello! I'm a code expert, need help with programming?
Psychological Counselor Warm listener Hello! I'm a psychological counselor, ready to listen to your concerns.

🔧 How to Find Page Elements

Open Developer Tools

Press F12 or right-click → "Inspect"

Find Message Container

1. Click the element selector (🖱️) in the top-left corner of developer tools
2. Click on any message
3. Look upward in the HTML to find the parent element containing all messages
4. Record its class or id

Test Selectors

Test in the console with the following command:

```javascript
document.querySelector('.your-selector')
```

Returning an element means the selector is correct; returning null means it needs adjustment.

⚠️ Important Notes

1. API Key Security: Never share your API key publicly
2. Cost Awareness: Using the OpenAI API incurs costs; please monitor your usage
3. Cooldown Mechanism: Each operation has a cooldown time to prevent frequent triggering
4. Memory Limit: Default retains the last 5 rounds of dialogue
5. Length Limit: Messages exceeding 500 characters will be automatically truncated

🐛 Troubleshooting

Issue Possible Cause Solution
No response Invalid API key Check if AI_API_KEY is correct
401 error Incorrect key format OpenAI keys start with sk-
Elements not found Incorrect selector Recheck page element selectors
Only self-reply Self not filtered Check if BOT_NAME matches
Messages not sending Incorrect button selector Test button selector or enable enter fallback

See FAQ for details

📄 License

This project is open-sourced under the MIT License. Using this code means you have read, understood, and agreed to the relevant terms.

Original Author: Bilibili FL-xigiy

🤝 Contributing

Issues and PRs are welcome to improve this project together.

📮 Contact

· Bilibili: FL-xigiy
· For questions, please leave a private message or comment on Bilibili

## 🛠️ Tech Stack

- **Core Engine**: API Service Providers (e.g., [OpenAI API](https://openai.com/) / [Mistral AI](https://mistral.ai/))
- **Runtime Environment**: [Tampermonkey](https://www.tampermonkey.net/) (User Script Manager)
- **Language**: JavaScript (ES6+)
- **Dependencies**: No external dependencies, pure native implementation

## 📁 Project Structure

```

Mot-Ai-Bot/
├── Mot-Ai-Bot.user.js      # Main script file
├── README.md                # Chinese documentation
├── README-en.md             # English documentation
├── DISCLAIMER.md            # Disclaimer
├── FAQ.md                    # Frequently Asked Questions
└── LICENSE                   # License

```
---

📅 Last Updated: March 7, 2026 | 📄 MIT License | ✨ FL-xigiy