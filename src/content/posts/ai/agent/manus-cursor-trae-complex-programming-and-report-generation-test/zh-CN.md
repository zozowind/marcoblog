---
title: Manus、Cursor、Trae 编程与报告复杂任务实测
published: 2025-04-17
tags: [Manus, Cursor, Trae]
image: 'http://images.chenzhijie.me/blog/2025/04/magic_ruler_cover.png'
category: 'ai-agent'
draft: false
lang: zh-CN
---

今天刚收到了Manus的邀请注册码，来次实测下传说中的Manus的神奇能力，另外我还选择了Cursor的Agent模式和Trae的Build模式进行了对比。

> **测试目标**：验证 Manus、Cursor 与 Trae 在“完全无人工干预”模式下，能否独立完成复杂编程任务及自动生成结构化报告的能力。

---

## 测试一：功能代码生成能力对比

### 任务背景说明：

我选取的编程任务是实现一个基于 Three.js 的 3D 魔尺（Magic Ruler）页面。魔尺是一种由多个小块组成、可变形的益智玩具。测试目标包括：

1. 创建一个立体的 24 段魔尺；
2. 每段为特殊切面结构，包含两个正方形面、两个等腰直角三角形面和一个长方形面；
3. 支持鼠标旋转与交互折叠；
4. 支持奇偶块批量设置不同颜色；
5. 各块通过正方形面连接，支持360度旋转。

### 使用模式与模型：

| 工具    | 运行模式       | 所用模型             |
|---------|----------------|----------------------|
| **Manus**  | 内置任务流程        | 内置自定义模型         |
| **Cursor** | Agent 协作模式     | Claude-3.7-sonnet    |
| **Trae**   | Build(Alpha) 模式  | DeepSeek-V3-3024     |

### ⏱ 耗时：

- **Manus**：10 分钟（消耗 237 积分）
- **Cursor**：5 分钟
- **Trae**：2 分钟

### 结果与分析：

#### **Manus**
- ✅ 生成了代码结构和部分控制组件；
- ❌ 页面仅显示控制面板，魔尺结构未正常呈现；
- ❌ 自动部署失败，页面无法交互；
- **结论**：**未能完成任务**。

PS: Manus提供进入到其虚拟机的入口，可以在虚拟机中查看任务处理的结果
![](http://images.chenzhijie.me/blog/2025/04/magic_ruler_manus.png)

#### **Cursor**
- ✅ 魔尺的立体结构正常呈现，支持鼠标旋转；
- ✅ 着色功能可用，奇偶区分生效；
- ⚠️ 魔尺块模型结构部分错误，连接面计算不严谨；
- ⚠️ 单个块的折叠控制尚未实现，随机折叠操作较抽象😂；
- **结论**：**完成度高，可视效果好，但仍有逻辑缺陷**。
![](http://images.chenzhijie.me/blog/2025/04/magic_ruler_cursor_1.png)
![](http://images.chenzhijie.me/blog/2025/04/magic_ruler_cursor_2.png)
[在线demo](/attachments/ai/agent/manus-cursor-trae-complex-programming-and-report-generation-test/cursor/index.html)

#### **Trae**
- ❌ 页面加载为纯黑屏，未显示任何可视元素（就不展示截图了🫠）
- **结论**：**未能完成任务**。

---

## 测试二：报告生成能力对比

### 测试流程：

将三份代码评估文本（Markdown 格式）提交至各自系统，提示词如下：

> 请根据三个实现 Magic Ruler 的评价报告，生成一个图文并茂的比较报告，HTML 格式，比较三方分别是 Manus、Cursor 和 Trae，细粒度打分部分请使用雷达图表示。

### ⏱ 耗时：

- **Manus**：12 分钟（消耗 194 积分）
- **Cursor**：2 分钟
- **Trae**：2 分钟

### 结果与分析：

#### **Manus**
- ⚠️ 页面生成正常，但雷达图呈现有误；
- ⚠️ 图文结构较为松散，配色缺乏层次感；
- **结论**：**有输出，质量待提升**。

> [在线报告](https://mswwffdl.manus.space/)

#### **Cursor**
- ✅ 报告结构清晰，图文结合自然；
- ✅ 雷达图实现正确，配色美观；
- ✅ 各工具对比明确，数据解读清晰；
- ⚠️ 报告中没有示例图，幻觉生成；
- **结论**：**最佳体验者，效率与美感兼具，小瑕疵**。

> [在线报告](/attachments/ai/agent/manus-cursor-trae-complex-programming-and-report-generation-test/cursor_comparison_report.html)

#### **Trae**
- ❌ 雷达图数据读取错误；
- ⚠️ 页面生成基础完成，但风格简陋、无图文交互感；
- **结论**：**可运行但表现平平**。

> [在线报告](/attachments/ai/agent/manus-cursor-trae-complex-programming-and-report-generation-test/trae_comparison_report.html)

---

## 🧠 综合评价与思考

在本次完全自动化测试任务中，三款工具表现差异显著：

| 工具    | 编程完成度 | 报告生成度 | 用户体验 | 推荐指数 |
|---------|------------|------------|-----------|-----------|
| **Cursor** | ⭐⭐⭐⭐☆ | ⭐⭐⭐⭐⭐ | 高 | ✅✅✅✅ |
| **Manus**  | ⭐⭐☆☆☆ | ⭐⭐☆☆☆ | 中 | ✅✅ |
| **Trae**   | ⭐☆☆☆☆ | ⭐⭐☆☆☆ | 低 | ✅ |

Cursor 在代码构建和报告表达两个维度上都展现出色性能，是目前相对更为成熟且易用的选择。Manus 的任务流程规范，对初学者较为友好，但速度偏慢，且对界面控制不够细腻。上述原因可能是由于使用虚拟机和调用python方法来进行任务处理实现而导致。
Trae 展示出一定的速度优势，但在准确性与表现力上仍有待提升。

---

## 对未来的期待与矛盾

这类工具的不断进化无疑为程序员和内容创作者带来了**更高的生产效率**和**创作自由度**，但也隐约引发了"被替代"的隐忧。正如在此次实测中所见，自动化系统已能在相当程度上完成复杂结构搭建和图文报告输出。未来，我们也许需要在"借助 AI 提升创造力"与"人类保持核心能力"之间找到新的平衡。
