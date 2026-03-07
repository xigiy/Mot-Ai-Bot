// ==UserScript==
// @name         通用AI聊天机器人
// @namespace    http://tampermonkey.net/
// @version      v1(test3.0)
// @description  通用AI聊天机器人，支持多角色切换、记忆管理、手动添加记忆
// @author       FL-xigiy
// @match        *://*/*
// @grant        none
// ==/UserScript==

// ============================================================================
// MIT License (English)
// Copyright (c) 2026 FL-xigiy
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// ============================================================================

// ============================================================================
// MIT 许可证（中文翻译，仅供参考）
// 版权所有 (c) 2026 FL-xigiy
// 
// 特此授予任何获得本软件及相关文档文件（以下简称“软件”）副本的人，无限制地处理本软件的权限，
// 包括但不限于使用、复制、修改、合并、发布、分发、再许可和/或出售本软件副本的权利，
// 并允许获得本软件的人这样做，但须满足以下条件：
// 
// 上述版权声明和本许可声明应包含在本软件的所有副本或实质性部分中。
// 
// 本软件按“原样”提供，不提供任何明示或默示的担保，包括但不限于适销性、
// 特定用途适用性和非侵权性的担保。在任何情况下，作者或版权持有人均不对
// 因本软件或本软件的使用或其他交易而引起的或与之相关的任何索赔、损害或其他责任负责，
// 无论是在合同诉讼、侵权行为还是其他方面。
// ============================================================================

// ============================================================================
// 附加声明 | Additional Statement
// ============================================================================

// 1. 未发布或已发布的版本均适用以上协议，无论是否注明。
//    All versions, whether released or not, are covered by the above license.
// 
// 2. 如有疑问或需求，可联系作者 B站 FL-xigiy。
//    For questions or requests, please contact the author: Bilibili FL-xigiy.
// 
// 3. 本声明不影响 MIT 许可证的法律效力。
//    This statement does not affect the legal validity of the MIT License.
// 
// 4. 由于代码性质与用途原因，不建议但不禁止任何形式的二次分发。
//    Due to the nature and purpose of this code, secondary distribution is not recommended but not prohibited.
// 
// 5. 使用本代码即表示您已阅读、理解并同意以上条款。
//    By using this code, you acknowledge that you have read, understood, and agreed to the above terms.
// ============================================================================

