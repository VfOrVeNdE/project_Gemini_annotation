function testGeminiConnection() {
    // 从环境变量中读取 Key
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    if (!API_KEY) {
        console.error("❌ 错误：未找到 API Key, 请检查 .env 文件是否配置正确.");
        return;
    }

    console.log("正在使用安全 Key 连接 Gemini...", API_KEY.slice(0, 5) + "******"); // 只打印前5位，验证读到了

    // ... 下面接你之前的 fetch 代码 ...
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    
    // 发送一个简单的测试请求
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: "Hello from secure env!" }] }]
        })
    })
    .then(res => res.json())
    .then(data => console.log("✅ Gemini 回复:", data.candidates[0].content.parts[0].text))
    .catch(err => console.error("❌ 连接失败:", err));
}

// 临时调用一下测试 call function
testGeminiConnection();