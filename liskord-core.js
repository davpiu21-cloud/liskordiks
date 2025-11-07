// Liskord Core - Основной функционал приложения

class LiskordApp {
    constructor() {
        this.currentUser = null;
        this.currentChannel = 'welcome';
        this.messages = [];
        this.members = [];
        this.isInitialized = false;
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.loadSampleData();
        this.showLoginModal();
        this.isInitialized = true;
        
        console.log('Liskord initialized successfully');
    }

    loadUserData() {
        const savedUser = localStorage.getItem('liskord_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.hideLoginModal();
        }
    }

    setupEventListeners() {
        // Навигация по каналам
        document.querySelectorAll('.channel').forEach(channel => {
            channel.addEventListener('click', (e) => {
                this.switchChannel(e.target.dataset.channel);
            });
        });

        // Отправка сообщений
        document.getElementById('messageForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage();
        });

        // Вход в систему
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Голосовые каналы
        document.querySelectorAll('.voice-channel').forEach(channel => {
            channel.addEventListener('click', () => {
                this.joinVoiceChannel(channel.textContent);
            });
        });
    }

    showLoginModal() {
        document.getElementById('loginModal').style.display = 'flex';
    }

    hideLoginModal() {
        document.getElementById('loginModal').style.display = 'none';
        this.updateUI();
    }

    handleLogin() {
        const usernameInput = document.getElementById('usernameInput');
        const avatarInput = document.getElementById('avatarInput');
        
        const username = usernameInput.value.trim();
        const avatar = avatarInput.value.trim();

        if (!username) return;

        this.currentUser = {
            id: this.generateId(),
            username: username,
            avatar: avatar || '',
            tag: this.generateTag(),
            status: 'online'
        };

        localStorage.setItem('liskord_user', JSON.stringify(this.currentUser));
        this.hideLoginModal();
    }

    switchChannel(channelName) {
        this.currentChannel = channelName;
        
        // Обновляем активный канал
        document.querySelectorAll('.channel').forEach(channel => {
            channel.classList.remove('active');
        });
        document.querySelector(`[data-channel="${channelName}"]`).classList.add('active');

        // Обновляем заголовок
        document.querySelector('.channel-name').textContent = channelName;
        document.getElementById('messageInput').placeholder = `Написать сообщение в #${channelName}`;

        this.loadChannelMessages();
    }

    sendMessage() {
        const input = document.getElementById('messageInput');
        const content = input.value.trim();

        if (!content || !this.currentUser) return;

        const message = {
            id: this.generateId(),
            content: content,
            author: this.currentUser,
            channel: this.currentChannel,
            timestamp: new Date(),
            reactions: []
        };

        this.messages.push(message);
        this.displayMessage(message);
        input.value = '';

        // Сохраняем в localStorage
        this.saveMessages();
    }

    displayMessage(message) {
        const messagesContainer = document.getElementById('messagesView');
        const messageElement = this.createMessageElement(message);
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    createMessageElement(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                ${message.author.avatar ? 
                    `<img src="${message.author.avatar}" alt="${message.author.username}">` : 
                    message.author.username.charAt(0).toUpperCase()
                }
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-author">${message.author.username}</span>
                    <span class="message-time">${this.formatTime(message.timestamp)}</span>
                </div>
                <div class="message-text">${this.escapeHtml(message.content)}</div>
            </div>
        `;
        return messageDiv;
    }

    loadChannelMessages() {
        const messagesContainer = document.getElementById('messagesView');
        messagesContainer.innerHTML = '';

        const channelMessages = this.messages.filter(msg => msg.channel === this.currentChannel);
        
        if (channelMessages.length === 0) {
            this.showWelcomeMessage();
        } else {
            channelMessages.forEach(message => {
                this.displayMessage(message);
            });
        }
    }

    showWelcomeMessage() {
        const welcomeMessage = {
            id: 'welcome',
            author: {
                username: 'Liskord System',
                avatar: '',
                id: 'system'
            },
            content: `Добро пожаловать в канал #${this.currentChannel}! Это начало этого канала.`,
            timestamp: new Date(),
            channel: this.currentChannel
        };
        
        this.displayMessage(welcomeMessage);
    }

    joinVoiceChannel(channelName) {
        alert(`Присоединяемся к голосовому каналу: ${channelName}\n\nЭто демо-версия. В реальном приложении здесь будет подключение WebRTC.`);
    }

    updateUI() {
        if (this.currentUser) {
            document.getElementById('currentUsername').textContent = this.currentUser.username;
            document.getElementById('userAvatar').src = this.currentUser.avatar;
            document.getElementById('userAvatar').alt = this.currentUser.username;
        }
    }

    loadSampleData() {
        // Загрузка тестовых данных
        const savedMessages = localStorage.getItem('liskord_messages');
        if (savedMessages) {
            this.messages = JSON.parse(savedMessages);
        }

        // Загрузка тестовых участников
        this.members = [
            { id: '1', username: 'UserOne', status: 'online', activity: 'В Liskord' },
            { id: '2', username: 'UserTwo', status: 'idle', activity: 'Не активен' },
            { id: '3', username: 'UserThree', status: 'dnd', activity: 'Не беспокоить' }
        ];

        this.updateMembersList();
    }

    updateMembersList() {
        const membersList = document.getElementById('membersList');
        membersList.innerHTML = '';

        this.members.forEach(member => {
            const memberElement = document.createElement('div');
            memberElement.className = 'member';
            memberElement.innerHTML = `
                <div class="member-avatar">
                    ${member.username.charAt(0).toUpperCase()}
                    <div class="member-status ${member.status}"></div>
                </div>
                <div class="member-info">
                    <span class="member-name">${member.username}</span>
                    <span class="member-activity">${member.activity}</span>
                </div>
            `;
            membersList.appendChild(memberElement);
        });
    }

    saveMessages() {
        localStorage.setItem('liskord_messages', JSON.stringify(this.messages));
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    generateTag() {
        return Math.floor(1000 + Math.random() * 9000);
    }

    formatTime(date) {
        return new Date(date).toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Инициализация приложения
const liskord = new LiskordApp();
document.addEventListener('DOMContentLoaded', () => liskord.init());