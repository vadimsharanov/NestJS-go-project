import { Controller, Get } from "@nestjs/common";

@Controller("articles/:slug")
export class CommentController {
	@Get("comments")
	async getComments() {
		return "in the future there will be all comments list";
	}
}
