"use client";
import { FC, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useInventoryStore } from "./state/useStore";
import Inventory from "./components/Inventory";
import CharacterInventory from "./components/characterInventory";
import DeleteSlot from "./components/Slots/deleteSlot";
import EditSlot from "./components/Slots/editSlot";
import CreateItemForm from "./components/Forms/createForm";
import Modal from "react-modal";
import FilterComponent from "./components/filter";

const Home: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetchItems = useInventoryStore((state) => state.fetchItems);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: "flex", gap: "20px" }}>
        <Inventory />
        <CharacterInventory />
      </div>
      <div style={{ display: "flex", gap: "20px" }}>
        <DeleteSlot />
        <EditSlot />
      </div>
      <FilterComponent />
      <button className="ForgeButton" onClick={openModal}>
        Forge Item
      </button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Forge Item"
      >
        <CreateItemForm onClose={closeModal} />
      </Modal>
    </DndProvider>
  );
};

export default Home;
