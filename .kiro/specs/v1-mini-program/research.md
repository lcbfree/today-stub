# Research Log

## Summary

V1 是一个绿地小程序实现，当前仓库只有产品文档、静态原型和视觉资产。设计决策直接来自 `.kiro/steering/`、`docs/product.md`、`docs/handoff-notes.md` 和 `prototype/v1/`。本轮未引入外部依赖，也未做网络检索；微信平台 API 细节在实现阶段需要用微信开发者工具和官方文档再确认。

## Research Log

### Topic: 产品边界与首版闭环

- **Sources**: `.kiro/steering/product.md`, `docs/product.md`, `docs/handoff-notes.md`
- **Findings**:
  - V1 只做本地闭环：今日生成、票根预览、保存图片、本地存档、详情、设置隐私。
  - 产品核心是「生活凭证」，不是记账、心理咨询或社区。
  - 用户自己的句子是票根核心；模板短语只作为降低门槛和情绪氛围。
- **Implications**:
  - 设计需要把输入、生成、保存、归档拆成明确边界。
  - 小花费模块只能作为生活痕迹，不进入财务统计语义。

### Topic: 技术路线

- **Sources**: `.kiro/steering/tech.md`, `docs/product.md`
- **Findings**:
  - V1 使用原生微信小程序，避免跨端框架增加复杂度。
  - 本地配置库、本地存储和 Canvas 图片渲染是关键技术模块。
  - 数据结构需要保留 `id`、`version`、`createdAt`、`updatedAt`、`syncStatus`，为未来云同步预留。
- **Implications**:
  - 工程结构应把页面、配置、服务、渲染和存储拆开。
  - Canvas 渲染必须尽早验证，尤其是中文换行、动态高度和保存相册。

### Topic: 原型与 UI 结构

- **Sources**: `prototype/v1/README.md`, `prototype/v1/index.html`, `prototype/v1/styles.css`, `assets/ui-concepts/README.md`
- **Findings**:
  - 当前原型包含 8 个页面/状态：今日生成、票根预览、保存反馈、存档墙、空态、详情、设置隐私、授权失败。
  - UI 气质应参考 `04-v1-emotional-value-ui-concept.png`，票根结构参考 `01-life-receipt-desktop-concept.png` 的分行结构。
  - 页面必须保持温柔、克制、纸张纪念物感，避免营销页和工具表格感。
- **Implications**:
  - 小程序页面应先复刻原型结构，再接真实状态和持久化。
  - 票根预览组件和 Canvas 渲染服务应共享同一份结构化数据，减少预览与导出不一致。

## Architecture Pattern Evaluation

### Chosen Pattern: 本地分层小程序

采用轻量分层：配置层、领域数据层、存储服务、渲染服务、页面层。所有能力运行在小程序本地，不引入后端。

### Alternatives Considered

- **Taro/uni-app**: 当前不需要跨端，增加框架层成本，不采用。
- **后端或云开发**: V1 不需要账号和云同步，增加隐私与成本复杂度，不采用。
- **AI 文案生成**: 当前目标是低成本验证产品闭环，本地短语库足够，不采用。

## Design Decisions

1. **数据模型先行**: 所有页面和渲染都围绕 `StubRecord` 与 `DraftState`，避免页面各自维护不兼容字段。
2. **预览与导出共享结构**: 票根预览页面和 Canvas 渲染都从同一条生成记录读取内容。
3. **生活痕迹模块泛化**: 睡眠、饮品、小花费、小确幸都用同一种 `LifeModule` 结构表达，V1 只实现默认模块。
4. **情绪价值资产固定 ID**: 短语、印章、小物件生成后保存 ID 和展示文本，历史回看不重新随机。
5. **本地存储可迁移**: V1 仅本地保存，但记录保留 `syncStatus = local_only`，为未来云同步做数据兼容。

## Risks And Mitigations

- **Canvas 导出与预览不一致**: 用同一份票根布局计算规则和字段顺序，优先做渲染 Spike。
- **中文长文本溢出**: 渲染服务需要统一换行和高度计算，页面预览需要同样的最大宽度约束。
- **相册授权失败路径被忽略**: 任务中单独拆出授权失败状态和重试入口。
- **生活模块滑向记账**: 小花费模块不保存总额字段，不展示统计词，任务和验收中保持边界。
- **正式小程序 API 细节变化**: 实现阶段用微信开发者工具和官方文档确认保存图片、Canvas 和权限 API。
