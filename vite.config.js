import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        signup: 'pages/signup.html',
        login: 'pages/login.html',
        forgotPassword: 'pages/forgot-password.html',
        resetPassword: 'pages/reset-password.html',
        profile: 'pages/profile.html',
        categories: 'pages/categories.html',
      },
    },
  },
});