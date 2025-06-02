import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
	modules: ["@wxt-dev/module-react"],
	runner: {
		startUrls: ["https://dl.acm.org/doi/10.1145/3563657.3595972"],
	},
	manifest: {
		name: "acm-to-notion",
		description: "ACM論文情報をNotionに送信する拡張機能",
		version: "0.1.0",
		permissions: ["activeTab", "scripting", "storage"],
		host_permissions: ["*://*.acm.org/*", "https://api.notion.com/*"],
	},
});
