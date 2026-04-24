# Game Market

Game Market 是一个专业的游戏资产交易平台，允许用户安全、便捷地交易游戏内资产。

## 项目简介

Game Market 提供了一个完整的游戏资产交易生态系统，包括：
- 游戏资产的展示和交易
- 钱包管理和资金流转
- 资产充值和提现
- 订单管理和交易历史
- 管理员后台管理

## 技术栈

### 前端
- **框架**：React 18.2.0
- **语言**：TypeScript
- **构建工具**：Vite
- **路由**：React Router v6
- **状态管理**：Redux Toolkit
- **UI 组件**：Ant Design
- **HTTP 客户端**：Axios
- **WebSocket**：Socket.io-client
- **图表库**：ECharts
- **国际化**：i18next

### 后端
- **框架**：Express 4.18.2
- **数据库**：SQLite (开发) / PostgreSQL (生产)
- **ORM**：Sequelize
- **认证**：JWT (JSON Web Token)
- **WebSocket**：Socket.io
- **环境管理**：Dotenv
- **密码加密**：bcryptjs

## 项目结构

```
GameMarket/
├── backend/              # 后端代码
│   ├── src/
│   │   ├── controllers/  # 控制器
│   │   ├── middleware/   # 中间件
│   │   ├── models/       # 数据模型
│   │   ├── routes/       # 路由
│   │   ├── services/     # 服务
│   │   ├── app.js        # 主应用文件
│   │   └── storage.js    # 存储配置
│   ├── package.json      # 后端依赖
│   └── .env              # 环境变量
├── frontend/             # 前端代码
│   ├── src/
│   │   ├── components/   # 组件
│   │   ├── pages/        # 页面
│   │   ├── services/     # 服务
│   │   ├── App.tsx       # 主应用组件
│   │   ├── main.tsx      # 入口文件
│   │   └── routes.tsx    # 路由配置
│   ├── package.json      # 前端依赖
│   └── vite.config.ts    # Vite 配置
└── README.md             # 项目说明
```

## 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 1. 克隆项目

```bash
git clone https://github.com/LuckyOneTwoThree/Project_GameMarket.git
cd Project_GameMarket
```

### 2. 安装后端依赖

```bash
cd GameMarket/backend
npm install
```

### 3. 配置环境变量

```bash
# 复制环境变量示例文件
cp .env.example .env

# 默认使用 SQLite，无需额外配置数据库
# 如需使用 PostgreSQL，请修改 .env 文件中的 DB_TYPE 和相关配置
```

### 4. 初始化数据库

```bash
# 自动创建数据库表
npm run db:migrate
```

### 5. 启动后端服务

```bash
# 开发模式
npm run dev

# 或生产模式
npm start
```

后端服务将在 http://localhost:8000 启动

### 6. 安装前端依赖

```bash
cd ../frontend
npm install
```

### 7. 启动前端服务

```bash
npm run dev
```

前端服务将在 http://localhost:5173 启动

### 8. 访问应用

打开浏览器访问 http://localhost:5173

## 数据库配置

### SQLite（默认，推荐开发使用）

无需安装和配置，数据将存储在 `backend/data/database.sqlite` 文件中。

环境变量配置：
```env
DB_TYPE=sqlite
SQLITE_PATH=./data/database.sqlite
```

### PostgreSQL（生产环境使用）

1. 安装 PostgreSQL
2. 创建数据库：
   ```sql
   CREATE DATABASE gamemarket;
   ```
3. 配置环境变量：
   ```env
   DB_TYPE=postgres
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=gamemarket
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_SSL=false
   ```

## 功能模块

### 前端功能

1. **用户认证**
   - 登录/注册
   - 管理员登录
   - 退出登录

2. **资产管理**
   - 资产概览
   - 资产充值
   - 资产提现
   - 充值/提现历史

3. **交易系统**
   - 交易对展示
   - 订单簿
   - K线图表
   - 交易历史
   - 下单功能

4. **订单管理**
   - 我的订单
   - 订单状态跟踪
   - 取消订单

5. **钱包管理**
   - 余额查询
   - 充值/提现
   - 交易历史

6. **用户设置**
   - 个人信息管理
   - Steam 账户关联
   - 通知设置

7. **管理员后台**
   - 用户管理
   - 资产管理
   - 系统状态监控

### 后端功能

1. **用户管理**
   - 注册/登录
   - 个人信息管理
   - Steam 账户关联

2. **资产管理**
   - 资产充值
   - 资产提现
   - 资产状态管理

3. **交易系统**
   - 订单匹配引擎
   - 交易执行
   - 交易历史记录

4. **钱包系统**
   - 余额管理
   - 交易记录
   - 充值/提现处理

5. **实时数据**
   - WebSocket 实时行情
   - 订单更新

## API 接口

