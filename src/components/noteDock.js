// 缩放的 notes 的储存点

// components/NoteDock.js

const NoteDock = {
    host: null,            // Dock 的 DOM 容器
    minimizedNotes: new Map(), // 存储被最小化的便签信息 {id: title}

    // --- 内部方法：初始化 DOM 结构 ---
    init() {
        if (this.host) return;

        // 1. 创建 CSS
        const style = document.createElement('style');
        style.innerHTML = `
            #gemini-note-dock {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 2147483647; /* 保证最高层级 */
                font-family: sans-serif;
                display: none; /* 默认隐藏 */
            }

            /* 主圆球按钮 */
            .dock-btn {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            .dock-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            }

            /* 列表容器 (默认隐藏，悬停时出现) */
            .dock-list {
                position: absolute;
                bottom: 60px; /* 在球的上方 */
                right: 0;
                width: 200px;
                background: white;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.15);
                padding: 5px 0;
                display: none; 
                flex-direction: column;
                opacity: 0;
                transform: translateY(10px);
                transition: all 0.2s;
            }

            .dock-list::after {
                content: '';
                position: absolute;
                
                /* 让它位于列表的紧下方 */
                top: 100%; 
                left: 0;
                
                /* 宽度占满，高度足够填补空隙 (Gap是10px，给20px是为了保险) */
                width: 100%;
                height: 20px; 
                
                /* 透明背景，用户看不见，但鼠标能摸到 */
                background: transparent; 
            }

            /* 悬停在整个组件上时显示列表 */
            #gemini-note-dock:hover .dock-list {
                display: flex;
                opacity: 1;
                transform: translateY(0);
            }

            /* 列表项 */
            .dock-item {
                padding: 10px 15px;
                font-size: 13px;
                color: #333;
                cursor: pointer;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                border-left: 3px solid transparent;
                transition: background 0.2s;
            }
            .dock-item:hover {
                background: #f8f9fa;
                border-left-color: #4285f4;
                color: #4285f4;
            }

            /* 数字角标 */
            .badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #ea4335;
                color: white;
                font-size: 10px;
                font-weight: bold;
                padding: 2px 6px;
                border-radius: 10px;
                border: 2px solid white;
            }
        `;
        document.head.appendChild(style);

        // 2. 创建 HTML
        const div = document.createElement('div');
        div.id = 'gemini-note-dock';
        div.innerHTML = `
            <div class="dock-list" id="dockList"></div>
            <div class="dock-btn">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                <div class="badge" id="dockBadge">0</div>
            </div>
        `;
        document.body.appendChild(div);
        this.host = div;
    },

    // --- 公开方法：最小化 ---
    minimize(noteId, title) {
        this.init(); // 懒加载

        // 1. 隐藏 Note
        const noteEl = document.getElementById(noteId);
        if (noteEl) noteEl.style.display = 'none';

        // 2. 存入数据
        this.minimizedNotes.set(noteId, title);

        // 3. 渲染
        this.render();
    },

    // --- 公开方法：恢复 ---
    restore(noteId) {
        // 1. 显示 Note
        const noteEl = document.getElementById(noteId);
        if (noteEl) {
            noteEl.style.display = 'block';
            // 可选：给个弹入动画
            noteEl.style.animation = 'popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
        }

        // 2. 移除数据
        this.minimizedNotes.delete(noteId);

        // 3. 渲染
        this.render();
    },

    // --- 公开方法：彻底移除记录 (比如用户直接把 note 关了) ---
    removeRecord(noteId) {
        if (this.minimizedNotes.has(noteId)) {
            this.minimizedNotes.delete(noteId);
            this.render();
        }
    },

    // --- 内部方法：渲染 UI ---
    render() {
        if (!this.host) return;

        const listEl = this.host.querySelector('#dockList');
        const badgeEl = this.host.querySelector('#dockBadge');

        // 如果没有内容，隐藏整个 Dock
        if (this.minimizedNotes.size === 0) {
            this.host.style.display = 'none';
            return;
        }

        this.host.style.display = 'block';
        badgeEl.innerText = this.minimizedNotes.size;
        listEl.innerHTML = '';

        // 生成列表
        this.minimizedNotes.forEach((title, id) => {
            const item = document.createElement('div');
            item.className = 'dock-item';
            item.innerText = title;
            item.onclick = () => this.restore(id); // 点击列表项恢复
            listEl.appendChild(item);
        });
    }
};

export default NoteDock;