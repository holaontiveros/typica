import { invoke } from '@tauri-apps/api/core';

export class FontAPI {
  static async getFonts() {
    try {
      // Use Tauri commands for desktop app
      const fonts = await invoke('get_system_fonts');
      return {
        success: true,
        fonts: fonts,
        cached: false,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error fetching fonts:', error);
      return {
        success: false,
        error: error.message,
        fonts: []
      };
    }
  }

  static async healthCheck() {
    try {
      // Use Tauri command for desktop app
      return await invoke('health_check');
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        status: 'error',
        error: error.message
      };
    }
  }

  static isTauriApp() {
    return true; // Always true since we're Tauri-only now
  }
}