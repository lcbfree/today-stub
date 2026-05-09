# Project Structure

updated_at: 2026-05-09

## Organization Philosophy

当前仓库采用「文档与原型先行」的组织方式：产品判断先沉淀到文档，视觉和交互先用静态原型验证，正式小程序实现再按已确认的 V1 范围推进。新内容应优先保持产品文档、原型说明和视觉资产说明之间的一致性。

## Directory Patterns

### Product Documentation
**Location**: `/docs/`  
**Purpose**: 保存产品定位、V1 范围、关键决策、交接上下文和后续开发判断。  
**Example**: `product.md` 是完整产品文档，`handoff-notes.md` 记录设计讨论后的关键口径。

### UI Concepts
**Location**: `/assets/ui-concepts/`  
**Purpose**: 保存视觉方向图和每张图的用途说明。概念图用于气质、布局、视觉隐喻参考，不等同于最终实现规格。  
**Example**: `04-v1-emotional-value-ui-concept.png` 是 V1 情绪价值气质参考，`01-life-receipt-desktop-concept.png` 可参考小票分行结构。

### Static Prototype
**Location**: `/prototype/v1/`  
**Purpose**: 保存 V1 页面 UI 原型、样式和整页截图，用于在正式开发前确认页面结构和视觉方向。  
**Example**: `index.html` 和 `styles.css` 表示当前页面 UI，`today-stub-v1-prototype.png` 是最新预览图。

### Steering Memory
**Location**: `/.kiro/steering/`  
**Purpose**: 保存项目级长期判断，帮助后续开发在产品、技术和结构上保持一致。  
**Example**: `product.md` 记录产品原则，`tech.md` 记录技术决策，`structure.md` 记录组织模式。

## Naming Conventions

- 概念图使用编号加描述：`NN-description.png`。
- 原型文件使用简洁小写命名：`index.html`、`styles.css`。
- 文档使用清晰领域名：`product.md`、`handoff-notes.md`。
- 数据字段在实现中倾向使用 camelCase，配置 ID 使用稳定的短字符串，例如 `small_spend`、`local_only`。

## Code Organization Principles

- 产品文档是范围判断的主要来源；当 UI 或功能方向变化时，同步更新文档和原型说明。
- 原型只表达 V1 的页面和状态，不承载正式运行逻辑。
- 视觉资产应有 README 说明用途，避免后续误把旧方向当作当前产品方向。
- 正式小程序实现开始后，应把页面、组件、配置库、渲染工具和存储工具分开组织，避免 Canvas 渲染、页面交互和数据持久化混在单个文件里。

---
_Document patterns, not file trees. New files following patterns shouldn't require updates_
