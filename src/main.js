console.log("Annotator demo loaded...");

// listener for mouseup
document.addEventListener('mouseup', (event) => {
    
    const selection = window.getSelection();            // get selected text
    const selectedText = selection.toString().trim();   // get the content to string and remove the spaces
    
    if (selectedText.length > 0) {
        const range = selection.getRangeAt(0);          // get range of position of text
        const rect = range.getBoundingClientRect();    

        console.log("Selected text: ", selectedText);
        console.log("Edge info of position: ", rect);

        const buttonX = rect.left + rect.width;         // assume the button is put at the right top of selected text
        const buttonY = rect.top;

        console.log(`Button position: X=${buttonX}, Y=${buttonY}`);
        TODO:
        handleSelectedText(selectedText);

      } else {
        console.log("No selected text found.");
    }

});