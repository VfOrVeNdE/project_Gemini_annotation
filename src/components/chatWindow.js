// 窗口长什么样，如何出现，应该有哪些动作响应逻辑
import NoteDock from './noteDock'; 

// decoration of window
let activeNotes = new Map();            // initialize current StickyNote reference as null map
let zIndexCounter = 10000;

// 配置
let NOTE_CONFIG = {
    width: 320,                         
    minWidth: 280,
    minHeight: 250,                     
    headerHeight: 40,                   
    zIndex: 10000,                      
    color: '#ffffff',                 
    pin_color: '#34a853',
    minimize_color: '#4285f4'
};

// annotation window
export function createStickyNote(x, y, contextText, onSendCallback) {       // the callback when the user clicks Send
    
    // generate unique note id
    const noteId = `note_${Date.now()}`;
    zIndexCounter++;

    // create host
    const host = document.createElement('div');
    host.id = noteId;
    host.style.position = 'absolute';
    host.style.left = `${x}px`;
    host.style.top = `${y}px`;
    host.style.zIndex = zIndexCounter;
    host.style.pointerEvents = 'none';

    document.body.appendChild(host);

    // shadow DOM
    const shadow = host.attachShadow({ mode: 'open' });

    // HTML pin icon
    const iconPin = `
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2">
            <path d="M15.9894 4.9502L16.52 4.42014L16.52 4.42014L15.9894 4.9502ZM19.0717 8.03562L18.5411 8.56568L18.5411 8.56568L19.0717 8.03562ZM8.73845 19.429L8.20785 19.9591L8.73845 19.429ZM4.62176 15.3081L5.15236 14.7781L4.62176 15.3081ZM17.567 14.9943L17.3032 14.2922L17.567 14.9943ZM15.6499 15.7146L15.9137 16.4167L15.6499 15.7146ZM8.33227 8.38177L7.62805 8.12375H7.62805L8.33227 8.38177ZM9.02673 6.48636L9.73095 6.74438L9.02673 6.48636ZM5.84512 10.6735L6.04445 11.3965H6.04445L5.84512 10.6735ZM7.30174 10.1351L6.86354 9.52646L6.86354 9.52646L7.30174 10.1351ZM7.6759 9.79038L8.24673 10.2768H8.24673L7.6759 9.79038ZM14.2511 16.3805L14.7421 16.9475L14.7421 16.9475L14.2511 16.3805ZM13.3807 18.2012L12.6575 18.0022V18.0022L13.3807 18.2012ZM13.917 16.7466L13.3076 16.3094L13.3076 16.3094L13.917 16.7466ZM2.71854 12.7552L1.96855 12.76V12.76L2.71854 12.7552ZM2.93053 11.9521L2.28061 11.5778H2.28061L2.93053 11.9521ZM11.3053 21.3431L11.3064 20.5931H11.3064L11.3053 21.3431ZM12.0933 21.1347L11.7216 20.4833L11.7216 20.4833L12.0933 21.1347ZM11.6973 2.03606L11.8589 2.76845L11.6973 2.03606ZM15.4588 5.48026L18.5411 8.56568L19.6023 7.50556L16.52 4.42014L15.4588 5.48026ZM9.26905 18.8989L5.15236 14.7781L4.09116 15.8382L8.20785 19.9591L9.26905 18.8989ZM17.3032 14.2922L15.3861 15.0125L15.9137 16.4167L17.8308 15.6964L17.3032 14.2922ZM9.03649 8.63979L9.73095 6.74438L8.32251 6.22834L7.62805 8.12375L9.03649 8.63979ZM6.04445 11.3965C6.75591 11.2003 7.29726 11.0625 7.73995 10.7438L6.86354 9.52646C6.6906 9.65097 6.46608 9.72428 5.64578 9.95044L6.04445 11.3965ZM7.62805 8.12375C7.3351 8.92332 7.24345 9.14153 7.10507 9.30391L8.24673 10.2768C8.60048 9.86175 8.78237 9.33337 9.03649 8.63979L7.62805 8.12375ZM7.73995 10.7438C7.92704 10.6091 8.09719 10.4523 8.24673 10.2768L7.10507 9.30391C7.03377 9.38757 6.95268 9.46229 6.86354 9.52646L7.73995 10.7438ZM15.3861 15.0125C14.697 15.2714 14.1717 15.4571 13.7601 15.8135L14.7421 16.9475C14.9029 16.8082 15.1193 16.7152 15.9137 16.4167L15.3861 15.0125ZM14.1038 18.4001C14.3291 17.5813 14.4022 17.3569 14.5263 17.1838L13.3076 16.3094C12.9903 16.7517 12.853 17.2919 12.6575 18.0022L14.1038 18.4001ZM13.7601 15.8135C13.5904 15.9605 13.4385 16.1269 13.3076 16.3094L14.5263 17.1838C14.5888 17.0968 14.6612 17.0175 14.7421 16.9475L13.7601 15.8135ZM5.15236 14.7781C4.50623 14.1313 4.06806 13.691 3.78374 13.3338C3.49842 12.9753 3.46896 12.8201 3.46852 12.7505L1.96855 12.76C1.97223 13.3422 2.26135 13.8297 2.6101 14.2679C2.95984 14.7073 3.47123 15.2176 4.09116 15.8382L5.15236 14.7781ZM5.64578 9.95044C4.80056 10.1835 4.10403 10.3743 3.58304 10.5835C3.06349 10.792 2.57124 11.0732 2.28061 11.5778L3.58045 12.3264C3.61507 12.2663 3.717 12.146 4.14187 11.9755C4.56531 11.8055 5.16345 11.6394 6.04445 11.3965L5.64578 9.95044ZM3.46852 12.7505C3.46758 12.6016 3.50623 12.4553 3.58045 12.3264L2.28061 11.5778C2.07362 11.9372 1.96593 12.3452 1.96855 12.76L3.46852 12.7505ZM8.20785 19.9591C8.83172 20.5836 9.34472 21.0987 9.78654 21.4506C10.2271 21.8015 10.718 22.0922 11.3042 22.0931L11.3064 20.5931C11.237 20.593 11.0815 20.5644 10.7211 20.2773C10.3619 19.9912 9.91931 19.5499 9.26905 18.8989L8.20785 19.9591ZM12.6575 18.0022C12.4133 18.8897 12.2463 19.4924 12.0752 19.9188C11.9034 20.3467 11.7822 20.4487 11.7216 20.4833L12.4651 21.7861C12.9741 21.4956 13.2573 21.0004 13.4672 20.4775C13.6777 19.9532 13.8695 19.2516 14.1038 18.4001L12.6575 18.0022ZM11.3042 22.0931C11.7113 22.0937 12.1115 21.9879 12.4651 21.7861L11.7216 20.4833C11.5951 20.5555 11.452 20.5933 11.3064 20.5931L11.3042 22.0931ZM18.5411 8.56568C19.6046 9.63022 20.3403 10.3695 20.7918 10.9788C21.2353 11.5774 21.2864 11.8959 21.2322 12.1464L22.6983 12.4634C22.8882 11.5854 22.5383 10.8162 21.997 10.0857C21.4636 9.36592 20.6306 8.53486 19.6023 7.50556L18.5411 8.56568ZM17.8308 15.6964C19.1922 15.1849 20.2941 14.773 21.0771 14.3384C21.8719 13.8973 22.5084 13.3416 22.6983 12.4634L21.2322 12.1464C21.178 12.3968 21.0002 12.6655 20.3492 13.0268C19.6865 13.3946 18.7113 13.7632 17.3032 14.2922L17.8308 15.6964ZM16.52 4.42014C15.4841 3.3832 14.6481 2.54353 13.9246 2.00638C13.1909 1.46165 12.4175 1.10912 11.5357 1.30367L11.8589 2.76845C12.1086 2.71335 12.4278 2.7633 13.0305 3.21075C13.6434 3.66579 14.3877 4.40801 15.4588 5.48026L16.52 4.42014ZM9.73095 6.74438C10.2526 5.32075 10.6162 4.33403 10.9813 3.66315C11.3403 3.00338 11.6091 2.82357 11.8589 2.76845L11.5357 1.30367C10.6541 1.49819 10.1006 2.14332 9.6637 2.94618C9.23286 3.73793 8.82695 4.85154 8.32251 6.22834L9.73095 6.74438Z" />
            <path opacity="0.5" d="M1.4694 21.4697C1.17666 21.7627 1.1769 22.2376 1.46994 22.5304C1.76298 22.8231 2.23786 22.8229 2.5306 22.5298L1.4694 21.4697ZM7.18383 17.8719C7.47657 17.5788 7.47633 17.1039 7.18329 16.8112C6.89024 16.5185 6.41537 16.5187 6.12263 16.8117L7.18383 17.8719ZM2.5306 22.5298L7.18383 17.8719L6.12263 16.8117L1.4694 21.4697L2.5306 22.5298Z" fill="currentColor" />
        </svg>
    `;

    // HTML minimize button
    const iconMinimize = `
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentcolor" stroke-width="2" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.8571 9.75C21.2714 9.75 21.6071 9.41421 21.6071 9C21.6071 8.58579 21.2714 8.25 20.8571 8.25H16.8107L22.5303 2.53033C22.8232 2.23744 22.8232 1.76256 22.5303 1.46967C22.2374 1.17678 21.7626 1.17678 21.4697 1.46967L15.75 7.18934V3.14286C15.75 2.72864 15.4142 2.39286 15 2.39286C14.5858 2.39286 14.25 2.72864 14.25 3.14286V9C14.25 9.41421 14.5858 9.75 15 9.75H20.8571Z" />
            <path d="M3.14286 14.25C2.72864 14.25 2.39286 14.5858 2.39286 15C2.39286 15.4142 2.72864 15.75 3.14286 15.75H7.18934L1.46967 21.4697C1.17678 21.7626 1.17678 22.2374 1.46967 22.5303C1.76256 22.8232 2.23744 22.8232 2.53033 22.5303L8.25 16.8107V20.8571C8.25 21.2714 8.58579 21.6071 9 21.6071C9.41421 21.6071 9.75 21.2714 9.75 20.8571V15C9.75 14.5858 9.41421 14.25 9 14.25H3.14286Z" />
        </svg>
    `;

    // HTML close button
    const iconClose = `
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentcolor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6L6 18M6 6l12 12"></path>
        </svg>
    `;

    // HTML send button
    const iconSend = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>
        </svg>
    `;
    
    // HTML loading button
    const iconLoading = `
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
        </svg>
    `;

    const template = `
        <style>
            :host { 
                all: initial; 
                box-sizing: border-box; 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }

            .note-card {
                /* 注意：这里设置 pointer-events: auto，因为 host 设置了 none */
                pointer-events: auto; 
                width: ${NOTE_CONFIG.width}px;
                height: auto; 
                min-width: ${NOTE_CONFIG.minWidth}px;
                min-height: ${NOTE_CONFIG.minHeight}px;
                
                background: ${NOTE_CONFIG.color};
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.15);
                border: 1px solid #e0e0e0;
                
                display: flex;
                flex-direction: column;
                overflow: visible; /* 必须允许 resizer 溢出一点点或者位于边界 */
                position: relative; 
                
                animation: popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                transform-origin: top left;
            }

            .header {
                height: ${NOTE_CONFIG.headerHeight}px;
                background: linear-gradient(to right, #f8f9fa, #e9ecef);
                border-bottom: 1px solid #dee2e6;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 12px;
                cursor: grab;
                flex-shrink: 0; 
                user-select: none;
            }
            .header:active { cursor: grabbing; }

            /* Header 内部样式 */
            .title-span { font-size: 13px; font-weight: 600; margin-right: auto; color: #495057; padding: 2px 4px; max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: text; border: 1px solid transparent; }
            .title-span:hover { background: rgba(0,0,0,0.03); border-radius: 4px; }
            .title-input { font-size: 13px; font-weight: 600; color: #495057; padding: 2px 4px; margin-right: auto; width: 140px; outline: none; background: #ffffff; border: 1px solid #4285f4; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .header.pinned { cursor: default; border-bottom: 1px solid #adb5bd; }
            
            .close-btn, .minimize-btn { background: transparent; border: none; font-size: 24px; color: #adb5bd; cursor: pointer; padding: 0 5px; line-height: 1; transition: color 0.2s; }
            .close-btn:hover { color: #dc3545; transform: scale(1.1); }
            .minimize-btn:hover { color: ${NOTE_CONFIG.minimize_color}; transform: scale(1.1); }
            
            .pin-btn { background: transparent; border: none; cursor: pointer; padding: 0 5px; margin-left: auto; color: currentcolor; transition: all 0.2s; display: flex; align-items: center; }
            .pin-btn:hover { color: ${NOTE_CONFIG.pin_color}; transform: scale(1.1); }
            .pin-btn.active { color: ${NOTE_CONFIG.pin_color};}

            .body {
                flex: 1;            
                padding: 12px;
                display: flex;
                flex-direction: column;
                gap: 10px;
                overflow-y: auto;   
                scrollbar-width: thin;
                scrollbar-color: #e0e0e0 transparent;
            }
            .body::-webkit-scrollbar { width: 6px; }
            .body::-webkit-scrollbar-track { background: transparent; }
            .body::-webkit-scrollbar-thumb { background-color: #e0e0e0; border-radius: 20px; }

            .context-quote {
                font-size: 12px;
                color: #666;
                background: #f1f3f4;
                padding: 8px;
                border-left: 3px solid #4285f4;
                border-radius: 2px;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
                flex-shrink: 0;
            }

            .answer-area {
                font-size: 14px; 
                line-height: 1.6; 
                color: #1f2937;
                white-space: pre-wrap; 
                margin-top: 10px;      
            }
            .answer-area.thinking { color: #9ca3af; font-style: italic; }

            .footer {
                padding: 12px 16px; 
                border-top: 1px solid #f3f4f6; 
                background: #fff;
                display: flex; 
                gap: 10px; 
                align-items: center;
                flex-shrink: 0;     
            }

            textarea { flex: 1; max-height: 100px; min-height: 40px; padding: 10px 14px; border-radius: 20px; border: 1px solid #e5e7eb; background: #f9fafb; font-family: inherit; font-size: 14px; color: #1f2937; line-height: 1.5; resize: none; outline: none; transition: all 0.2s; }
            textarea:focus { border-color: #6366f1; background: #fff; box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1); }    
            textarea::placeholder {color: #9ca3af; font-family: inherit; }
            .send-btn { width: 40px; height: 40px; border-radius: 50%; border: none; background: linear-gradient(135deg, #4285f4 0%, #9b72cb 100%); box-shadow: 0 2px 5px rgba(99, 102, 241, 0.3); color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.1s, box-shadow: 0.2s; flex-shrink: 0; }
            .send-btn:hover { transform: scale(1.05); box-shadow: 0 4px 10px rgba(99, 102, 241, 0.4); }
            .send-btn:active { transform: scale(0.95); }
            .send-btn:disabled { background: #e5e7eb; box-shadow: none; cursor: not-allowed; }
            .spin { animation: spin 1s linear infinite; }
            @keyframes popIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
            @keyframes spin { 100% { transform: rotate(360deg); } }

            /* --- 全方向 Resizer 样式 --- */
            .resizer {
                position: absolute;
                background: transparent; /* 平时看不见 */
                z-index: 999;
                /* 调试时可以把 opacity 改成 0.5 看看位置 */
            }

            /* 边 (Sides) - 6px 宽/高，方便鼠标抓取 */
            .resizer.n { top: -3px; left: 0; right: 0; height: 6px; cursor: n-resize; }
            .resizer.s { bottom: -3px; left: 0; right: 0; height: 6px; cursor: s-resize; }
            .resizer.e { right: -3px; top: 0; bottom: 0; width: 6px; cursor: e-resize; }
            .resizer.w { left: -3px; top: 0; bottom: 0; width: 6px; cursor: w-resize; }

            /* 角 (Corners) - 10px 大小 */
            .resizer.ne { top: -5px; right: -5px; width: 12px; height: 12px; cursor: ne-resize; z-index: 1000; }
            .resizer.nw { top: -5px; left: -5px; width: 12px; height: 12px; cursor: nw-resize; z-index: 1000; }
            .resizer.se { bottom: -5px; right: -5px; width: 12px; height: 12px; cursor: se-resize; z-index: 1000; }
            .resizer.sw { bottom: -5px; left: -5px; width: 12px; height: 12px; cursor: sw-resize; z-index: 1000; }

            .note-card.pinned .resizer {
                pointer-events: none;  /* 彻底禁用鼠标交互 */
                display: none;         /* 或者直接隐藏，看你喜好 */
            }
        </style>

        <div class="note-card" id="card">
            <div class="resizer n" data-dir="n"></div>
            <div class="resizer s" data-dir="s"></div>
            <div class="resizer e" data-dir="e"></div>
            <div class="resizer w" data-dir="w"></div>
            <div class="resizer ne" data-dir="ne"></div>
            <div class="resizer nw" data-dir="nw"></div>
            <div class="resizer se" data-dir="se"></div>
            <div class="resizer sw" data-dir="sw"></div>

            <div class="header" id="dragHeader">  
                <span id="titleSpan" class="title-span">Note #${activeNotes.size + 1}</span>      
                <input type="text" id="noteTitle" class="title-input" value="Note #${activeNotes.size + 1}" spellcheck="false" style="display:none;">
                
                <button class="pin-btn" id="pinBtn" title="Pin note">${iconPin}</button>
                <button class="minimize-btn" id="minimizeBtn" title="Minimize note">${iconMinimize}</button>
                <button class="close-btn" id="closeBtn" title="Close note">${iconClose}</button>
            </div>
            
            <div class="body">
                <div class="context-quote">"${contextText}"</div>
                <div class="answer-area" id="answerArea"></div>
            </div>
            
            <div class="footer">
                <textarea id="inputBox" placeholder="Ask anything..." rows="1"></textarea>
                <button class="send-btn" id="sendBtn">${iconSend}</button>
            </div>
        </div>
    `;

    // inject DOM (注入)
    const wrapper = document.createElement('div');
    wrapper.innerHTML = template;
    shadow.appendChild(wrapper);

    //  get element
    const card = shadow.getElementById('card');
    const header = shadow.getElementById('dragHeader');
    const pinBtn = shadow.getElementById('pinBtn');
    const minimizeBtn = shadow.getElementById('minimizeBtn');
    const closeBtn = shadow.getElementById('closeBtn');
    const titleSpan = shadow.getElementById('titleSpan');
    const titleInput = shadow.getElementById('noteTitle');
    const inputBox = shadow.getElementById('inputBox');
    const sendBtn = shadow.getElementById('sendBtn');
    const answerArea = shadow.getElementById('answerArea');
    const resizers = shadow.querySelectorAll('.resizer');

    

    // annotation window 窗口内事件逻辑交互绑定 (logic)
    // 基础交互 (阻止冒泡) Z-index management
    card.onmousedown = (e) => {
        host.style.zIndex = ++zIndexCounter;
        e.stopPropagation();
    };

    // 2. 关闭
    closeBtn.onclick = (e) => {
        e.stopPropagation();
        removeStickyNote(noteId);
        NoteDock.removeRecord(noteId);
    };

    // 3. 固定
    let isPinned = false;
    pinBtn.onclick = (e) => {
        e.stopPropagation();
        isPinned = !isPinned;
        pinBtn.classList.toggle('active', isPinned);
        header.classList.toggle('pinned', isPinned);
        card.classList.toggle('pinned', isPinned);
    };

    // 4. 最小化
    minimizeBtn.onclick = (e) => {
        e.stopPropagation();

        const currentTitle = titleSpan.innerText;

        NoteDock.minimize(noteId, currentTitle);
    };

    // 5. 改标题
    titleSpan.ondblclick = (e) => {
        e.stopPropagation();
        
        titleSpan.style.display = 'none';
        titleInput.style.display = 'block';
        
        titleInput.value = titleSpan.innerText;
        
        titleInput.focus();
        titleInput.select();
    };

    titleSpan.onmousedown = (e) => e.stopPropagation();

    const finishEditing = () => {
        // 1. 同步文字回 Span
        // 如果为空，给个默认值，防止 Span 消失无法再点击
        const newValue = titleInput.value.trim() || "Untitled";
        titleSpan.innerText = newValue;
        titleInput.value = newValue; // 格式化 input 值

        // 2. 隐藏 Input，显示 Span
        titleInput.style.display = 'none';
        titleSpan.style.display = 'block';

        // 3. 解锁
        
        console.log(`[Annotator] Title renamed to: ${newValue}`);
    };

    titleInput.onmousedown = (e) => e.stopPropagation();
    titleInput.onblur = finishEditing;
    titleInput.onkeydown = (e) => { 
        e.stopPropagation();
        if (e.key === 'Enter'){
            e.preventDefault();
            titleInput.blur();
        };
    };

    // 6. 发送逻辑
    const handleSend = () => {
        const question = inputBox.value.trim();
        if (!question) return;

        // UI 状态更新：Loading
        inputBox.disabled = true;
        sendBtn.disabled = true;
        sendBtn.innerHTML = `<div class="spin">${iconLoading}</div>`; 
        
        answerArea.className = "answer-area thinking";
        answerArea.innerText = "Gemini is thinking...";

        // 通知 Main.js 去请求 API
        if (onSendCallback && typeof onSendCallback === 'function') {
            onSendCallback(question, (response) => {
                // API 成功返回后的逻辑
                answerArea.className = "answer-area";
                answerArea.innerText = response;
                
                // 恢复 UI
                inputBox.disabled = false;
                inputBox.value = ''; 
                inputBox.focus();    
                sendBtn.disabled = false;
                sendBtn.innerHTML = iconSend; 
            });
        }
    };
    sendBtn.onclick = handleSend;
    inputBox.onkeydown = (e) => {
        e.stopPropagation(); 
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    // 7. 拖拽逻辑
    header.onmousedown = (e) => {
        if (isPinned || e.target.closest("button")) return;
        
        e.preventDefault();
        
        const rect = host.getBoundingClientRect();
        const shiftX = e.clientX - rect.left;
        const shiftY = e.clientY - rect.top;

        const onMouseMove = (moveEvent) => {
            host.style.left = `${moveEvent.clientX - shiftX + window.scrollX}px`;
            host.style.top = `${moveEvent.clientY - shiftY + window.scrollY}px`;
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    resizers.forEach(resizer => {
        resizer.onmousedown = (e) => {
            if (isPinned) return;

            e.stopPropagation(); 
            e.preventDefault(); 

            const direction = resizer.getAttribute('data-dir'); // 获取方向 (n, s, e, w, ne, nw...)
            
            // 记录初始数据
            const startX = e.clientX;
            const startY = e.clientY;
            
            // 尺寸从 card 获取
            const startWidth = card.offsetWidth;
            const startHeight = card.offsetHeight;
            
            // 位置从 host 获取 (解析 '100px' -> 100)
            const startLeft = parseFloat(host.style.left); 
            const startTop = parseFloat(host.style.top);

            const onResizeMove = (moveEvent) => {
                const dx = moveEvent.clientX - startX;
                const dy = moveEvent.clientY - startY;

                let newWidth = startWidth;
                let newHeight = startHeight;
                let newLeft = startLeft;
                let newTop = startTop;

                // --- 逻辑分支：根据方向计算 ---

                // 1. 东 (右边变宽)
                if (direction.includes('e')) {
                    newWidth = startWidth + dx;
                }

                // 2. 南 (下边变高)
                if (direction.includes('s')) {
                    newHeight = startHeight + dy;
                }

                // 3. 西 (左边拖拽：变宽 + 左移)
                if (direction.includes('w')) {
                    newWidth = startWidth - dx;
                    // 只有当宽度没有触底最小宽度时，才移动 Left
                    if (newWidth > NOTE_CONFIG.minWidth) {
                        newLeft = startLeft + dx;
                    } else {
                        newWidth = NOTE_CONFIG.minWidth; // 锁死最小宽
                    }
                }

                // 4. 北 (上边拖拽：变高 + 上移)
                if (direction.includes('n')) {
                    newHeight = startHeight - dy;
                    // 只有当高度没有触底最小高度时，才移动 Top
                    if (newHeight > NOTE_CONFIG.minHeight) {
                        newTop = startTop + dy;
                    } else {
                        newHeight = NOTE_CONFIG.minHeight; // 锁死最小高
                    }
                }

                // --- 应用限制 (Clamp) ---
                if (newWidth < NOTE_CONFIG.minWidth) newWidth = NOTE_CONFIG.minWidth;
                if (newHeight < NOTE_CONFIG.minHeight) newHeight = NOTE_CONFIG.minHeight;

                // --- 写入 DOM ---
                card.style.width = `${newWidth}px`;
                card.style.height = `${newHeight}px`;
                
                // 只有涉及左/上移动时才写 host
                if (direction.includes('w')) host.style.left = `${newLeft}px`;
                if (direction.includes('n')) host.style.top = `${newTop}px`;
            };

            const onResizeUp = () => {
                document.removeEventListener('mousemove', onResizeMove);
                document.removeEventListener('mouseup', onResizeUp);
            };

            document.addEventListener('mousemove', onResizeMove);
            document.addEventListener('mouseup', onResizeUp);
        };
    });

    activeNotes.set(noteId, host);
}

export function removeStickyNote(noteId) {
    if (activeNotes.has(noteId)) {
        const host = activeNotes.get(noteId);
        host.remove();
        activeNotes.delete(noteId);
        console.log(`[Annotator] Note Removed: ${noteId}`);
    }
}
