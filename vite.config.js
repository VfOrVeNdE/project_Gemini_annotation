import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    
  // load the environmental variable
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // explicitly define the substitution of environmental variable
    define: {
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
    },

    // configuration for manifest.json
    build: {
      // output directory 输出目录
      outDir: 'dist',
      // 防止文件带 hash (例如 main-x8s9.js)
      rollupOptions: {
        output: {
          entryFileNames: 'main.js',
          assetFileNames: (assetInfo) => {
            
            const infoName = assetInfo.names ? assetInfo.names[0] : assetInfo.name;
            
            if (infoName.names === 'style.css') {
              return 'style.css';
            } 
            return '[name][extname]';
            
          },
        },
      },
    },
  };

});