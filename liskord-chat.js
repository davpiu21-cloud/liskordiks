// Liskord Chat - Расширенный функционал чата

class LiskordChat {
    constructor(app) {
        this.app = app;
        this.typingUsers = new Set();
        this.typingTimeout = null;
    }

    init() {
        this.setupChatFeatures();
        this.setupMessageActions();
    }

    setupChatFeatures() {
        // Отслеживание ввода сообщения
        const messageInput = document.getElementById('messageInput');
        
        messageInput.addEventListener('input', () => {
            this.handleTyping();
        });

        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.app.sendMessage();
            }
        });
    }

    handleTyping() {
        // В реальном приложении здесь бы отправлялось событие другим пользователям
        console.log('User is typing...');
    }

    setupMessageActions() {
        // Реакции на сообщения
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('message-text')) {
                this.showMessageActions(e.target);
            }
        });
    }

    showMessageActions(messageElement) {
        // Показ меню действий с сообщением
        console.log('Message actions for:', messageElement.textContent);
    }

    addReaction(messageId, emoji) {
        const message = this.app.messages.find(msg => msg.id === messageId);
        if (message) {
            const reaction = message.reactions.find(r => r.emoji === emoji);
            if (reaction) {
                reaction.users.push(this.app.currentUser.id);
            } else {
                message.reactions.push({
                    emoji: emoji,
                    users: [this.app.currentUser.id]
                });
            }
            this.app.saveMessages();
        }
    }

    // Дополнительные методы для расширения функционала чата
}