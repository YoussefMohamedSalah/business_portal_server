export type CreateTender = {
    description: string;
    date: string;
    hand_over: string;
    files?: string[];
    comments: Array<{ id: number, userId: string, name: string, comment: string }>;
};
