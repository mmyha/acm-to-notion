import { ACMInfo } from "../types";

/**
 * ACMの論文情報をwebページから取得するリポジトリ
 *
 */
class ACMInfoRepository {
	private static _instance: ACMInfoRepository;

	private constructor() {}

	public static getInstance(): ACMInfoRepository {
		if (!ACMInfoRepository._instance) {
			ACMInfoRepository._instance = new ACMInfoRepository();
		}
		return ACMInfoRepository._instance;
	}

	/**
	 * ACMの論文情報を取得する
	 *
	 * タイトルおよび著者が存在しない場合はエラーを投げる
	 *
	 * @returns [ACMInfo]
	 */
	public async getACMInfo(): Promise<ACMInfo> {
		let url = this._getDoiUrl();
		let title = this._getTitle();
		let authors = this._getAuthors();
		let confAbbr = this._getConferenceAbbreviation();
		let htmlViewerUrl = this._getHtmlViewerUrl();
		let pdfUrl = this._getPdfUrl();
		return {
			url,
			title,
			authors,
			confAbbr,
			htmlViewerUrl,
			pdfUrl,
		};
	}

	/**
	 * 論文タイトルの取得
	 *
	 * @returns String
	 * @throws Error タイトルが見つからない場合
	 */
	private _getTitle(): string {
		const title: string | null =
			(document.querySelector('h1[property="name"]') as HTMLElement | null)
				?.innerText ?? null;
		if (!title) {
			console.error("Title element not found");
			throw new Error("Title not found");
		}
		return title;
	}

	// -------------------- private methods -------------------- //

	/**
	 * 論文の著者情報の取得
	 *
	 * @returns String[]
	 * @throws Error 著者が見つからない場合
	 */
	private _getAuthors(): string[] {
		const authorSpans = document.querySelectorAll(
			'span[property="author"][typeof="Person"]'
		);
		if (authorSpans.length === 0) {
			throw new Error("Authors not found");
		}
		const authors: string[] = [];
		authorSpans.forEach((span) => {
			const given =
				span.querySelector('span[property="givenName"]')?.textContent?.trim() ??
				"";
			const family =
				span
					.querySelector('span[property="familyName"]')
					?.textContent?.trim() ?? "";
			if (given || family) {
				authors.push(`${given} ${family}`.trim());
			}
		});
		if (authors.length === 0) {
			console.error("No authors found in the document");
			throw new Error("Authors not found");
		}
		return authors;
	}

	/**
	 * 学会名　略称があればそれを返す
	 *
	 * @returns Conference abbreviation
	 */
	private _getConferenceAbbreviation(): string | null {
		const confDiv = document.querySelector("div.core-self-citation");
		const confNameElem = confDiv?.querySelector('a[property="name"]');
		const confName = confNameElem?.textContent?.trim() ?? null;
		if (!confName) {
			console.warn("Conference name not found");
			return null;
		}
		const abbr = confName.split(":")[0].trim();
		return abbr.length > 0 ? abbr : confName;
	}

	/**
	 * url取得
	 *
	 * @returns string | null
	 */
	private _getDoiUrl(): string | null {
		const url = window.location.href;
		if (url.includes("dl.acm.org/doi/")) {
			return url;
		} else {
			return null;
		}
	}

	/**
	 * HTMLViewerのURLを取得する
	 *
	 * @returns string | null
	 */
	private _getHtmlViewerUrl(): string | null {
		const htmlViewerElem = document.querySelector("section.format--HTML_full");
		const linkElem = htmlViewerElem?.querySelector("a[href]");
		if (!linkElem) {
			console.warn("HTML Viewer link not found");
			return null;
		}
		return linkElem?.getAttribute("href") ?? null;
	}

	/**
	 * PDFのURLを取得する
	 *
	 * @returns string | null
	 */
	private _getPdfUrl(): string | null {
		const pdfLinkElem = document.querySelector('a[title="View PDF"]');
		const pdfLink = pdfLinkElem?.getAttribute("href");
		if (!pdfLink) {
			console.warn("PDF link not found");
			return null;
		}
		return pdfLink ?? null;
	}
}

export default ACMInfoRepository;
