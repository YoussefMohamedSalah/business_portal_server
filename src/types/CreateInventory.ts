import { InventoryType } from "src/enums/enums";

export type CreateInventoryInfo = {
    type: InventoryType,
    items_count: number,
    items_value: number,
};
