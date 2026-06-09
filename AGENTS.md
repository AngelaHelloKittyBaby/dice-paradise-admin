# Dice Paradise Admin 开发约定

这个项目是投骰乐园运营后台，使用 Next.js App Router + Ant Design Pro Components。后台数据优先接入 `dice-paradise-client` 已经使用过的真实接口；没有真实接口时使用空状态，不新增假数据。

## 目录结构

```txt
dice-paradise-admin/
├─ config/
│  ├─ backend.js              # 后端默认地址、API 版本路径、URL 规范化方法
│  └─ backend.d.ts            # backend.js 的 TypeScript 声明
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx           # 全局布局
│  │  ├─ page.tsx             # 根页面跳转入口
│  │  └─ admin/               # 后台路由目录，只放 page/layout
│  │     ├─ layout.tsx
│  │     ├─ page.tsx
│  │     ├─ users/page.tsx
│  │     ├─ rooms/page.tsx
│  │     ├─ games/page.tsx
│  │     ├─ leaderboard/page.tsx
│  │     ├─ activities/page.tsx
│  │     ├─ achievements/page.tsx
│  │     ├─ chat/page.tsx
│  │     ├─ rewards/page.tsx
│  │     ├─ risk/page.tsx
│  │     ├─ settings/page.tsx
│  │     └─ audit/page.tsx
│  ├─ config/
│  │  └─ api.ts               # 前端请求基址，复用 config/backend.js 的 API 版本路径
│  ├─ modules/
│  │  └─ admin/               # 后台业务域
│  │     ├─ api/
│  │     │  └─ adminApi.ts    # 后台真实接口适配和数据归一化
│  │     ├─ components/
│  │     │  ├─ AdminShell.tsx
│  │     │  └─ AdminDataState.tsx
│  │     ├─ hooks/
│  │     │  └─ useAdminData.ts
│  │     ├─ styles/
│  │     │  ├─ AdminShell.module.css
│  │     │  └─ adminPages.module.css
│  │     ├─ utils/
│  │     │  └─ adminFormat.tsx
│  │     └─ types.ts
│  └─ styles/
│     └─ globals.css
├─ next.config.js             # 读取 config/backend.js 做 /api/v1 代理
├─ package.json
└─ tsconfig.json
```

## 后端地址

默认后端地址只写在 `config/backend.js`：

```js
const DEFAULT_BACKEND_ORIGIN = 'http://192.168.21.17:8000';
```

开发或部署时也可以用环境变量覆盖：

- `API_PROXY_TARGET`：Next.js 服务端代理目标
- `NEXT_PUBLIC_API_BASE_URL`：浏览器端请求基址

## 放置规则

- `src/app/admin/**/page.tsx` 只负责路由页面和页面组合，不放接口请求细节。
- admin 业务类型放在 `src/modules/admin/types.ts`。
- admin 接口和数据归一化放在 `src/modules/admin/api/adminApi.ts`。
- admin 页面数据 hook 放在 `src/modules/admin/hooks/useAdminData.ts`。
- admin 通用组件放在 `src/modules/admin/components/`。
- admin 样式放在 `src/modules/admin/styles/`。
- admin 格式化、状态标签等工具放在 `src/modules/admin/utils/`。
- 不新增 `src/mocks`、`mock`、`fake` 数据文件。真实接口不存在时，页面展示空状态。

## 常用命令

```bash
npm run dev -- -p 3100
npm run build
```

提交前至少运行：

```bash
npm run build
```
