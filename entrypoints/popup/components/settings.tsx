import { useState } from "react";
import { NotionSettings } from "../../../src/types";

interface SettingsProps {
	settings: NotionSettings;
	originalSettings: NotionSettings;
	onSave: (settings: NotionSettings) => Promise<void>;
	onCancel: () => void;
}

/**
 * 設定コンポーネント
 *
 */
export default function Settings({
	settings,
	originalSettings,
	onSave,
	onCancel,
}: SettingsProps) {
	const [currentSettings, setCurrentSettings] =
		useState<NotionSettings>(settings);

	const handleSave = async () => {
		if (currentSettings.token && currentSettings.databaseId) {
			await onSave(currentSettings);
		} else {
			alert("Please fill in both token and database ID");
		}
	};

	return (
		<div style={{ padding: "20px", width: "400px" }}>
			<h2>Notion Settings</h2>
			<div style={{ marginBottom: "15px" }}>
				<label style={{ display: "block", marginBottom: "5px" }}>
					Notion Token:
				</label>
				<input
					type="password"
					value={currentSettings.token}
					onChange={(e) =>
						setCurrentSettings({ ...currentSettings, token: e.target.value })
					}
					style={{ width: "100%", padding: "5px" }}
					placeholder="ntn_..."
				/>
				{originalSettings.token && (
					<div style={{ fontSize: "12px", color: "gray", marginTop: "2px" }}>
						Current: {originalSettings.token.substring(0, 10)}...
					</div>
				)}
			</div>
			<div style={{ marginBottom: "15px" }}>
				<label style={{ display: "block", marginBottom: "5px" }}>
					Database ID:
				</label>
				<input
					type="text"
					value={currentSettings.databaseId}
					onChange={(e) =>
						setCurrentSettings({
							...currentSettings,
							databaseId: e.target.value,
						})
					}
					style={{ width: "100%", padding: "5px" }}
					placeholder="database_id..."
				/>
				{originalSettings.databaseId && (
					<div style={{ fontSize: "12px", color: "gray", marginTop: "2px" }}>
						Current: {originalSettings.databaseId}
					</div>
				)}
			</div>
			<div>
				<button onClick={handleSave} style={{ marginRight: "10px" }}>
					Save
				</button>
				<button onClick={onCancel}>Cancel</button>
			</div>
		</div>
	);
}
