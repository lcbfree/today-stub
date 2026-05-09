# Technology Stack

updated_at: 2026-05-09

## Architecture

V1 计划实现为原生微信小程序。当前仓库处于产品文档和静态 HTML/CSS 原型阶段，尚未包含正式小程序代码。第一版采用本地单端架构：本地配置库驱动生成页和票根渲染，本地存储保存历史记录，Canvas 负责导出图片。

## Core Technologies

- **Target Platform**: 微信小程序
- **Implementation Direction**: 原生小程序 JS / WXML / WXSS
- **Prototype**: 静态 HTML / CSS，可直接以 `file://` 打开验证页面 UI
- **Rendering**: 小程序 Canvas，用于票根预览一致的图片导出
- **Storage**: 微信本地存储，记录结构预留 `syncStatus` 便于未来云同步

## Development Standards

### Product Constraints

- V1 不接后端、不接 AI、不做登录支付，所有短语、印章、小物件和主题配置都应可本地运行。
- 保存图片前才触发相册权限相关流程，不提前索要无关权限。
- 本地历史未来如迁移到云端，必须由用户明确确认，不能静默上传。

### Canvas Rendering

- 票根渲染应以固定设计宽度为基准，按内容动态计算高度。
- 中文文本必须做换行、截断和行高控制，导出图与预览页保持一致。
- 生活痕迹模块按用户选择顺序渲染，未选择模块不占位。
- 小花费模块只渲染生活描述，不渲染合计、预算、消费分类或趋势。

### Data Patterns

- 记录使用全局唯一 `id`，不能只以日期作为主键。
- 保存 `phraseId`、`stampId`、`objectId`、`themeId` 等配置 ID，保证历史回看稳定。
- 业务字段优先使用清晰语义，例如 `selfSentence`、`lifeModules`、`energyLevel`、`emotionBalance`。

## Testing

实现阶段至少验证：

- Canvas 导出和页面预览在关键内容上保持一致。
- 中文长句、长模块文本、小屏设备不会溢出或遮挡。
- 保存相册权限、拒绝权限后的再次引导和成功反馈路径可用。
- 本地新增、读取、删除、按日期展示历史记录稳定。
- 空态、当天多条记录、无生活模块、生活模块较多等边界状态可用。

## Key Technical Decisions

- 原生微信小程序优先，避免 V1 被跨端框架和复杂工程配置拖慢。
- 本地配置库优先，避免第一版依赖远程接口或 AI 调用。
- Canvas 导出是核心技术验证点，应早于复杂页面开发完成。
- 数据结构为未来云同步预留字段，但 V1 不实现云端。

---
_Document standards and patterns, not every dependency_
