console.log("Annotator demo loaded...");

let currentButton = null;                                                // initialize current button reference as null, button is mutable
const BUTTON_WIDTH = 120;                                                // button size constants                   
const BUTTON_HEIGHT = 40;
const MARGIN = 2;

let activeNotes = new Map();                                             // initialize current StickyNote reference as null map
let NOTE_CONFIG = {
    width: 300,        // 默认宽度 (px)
    minHeight: 200,    // 默认最小高度 (px)
    headerHeight: 40,  // 顶部标题栏高度
    zIndex: 10000,     // 默认层级
    color: '#fd7a7aff'   // 背景颜色
};

// listener for mouseup
document.addEventListener('mouseup', (event) => {

    const selection = window.getSelection();                             // get selected text
    const selectedText = selection.toString().trim();                    // get the content to string and remove the spaces
    
    removeButton();

    if (selectedText.length > 0) {
        const range = selection.getRangeAt(0);                           // get range of position of text
        const rect = range.getBoundingClientRect();    

        console.log("Selected text: ", selectedText);
        console.log("Edge info of position: ", rect);

        // assume button is put at right-top of selected text
        let buttonX = rect.left + rect.width + window.scrollX;           
        let buttonY = rect.top + window.scrollY - BUTTON_HEIGHT + 8;     

        // adjust when no enough space above
        if (rect.top < (BUTTON_HEIGHT + MARGIN)) {
          console.log("Not enough space above, placing button below the selection.");
          buttonY = rect.bottom + window.scrollY + MARGIN;
        }
        
        // adjust when no enough space on the right 
        const viewPortWidth = document.documentElement.clientWidth;
        if ((rect.left + rect.width + BUTTON_WIDTH + MARGIN) > viewPortWidth) {
          console.log("Not enough space on the right, placing button to the left of the selection.");
          buttonX = viewPortWidth - BUTTON_WIDTH - 20;
        }

        showButton(buttonX, buttonY, selectedText);
        
        // TODO:
        // handleSelectedText(selectedText);

      } else {
        console.log("No selected text found.");
    }

});

