import { NotionSettings } from "../types";

/**
 * Notionの設定を管理するサービス
 *
 * ブラウザに保存される
 */
export class SettingsService {
	private static instance: SettingsService;
	private static readonly STORAGE_KEY = "notion_settings";

	private constructor() {}

	public static getInstance(): SettingsService {
		if (!SettingsService.instance) {
			SettingsService.instance = new SettingsService();
		}
		return SettingsService.instance;
	}

	/**
	 * Notion設定を保存する
	 */
	public async saveSettings(settings: NotionSettings): Promise<void> {
		await browser.storage.sync.set({
			[SettingsService.STORAGE_KEY]: settings,
		});
	}

	/**
	 * Notion設定を取得する
	 */
	public async getSettings(): Promise<NotionSettings | null> {
		const result = await browser.storage.sync.get(SettingsService.STORAGE_KEY);
		return result[SettingsService.STORAGE_KEY] || null;
	}

	/**
	 * 設定が有効かチェックする
	 */
	public async isConfigured(): Promise<boolean> {
		const settings = await this.getSettings();
		return !!(settings?.token && settings?.databaseId);
	}
}
