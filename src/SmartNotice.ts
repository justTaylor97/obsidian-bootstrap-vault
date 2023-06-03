import { Notice } from "obsidian";

export enum NoticeLevel {
	Error = "notice-error",
	Warning = "notice-warning",
	Success = "notice-success",
}

export class SmartNotice extends Notice {
	constructor(message: string | DocumentFragment, level: NoticeLevel) {
		super(message);
		this.noticeEl.addClass(level);
	}
}
