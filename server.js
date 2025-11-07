const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Важные настройки для Render
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling'] // Добавьте это
});

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

let messages = [];
let users = [];

io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);
  
  // Отправляем историю сообщений
  socket.emit('messageHistory', messages);
  
  // Уведомляем о новом пользователе
  socket.emit('userList', users);

  socket.on('sendMessage', (data) => {
    console.log('📨 New message:', data);
    const message = {
      id: Date.now(),
      author: data.author,
      content: data.content,
      timestamp: new Date(),
      channel: 'general'
    };
    
    messages.push(message);
    
    // Отправляем ВСЕМ подключенным
    io.emit('newMessage', message);
  });

  socket.on('userJoined', (userData) => {
    users.push({
      id: socket.id,
      username: userData.username,
      status: 'online'
    });
    io.emit('userList', users);
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
    users = users.filter(user => user.id !== socket.id);
    io.emit('userList', users);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});