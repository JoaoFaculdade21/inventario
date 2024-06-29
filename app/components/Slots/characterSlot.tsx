// components/Slots/CharacterSlot.tsx
import { FC, useRef, useEffect } from "react";
import { DropTargetMonitor, useDrop } from "react-dnd";
import { ItemTypes } from "../../dnd/itemTypes";
import { useInventoryStore, Item } from "@/app/state/useStore";
import DraggableItem from "../DraggableItem";

interface CharacterSlotProps {
  type: Item["type"];
}

const CharacterSlot: FC<CharacterSlotProps> = ({ type }) => {
  const { characterItems, moveItem } = useInventoryStore();
  const item = characterItems[type];

  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: ItemTypes.ITEM,
    drop: (item: { item: Item }, monitor: DropTargetMonitor) => {
      const draggedItem = monitor.getItem() as {
        index: number | null;
        item: Item;
      };
      if (draggedItem.index !== null) {
        moveItem(draggedItem.index, null, type);
      }
    },
    canDrop: (item: { item: Item }) => item.item.type === type,
  });

  useEffect(() => {
    if (ref.current) {
      drop(ref.current);
    }
  }, [ref, drop]);

  return (
    <div
      ref={ref}
      style={{
        border: "1px solid white",
        width: "100px",
        height: "100px",
        borderRadius: "5px",
        backgroundColor: item ? "lightgrey" : "transparent",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {item ? <DraggableItem item={item} index={null} /> : type}
    </div>
  );
};

export default CharacterSlot;
