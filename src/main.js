console.log("Annotator demo loaded...");

let currentButton = null;                                                // initialize current button reference as null, button is mutable
const BUTTON_WIDTH = 120;                                                // button size constants                   
const BUTTON_HEIGHT = 40;
const MARGIN = 2;

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

        let buttonX = rect.left + rect.width + window.scrollX;           // assume the button is put at the right top of selected text
        let buttonY = rect.top + window.scrollY - BUTTON_HEIGHT + 8;     // 40px above the top edge of selected text

        if (rect.top < (BUTTON_HEIGHT + MARGIN)) {
          console.log("Not enough space above, placing button below the selection.");
          buttonY = rect.bottom + window.scrollY + MARGIN;
        }
        
        const viewPortWidth = document.documentElement.clientWidth;
        if ((rect.left + rect.width + BUTTON_WIDTH + MARGIN) > viewPortWidth) {
          console.log("Not enough space on the right, placing button to the left of the selection.");
          buttonX = viewPortWidth - BUTTON_WIDTH - 20;
        }

        showButton(buttonX, buttonY);
        
        // TODO:
        // handleSelectedText(selectedText);

      } else {
        console.log("No selected text found.");
    }

});


function showButton(x, y) {

  const btn = document.createElement("button");
  btn.innerText = "Ask me anything for chosen text";
  btn.style.position = "absolute";
  btn.style.left = `${x}px`;
  btn.style.top = `${y}px`;
  btn.style.zIndex = "9999";                            // top layer
  btn.style.padding = "5px 10px";
  btn.style.backgroundColor = "#1a73e8";              // google blue
  btn.style.color = "white";
  btn.style.border = "none";
  btn.style.borderRadius = "4px";
  btn.style.cursor = "pointer";
  btn.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";

  btn.onmousedown = (e) => {
    e.preventDefault();                                  // prevent losing text selection on "button" click
    alert("Button clicked! \nSidebar will be expanded here.");
  };

  document.body.appendChild(btn);
  currentButton = btn;                                   // store current button reference, each mouseup will only have one button element

}

// function showButton(x, y) {
//     // 1. 先检查页面里有没有注入动画样式，没有就注入一次
//     if (!document.getElementById('gemini-btn-style')) {
//         const style = document.createElement('style');
//         style.id = 'gemini-btn-style';
//         style.innerHTML = `
//             @keyframes popIn {
//                 0% { opacity: 0; transform: scale(0.5) translateY(10px); }
//                 100% { opacity: 1; transform: scale(1) translateY(0); }
//             }
//             .gemini-gradient-btn {
//                 background: linear-gradient(135deg, #1a73e8 0%, #8ab4f8 100%); /* 经典谷歌蓝渐变 */
//                 /* 如果你想要更像 Gemini Advanced，可以用这个紫蓝渐变：
//                    background: linear-gradient(135deg, #4285f4 0%, #9b72cb 100%); 
//                 */
//                 color: white;
//                 border: none;
//                 padding: 6px 16px; /* 稍微瘦身一点 */
//                 border-radius: 20px; /* 药丸形状 */
//                 font-family: 'Google Sans', sans-serif, system-ui; /* 尝试用好看的字体 */
//                 font-size: 14px;
//                 font-weight: 500;
//                 cursor: pointer;
//                 box-shadow: 0 4px 15px rgba(26, 115, 232, 0.4); /* 漂亮的辉光阴影 */
//                 display: flex;
//                 align-items: center;
//                 gap: 6px; /* 图标和字的间距 */
//                 z-index: 9999;
//                 position: absolute;
//                 animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; /* 弹性弹出动画 */
//                 transition: transform 0.2s, box-shadow 0.2s;
//             }
//             .gemini-gradient-btn:hover {
//                 transform: scale(1.05) translateY(-2px); /* 悬停时轻微上浮 */
//                 box-shadow: 0 6px 20px rgba(26, 115, 232, 0.6);
//             }
//             .gemini-gradient-btn:active {
//                 transform: scale(0.95);
//             }
//         `;
//         document.head.appendChild(style);
//     }

//     const btn = document.createElement("button");
    
//     // 使用 innerHTML 插入带图标的文本
//     // 这里用了一个 SVG 的星星图标 (✨)
//     btn.innerHTML = `
//         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="white"/>
//         </svg>
//         Ask Gemini
//     `;
    
//     btn.className = 'gemini-gradient-btn';
//     btn.style.left = `${x}px`;
//     btn.style.top = `${y}px`;

//     btn.onmousedown = (e) => {
//         e.preventDefault(); 
//         // 这里为了演示，暂时用 console，等队友接手
//         console.log("Gemini Button Clicked!");
        
//         // 伪造一个简单的窗口打开逻辑 (Optional)
//         if(window.createChatWindow) window.createChatWindow(); 
//         else alert("✨ Gemini 正在思考... (等待 UI 模块)");
//     };

//     document.body.appendChild(btn);
//     currentButton = btn;
// }


function removeButton() {
  if (currentButton) {
    currentButton.remove();
    currentButton = null;
  }
}