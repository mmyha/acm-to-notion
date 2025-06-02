import { NotionRequest } from "../types";
import { SettingsService } from "./settings_service";

/**
 * Notion APIを操作するAPIサービス
 */
export class NotionApiService {
	private static instance: NotionApiService;
	private settingsService: SettingsService;
	private apiVersion: string = "2022-06-28";
	private _baseUrl: string = "https://api.notion.com/v1";

	private constructor() {
		this.settingsService = SettingsService.getInstance();
	}

	public static getInstance(): NotionApiService {
		if (!NotionApiService.instance) {
			NotionApiService.instance = new NotionApiService();
		}
		return NotionApiService.instance;
	}

	/**
	 * Notionのデータベースにページを追加する
	 */
	public async addPageToDatabase(req: NotionRequest): Promise<void> {
		const settings = await this.settingsService.getSettings();
		if (!settings?.token) {
			throw new Error("Notion token not configured");
		}

		const headers: HeadersInit = {
			Authorization: `Bearer ${settings.token}`,
			"Notion-Version": this.apiVersion,
			"Content-Type": "application/json",
		};

		try {
			let res = await fetch(`${this._baseUrl}/pages`, {
				method: "POST",
				headers,
				body: req.toJson(),
			});

			const responseText = await res.text();

			if (!res.ok) {
				throw new Error(`Notion API error: ${res.status} - ${responseText}`);
			}

			console.log("Page added to Notion database successfully");
		} catch (error) {
			console.error("Error adding page to Notion database:", error);
			throw error;
		}
	}
}