(function() {
    'use strict';

    // ==================== 配置区（请按需修改）====================

    // 基础配置
    const BOT_NAME = 'AI助手';                    // 机器人的名字（用于过滤自己的消息）
    const TRIGGER_WORDS = ['AI', '助手', 'help'];  // 触发词（大小写不敏感）
    const AI_API_URL = 'https://api.openai.com/v1/chat/completions';
    const AI_API_KEY = '你的 OpenAI API Key';      // 必填：你的 OpenAI API 密钥
    const MODEL_NAME = 'gpt-3.5-turbo';            // 可选：gpt-4, gpt-4-turbo, gpt-3.5-turbo

    // 角色扮演提示词（默认角色：通用助手）
    const CUSTOM_PROMPT = `你是一个友好的AI助手，乐于帮助用户解答问题。请用简洁、友好的语气回复，每次不超过两句话。`;

    // ==================== 页面元素配置 ====================

    // 消息容器（存放所有消息的父元素）
    // 请替换为实际网站的消息列表容器选择器
    const MESSAGE_CONTAINER_SELECTOR = '.your-message-container';

    // 消息解析配置
    const MESSAGE_CONFIG = {
        // 单条消息的选择器
        nodeSelector: '.your-message-item',
        // 发送者名字元素的选择器
        senderSelector: '.your-sender-name',
        // 消息内容元素的选择器
        contentSelector: '.your-message-content',
        // 如果消息是纯文本格式（如 "用户名: 内容"），设为 true
        isPlainText: false,
        // 纯文本格式的分隔符（当 isPlainText = true 时使用）
        textSeparator: ':'
    };

    // 输入框选择器（用于输入消息的文本框）
    // 请替换为实际网站的输入框选择器
    const INPUT_SELECTOR = '.your-input-field';

    // 发送按钮选择器（用于提交消息的按钮）
    // 请替换为实际网站的发送按钮选择器
    const SEND_BUTTON_SELECTOR = '.your-send-button';

    // ==================== 冷却与限制配置 ====================

    const RATE_LIMIT_SECONDS = 3;                  // 每个用户普通操作最小间隔（秒）
    const GLOBAL_COOLDOWN_SECONDS = 2;              // 全局冷却（任何回复后需等待）
    const MAX_HISTORY = 5;                          // 每位用户保留的对话轮数
    const INITIAL_IGNORE_SECONDS = 3;                // 启动后忽略消息的秒数（防加载刷屏）
    const MAX_MESSAGE_AGE_SECONDS = 30;              // 只处理最近30秒内的消息（防历史消息刷屏）
    const MAX_MESSAGE_LENGTH = 500;                  // 消息最大长度

    // ==================== 指令配置 ====================

    const HELP_TRIGGER = '/help';                    // 帮助命令
    const CLEAR_MEMORY_TRIGGER = '/clear';           // 清除记忆指令
    const VIEW_MEMORY_TRIGGER = '/memory';           // 查看记忆指令
    const LIST_ROLES_TRIGGER = '/roles';             // 查看角色列表
    const ROLE_SWITCH_TRIGGER = '/role';             // 切换角色命令
    const ADD_MEMORY_TRIGGER = '/addmemory';         // 手动添加记忆命令

    // ==================== 角色切换配置 ====================

    const ROLE_MAP = {
        '通用助手': `你是一个友好的AI助手，乐于帮助用户解答问题。`,
        '翻译助手': `你是一个专业的翻译助手，负责将用户输入的内容翻译成目标语言。`,
        '代码专家': `你是一个编程专家，擅长解答各种编程问题。`,
        '心理咨询师': `你是一个温暖的心理咨询师，倾听用户的烦恼并给予建议。`
    };

    const ROLE_START_MESSAGES = {
        '通用助手': '你好！我是你的AI助手，有什么可以帮你的吗？',
        '翻译助手': '你好！我是翻译助手，需要翻译什么内容？',
        '代码专家': '你好！我是代码专家，有什么编程问题需要帮助？',
        '心理咨询师': '你好！我是心理咨询师，愿意倾听你的烦恼。'
    };

    const DEFAULT_ROLE = '通用助手';                 // 默认角色

    // ==================== 回复配置 ====================

    const AI_REPLY_PREFIX = '[AI]';                  // AI回复前缀
    const RATE_LIMIT_REPLIES = [                      // 随机固定回复库
        '请稍等，我正在思考...',
        '让我想想...',
        '稍等一下哦～',
        '请稍候，我整理一下思绪',
        '正在处理你的请求...'
    ];

    // ==================== 添加记忆配置 ====================

    const ADD_MEMORY_COOLDOWN_SECONDS = 10;           // 添加记忆独立冷却（秒）

    // ==================== 就位消息 ====================

    const READY_MESSAGE = 'AI助手已上线，可以使用啦～';

    // ==================== 高级配置（一般不需要修改）====================

    // 是否启用回车后备方案（当找不到发送按钮时自动模拟回车）
    const ENABLE_ENTER_FALLBACK = true;

    // 调试模式（输出更详细的日志）
    const DEBUG_MODE = false;

    // ==================== 全局状态变量 ====================

    const scriptStartTime = Date.now();
    const contextMemory = {};                          // 对话记忆库
    const lastReplyTime = {};                          // 用户操作时间记录
    const lastAddMemoryTime = {};                       // 添加记忆独立冷却
    const userRole = {};                                // 存储每个用户当前选择的角色名
    let lastGlobalSendTime = 0;                         // 全局冷却时间戳
    let readyMessageSent = false;                       // 是否已发送就位消息

    // ==================== 工具函数 ====================

    /**
     * 查找消息容器
     */
    function findMessageContainer() {
        return document.querySelector(MESSAGE_CONTAINER_SELECTOR);
    }

    /**
     * 解析消息，提取发送者和内容
     * @param {HTMLElement} messageNode - 消息节点
     * @returns {Object} { sender, content }
     */
    function parseMessage(messageNode) {
        if (MESSAGE_CONFIG.isPlainText) {
            const text = messageNode.innerText;
            const separatorIndex = text.indexOf(MESSAGE_CONFIG.textSeparator);
            if (separatorIndex > 0) {
                return {
                    sender: text.substring(0, separatorIndex).trim(),
                    content: text.substring(separatorIndex + 1).trim()
                };
            }
            return { sender: 'unknown', content: text };
        } else {
            const sender = messageNode.querySelector(MESSAGE_CONFIG.senderSelector)?.innerText || '';
            const content = messageNode.querySelector(MESSAGE_CONFIG.contentSelector)?.innerText || '';
            return { sender: sender.trim(), content: content.trim() };
        }
    }

    /**
     * 获取用户当前使用的系统提示词
     * @param {string} userId - 用户ID
     * @returns {string} 系统提示词
     */
    function getSystemPromptForUser(userId) {
        const roleName = userRole[userId] || DEFAULT_ROLE;
        return ROLE_MAP[roleName] || ROLE_MAP[DEFAULT_ROLE];
    }

    /**
     * 调试日志
     */
    function logDebug(...args) {
        if (DEBUG_MODE) {
            console.log('[DEBUG]', ...args);
        }
    }

    // ==================== 发送消息 ====================

    /**
     * 发送消息到页面
     * @param {string} text - 要发送的消息
     */
    function sendMessage(text) {
        // 长度限制
        if (text.length > MAX_MESSAGE_LENGTH) {
            text = text.substring(0, MAX_MESSAGE_LENGTH - 3) + '...';
            console.log(`⚠️ 消息超长，已截断至 ${MAX_MESSAGE_LENGTH} 字符`);
        }

        // 查找输入框
        const inputBox = document.querySelector(INPUT_SELECTOR);
        if (!inputBox) {
            console.error('❌ 未找到输入框，请检查 INPUT_SELECTOR 配置');
            return;
        }

        // 填入内容并触发输入事件
        inputBox.focus();
        inputBox.value = text;
        inputBox.dispatchEvent(new Event('input', { bubbles: true }));

        // 查找发送按钮
        const sendButton = document.querySelector(SEND_BUTTON_SELECTOR);
        
        if (sendButton) {
            // 延迟点击，确保输入事件已处理
            setTimeout(() => {
                sendButton.click();
                lastGlobalSendTime = Date.now();
                console.log('💬 已点击发送按钮:', text);
            }, 50);
        } else if (ENABLE_ENTER_FALLBACK) {
            // 后备方案：模拟回车
            console.log('⚠️ 未找到发送按钮，尝试模拟回车');
            const enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true
            });
            inputBox.dispatchEvent(enterEvent);
            lastGlobalSendTime = Date.now();
            console.log('💬 已模拟回车发送:', text);
        } else {
            console.error('❌ 未找到发送按钮，且回车后备已禁用');
        }
    }

    // ==================== 指令处理函数 ====================

    /**
     * 处理帮助命令
     */
    function handleHelp(userId) {
        const now = Date.now();
        if (now - lastGlobalSendTime < GLOBAL_COOLDOWN_SECONDS * 1000) {
            logDebug('全局冷却中，忽略帮助命令');
            return;
        }
        
        const last = lastReplyTime[userId] || 0;
        if (now - last < RATE_LIMIT_SECONDS * 1000) {
            logDebug(`用户 ${userId} 操作过于频繁，忽略帮助命令`);
            return;
        }
        
        lastReplyTime[userId] = now;
        
        const helpMessage = `可用指令：
/help - 显示本帮助
/roles - 查看可用角色
/role 角色名 - 切换角色（如：/role 翻译助手）
/memory - 查看记忆轮数
/clear - 清除记忆
/addmemory 目标用户 角色名 [用户]内容[AI]回复... - 手动添加记忆

当前角色：${userRole[userId] || DEFAULT_ROLE}
记忆轮数：${(contextMemory[userId]?.length || 0) / 2}/${MAX_HISTORY}`;
        
        sendMessage(helpMessage);
    }

    /**
     * 处理查看角色列表
     */
    function handleListRoles(userId) {
        const now = Date.now();
        if (now - lastGlobalSendTime < GLOBAL_COOLDOWN_SECONDS * 1000) return;
        
        const last = lastReplyTime[userId] || 0;
        if (now - last < RATE_LIMIT_SECONDS * 1000) return;
        
        lastReplyTime[userId] = now;
        lastGlobalSendTime = now;

        const roleNames = Object.keys(ROLE_MAP);
        const roleListStr = roleNames.join('、');
        sendMessage(`可用角色: ${roleListStr}`);
    }

    /**
     * 处理切换角色
     */
    function handleSwitchRole(userId, targetRole) {
        const now = Date.now();
        
        if (now - lastGlobalSendTime < GLOBAL_COOLDOWN_SECONDS * 1000) return;
        
        const last = lastReplyTime[userId] || 0;
        if (now - last < RATE_LIMIT_SECONDS * 1000) return;

        if (!ROLE_MAP[targetRole]) {
            const availableRoles = Object.keys(ROLE_MAP).join('、');
            sendMessage(`角色不存在哦！可用角色: ${availableRoles}`);
            return;
        }

        lastReplyTime[userId] = now;
        lastGlobalSendTime = now;

        userRole[userId] = targetRole;
        delete contextMemory[userId];

        const startMsg = ROLE_START_MESSAGES[targetRole] || `已切换角色为 “${targetRole}”`;
        sendMessage(startMsg);
    }

    /**
     * 处理查看记忆
     */
    function handleViewMemory(userId) {
        const now = Date.now();
        if (now - lastGlobalSendTime < GLOBAL_COOLDOWN_SECONDS * 1000) return;
        
        const last = lastReplyTime[userId] || 0;
        if (now - last < RATE_LIMIT_SECONDS * 1000) return;
        
        lastReplyTime[userId] = now;
        lastGlobalSendTime = now;

        const history = contextMemory[userId] || [];
        const rounds = history.length / 2;
        sendMessage(`你当前共有 ${rounds} 轮对话记忆（上限 ${MAX_HISTORY} 轮）`);
    }

    /**
     * 处理清除记忆
     */
    function handleClearMemory(userId) {
        const now = Date.now();
        if (now - lastGlobalSendTime < GLOBAL_COOLDOWN_SECONDS * 1000) return;
        
        const last = lastReplyTime[userId] || 0;
        if (now - last < RATE_LIMIT_SECONDS * 1000) return;
        
        lastReplyTime[userId] = now;
        lastGlobalSendTime = now;

        if (contextMemory[userId]) {
            delete contextMemory[userId];
        }
        sendMessage('已清除你的对话记忆');
    }

    /**
     * 处理手动添加记忆
     */
    function handleAddMemory(userId, fullContent) {
        const now = Date.now();
        
        if (now - lastGlobalSendTime < GLOBAL_COOLDOWN_SECONDS * 1000) return;

        const lastAdd = lastAddMemoryTime[userId] || 0;
        if (now - lastAdd < ADD_MEMORY_COOLDOWN_SECONDS * 1000) return;
        
        const last = lastReplyTime[userId] || 0;
        if (now - last < RATE_LIMIT_SECONDS * 1000) return;

        // 解析格式：/addmemory 目标用户 角色名 [用户]内容[AI]回复...
        const parts = fullContent.substring(ADD_MEMORY_TRIGGER.length).trim().split(' ');
        if (parts.length < 3) {
            sendMessage('格式错误：/addmemory 目标用户 角色名 [用户]内容[AI]回复...');
            return;
        }

        const targetUser = parts[0];
        const targetRole = parts[1];
        const dialogText = parts.slice(2).join(' ');

        if (!ROLE_MAP[targetRole]) {
            sendMessage(`角色 “${targetRole}” 不存在`);
            return;
        }

        const dialogRegex = /\[用户\]([^\[]+)\[AI\]([^\[]+)/g;
        const matches = [...dialogText.matchAll(dialogRegex)];

        if (matches.length === 0) {
            sendMessage('格式错误：未找到 [用户][AI] 对话对');
            return;
        }

        const newHistory = [];
        for (let i = 0; i < matches.length; i++) {
            const userContent = matches[i][1].trim();
            const aiContent = matches[i][2].trim();
            
            if (!userContent || !aiContent) {
                sendMessage(`第 ${i+1} 组对话内容不能为空`);
                return;
            }
            
            newHistory.push({ role: 'user', content: userContent });
            newHistory.push({ role: 'assistant', content: aiContent });
        }

        lastAddMemoryTime[userId] = now;
        lastReplyTime[userId] = now;
        lastGlobalSendTime = now;

        contextMemory[targetUser] = newHistory;
        sendMessage(`✅ 为 ${targetUser} 添加记忆成功（${matches.length}轮）`);
    }

    /**
     * 处理普通触发（调用AI或随机回复）
     */
    function handleTrigger(userId, message) {
        const now = Date.now();

        if (now - lastGlobalSendTime < GLOBAL_COOLDOWN_SECONDS * 1000) return;

        const last = lastReplyTime[userId] || 0;
        if (now - last < RATE_LIMIT_SECONDS * 1000) {
            const randomReply = RATE_LIMIT_REPLIES[Math.floor(Math.random() * RATE_LIMIT_REPLIES.length)];
            sendMessage(randomReply);
            return;
        }
        lastReplyTime[userId] = now;
        callAIAndReply(userId, message);
    }

    /**
     * 调用 OpenAI API
     */
    async function callAIAndReply(userId, userMessage) {
        let history = contextMemory[userId] || [];
        if (history.length > MAX_HISTORY * 2) history = history.slice(-MAX_HISTORY * 2);

        const systemPrompt = getSystemPromptForUser(userId);
        const messages = [
            { role: 'system', content: systemPrompt },
            ...history,
            { role: 'user', content: userMessage }
        ];

        try {
            logDebug('发送API请求', messages);
            
            const response = await fetch(AI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AI_API_KEY}`
                },
                body: JSON.stringify({
                    model: MODEL_NAME,
                    messages: messages,
                    max_tokens: 150,
                    temperature: 0.7
                })
            });
            
            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`);
            }
            
            const data = await response.json();
            const replyText = data.choices[0].message.content;
            
            logDebug('收到API回复', replyText);

            // 更新记忆
            if (!contextMemory[userId]) contextMemory[userId] = [];
            contextMemory[userId].push(
                { role: 'user', content: userMessage },
                { role: 'assistant', content: replyText }
            );
            
            if (contextMemory[userId].length > MAX_HISTORY * 2) {
                contextMemory[userId] = contextMemory[userId].slice(-MAX_HISTORY * 2);
            }

            sendMessage(`${AI_REPLY_PREFIX} ${replyText}`);
        } catch (error) {
            console.error('❌ API调用失败', error);
            const randomReply = RATE_LIMIT_REPLIES[Math.floor(Math.random() * RATE_LIMIT_REPLIES.length)];
            sendMessage(randomReply);
        }
    }

    // ==================== 消息监听 ====================

    /**
     * 处理新消息
     * @param {MutationRecord[]} mutations
     */
    function onNewMessage(mutations) {
        // 启动初期忽略消息
        if (Date.now() - scriptStartTime < INITIAL_IGNORE_SECONDS * 1000) return;

        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return; // 只处理元素节点
                
                const { sender, content } = parseMessage(node);
                if (!sender || !content) return;

                // 忽略机器人自己的消息
                if (sender === BOT_NAME) return;

                logDebug(`新消息 [${sender}]: ${content}`);

                // 指令处理
                if (content.startsWith(HELP_TRIGGER)) {
                    handleHelp(sender);
                } else if (content.startsWith(LIST_ROLES_TRIGGER)) {
                    handleListRoles(sender);
                } else if (content.startsWith(ROLE_SWITCH_TRIGGER)) {
                    const roleName = content.substring(ROLE_SWITCH_TRIGGER.length).trim();
                    if (roleName) {
                        handleSwitchRole(sender, roleName);
                    } else {
                        sendMessage('请指定角色名，例如：/role 通用助手');
                    }
                } else if (content.startsWith(VIEW_MEMORY_TRIGGER)) {
                    handleViewMemory(sender);
                } else if (content.startsWith(CLEAR_MEMORY_TRIGGER)) {
                    handleClearMemory(sender);
                } else if (content.startsWith(ADD_MEMORY_TRIGGER)) {
                    handleAddMemory(sender, content);
                } else {
                    // 检查普通触发词
                    const lowerContent = content.toLowerCase();
                    const containsTrigger = TRIGGER_WORDS.some(word => 
                        lowerContent.includes(word.toLowerCase())
                    );
                    
                    if (containsTrigger) {
                        logDebug(`触发词被 ${sender} 提及`);
                        handleTrigger(sender, content);
                    }
                }
            });
        });
    }

    // ==================== 启动相关 ====================

    /**
     * 发送就位消息
     */
    function sendReadyMessage() {
        if (readyMessageSent || !READY_MESSAGE) return;
        readyMessageSent = true;
        setTimeout(() => {
            sendMessage(READY_MESSAGE);
            console.log('📢 已发送就位消息');
        }, 1000);
    }

    /**
     * 启动监听器
     */
    function startObserver() {
        const messageContainer = findMessageContainer();
        
        if (messageContainer) {
            const observer = new MutationObserver(onNewMessage);
            observer.observe(messageContainer, {
                childList: true,
                subtree: true
            });
            console.log('👀 消息监听器已启动');
            console.log('📦 消息容器:', MESSAGE_CONTAINER_SELECTOR);
            console.log('🔧 消息解析配置:', MESSAGE_CONFIG);

            // 计算就位消息发送时间
            const remaining = Math.max(0, INITIAL_IGNORE_SECONDS * 1000 - (Date.now() - scriptStartTime));
            if (remaining <= 0) {
                sendReadyMessage();
            } else {
                setTimeout(sendReadyMessage, remaining);
            }
        } else {
            console.error('❌ 未找到消息容器，请检查 MESSAGE_CONTAINER_SELECTOR 配置');
            console.log('当前配置:', MESSAGE_CONTAINER_SELECTOR);
            // 5秒后重试
            setTimeout(startObserver, 5000);
        }
    }

    // 启动机器人
    console.log('🤖 通用AI聊天机器人 v3.0 正在启动...');
    console.log('ℹ️ 请确保已正确配置页面元素选择器');
    startObserver();

})();