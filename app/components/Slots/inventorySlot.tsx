// /components/Slots/InventorySlot.tsx
import React, { useRef, useEffect } from "react";
import { useDrop, DropTargetMonitor } from "react-dnd";
import { ItemTypes } from "../../dnd/itemTypes";
import { useInventoryStore, Item } from "@/app/state/useStore";
import DraggableItem from "../DraggableItem";

interface InventorySlotProps {
  index: number;
  item: Item | null;
}

const InventorySlot: React.FC<InventorySlotProps> = ({ index, item }) => {
  const { moveItem } = useInventoryStore();
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: ItemTypes.ITEM,
    drop: (
      droppedItem: { index: number | null; item: Item },
      monitor: DropTargetMonitor
    ) => {
      if (droppedItem.index === null) {
        moveItem(null, index, droppedItem.item.type);
      } else {
        moveItem(droppedItem.index, index);
      }
    },
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
      {item ? <DraggableItem item={item} index={index} /> : null}
    </div>
  );
};

export default InventorySlot;
