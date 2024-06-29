import { FC, useRef, useEffect, useState } from "react";
import { useDrop, DropTargetMonitor } from "react-dnd";
import { ItemTypes } from "@/app/dnd/itemTypes";
import { Item } from "@/app/state/useStore";
import { useInventoryStore } from "@/app/state/useStore";
import EditForm from "../Forms/editForm";

const EditSlot: FC = () => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const updateItem = useInventoryStore((state) => state.updateItem);

  const [, drop] = useDrop({
    accept: ItemTypes.ITEM,
    drop: (
      draggedItem: { index: number | null; item: Item },
      monitor: DropTargetMonitor
    ) => {
      setItemToEdit(draggedItem.item);
      setShowEditForm(true);
    },
    canDrop: () => true,
  });

  useEffect(() => {
    if (ref.current) {
      drop(ref.current);
    }
  }, [ref, drop]);

  const handleUpdate = (updatedItem: Item) => {
    updateItem(updatedItem);
    setShowEditForm(false);
  };

  return (
    <div
      ref={ref}
      style={{
        border: "1px dashed blue",
        width: "100px",
        height: "100px",
        borderRadius: "5px",
        backgroundColor: "lightgrey",
        color: "blue",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {showEditForm && itemToEdit && (
        <>
          <div
            className="modal-overlay"
            onClick={() => setShowEditForm(false)}
          />
          <EditForm
            item={itemToEdit}
            onUpdate={handleUpdate}
            onClose={() => setShowEditForm(false)}
          />
        </>
      )}
      <p>Drop to Edit</p>
    </div>
  );
};

export default EditSlot;
