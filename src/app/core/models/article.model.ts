export interface Article {
    id: number;
    feed_id: number;
    category_id: number;
    title: string;
    link: string;
    content: string;
    content_snippet: string;
    guid: string;
    iso_date: string;
    image_url: string;
    published_at: string;
}