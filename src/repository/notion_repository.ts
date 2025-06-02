import { NotionApiService } from "../service/notion_api_service";
import { SettingsService } from "../service/settings_service";
import { ACMInfo, NotionRequest } from "../types";

/**
 * Notionのデータベースにページを追加するリポジトリ
 *
 */
export class NotionRepository {
	private static _instance: NotionRepository;
	private _notionApiService: NotionApiService;
	private _settingsService: SettingsService;

	constructor() {
		this._notionApiService = NotionApiService.getInstance();
		this._settingsService = SettingsService.getInstance();
	}

	public static getInstance(): NotionRepository {
		if (!NotionRepository._instance) {
			NotionRepository._instance = new NotionRepository();
		}
		return NotionRepository._instance;
	}

	/**
	 * Notionのデータベースにページを追加する
	 */
	public async addPageToDatabase(acmInfo: ACMInfo): Promise<void> {
		const settings = await this._settingsService.getSettings();
		if (!settings?.databaseId) {
			throw new Error("Database ID not configured");
		}

		try {
			let request = this._toRequest(acmInfo, settings.databaseId);
			await this._notionApiService.addPageToDatabase(request);
			return;
		} catch (error) {
			console.error("Error adding page to Notion database:", error);
			throw error;
		}
	}

	// -------------------- private methods -------------------- //

	private _toRequest(acmInfo: ACMInfo, databaseId: string): NotionRequest {
		return new NotionRequest({
			databaseId,
			title: acmInfo.title,
			authors: acmInfo.authors,
			conference: acmInfo.confAbbr,
			htmlViewerUrl: acmInfo.htmlViewerUrl,
			doiUrl: acmInfo.url,
			pdfUrl: acmInfo.pdfUrl,
		});
	}
}
