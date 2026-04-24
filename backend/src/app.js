const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// 加载环境变量
dotenv.config();

// 初始化 Express 应用
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
const routes = require('./routes');
app.use('/', routes);

// WebSocket 连接
io.on('connection', (socket) => {
  console.log('New WebSocket connection');
  
  // 处理订阅交易对
  socket.on('subscribe', (symbol) => {
    console.log(`Subscribed to ${symbol}`);
    socket.join(symbol);
  });
  
  // 处理取消订阅
  socket.on('unsubscribe', (symbol) => {
    console.log(`Unsubscribed from ${symbol}`);
    socket.leave(symbol);
  });
  
  // 处理断开连接
  socket.on('disconnect', () => {
    console.log('WebSocket disconnected');
  });
});

// 启动服务器
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// 导出io实例，供其他模块使用
module.exports = { app, io, server };