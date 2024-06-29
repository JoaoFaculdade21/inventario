import React from "react";
import { useInventoryStore } from "@/app/state/useStore";
import InventorySlot from "./Slots/inventorySlot";

const Inventory: React.FC = () => {
  const { filteredItems } = useInventoryStore();
  const slots = Array.from({ length: 64 }, (_, i) => i);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(8, 100px)",
        gap: "10px",
        padding: "20px",
        backgroundColor: "#282c34",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {slots.map((index) => (
        <InventorySlot key={index} index={index} item={filteredItems[index]} />
      ))}
    </div>
  );
};

export default Inventory;
