import { App, FileSystemAdapter, Modal, Notice, Setting } from "obsidian";
import { NoticeLevel, SmartNotice } from "./SmartNotice";

class ValidationError extends Error {}

export class BootstrapVaultWizardModal extends Modal {
	sourceVaultPath: string;
	destinationVaultPath: string;

	constructor(app: App) {
		super(app);
	}

	setDefaultSourceVault() {
		const adapter = this.app.vault.adapter;
		if (adapter instanceof FileSystemAdapter) {
			this.sourceVaultPath = adapter.getBasePath();
		}
	}

	onOpen() {
		const { contentEl, titleEl } = this;

		titleEl.setText("Bootstrap Vault - Step 1");

		this.setDefaultSourceVault();
		new Setting(contentEl)
			.setName("Source vault")
			.setDesc("Absolute path to the prime vault")
			.addText((text) =>
				text.setValue(this.sourceVaultPath).onChange((value) => {
					this.sourceVaultPath = value;
				})
			);

		new Setting(contentEl)
			.setName("Destination vault path")
			.setDesc("Absolute path the clone vault")
			.addText((text) =>
				text.onChange((value) => {
					this.destinationVaultPath = value;
				})
			);

		new Setting(contentEl).addButton((btn) =>
			btn
				.setButtonText("Next")
				.setCta()
				.onClick(() => {
					this.validateStepOne()
						.then(() => {
							// TODO: wizard step 2
							new SmartNotice(
								`Step 1 complete\n\nSource vault path: ${this.sourceVaultPath}\nDestination vault path: ${this.destinationVaultPath}`,
								NoticeLevel.Success
							);
						})
						.catch((error: Error) => {
							new SmartNotice(error.message, NoticeLevel.Error);
						});
				})
		);
	}

	async validateStepOne() {
		if (!this.sourceVaultPath || this.sourceVaultPath.length === 0) {
			throw new ValidationError("Please fill out the source vault path");
		}
		if (
			!this.destinationVaultPath ||
			this.destinationVaultPath.length === 0
		) {
			throw new ValidationError(
				"Please fill out the destination vault path"
			);
		}

		return;
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
