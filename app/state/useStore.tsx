import create from "zustand";

export enum ItemType {
  HELMET = "HELMET",
  ARMOR = "ARMOR",
  BOOTS = "BOOTS",
  NECKLACE = "NECKLACE",
  RING = "RING",
  WEAPON = "WEAPON",
}

export enum ItemRarity {
  COMMON = "COMMON",
  RARE = "RARE",
  EPIC = "EPIC",
  LEGENDARY = "LEGENDARY",
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  weight: number;
  epicness: number;
  defense?: number;
  damage?: number;
}

interface InventoryState {
  items: (Item | null)[];
  characterItems: Record<ItemType, Item | null>;
  filteredItems: (Item | null)[]; // Novo estado para itens filtrados
  moveItem: (
    fromIndex: number | null,
    toIndex: number | null,
    slotType?: ItemType
  ) => void;
  updateItem: (updatedItem: Item) => void;
  applyFilter: (filter: string, value?: string) => void;
  addItem: (item: Item) => void;
  clearItem: (index: number) => void;
  fetchItems: () => void;
  setFilteredItems: (items: (Item | null)[]) => void; // Nova função para definir itens filtrados
}

const initialItems: (Item | null)[] = Array(64).fill(null);

export const useInventoryStore = create<InventoryState>((set) => ({
  items: initialItems,
  characterItems: {
    [ItemType.HELMET]: null,
    [ItemType.ARMOR]: null,
    [ItemType.BOOTS]: null,
    [ItemType.NECKLACE]: null,
    [ItemType.RING]: null,
    [ItemType.WEAPON]: null,
  },
  filteredItems: initialItems,
  moveItem: (fromIndex, toIndex, slotType) =>
    set((state) => {
      if (fromIndex !== null && toIndex !== null) {
        const items = [...state.items];
        [items[fromIndex], items[toIndex]] = [items[toIndex], items[fromIndex]];
        return { items, filteredItems: items };
      } else if (fromIndex !== null && slotType) {
        const items = [...state.items];
        const item = items[fromIndex];
        if (item && item.type === slotType) {
          items[fromIndex] = null;
          return {
            items,
            filteredItems: items,
            characterItems: { ...state.characterItems, [slotType]: item },
          };
        }
      } else if (toIndex !== null && slotType) {
        const characterItems = { ...state.characterItems };
        const item = characterItems[slotType];
        if (item) {
          const items = [...state.items];
          items[toIndex] = item;
          characterItems[slotType] = null;
          return {
            items,
            filteredItems: items,
            characterItems,
          };
        }
      }
      return state;
    }),
  updateItem: (updatedItem) =>
    set((state) => {
      const items = state.items.map((item) =>
        item?.id === updatedItem.id ? updatedItem : item
      );
      const characterItems = { ...state.characterItems };
      if (updatedItem.type in characterItems) {
        characterItems[updatedItem.type] =
          characterItems[updatedItem.type]?.id === updatedItem.id
            ? updatedItem
            : characterItems[updatedItem.type];
      }
      return { items, filteredItems: items, characterItems };
    }),
  addItem: (item) =>
    set((state) => {
      const items = [...state.items];
      const emptyIndex = items.findIndex((slot) => slot === null);
      if (emptyIndex !== -1) {
        items[emptyIndex] = item;
      }
      return { items, filteredItems: items };
    }),
  clearItem: (index) =>
    set((state) => {
      const items = [...state.items];
      items[index] = null;
      return { items, filteredItems: items };
    }),
  applyFilter: (filter, value) =>
    set((state) => {
      let filteredItems = [...state.items];
      if (filter === "alltype") {
        filteredItems.sort((a, b) =>
          a && b ? a.type.localeCompare(b.type) : 0
        );
      } else if (filter === "allrarity") {
        filteredItems.sort((a, b) =>
          a && b ? a.rarity.localeCompare(b.rarity) : 0
        );
      } else if (filter === "weight") {
        filteredItems.sort((a, b) => (a && b ? a.weight - b.weight : 0));
      } else if (filter === "epicness") {
        filteredItems.sort((a, b) => (a && b ? a.epicness - b.epicness : 0));
      } else if (filter === "type" && value) {
        filteredItems = filteredItems.filter((item) => item?.type === value);
      } else if (filter === "raritySpecific" && value) {
        filteredItems = filteredItems.filter((item) => item?.rarity === value);
      }
      return { filteredItems };
    }),
  fetchItems: async () => {
    try {
      const response = await fetch("/api/find/item");
      const data = await response.json();
      set({ items: data.items, filteredItems: data.items });
    } catch (error) {
      console.error("Failed to fetch items:", error);
    }
  },
  setFilteredItems: (filteredItems) => set({ filteredItems }),
}));