### 用户相关
- `POST /api/users/register` - 用户注册
- `POST /api/users/login` - 用户登录
- `GET /api/users/profile` - 获取用户信息
- `PUT /api/users/profile` - 更新用户信息
- `PUT /api/users/password` - 修改密码
- `POST /api/users/steam/link` - 关联 Steam 账户

### 资产相关
- `GET /api/assets` - 获取资产列表
- `POST /api/assets/deposit` - 充值资产
- `POST /api/assets/withdraw` - 提现资产
- `GET /api/assets/deposit/history` - 获取充值历史
- `GET /api/assets/withdraw/history` - 获取提现历史

### 交易相关
- `GET /api/trades` - 获取交易对列表
- `GET /api/trades/:symbol` - 获取交易对详情
- `GET /api/trades/:symbol/orders` - 获取订单簿
- `GET /api/trades/:symbol/trades` - 获取交易历史
- `POST /api/trades/orders` - 创建订单
- `DELETE /api/trades/orders/:id` - 取消订单
- `GET /api/trades/orders` - 获取用户订单

### 钱包相关
- `GET /api/wallets` - 获取钱包余额
- `POST /api/wallets/deposit` - 充值
- `POST /api/wallets/withdraw` - 提现
- `GET /api/wallets/history` - 获取交易历史

### 管理员相关
- `GET /api/admin/users` - 获取用户列表
- `GET /api/admin/skus` - 获取资产列表
- `POST /api/admin/skus` - 创建资产
- `PUT /api/admin/skus/:id` - 更新资产
- `DELETE /api/admin/skus/:id` - 删除资产
- `GET /api/admin/status` - 获取系统状态

## 部署说明

### 前端部署

1. 构建生产版本：
   ```bash
   cd frontend
   npm run build
   ```

2. 将 `dist` 目录部署到静态文件服务器（如 Nginx、Vercel、Netlify 等）

### 后端部署

1. 设置环境变量为生产模式：
   ```env
   NODE_ENV=production
   DB_TYPE=postgres
   # 配置 PostgreSQL 连接信息
   ```

2. 安装依赖并启动：
   ```bash
   cd backend
   npm install --production
   npm start
   ```

3. 建议使用 PM2 等进程管理工具：
   ```bash
   npm install -g pm2
   pm2 start src/app.js --name gamemarket
   ```

## 环境变量说明

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| DB_TYPE | 数据库类型 (sqlite/postgres) | sqlite |
| SQLITE_PATH | SQLite 数据库文件路径 | ./data/database.sqlite |
| DB_HOST | PostgreSQL 主机 | localhost |
| DB_PORT | PostgreSQL 端口 | 5432 |
| DB_NAME | PostgreSQL 数据库名 | gamemarket |
| DB_USER | PostgreSQL 用户名 | postgres |
| DB_PASSWORD | PostgreSQL 密码 | - |
| DB_SSL | 是否使用 SSL | false |
| JWT_SECRET | JWT 密钥 | - |
| JWT_EXPIRES_IN | JWT 过期时间 | 24h |
| PORT | 服务器端口 | 8000 |
| NODE_ENV | 运行环境 | development |
| CORS_ORIGIN | 允许的跨域来源 | http://localhost:5173 |
| STEAM_API_KEY | Steam API 密钥 | - |

## 安全措施

1. **认证与授权**
   - JWT 认证
   - 密码加密存储 (bcryptjs)
   - 权限控制

2. **数据验证**
   - 前端表单验证
   - 后端参数验证

3. **API 安全**
   - CORS 配置
   - 速率限制
   - SQL 注入防护 (Sequelize ORM)

## 开发指南

### 添加新功能

1. 后端：
   - 在 `models/` 添加数据模型
   - 在 `controllers/` 添加控制器
   - 在 `routes/` 添加路由
   - 在 `app.js` 注册路由

2. 前端：
   - 在 `pages/` 添加页面组件
   - 在 `routes.tsx` 添加路由
   - 在 `services/api.ts` 添加 API 调用

### 数据库迁移

修改模型后，运行迁移命令更新数据库：
```bash
cd backend
npm run db:migrate
```

**注意**：这会删除现有数据并重新创建表，生产环境请谨慎使用。

## 常见问题

### 1. 安装 sqlite3 失败

在 Windows 上可能需要安装 Python 和 Visual Studio Build Tools：
```bash
npm install --global windows-build-tools
```

或使用预编译的二进制文件：
```bash
npm install sqlite3 --build-from-source
```

### 2. 端口被占用

修改 `.env` 文件中的 `PORT` 变量，或使用其他端口启动前端。

### 3. 数据库连接失败

- SQLite：确保 `data` 目录存在且有写入权限
- PostgreSQL：检查数据库服务是否运行，连接信息是否正确

## 贡献

欢迎贡献代码和提出建议！

## 许可证

MIT License

## 联系方式

如有问题或建议，请联系项目维护者。
