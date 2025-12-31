import { showButton, removeButton} from "./components/button";
import { createStickyNote, removeStickyNote } from "./components/chatWindow";

console.log("[Annotator] demo loaded...");

// data used for measuring distance to edges
const BUTTON_WIDTH = 120;                                                // button size constants                   
const BUTTON_HEIGHT = 40;
const MARGIN = 2;

// listener for mouseup
document.addEventListener('mouseup', (event) => {

    // do nothing if click inside button or note
    // 获取事件的完整路径
    // [svg, button#closeBtn, div.header, div#note_123, body, html, ...]
    const path = event.composedPath();

    // 检查点击是否发生在 "Ask Gemini" 按钮上 (普通 DOM)
    const isButton = event.target.closest('.gemini-gradient-btn');

    // 检查点击是否发生在 Note 内部 (Shadow DOM 宿主)
    // 我们遍历路径，看路径里有没有 ID 以 "note_" 开头的元素
    const noteHost = path.find(el => el instanceof HTMLElement && el.id.startsWith('note_'));
    const isInsideNote = !!noteHost;

    // 检查是否具体点击了 Note 内部的 "关闭按钮"
    // 假设你在 chatWindow.js 里给关闭按钮的 ID 是 'closeBtn'
    // 注意：el 必须是 HTMLElement 才能访问 .id，否则 window/document 会报错
    const isCloseBtn = path.some(el => el instanceof HTMLElement && el.id === 'closeBtn');

    // --- 逻辑判断区 ---

    // 情况 A：如果是点击了关闭按钮
    if (isCloseBtn) {
        console.log("Detect: User click the close button inside the Shadow DOM");
        // 这里你通常直接 return，因为 chatWindow.js 内部的 onclick 会处理删除逻辑
        // 如果 chatWindow.js 里写了 stopPropagation()，这行代码其实甚至不会触发（取决于谁先捕获）
        return; 
    }

    // 情况 B：如果只是点击了 Note 的其他部分（比如拖拽栏、输入框）
    if (isInsideNote || isButton) {
        // 也是直接忽略，不执行选词逻辑
        return;
    }

    removeButton();

    // get selected text
    const selection = window.getSelection();                             // get selected text
    const selectedText = selection.toString().trim();                    // get the content to string and remove the spaces
    
    if (!selectedText) {
        console.log("No selected text found.");
        return;
    }

    // measuring logic
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

        showButton(buttonX, buttonY, selectedText, ()=> {
            console.log("Ask button clicked.");

            removeButton();

            createStickyNote(buttonX, buttonY + 50, selectedText);

            window.getSelection().removeAllRanges();
        });
        
        // TODO:
        // handleSelectedText(selectedText);

      } else {
        console.log("No selected text found.");
    }

});