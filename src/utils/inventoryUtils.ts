import { Inventory } from "../entities/Inventory";
import { InventoryItem } from "../entities/InventoryItem";

export const handleInventoryCountAndValue = (inventory: Inventory, item: InventoryItem, term: string) => {
    let updatedInventory = { ...inventory } as Inventory;

    let inventoryItemsCount;
    let newItemValue;
    let inventoryItemsValue;

    if (term === 'add') {
        inventoryItemsCount = Number(inventory.items_count) + Number(item.count);
        newItemValue = calculateItemValue(Number(item.count), Number(item.price))
        inventoryItemsValue = inventory.items_value + Number(newItemValue);

        updatedInventory.items_count = inventoryItemsCount;
        updatedInventory.items_value = inventoryItemsValue;
        return updatedInventory;
    } else if (term === 'remove') {
        inventoryItemsCount = Number(inventory.items_count) - Number(item.count);
        newItemValue = calculateItemValue(Number(item.count), Number(item.price))
        inventoryItemsValue = inventory.items_value - Number(newItemValue);
        updatedInventory.items_count = inventoryItemsCount;
        updatedInventory.items_value = inventoryItemsValue;
        return updatedInventory;
    } else {

    }
    return updatedInventory;
}


export const handleCalculateItemValue = (oldItem: InventoryItem, newItem: { price: number, count: number }) => {
    let newItemTotalValue = oldItem.total_value;
    if (oldItem.count !== newItem.count && oldItem.price !== newItem.price) {
        return newItemTotalValue = calculateItemValue(Number(newItem.count), Number(newItem.price));
    } else if (oldItem.count !== newItem.count && oldItem.price === newItem.price) {
        return newItemTotalValue = calculateItemValue(Number(newItem.count), Number(oldItem.price));
    } else if (oldItem.count === newItem.count && oldItem.price !== newItem.price) {
        return newItemTotalValue = calculateItemValue(Number(oldItem.count), Number(newItem.price));
    } else return newItemTotalValue;
}



export const calculateItemValue = (count: number, value: number) => {
    return Number(count) * Number(value);
}