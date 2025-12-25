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
      padding: 12px 16px;
      border: 1px solid;
      background: white;
      border-left: 4px solid;
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 300px;
      max-width: 500px;
      opacity: 0;
      transform: translateX(400px);
      transition: all 0.2s ease;
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
        notification.style.borderColor = colors[type];

        const icon = document.createElement('span');
        icon.style.cssText = `
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      background: ${colors[type]};
      color: white;
      font-weight: bold;
      flex-shrink: 0;
      font-size: 12px;
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

    /**
     * 显示确认对话框（扁平化设计）
     * @param message 提示信息
     * @param title 标题（可选）
     * @returns Promise<boolean> 用户点击确认返回 true，取消返回 false
     */
    confirm(message: string, title: string = '确认操作'): Promise<boolean> {
        return new Promise((resolve) => {
            // 创建遮罩层
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                animation: fadeIn 0.2s ease;
            `;

            // 创建对话框
            const dialog = document.createElement('div');
            dialog.style.cssText = `
                background: white;
                border: none;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                min-width: 400px;
                max-width: 500px;
                width: 100%;
                overflow: hidden;
                animation: slideUp 0.3s ease;
            `;

            // 标题栏
            const header = document.createElement('div');
            header.style.cssText = `
                padding: 1.25rem 1.5rem;
                border-bottom: 1px solid #e9ecef;
                font-weight: 600;
                font-size: 1.25rem;
                color: white;
                background: linear-gradient(135deg, #4f8cff 0%, #9b7bff 100%);
                display: flex;
                align-items: center;
                gap: 0.5rem;
            `;
            
            // 添加图标
            const icon = document.createElement('i');
            icon.className = 'bi bi-question-circle-fill';
            icon.style.cssText = 'font-size: 1.2rem;';
            header.appendChild(icon);
            
            const titleText = document.createElement('span');
            titleText.textContent = title;
            header.appendChild(titleText);

            // 内容区域
            const body = document.createElement('div');
            body.style.cssText = `
                padding: 2rem 1.5rem;
                font-size: 0.9375rem;
                color: #495057;
                line-height: 1.6;
                white-space: pre-line;
            `;
            body.textContent = message;

            // 按钮区域
            const footer = document.createElement('div');
            footer.style.cssText = `
                padding: 1rem 1.5rem;
                border-top: 1px solid #e9ecef;
                display: flex;
                justify-content: flex-end;
                gap: 0.75rem;
                background: #f8f9fa;
            `;

            // 取消按钮
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = '取消';
            cancelBtn.className = 'btn-cancel';
            cancelBtn.style.cssText = `
                padding: 0.625rem 1.5rem;
                border: 1px solid #ced4da;
                background: white;
                color: #495057;
                font-size: 0.9375rem;
                font-weight: 600;
                cursor: pointer;
                border-radius: 8px;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            `;
            cancelBtn.onmouseenter = () => {
                cancelBtn.style.backgroundColor = '#f8f9fa';
                cancelBtn.style.borderColor = '#adb5bd';
                cancelBtn.style.transform = 'translateY(-1px)';
            };
            cancelBtn.onmouseleave = () => {
                cancelBtn.style.backgroundColor = 'white';
                cancelBtn.style.borderColor = '#ced4da';
                cancelBtn.style.transform = 'translateY(0)';
            };
            cancelBtn.onclick = () => {
                overlay.style.animation = 'fadeOut 0.2s ease';
                dialog.style.animation = 'slideDown 0.2s ease';
                setTimeout(() => {
                    if (document.body.contains(overlay)) {
                        document.body.removeChild(overlay);
                    }
                }, 200);
                resolve(false);
            };

            // 确认按钮
            const confirmBtn = document.createElement('button');
            confirmBtn.textContent = '确认';
            confirmBtn.className = 'btn-primary';
            confirmBtn.style.cssText = `
                padding: 0.625rem 1.5rem;
                border: none;
                background: linear-gradient(135deg, #4f8cff 0%, #9b7bff 100%);
                color: white;
                font-size: 0.9375rem;
                font-weight: 600;
                cursor: pointer;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(79, 140, 255, 0.3);
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            `;
            confirmBtn.onmouseenter = () => {
                confirmBtn.style.transform = 'translateY(-2px) scale(1.02)';
                confirmBtn.style.boxShadow = '0 6px 16px rgba(79, 140, 255, 0.4)';
            };
            confirmBtn.onmouseleave = () => {
                confirmBtn.style.transform = 'translateY(0) scale(1)';
                confirmBtn.style.boxShadow = '0 4px 12px rgba(79, 140, 255, 0.3)';
            };
            confirmBtn.onclick = () => {
                overlay.style.animation = 'fadeOut 0.2s ease';
                dialog.style.animation = 'slideDown 0.2s ease';
                setTimeout(() => {
                    if (document.body.contains(overlay)) {
                        document.body.removeChild(overlay);
                    }
                }, 200);
                resolve(true);
            };

            // 组装对话框
            footer.appendChild(cancelBtn);
            footer.appendChild(confirmBtn);
            dialog.appendChild(header);
            dialog.appendChild(body);
            dialog.appendChild(footer);
            overlay.appendChild(dialog);

            // 添加动画样式
            if (!document.getElementById('confirm-dialog-styles')) {
                const style = document.createElement('style');
                style.id = 'confirm-dialog-styles';
                style.textContent = `
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes fadeOut {
                        from { opacity: 1; }
                        to { opacity: 0; }
                    }
                    @keyframes slideUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    @keyframes slideDown {
                        from {
                            opacity: 1;
                            transform: translateY(0);
                        }
                        to {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                    }
                `;
                document.head.appendChild(style);
            }

            // 点击遮罩层关闭
            overlay.onclick = (e) => {
                if (e.target === overlay) {
                    overlay.style.animation = 'fadeOut 0.2s ease';
                    dialog.style.animation = 'slideDown 0.2s ease';
                    setTimeout(() => {
                        if (document.body.contains(overlay)) {
                            document.body.removeChild(overlay);
                        }
                    }, 200);
                    resolve(false);
                }
            };

            // ESC 键关闭
            const handleEsc = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    overlay.style.animation = 'fadeOut 0.2s ease';
                    dialog.style.animation = 'slideDown 0.2s ease';
                    setTimeout(() => {
                        if (document.body.contains(overlay)) {
                            document.body.removeChild(overlay);
                        }
                        document.removeEventListener('keydown', handleEsc);
                    }, 200);
                    resolve(false);
                }
            };
            document.addEventListener('keydown', handleEsc);

            // 添加到页面
            document.body.appendChild(overlay);

            // 聚焦确认按钮
            setTimeout(() => {
                confirmBtn.focus();
            }, 100);
        });
    }
}

// 导出单例
export const notification = new NotificationManager();

// 默认导出
export default notification;
