import { useState, useEffect } from "react";
import "./App.css";
import {
	ACMInfoAction,
	ChromeRequest,
	ContentScriptResponse,
	NotionSettings,
} from "../../src/types";
import { SettingsService } from "../../src/service/settings_service";
import Settings from "./components/settings";

function App() {
	const [showSettings, setShowSettings] = useState(false);
	const [settings, setSettings] = useState<NotionSettings>({
		token: "",
		databaseId: "",
	});
	const [originalSettings, setOriginalSettings] = useState<NotionSettings>({
		token: "",
		databaseId: "",
	});
	const [isConfigured, setIsConfigured] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [statusMessage, setStatusMessage] = useState("");

	const settingsService = SettingsService.getInstance();

	useEffect(() => {
		// 設定を読み込み
		const loadSettings = async () => {
			const savedSettings = await settingsService.getSettings();
			if (savedSettings) {
				setSettings(savedSettings);
				setOriginalSettings(savedSettings);
			}
			setIsConfigured(await settingsService.isConfigured());
		};
		loadSettings();
	}, []);

	const handleShowSettings = () => {
		// 設定画面を開く時に現在の設定値をコピー
		setSettings({ ...originalSettings });
		setShowSettings(true);
	};

	const handleSaveSettings = async (newSettings: NotionSettings) => {
		await settingsService.saveSettings(newSettings);
		setSettings(newSettings);
		setOriginalSettings({ ...newSettings });
		setIsConfigured(true);
		setShowSettings(false);
		console.log("Settings saved successfully");
	};

	const handleCancelSettings = () => {
		setSettings({ ...originalSettings });
		setShowSettings(false);
	};

	/**
	 * 非同期ハンドリング
	 *
	 */
	const handleFetch = async () => {
		if (!isConfigured) {
			alert("Please configure your Notion settings first");
			setShowSettings(true);
			return;
		}

		setIsLoading(true);
		setStatusMessage("Getting ACM information...");

		try {
			console.log("Fetching response from content script...");

			const tabs = await browser.tabs.query({
				active: true,
				currentWindow: true,
			});
			if (tabs.length === 0 || tabs[0].id === undefined) {
				throw new Error("No active tab found.");
			}

			const tabId = tabs[0].id;
			setStatusMessage("Adding to Notion...");

			const response = await browser.tabs.sendMessage<
				ChromeRequest,
				ContentScriptResponse
			>(tabId, {
				action: ACMInfoAction.GET_ACM_INFO,
			});

			console.log("Full response received:", response);
			console.log("Response type:", typeof response);
			console.log(
				"Response keys:",
				response ? Object.keys(response) : "no response"
			);

			// レスポンスが成功の場合
			if (response?.success) {
				setStatusMessage("Successfully added to Notion ✓");
				// 5秒後にステータスメッセージをクリア
				setTimeout(() => {
					setStatusMessage("");
				}, 5000);
			}

			// レスポンスがエラーを含む場合
			if (response?.error) {
				throw new Error(response.error);
			}
		} catch (error) {
			console.error("Error sending message to content script:", error);

			let errorMessage = "Error: Failed to add to Notion ✗";
			if (error instanceof Error) {
				errorMessage = `Error: ${error.message}`;
			}

			setStatusMessage(errorMessage);

			// 5秒後にエラーメッセージをクリア
			setTimeout(() => {
				setStatusMessage("");
			}, 5000);
		} finally {
			setIsLoading(false);
		}
	};

	if (showSettings) {
		return (
			<Settings
				settings={settings}
				originalSettings={originalSettings}
				onSave={handleSaveSettings}
				onCancel={handleCancelSettings}
			/>
		);
	}

	return (
		<div style={{ padding: "20px", width: "300px" }}>
			<h1>ACM to Notion</h1>

			<div style={{ margin: "20px 0" }}>
				<button onClick={handleShowSettings} style={{ marginRight: "10px" }}>
					⚙️ Settings
				</button>
				<span
					style={{ fontSize: "12px", color: isConfigured ? "green" : "red" }}
				>
					{isConfigured ? "✓ Configured" : "⚠️ Not configured"}
				</span>
			</div>

			{/* ステータスメッセージ表示 */}
			{statusMessage && (
				<div
					style={{
						margin: "10px 0",
						padding: "8px",
						backgroundColor: statusMessage.includes("Error")
							? "#ffe6e6"
							: "#e6f7ff",
						border: `1px solid ${
							statusMessage.includes("Error") ? "#ff9999" : "#99d6ff"
						}`,
						borderRadius: "4px",
						fontSize: "12px",
						textAlign: "center",
					}}
				>
					{statusMessage}
				</div>
			)}

			<button
				className="fetchButton"
				onClick={handleFetch}
				style={{
					width: "100%",
					padding: "12px",
					fontSize: "16px",
					backgroundColor: isLoading
						? "#999"
						: isConfigured
						? "#007acc"
						: "#ccc",
					color: "white",
					border: "none",
					borderRadius: "4px",
					cursor: isLoading ? "wait" : isConfigured ? "pointer" : "not-allowed",
					position: "relative",
				}}
				disabled={!isConfigured || isLoading}
			>
				{isLoading ? (
					<>
						<span style={{ marginRight: "8px" }}>🔄</span>
						Adding...
					</>
				) : isConfigured ? (
					"Add to Notion"
				) : (
					"Configure Settings First"
				)}
			</button>
		</div>
	);
}

export default App;
