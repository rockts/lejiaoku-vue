/**
 * 统一的通知和错误提示工具
 */

export interface NotificationOptions {
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number; // 持续时间（毫秒）
    onClose?: () => void;
}

class NotificationManager {
    private container: HTMLElement | null = null;
    private activeNotifications: HTMLElement[] = [];

    private getContainer(): HTMLElement {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'notification-container';
            this.container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        pointer-events: none;
      `;
            document.body.appendChild(this.container);
        }
        return this.container;
    }

    show(options: NotificationOptions): void {
        const {
            message,
            type = 'info',
            duration = 4000,
            onClose
        } = options;

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
      pointer-events: auto;
      margin-bottom: 12px;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      background: white;
      border-left: 4px solid;
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 300px;
      max-width: 500px;
      opacity: 0;
      transform: translateX(400px);
      transition: all 0.3s ease;
      font-size: 14px;
    `;

        // 设置边框颜色和图标
        const icons: Record<string, string> = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        const colors: Record<string, string> = {
            success: '#52c41a',
            error: '#f5222d',
            warning: '#faad14',
            info: '#1890ff'
        };

        notification.style.borderLeftColor = colors[type];

        const icon = document.createElement('span');
        icon.style.cssText = `
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: ${colors[type]};
      color: white;
      font-weight: bold;
      flex-shrink: 0;
    `;
        icon.textContent = icons[type];

        const content = document.createElement('span');
        content.style.cssText = `
      flex: 1;
      color: #333;
    `;
        content.textContent = message;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
      border: none;
      background: none;
      font-size: 20px;
      color: #999;
      cursor: pointer;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    `;
        closeBtn.onclick = () => this.remove(notification, onClose);

        notification.appendChild(icon);
        notification.appendChild(content);
        notification.appendChild(closeBtn);

        const container = this.getContainer();
        container.appendChild(notification);
        this.activeNotifications.push(notification);

        // 触发动画
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);

        // 自动关闭
        if (duration > 0) {
            setTimeout(() => {
                this.remove(notification, onClose);
            }, duration);
        }
    }

    private remove(notification: HTMLElement, onClose?: () => void): void {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(400px)';

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            const index = this.activeNotifications.indexOf(notification);
            if (index > -1) {
                this.activeNotifications.splice(index, 1);
            }
            if (onClose) {
                onClose();
            }
        }, 300);
    }

    success(message: string, duration?: number): void {
        this.show({ message, type: 'success', duration });
    }

    error(message: string, duration?: number): void {
        this.show({ message, type: 'error', duration });
    }

    warning(message: string, duration?: number): void {
        this.show({ message, type: 'warning', duration });
    }

    info(message: string, duration?: number): void {
        this.show({ message, type: 'info', duration });
    }
}

// 导出单例
export const notification = new NotificationManager();

// 默认导出
export default notification;
