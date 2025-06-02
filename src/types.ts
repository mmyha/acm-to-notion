// ---------- TypeScript Types for Chrome Extension ---------- //
export type ChromeRequest = {
	action: ACMInfoAction;
	data?: ACMInfo;
};

export enum ACMInfoAction {
	GET_ACM_INFO,
	TO_NOTION,
}

export type BackgroundResponse = {
	success?: boolean;
	error?: string;
};

export type ContentScriptResponse = {
	success: boolean;
	error?: string;
};

// --------------------------------------------------------- //

/**
 * ACMの論文情報
 * @property {string | null} url - 論文のURL
 * @property {string} title - 論文のタイトル
 * @property {string[]} authors - 論文の著者リスト
 * @property {string | null} confAbbr - 学会の略称
 * @property {string | null} htmlViewerUrl - HTMLビューアのURL
 * @property {string | null} pdfUrl - PDFのURL
 */
export type ACMInfo = {
	url: string | null;
	title: string;
	authors: string[];
	confAbbr: string | null;
	htmlViewerUrl: string | null;
	pdfUrl: string | null;
};

/**
 * Notionの設定情報
 * @property {string} token - Notion APIのトークン
 * @property {string} databaseId - NotionのデータベースID
 */
export type NotionSettings = {
	token: string;
	databaseId: string;
};

/**
 * Notionのリクエストパラメータ
 */
export interface NotionRequestParams {
	databaseId: string;
	title: string;
	authors: string[];
	conference: string | null;
	htmlViewerUrl: string | null;
	doiUrl: string | null;
	pdfUrl: string | null;
}

/**
 * Notionへのリクエストを表すモデル
 */
export class NotionRequest {
	parent: {
		database_id: string;
	};
	properties: {
		名前: {
			title: [
				{
					text: {
						content: string;
					};
				}
			];
		};
		著者: {
			multi_select: { name: string }[];
		};
		学会: {
			multi_select: { name: string }[];
		};
		HTML: {
			url: string | null;
		};
		DOI: {
			url: string | null;
		};
		PDF: {
			files: { name: string; external: { url: string } }[];
		};
	};

	constructor({
		databaseId,
		title,
		authors,
		conference,
		htmlViewerUrl,
		doiUrl,
		pdfUrl,
	}: NotionRequestParams) {
		this.parent = { database_id: databaseId };
		this.properties = {
			名前: {
				title: [
					{
						text: {
							content: title,
						},
					},
				],
			},
			著者: {
				multi_select: authors.map((author) => ({ name: author })),
			},
			学会: {
				multi_select: conference ? [{ name: conference }] : [],
			},
			HTML: {
				url: htmlViewerUrl,
			},
			DOI: {
				url: doiUrl,
			},
			PDF: {
				files:
					pdfUrl != null
						? [
								{
									name: "PDF (link)",
									external: { url: pdfUrl },
								},
						  ]
						: [],
			},
		};
	}

	toJson(): string {
		return JSON.stringify(this, null, 2);
	}
}
