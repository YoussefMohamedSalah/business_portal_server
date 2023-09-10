import { InventoryType } from "../enums/enums";

export type CreateInventoryInfo = {
    type: string,
    items_count: number,
    items_value: number,
};
