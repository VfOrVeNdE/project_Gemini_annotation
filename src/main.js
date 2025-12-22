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


function removeButton() {
  if (currentButton) {
    currentButton.remove();
    currentButton = null;
  }
}