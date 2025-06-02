import ACMInfoRepository from "../src/repository/acm_info_repository";
// BackgroundResponse をインポートリストに追加
import {
	ACMInfo,
	ACMInfoAction,
	ChromeRequest,
	BackgroundResponse,
	ContentScriptResponse,
} from "../src/types";

export default defineContentScript({
	matches: ["*://*.acm.org/*"],
	main() {
		console.log("Setting up message listener");
		const repo = ACMInfoRepository.getInstance();

		browser.runtime.onMessage.addListener(
			(
				message: ChromeRequest,
				_,
				sendResponse: (res: ContentScriptResponse) => void
			) => {
				(async () => {
					if (message.action === ACMInfoAction.GET_ACM_INFO) {
						try {
							// ACMの論文情報を取得
							const acmInfo: ACMInfo = await repo.getACMInfo();
							console.log("ACM Info:", acmInfo);

							// バックグラウンドスクリプトにACM情報を送信, notionに送信する
							let responseFromBackground: BackgroundResponse | undefined;
							responseFromBackground = await browser.runtime.sendMessage<
								ChromeRequest,
								BackgroundResponse
							>({
								action: ACMInfoAction.TO_NOTION,
								data: acmInfo,
							});

							if (responseFromBackground && responseFromBackground.success) {
								console.log("Successfully sent ACM Info to Notion");
								sendResponse({ success: true });
								return true;
							} else {
								let errorMessage = "Unknown error from background script.";
								if (responseFromBackground?.error) {
									errorMessage = responseFromBackground.error;
								} else if (!responseFromBackground) {
									errorMessage = "No response received from background script.";
								}
								console.error(
									"Error or no response from background script:",
									errorMessage
								);
								throw new Error(errorMessage);
							}
						} catch (error: any) {
							console.error(
								"Error in content script processing GET_ACM_INFO:",
								error
							);
							const errorMessage =
								error instanceof Error ? error.message : String(error);
							sendResponse({
								success: false,
								error: errorMessage,
							});
							return true;
						}
					}
				})();
				return true;
			}
		);
	},
});
