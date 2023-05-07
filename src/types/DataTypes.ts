import { ReactNode } from "react";

export enum DataFields {
    Timestamp = "timestamp",
    Impressions = "impressions",
    Clicks = "clicks",
    Cost = "cost",
    Conversions = "conversions"
}

export interface DataItem {
    timestamp: string,
    impressions: number,
    clicks: number,
    cost: number,
    conversions: number
}

export interface DataColumn {
    label: string;
    order: number;
    render?: (val: any) => ReactNode;
}

export type DataByFields = Record<string, Record<string, number>>;