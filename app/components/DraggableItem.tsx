import React, { useRef, useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../dnd/itemTypes";
import { Item, ItemType, ItemRarity } from "../state/useStore";
import ItemTooltip from "./itemTooltip";

interface DraggableItemProps {
  item: Item;
  index: number | null;
}

const typeToImageMap: Record<ItemType, string> = {
  [ItemType.HELMET]: "/Helmet.png",
  [ItemType.ARMOR]: "/Armor.png",
  [ItemType.BOOTS]: "/Boots.png",
  [ItemType.NECKLACE]: "/Necklace.png",
  [ItemType.RING]: "/Ring.png",
  [ItemType.WEAPON]: "/Weapon.png",
};

const rarityToClassMap: Record<ItemRarity, string> = {
  [ItemRarity.COMMON]: "common",
  [ItemRarity.RARE]: "rare",
  [ItemRarity.EPIC]: "epic",
  [ItemRarity.LEGENDARY]: "legendary",
};

const DraggableItem: React.FC<DraggableItemProps> = ({ item, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [, drag, preview] = useDrag({
    type: ItemTypes.ITEM,
    item: { index, item },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (ref.current) {
      drag(ref.current);
    }
  }, [ref, drag]);

  const itemImage = typeToImageMap[item.type];
  const rarityClass = rarityToClassMap[item.rarity];

  return (
    <div
      ref={ref}
      className={`draggable-item ${rarityClass} ${
        showTooltip ? "dragging" : ""
      }`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <img src={itemImage} alt={item.name} />
      {showTooltip && <ItemTooltip item={item} />}
    </div>
  );
};

export default DraggableItem;
