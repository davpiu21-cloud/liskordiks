// Liskord Auth - Управление аутентификацией

class LiskordAuth {
    constructor(app) {
        this.app = app;
    }

    init() {
        this.setupAuthHandlers();
    }

    setupAuthHandlers() {
        // Дополнительная логика аутентификации
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.getElementById('loginModal').style.display === 'flex') {
                this.app.hideLoginModal();
            }
        });
    }

    logout() {
        localStorage.removeItem('liskord_user');
        localStorage.removeItem('liskord_messages');
        this.app.currentUser = null;
        this.app.showLoginModal();
    }

    // Дополнительные методы для расширения системы аутентификации
}

// Интеграция всех модулей
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация основного приложения
    liskord.init();

    // Инициализация дополнительных модулей
    const chat = new LiskordChat(liskord);
    const ui = new LiskordUI(liskord);
    const auth = new LiskordAuth(liskord);

    chat.init();
    ui.init();
    auth.init();

    // Экспорт для глобального доступа (для отладки)
    window.Liskord = {
        app: liskord,
        chat: chat,
        ui: ui,
        auth: auth
    };
});