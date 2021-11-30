import { CommentEntity } from "../comment.entity";

export interface AllCommentResponseInterface {
	comments: CommentEntity[];
	commentsCount: number;
}
