import { NotionRepository } from "../src/repository/notion_repository";
import {
	ACMInfo,
	ACMInfoAction,
	BackgroundResponse,
	ChromeRequest,
} from "../src/types";

export default defineBackground(() => {
	console.log("setup background", { id: browser.runtime.id });

	browser.runtime.onMessage.addListener(
		(
			message: ChromeRequest,
			_,
			sendResponse: (response?: BackgroundResponse) => void
		) => {
			(async () => {
				if (message.action === ACMInfoAction.TO_NOTION) {
					try {
						const acmInfo = message.data;
						if (!acmInfo) {
							sendResponse({
								success: false,
								error:
									"ACMInfo data is missing in the request to background script.",
							});
							return;
						}
						const notionRepo = NotionRepository.getInstance();
						await notionRepo.addPageToDatabase(acmInfo);
						sendResponse({ success: true });
					} catch (error) {
						console.error("Error in background script:", error);
						const errorMessage =
							error instanceof Error ? error.message : String(error);
						sendResponse({ success: false, error: errorMessage });
					}
				} else {
					sendResponse({
						success: false,
						error: "Unsupported action in background script.",
					});
				}
			})();

			return true;
		}
	);
});
