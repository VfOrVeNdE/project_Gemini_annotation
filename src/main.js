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

// button test version
// function showButton(x, y) {

//   const btn = document.createElement("button");
//   btn.innerText = "Ask me anything for chosen text";
//   btn.style.position = "absolute";
//   btn.style.left = `${x}px`;
//   btn.style.top = `${y}px`;
//   btn.style.zIndex = "9999";                            // top layer
//   btn.style.padding = "5px 10px";
//   btn.style.backgroundColor = "#1a73e8";              // google blue
//   btn.style.color = "white";
//   btn.style.border = "none";
//   btn.style.borderRadius = "4px";
//   btn.style.cursor = "pointer";
//   btn.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";

//   btn.onmousedown = (e) => {
//     e.preventDefault();                                  // prevent losing text selection on "button" click
//     alert("Button clicked! \nSidebar will be expanded here.");
//   };

//   document.body.appendChild(btn);
//   currentButton = btn;                                   // store current button reference, each mouseup will only have one button element

// }

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
        Explain this further
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

  // pin icons
  const iconPinEmpty = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M16 4v12l3 3H5l3-3V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2z"></path></svg>`;
  const iconPinSolid = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="currentColor"><path d="M16 4v12l3 3H5l3-3V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2z"></path></svg>`;

  // template
  const template = `
      <style>
          :host { 
              all: initial; 
              box-sizing: border-box; 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }

          .note-card {
              width: ${NOTE_CONFIG.width}px;
              min-height: ${NOTE_CONFIG.minHeight}px;
              background: ${NOTE_CONFIG.color};
              
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0,0,0,0.15); /* 漂亮的阴影 */
              border: 1px solid #e0e0e0;
              
              display: flex;
              flex-direction: column;
              overflow: hidden;
              
              /* 进场动画: 像气泡一样弹出 */
              animation: popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
              transform-origin: top left;
          }

          @keyframes popIn {
              from { opacity: 0; transform: scale(0.8); }
              to { opacity: 1; transform: scale(1); }
          }

          /* 1. 顶部 Header */
          .header {
              height: ${NOTE_CONFIG.headerHeight}px;
              background: linear-gradient(to right, #f8f9fa, #e9ecef);
              border-bottom: 1px solid #dee2e6;
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 0 12px;
              cursor: grab; /* 暗示可拖拽 */
          }

          .title {
              font-size: 13px;
              font-weight: 600;
              color: #495057;
          }

          .close-btn {
              background: transparent;
              border: none;
              font-size: 18px;
              color: #adb5bd;
              cursor: pointer;
              padding: 0 5px;
              line-height: 1;
              transition: color 0.2s;
          }
          .close-btn:hover { color: #dc3545; }

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

          /* --- [新增/修改] Header 里的按钮样式 --- */
          .pin-btn {
              background: transparent;
              border: none;
              cursor: pointer;
              padding: 0 5px;
              margin-right: auto; /* 让图钉靠左，标题居中或靠右 */
              color: #adb5bd;
              transition: all 0.2s;
              display: flex; /* 为了居中 SVG */
              align-items: center;
          }
          .pin-btn:hover { color: #666; transform: scale(1.1); }
          .pin-btn.active { color: #d63384; /* 激活时的颜色 (洋红色) */ }

          /* --- [新增] 右下角缩放手柄 --- */
          .resizer {
              width: 15px;
              height: 15px;
              background: transparent;
              position: absolute;
              right: 0;
              bottom: 0;
              cursor: se-resize; /* 鼠标变成双向箭头 */
              z-index: 10;
          }
          /* 给个视觉提示，让用户知道这里可以拉 (可选) */
          .resizer::after {
              content: '';
              position: absolute;
              right: 3px;
              bottom: 3px;
              width: 6px;
              height: 6px;
              border-right: 2px solid #adb5bd;
              border-bottom: 2px solid #adb5bd;
          }

          /* --- [修改] Header 样式适配 --- */
          /* 当被固定, Header 鼠标样式变回普通 */
          .header.pinned {
              cursor: default;
              background: #e9ecef; /*稍微变深一点表示锁定*/
          }

      </style>

      <div class="note-card" id="card">
          <div class="header" id="dragHeader">
              <button class="pin-btn" id="pinBtn" title="Pin note">${iconPinEmpty}</button>
              
              <span class="title">Note #${activeNotes.size + 1}</span>
              <button class="close-btn" id="closeBtn">×</button>
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

      if (isPinned) {
          // 变为实心，改变颜色
          pinBtn.innerHTML = iconPinSolid;
          pinBtn.classList.add('active');
          header.classList.add('pinned'); // 改变鼠标样式
      } else {
          // 变为空心
          pinBtn.innerHTML = iconPinEmpty;
          pinBtn.classList.remove('active');
          header.classList.remove('pinned');
      }
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