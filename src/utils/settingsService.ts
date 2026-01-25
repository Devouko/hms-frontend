import { SystemSettings } from '../types/settings';

export class SettingsService {
  private static baseUrl = '/api/settings';

  static async getSettings(): Promise<SystemSettings> {
    const response = await fetch(this.baseUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch settings');
    }
    return response.json();
  }

  static async saveSettings(settings: Partial<SystemSettings>): Promise<void> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error('Failed to save settings');
    }
  }

  static async updateSettings(updates: Partial<SystemSettings>): Promise<void> {
    const response = await fetch(this.baseUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update settings');
    }
  }

  // Backup operations
  static async createBackup(): Promise<Blob> {
    const response = await fetch('/api/settings/backup', {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to create backup');
    }

    return response.blob();
  }

  static async restoreBackup(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('backup', file);

    const response = await fetch('/api/settings/restore', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to restore backup');
    }
  }

  // Test email/SMS configuration
  static async testEmailConfig(config: any): Promise<boolean> {
    const response = await fetch('/api/settings/test-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    return response.ok;
  }

  static async testSMSConfig(config: any): Promise<boolean> {
    const response = await fetch('/api/settings/test-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    return response.ok;
  }
}