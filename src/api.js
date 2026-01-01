export async function askGeminiFurther(selectedText, contextText = "") {

    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!API_KEY) {
        console.log("Something wrong with the API key,\n please check .env file");
        return "API key missed, please check .env file.";
    }

    // construct the sample prompt of context
    const systemPrompt = `
    You are an intelligent and helpful reading assistant. 
    The user is reading a document. I will provide you with the "Context" (surrounding text) and the "User's Selection".

    **YOUR CORE TASKS:**
    1. Explain the "Selection" clearly and concisely.
    2. Use the "Context" to understand the specific meaning of the selection in this scenario.
    3. If the selection is code, explain what it does and its logic.
    4. Keep the tone professional and friendly.

    **CRITICAL LANGUAGE RULES:**
    You must strictly adapt your output language based on the user's input. Follow this priority order:
    
    * **Priority 1 (Explicit Instruction):** If the user asks a specific question or gives an instruction in a specific language (e.g., "Translate to English", "Explain in Japanese"), **ALWAYS** follow the user's language preference.
    * **Priority 2 (Default Behavior):** If the user provides NO specific question (only selects text), answer in the **same language** as the "User's Selection".

    **Examples:**
    * Selection is Chinese -> Answer in Chinese.
    * Selection is English -> Answer in English.
    * Selection is Chinese but User asks "Translate to English" -> Answer in English.
    * Selection is English but User asks "Translate to Chinese" -> Answer in Chinese.
    `;

    const userContent = `
    Context: "...${contextText}..."
    Selection: "${selectedText}"
    `;

    // request
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const payload = {
        contents: [{
            role: "user",
            parts: [{ text: systemPrompt + "\n" + userContent }]
        }]
    };

    try {
        // HTTP request message to send necessary info to Gemini api
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`)
        }
        
        // get response message from Gemini
        const data = await response.json();

        // extract info from json body
        const answer = data.candidates[0].content.parts[0].text;
        return answer;
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Sorry, a network error occurred while connecting to the AI service. Please try again later.";
    }
}