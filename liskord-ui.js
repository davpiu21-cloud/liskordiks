// Liskord UI - Управление интерфейсом

class LiskordUI {
    constructor(app) {
        this.app = app;
    }

    init() {
        this.setupUIInteractions();
        this.setupResponsiveDesign();
    }

    setupUIInteractions() {
        // Переключение серверов
        document.querySelectorAll('.server-icon').forEach(icon => {
            icon.addEventListener('click', () => {
                this.switchServer(icon.dataset.server);
            });
        });

        // Кнопки управления пользователя
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleUserControl(e.target);
            });
        });

        // Действия в чате
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleChatAction(e.target);
            });
        });
    }

    switchServer(serverId) {
        document.querySelectorAll('.server-icon').forEach(icon => {
            icon.classList.remove('active');
        });
        document.querySelector(`[data-server="${serverId}"]`).classList.add('active');

        // Обновляем заголовок сервера
        const serverTitles = {
            'main': 'Liskord Space',
            'gaming': 'Gaming Zone',
            'music': 'Music Lounge'
        };

        document.querySelector('.server-header h2').textContent = serverTitles[serverId] || 'Liskord Server';
    }

    handleUserControl(button) {
        const action = button.textContent || button.classList[1];
        
        switch(action) {
            case '🎤':
                this.toggleMicrophone();
                break;
            case '🎧':
                this.toggleHeadphones();
                break;
            case '⚙️':
                this.showSettings();
                break;
        }
    }

    handleChatAction(button) {
        const action = button.textContent;
        
        switch(action) {
            case '👥':
                this.toggleMembersList();
                break;
            case '🔍':
                this.showSearch();
                break;
            case '📌':
                this.showPinnedMessages();
                break;
            case '@':
                this.showMentions();
                break;
        }
    }

    toggleMicrophone() {
        console.log('Microphone toggled');
        // Реализация переключения микрофона
    }

    toggleHeadphones() {
        console.log('Headphones toggled');
        // Реализация переключения звука
    }

    showSettings() {
        alert('Настройки Liskord\n\nЭто демо-версия. В реальном приложении здесь будут настройки пользователя.');
    }

    toggleMembersList() {
        const membersSidebar = document.querySelector('.liskord-members');
        const isHidden = membersSidebar.style.display === 'none';
        membersSidebar.style.display = isHidden ? 'flex' : 'none';
    }

    showSearch() {
        alert('Поиск сообщений\n\nЭто демо-версия. В реальном приложении здесь будет поиск по сообщениям.');
    }

    showPinnedMessages() {
        alert('Закрепленные сообщения\n\nЭто демо-версия. В реальном приложении здесь будут закрепленные сообщения.');
    }

    showMentions() {
        alert('Упоминания\n\nЭто демо-версия. В реальном приложении здесь будут упоминания пользователя.');
    }

    setupResponsiveDesign() {
        // Адаптация под мобильные устройства
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    handleResize() {
        if (window.innerWidth < 768) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    }
}