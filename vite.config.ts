/**
 * Copyright (c) 2026 Fabio Orengo. All rights reserved.
 * Licensed under the MIT License.
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Tombola/', // Ensures relative paths for assets, crucial for GitHub Pages
});