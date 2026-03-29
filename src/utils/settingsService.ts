import { SystemSettings } from '../types/settings';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api';

export class SettingsService {
  private static baseUrl = `${BASE_URL}/settings`;

  static async getSettings(): Promise<Partial<SystemSettings>> {
    const response = await fetch(this.baseUrl);
    if (!response.ok) throw new Error('Failed to fetch settings');
    const json = await response.json();
    return json.data ?? json;
  }

  static async saveSettings(settings: Partial<SystemSettings>): Promise<void> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (!response.ok) throw new Error('Failed to save settings');
  }

  static async updateSettings(updates: Partial<SystemSettings>): Promise<void> {
    const response = await fetch(this.baseUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update settings');
  }

  static async createBackup(): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/backup`, { method: 'POST' });
    if (!response.ok) throw new Error('Failed to create backup');
    return response.blob();
  }

  static async restoreBackup(file: File): Promise<void> {
    const text = await file.text();
    const response = await fetch(`${this.baseUrl}/restore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: text,
    });
    if (!response.ok) throw new Error('Failed to restore backup');
  }

  static async testEmailConfig(config: any): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/test-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    return response.ok;
  }

  static async testSMSConfig(config: any): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/test-sms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    return response.ok;
  }
}