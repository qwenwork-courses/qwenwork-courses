/**
 * 全局悬浮客服组件 (Global Floating Contact)
 * 功能：右下角悬浮头像 -> 悬停展开二维码 -> 点击弹出大图
 */
(function() {
    // 防止重复加载
    if (window.__floatContactLoaded) return;
    window.__floatContactLoaded = true;

    // 配置项
    const CONFIG = {
        avatarUrl: "https://gw.alicdn.com/imgextra/i1/O1CN016CfrfB1ojaqRMGryd_!!6000000005261-2-tps-544-544.png",
        label: "课程合作<br>钉钉扫码咨询"
    };

    // 1. 注入 CSS 样式
    function injectStyles() {
        const styleId = 'global-float-style';
        if (document.getElementById(styleId)) return;

        const css = `
            /* 悬浮容器 */
            .float-contact {
                position: fixed;
                bottom: 15px;
                right: 15px;
                z-index: 9999;
                transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            }

            /* 关闭按钮 */
            .contact-close {
                position: absolute;
                top: -10px;
                right: -10px;
                width: 24px;
                height: 24px;
                background: #fff;
                color: #666;
                border-radius: 50%;
                text-align: center;
                line-height: 22px;
                font-size: 16px;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                z-index: 20;
                opacity: 0;
                transition: opacity 0.3s;
            }

            .float-contact:hover .contact-close {
                opacity: 1;
            }

            /* 触发器区域（头像+文字） */
            .contact-trigger {
                display: flex;
                flex-direction: column;
                align-items: center;
                cursor: pointer;
                transition: transform 0.3s;
            }

            .float-contact:hover .contact-trigger {
                transform: scale(0.9);
            }

            /* 圆形头像 */
            .avatar-circle {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                overflow: hidden;
                border: 3px solid #fff;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                background: #fff;
            }

            .avatar-circle img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            /* 文字说明 */
            .contact-label {
                margin-top: 8px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #fff;
                font-size: 11px;
                padding: 4px 8px;
                border-radius: 12px;
                text-align: center;
                line-height: 1.4;
                white-space: nowrap;
                box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                transition: opacity 0.3s;
            }

            .float-contact:hover .contact-label {
                opacity: 0;
            }

            /* 展开的图片区域 */
            .contact-expand-box {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 0;
                height: 0;
                overflow: hidden;
                border-radius: 12px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
                background: #fff;
                transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
                opacity: 0;
                pointer-events: none;
            }

            /* 悬停时展开 */
            .float-contact:hover .contact-expand-box {
                width: 220px;
                height: 220px;
                opacity: 1;
                pointer-events: auto;
                bottom: 70px;
                right: -10px;
            }

            .expand-img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                cursor: pointer;
            }

            /* 中央弹窗遮罩 */
            .contact-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
                z-index: 10000;
                justify-content: center;
                align-items: center;
                backdrop-filter: blur(4px);
            }

            /* 弹窗内容 */
            .modal-body {
                position: relative;
                max-width: 90vw;
                max-height: 90vh;
                animation: modalPop 0.3s ease-out;
            }

            .modal-body img {
                max-width: 100%;
                max-height: 85vh;
                border-radius: 8px;
                box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
            }

            /* 弹窗关闭按钮 */
            .modal-close-btn {
                position: absolute;
                top: -40px;
                right: 0;
                color: #fff;
                font-size: 32px;
                cursor: pointer;
                transition: transform 0.2s;
            }

            .modal-close-btn:hover {
                transform: scale(1.1);
            }

            @keyframes modalPop {
                from { transform: scale(0.9); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }

            /* 移动端适配 */
            @media (max-width: 768px) {
                .float-contact {
                    bottom: 20px;
                    right: 20px;
                }
                .avatar-circle {
                    width: 50px;
                    height: 50px;
                }
                .contact-label {
                    font-size: 10px;
                }
                .float-contact:hover .contact-expand-box {
                    width: 180px;
                    height: 180px;
                }
            }
        `;

        const styleEl = document.createElement('style');
        styleEl.id = styleId;
        styleEl.textContent = css;
        document.head.appendChild(styleEl);
    }

    // 2. 注入 HTML 结构
    function injectHTML() {
        if (document.getElementById('floatContact')) return;

        const html = `
            <div class="float-contact" id="floatContact">
                <span class="contact-close" id="contactClose">&times;</span>
                <div class="contact-trigger">
                    <div class="avatar-circle">
                        <img src="${CONFIG.avatarUrl}" alt="客服头像" />
                    </div>
                    <div class="contact-label">${CONFIG.label}</div>
                </div>
                <div class="contact-expand-box">
                    <img src="${CONFIG.avatarUrl}" alt="咨询二维码" class="expand-img" />
                </div>
            </div>

            <div class="contact-modal" id="contactModal">
                <div class="modal-body">
                    <span class="modal-close-btn" id="modalClose">&times;</span>
                    <img src="${CONFIG.avatarUrl}" alt="咨询详情" />
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
    }

    // 3. 绑定交互逻辑
    function bindEvents() {
        const floatEl = document.getElementById('floatContact');
        const closeBtn = document.getElementById('contactClose');
        const expandImg = document.querySelector('.expand-img');
        const modalEl = document.getElementById('contactModal');
        const modalCloseBtn = document.getElementById('modalClose');

        if (!floatEl) return;

        // 点击展开的图片 -> 打开中央弹窗
        if (expandImg) {
            expandImg.addEventListener('click', function(e) {
                e.stopPropagation();
                modalEl.style.display = 'flex';
            });
        }

        // 点击右下角关闭按钮 -> 隐藏整个浮窗
        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                floatEl.style.display = 'none';
            });
        }

        // 点击弹窗关闭按钮 -> 关闭弹窗
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', function() {
                modalEl.style.display = 'none';
            });
        }

        // 点击弹窗背景 -> 关闭弹窗
        if (modalEl) {
            modalEl.addEventListener('click', function(e) {
                if (e.target === modalEl) {
                    modalEl.style.display = 'none';
                }
            });
        }
    }

    // 初始化执行
    function init() {
        injectStyles();
        injectHTML();
        bindEvents();
    }

    // 确保 DOM 加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();