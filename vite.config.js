import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // 这里是可能需要的其他配置...

    // 显式定义环境变量替换
    define: {
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
    },
  };

});