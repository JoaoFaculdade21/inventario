import React, { useState, useEffect } from "react";
import { Item, ItemRarity, ItemType } from "@/app/state/useStore";

interface EditFormProps {
  item: Item;
  onUpdate: (updatedItem: Item) => void;
  onClose: () => void;
}

const EditForm: React.FC<EditFormProps> = ({ item, onUpdate, onClose }) => {
  const [updatedItem, setUpdatedItem] = useState<Item>(item);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ajustar defesa e dano com base no tipo do item
    if (
      [ItemType.ARMOR, ItemType.HELMET, ItemType.BOOTS].includes(
        updatedItem.type
      )
    ) {
      setUpdatedItem((prevItem) => ({ ...prevItem, damage: 0 }));
    } else if (updatedItem.type === ItemType.WEAPON) {
      setUpdatedItem((prevItem) => ({ ...prevItem, defense: 0 }));
    }
  }, [updatedItem.type]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUpdatedItem((prevItem) => ({
      ...prevItem,
      [name]: ["weight", "epicness", "defense", "damage"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Garantir que os valores de defesa e dano estão corretos antes de atualizar
    const adjustedItem = { ...updatedItem };
    if (
      [ItemType.ARMOR, ItemType.HELMET, ItemType.BOOTS].includes(
        adjustedItem.type
      )
    ) {
      adjustedItem.damage = 0;
    } else if (adjustedItem.type === ItemType.WEAPON) {
      adjustedItem.defense = 0;
    }

    try {
      const response = await fetch(`/api/update/item/${adjustedItem.id}`, {
        method: "PUT", // Assumindo que você está usando PUT para atualizar
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adjustedItem),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      onUpdate(result);
    } catch (error) {
      setError("Failed to update item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <label>
          Nome:
          <input
            type="text"
            name="name"
            value={updatedItem.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Tipo:
          <select name="type" value={updatedItem.type} onChange={handleChange}>
            {Object.values(ItemType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label>
          Raridade:
          <select
            name="rarity"
            value={updatedItem.rarity}
            onChange={handleChange}
          >
            {Object.values(ItemRarity).map((rarity) => (
              <option key={rarity} value={rarity}>
                {rarity}
              </option>
            ))}
          </select>
        </label>
        <label>
          Peso:
          <input
            type="number"
            name="weight"
            value={updatedItem.weight}
            onChange={handleChange}
          />
        </label>
        <label>
          Epicness:
          <input
            type="number"
            name="epicness"
            value={updatedItem.epicness}
            onChange={handleChange}
          />
        </label>
        {updatedItem.type !== ItemType.WEAPON && (
          <label>
            Defesa:
            <input
              type="number"
              name="defense"
              value={updatedItem.defense || 0}
              onChange={handleChange}
            />
          </label>
        )}
        {updatedItem.type !== ItemType.ARMOR &&
          updatedItem.type !== ItemType.HELMET &&
          updatedItem.type !== ItemType.BOOTS && (
            <label>
              Dano:
              <input
                type="number"
                name="damage"
                value={updatedItem.damage || 0}
                onChange={handleChange}
              />
            </label>
          )}
        <button type="submit" disabled={loading}>
          Salvar
        </button>
        <button type="button" onClick={onClose}>
          Fechar
        </button>
        {error && <div>{error}</div>}
      </form>
    </div>
  );
};

export default EditForm;
