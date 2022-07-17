export interface PostSearchBody {
    id: string;
    title: string;
    body: string;
    author: string;
}
export interface PostSearchResult {
    hits: {
        total: number;
        hits: Array<{
            _source: PostSearchBody;
        }>;
    };
}