// formal version
function showButton(x, y, selectedText) {
  
    // Element: new style instance
    // style decorative injection for button
    if (!document.getElementById('gemini-btn-style')) {
        const style = document.createElement('style');
        style.id = 'gemini-btn-style';

        // CSS decorations
        style.innerHTML = `
            @keyframes popIn {
                0% { opacity: 0; transform: scale(0.5) translateY(10px); }
                100% { opacity: 1; transform: scale(1) translateY(0); }
            }
            .gemini-gradient-btn {
                background: linear-gradient(135deg, #4285f4 0%, #9b72cb 100%); 
                
                /* 多个按钮颜色渐变方案
                   background: linear-gradient(135deg, #4285f4 0%, #9b72cb 100%); 谷歌紫蓝渐变
                   background: linear-gradient(135deg, #1a73e8 0%, #8ab4f8 100%); 经典谷歌蓝渐变
                */

                color: white;
                border: none;
                padding: 6px 16px; /* narrow 稍微瘦身一点 */
                border-radius: 20px; /* pill shape 药丸形状 */
                font-family: 'Google Sans', sans-serif, system-ui; /* 尝试用好看的字体 */
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(26, 115, 232, 0.4); /* 漂亮的辉光阴影 */
                display: flex;
                align-items: center;
                gap: 6px; /* 图标和字的间距 */
                z-index: 9999;
                position: absolute;
                animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; /* 弹性弹出动画 */
                transition: transform 0.2s, box-shadow 0.2s;
            }
            .gemini-gradient-btn:hover {
                transform: scale(1.05) translateY(-2px); /* 悬停时轻微上浮 */
                box-shadow: 0 6px 20px rgba(26, 115, 232, 0.6);
            }
            .gemini-gradient-btn:active {
                transform: scale(0.95);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Element: button
    const btn = document.createElement("button");
    
    // HTML content with SVG icon
    btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C12 2 14.5 9.5 22 12C14.5 14.5 12 22 12 22C12 22 9.5 14.5 2 12C9.5 9.5 12 2 12 2Z" fill="white"/>
        </svg>
        Ask further
    `;
    
    btn.className = 'gemini-gradient-btn';
    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;

    btn.onmousedown = (e) => {
        e.preventDefault();                
        // 计算一个稍微错开的位置，防止遮住选中的文字
        if (window.createStickyNote) createStickyNote(x, y + 50, selectedText);
        else alert("ERROR! Could not find function 'createStickyNote'! ");
    };

    document.body.appendChild(btn);
    currentButton = btn;
}


// singleton pattern ensure only one button instance exists
function removeButton() {
  if (currentButton) {
    currentButton.remove();        // visually remove from DOM            
    currentButton = null;          // clear reference in memory
  }
}





// Annotator Window 打开窗口
window.createStickyNote = function createStickyNote(x, y, contextText) {
    // 生成唯一 ID
    const noteId = `note_${Date.now()}`;

    // 创建 Host
    const host = document.createElement('div');
    host.id = noteId;
    
    // 基础定位样式
    host.style.position = 'absolute';
    host.style.left = `${x}px`;
    host.style.top = `${y}px`;
    host.style.zIndex = NOTE_CONFIG.zIndex;

    document.body.appendChild(host);

    // shadow DOM
    const shadow = host.attachShadow({ mode: 'open' });

    // HTML pin icon
    const iconPin = `
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentcolor" stroke-width="2">
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

    // template
    const template = `
        <style>
            :host { 
                all: initial; 
                box-sizing: border-box; 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                --theme-color: ${NOTE_CONFIG.color};
            }

            .note-card {
                width: ${NOTE_CONFIG.width}px;
                min-height: ${NOTE_CONFIG.minHeight}px;
                background: ${NOTE_CONFIG.color};
                
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.15);
                border: 1px solid #e0e0e0;
                
                display: flex;
                flex-direction: column;
                overflow: hidden;
                
                animation: popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                transform-origin: top left;
            }

            @keyframes popIn {
                from { opacity: 0; transform: scale(0.8); }
                to { opacity: 1; transform: scale(1); }
            }

            /* Header 部分 */
            .header {
                height: ${NOTE_CONFIG.headerHeight}px;
                background: linear-gradient(to right, #f8f9fa, #e9ecef);
                border-bottom: 1px solid #dee2e6;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 12px;
                cursor: grab; /* 可拖拽 */
            }

            /* Header 中的 title */
            .title {
                font-size: 13px;
                font-weight: 600;
                margin-right: auto;
                color: #495057;

                background: transparent;
                border: none;
                outline: none;
            }

            .title:focus {
                border-bottom: 2px solid #adb5bd;
                padding-bottom: 2px;
                width: 120px;
                transition: border-color 0.2s;
                border-bottom-color: ${NOTE_CONFIG.color};
            }

            /* 当被固定, Header 鼠标样式变回普通 */
            .header.pinned {
                cursor: default;
                border-bottom: 1px solid #adb5bd;
            }
            
            /* Header 中的 close button */
            .close-btn {
                background: transparent;
                border: none;
                font-size: 24px;
                color: #adb5bd;
                cursor: pointer;
                padding: 0 5px;
                line-height: 1;
                transition: color 0.2s;
            }
            .close-btn:hover { color: #dc3545; transform: scale(1.1); }

            /* Header 中的 pin button */
            .pin-btn {
                background: transparent;
                border: none;
                cursor: pointer;
                padding: 0 5px;
                margin-left: auto;
                color: currentcolor;
                transition: all 0.2s;
                display: flex;
                align-items: center;
            }
            .pin-btn:hover { color: ${NOTE_CONFIG.color}; transform: scale(1.1); }
            .pin-btn.pinned { color: ${NOTE_CONFIG.color};}

            /* Header 中的 minimize button */
            .minimize-btn {
                background: transparent;
                border: none;
                font-size: 24px;
                color: #adb5bd;
                cursor: pointer;
                padding: 0 5px;
                line-height: 1;
                transition: color 0.2s;
            }
            
            .minimize-btn:hover { color: ${NOTE_CONFIG.color}; transform: scale(1.1); }


            /* 2. 内容区域 */
            .body {
                flex: 1;
                padding: 12px;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            /* 选中的文字引用 */
            .context-quote {
                font-size: 12px;
                color: #666;
                background: #f1f3f4;
                padding: 8px;
                border-left: 3px solid #4285f4;
                border-radius: 2px;
                
                /* 最多显示3行, 超出省略 */
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            /* 输入框 */
            textarea {
                flex: 1;
                width: 100%;
                min-height: 80px;
                border: none;
                outline: none;
                resize: none; /* 禁止手动拉伸，保持卡片美观 */
                font-family: inherit;
                font-size: 14px;
                color: #333;
                background: transparent;
            }
            textarea::placeholder { color: #ced4da; }

        </style>

        <div class="note-card" id="card">
            <div class="header" id="dragHeader">
                
                <input type="text" id="noteTitle" class="title" value="Note #${activeNotes.size + 1}" spellcheck="false">
                <button class="pin-btn" id="pinBtn" title="Pin note">${iconPin}</button>
                <button class="minimize-btn" id "minimizeBtn" title="Minimize note">${iconMinimize}</button>
                <button class="close-btn" id="closeBtn" title="Close note">${iconClose}</button>
            </div>
            
            <div class="body">
                <div class="context-quote">"${contextText}"</div>
                <textarea placeholder="Write something..."></textarea>
            </div>
        </div>
    `;

    // inject DOM
    const wrapper = document.createElement('div');
    wrapper.innerHTML = template;
    shadow.appendChild(wrapper);

    // 绑定事件逻辑
    // e.stopPropagation(): 阻止冒泡，防止触发 document 上的其他点击逻辑

    // 1. 关闭按钮
    const closeBtn = shadow.getElementById('closeBtn');
    closeBtn.onclick = (e) => {
        e.stopPropagation(); 
        removeStickyNote(noteId);
    };

    // 2. 阻止点击穿透
    // 例如: 如果用户在 Note 内部点击（比如点输入框），不要让 document 觉得用户点了“空白处”
    const card = shadow.getElementById('card');
    card.onmousedown = (e) => {
        e.stopPropagation();
    };

    // 3. 切换固定状态
    let isPinned = false; 

    const pinBtn = shadow.getElementById('pinBtn');
    const header = shadow.getElementById('dragHeader');

    pinBtn.onclick = (e) => {
        e.stopPropagation();
        isPinned = !isPinned;

        pinBtn.classList.toggle('pinned', isPinned);
        header.classList.toggle('pinned', isPinned);
    };

    // 4. 拖拽功能
    header.onmousedown = (e) => {
        // 1. 如果固定了，或者点的是关闭/图钉按钮，就不许拖
        if (isPinned) return; 
        
        // 防止选中文字
        e.preventDefault(); 

        // 2. 计算鼠标点击点相对于 Host 左上角的偏移
        // 注意：host 在 light DOM，可以使用 getBoundingClientRect
        const rect = host.getBoundingClientRect();
        const shiftX = e.clientX - rect.left;
        const shiftY = e.clientY - rect.top;

        // 3. 移动函数 (绑定到 document 以防止鼠标移出 iframe/div 范围)
        const onMouseMove = (moveEvent) => {
            // 直接修改 host 的位置
            host.style.left = `${moveEvent.clientX - shiftX}px`;
            host.style.top = `${moveEvent.clientY - shiftY}px`;
        };

        // 让便签停止跟随鼠标
        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    // 5. 缩放功能

    // 6. 改标题功能
    const titleInput = shadow.getElementById('noteTitle');
    // 阻止拖拽冒泡
    titleInput.addEventListener('mousedown', (e) => {
        e.stopPropagation(); 
    });

    // 点击/聚焦时，光标永远跳到最后
    titleInput.addEventListener('focus', function() {
        const len = this.value.length;
        setTimeout(() => {
            // 将光标选区设置为 (len, len)，也就是最后一个字符后面
            this.setSelectionRange(len, len);
        }, 0);
    });

    // enter 完成编辑
    titleInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.target.blur(); // 失去焦点，隐藏光标
        }
    });


    // 加入 activeNotes
    activeNotes.set(noteId, host);

    console.log(`[Annotator] Note Created: ${noteId}`);
    }

function removeStickyNote(noteId) {
    if (activeNotes.has(noteId)) {
        const host = activeNotes.get(noteId);
        host.remove();
        activeNotes.delete(noteId);
        console.log(`[Annotator] Note Removed: ${noteId}`);
    }
}