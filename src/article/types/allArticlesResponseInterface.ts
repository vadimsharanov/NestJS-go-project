import { ArticleType } from "./article.type";

export interface AllArticlesResponseInterface {
	articles: ArticleType[];
	articlesCount: number;
}
