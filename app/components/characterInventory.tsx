// components/CharacterInventory.tsx
import { FC } from "react";
import CharacterSlot from "./Slots/characterSlot";
import { useInventoryStore, ItemType } from "../state/useStore";

const CharacterInventory: FC = () => {
  const slotTypes: ItemType[] = [
    ItemType.HELMET,
    ItemType.ARMOR,
    ItemType.BOOTS,
    ItemType.NECKLACE,
    ItemType.RING,
    ItemType.WEAPON,
  ];

  const { characterItems } = useInventoryStore();

  const calculateSums = () => {
    let totalDefense = 0;
    let totalDamage = 0;
    let totalEpicness = 0;

    Object.values(characterItems).forEach((item) => {
      if (item) {
        totalDefense += item.defense || 0;
        totalDamage += item.damage || 0;
        totalEpicness += item.epicness;
      }
    });

    return { totalDefense, totalDamage, totalEpicness };
  };

  const { totalDefense, totalDamage, totalEpicness } = calculateSums();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 3fr)",
        gap: "10px",
        padding: "20px",
        backgroundColor: "#282c34",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {slotTypes.map((type) => (
        <CharacterSlot key={type} type={type} />
      ))}
      <div
        style={{
          gridColumn: "span 2",
          textAlign: "center",
          marginTop: "20px",
          color: "white",
        }}
      >
        <div>Total Defense: {totalDefense}</div>
        <div>Total Damage: {totalDamage}</div>
        <div>Total Epicness: {totalEpicness}</div>
      </div>
    </div>
  );
};

export default CharacterInventory;
