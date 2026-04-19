import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Affirmation = {
    id: string;
    date: string;
    affirmation: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type Background = {
    id: string;
    date: string;
    theme: string;
    imageID: string;
    url: string;
    unsplashUrl: string;
    index: number;
    description: string;
    username: string;
    authorName: string;
    portfolioUrl: string;
    city: string;
    country: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type User = {
    id: string;
    oauthProvider: string;
    oauthId: string;
    name: Generated<string>;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type DB = {
    Affirmation: Affirmation;
    Background: Background;
    User: User;
};
