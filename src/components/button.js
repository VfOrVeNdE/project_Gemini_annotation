// 按钮长什么样、怎么出现、怎么消失

let currentButton = null;                                                // initialize current button reference as null, button is mutable

// exporting model of button decoration
export function showButton(x, y, selectedText, callback) {
    
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
                box-shadow: 0 2px 10px rgba(26, 115, 232, 0.3), inset 0 0 100px 100px rgba(0, 0, 0, 0.1);
            }
        `;
        document.head.appendChild(style);
    }


    // Element: button
    const btn = document.createElement("button");
    
    // HTML content with SVG icon inside the button
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
        e.stopPropagation();
    }

    btn.onmouseup = (e) => {
        e.stopPropagation();
        // check whether callback exists and is a function
        if (callback && typeof callback == 'function') {
            // 执行传入的回调参数
            callback();
        } else {
            console.log("The callback function was not passed correctly.");
        }

        removeButton();
        console.log("Button Removed");
    }

    document.body.appendChild(btn);
    currentButton = btn;
}

// singleton pattern ensure only one button instance exists
export function removeButton() {
  if (currentButton) {
    currentButton.remove();        // visually remove from DOM            
    currentButton = null;          // clear reference in memory
  }
}
