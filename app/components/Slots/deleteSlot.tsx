import { FC, useEffect, useRef, useState } from "react";
import { DropTargetMonitor, useDrop } from "react-dnd";
import { ItemTypes } from "@/app/dnd/itemTypes";
import { Item } from "@/app/state/useStore";
import { useInventoryStore } from "@/app/state/useStore";

const DeleteSlot: FC = () => {
  const { clearItem, fetchItems } = useInventoryStore();
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: ItemTypes.ITEM,
    drop: (
      draggedItem: { index: number | null; item: Item },
      monitor: DropTargetMonitor
    ) => {
      if (draggedItem.index !== null) {
        setItemToDelete(draggedItem.item);
        setShowDeleteButton(true);
        // Remove the item from its original location and move it to the delete slot
        clearItem(draggedItem.index);
      }
    },
    canDrop: () => true,
  });

  useEffect(() => {
    if (ref.current) {
      drop(ref.current);
    }
  }, [ref, drop]);

  const handleDelete = async () => {
    if (itemToDelete) {
      try {
        const response = await fetch(`/api/delete/item/${itemToDelete.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete item");
        }

        // Refresh the inventory to show the updated list of items
        await fetchItems();
        setShowDeleteButton(false);
        setItemToDelete(null);
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  return (
    <div
      ref={ref}
      style={{
        border: "2px dashed blue",
        width: "100px",
        height: "100px",
        position: "relative",
        borderRadius: "5px",
        backgroundColor: "lightgrey",
        color: "blue",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {itemToDelete && (
        <div
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <p>{itemToDelete.name}</p>
          {showDeleteButton && (
            <button
              onClick={handleDelete}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              Excluir
            </button>
          )}
        </div>
      )}
      {!itemToDelete && <p>Drop to Delete</p>}
    </div>
  );
};

export default DeleteSlot;
