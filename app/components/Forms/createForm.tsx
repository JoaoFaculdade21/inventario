import React, { useEffect, useState } from "react";
import {
  Item,
  ItemRarity,
  ItemType,
  useInventoryStore,
} from "@/app/state/useStore";

interface ItemFormData {
  name: string;
  rarity: string;
  weight: number;
  epicness: number;
  type: string;
  defense?: number | null;
  damage?: number | null;
}

const CreateItemForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState<ItemFormData>({
    name: "",
    rarity: "COMMON",
    weight: 0,
    epicness: 0,
    type: "HELMET",
    defense: null,
    damage: null,
  });

  const { addItem, fetchItems } = useInventoryStore();

  useEffect(() => {
    fetchItems();
  }, []);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]:
        name === "weight" || name === "epicness"
          ? parseFloat(value)
          : name === "defense" || name === "damage"
          ? value !== ""
            ? parseInt(value, 10)
            : null
          : value,
    }));
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { type } = formData;

    if (["HELMET", "ARMOR", "BOOTS"].includes(type)) {
      formData.damage = null;
    } else if (type === "WEAPON") {
      formData.defense = null;
    }

    try {
      const response = await fetch("/api/create/item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        const newItem: Item = {
          id: result.id,
          name: formData.name,
          type: formData.type as ItemType,
          rarity: formData.rarity as ItemRarity,
          weight: formData.weight,
          epicness: formData.epicness,
          defense: formData.defense || undefined,
          damage: formData.damage || undefined,
        };

        addItem(newItem);
        await fetchItems();

        setFormData({
          name: "",
          rarity: "COMMON",
          weight: 0,
          epicness: 0,
          type: "HELMET",
          defense: null,
          damage: null,
        });

        onClose(); // Fecha o modal ao submeter o formulário
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert("An error occurred while creating the item.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="modal-close" onClick={onClose}>
          &times;
        </span>
        <form onSubmit={handleFormSubmit}>
          <div>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Rarity:
              <select
                name="rarity"
                value={formData.rarity}
                onChange={handleInputChange}
              >
                <option value="COMMON">COMMON</option>
                <option value="RARE">RARE</option>
                <option value="EPIC">EPIC</option>
                <option value="LEGENDARY">LEGENDARY</option>
              </select>
            </label>
          </div>
          <div>
            <label>
              Weight:
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                step="0.01"
                required
              />
            </label>
          </div>
          <div>
            <label>
              Epicness:
              <input
                type="number"
                name="epicness"
                value={formData.epicness}
                onChange={handleInputChange}
                step="0.01"
                required
              />
            </label>
          </div>
          <div>
            <label>
              Type:
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              >
                <option value="HELMET">HELMET</option>
                <option value="ARMOR">ARMOR</option>
                <option value="BOOTS">BOOTS</option>
                <option value="NECKLACE">NECKLACE</option>
                <option value="RING">RING</option>
                <option value="WEAPON">WEAPON</option>
              </select>
            </label>
          </div>

          {["HELMET", "ARMOR", "BOOTS", "NECKLACE", "RING"].includes(
            formData.type
          ) && (
            <div>
              <label>
                Defense:
                <input
                  type="number"
                  name="defense"
                  value={formData.defense ?? ""}
                  onChange={handleInputChange}
                />
              </label>
            </div>
          )}

          {["WEAPON", "NECKLACE", "RING"].includes(formData.type) && (
            <div>
              <label>
                Damage:
                <input
                  type="number"
                  name="damage"
                  value={formData.damage ?? ""}
                  onChange={handleInputChange}
                />
              </label>
            </div>
          )}

          <button type="submit">Create Item</button>
        </form>
      </div>
    </div>
  );
};

export default CreateItemForm;
