import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    
  // load the environmental variable
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // explicitly define the substitution of environmental variable
    define: {
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
    },
  };

});