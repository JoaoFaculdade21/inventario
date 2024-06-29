import React, { useState } from "react";
import { useInventoryStore, ItemType, ItemRarity } from "@/app/state/useStore";

const Filter: React.FC = () => {
  const [filterType, setFilterType] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string | null>(null);
  const { applyFilter, fetchItems } = useInventoryStore();

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFilterType(value);
    setFilterValue(null);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFilterValue(value);
  };

  const handleApplyFilter = () => {
    if (filterType === "") {
      fetchItems();
    } else {
      applyFilter(filterType, filterValue || undefined);
    }
  };

  return (
    <div className="filter">
      <select onChange={handleFilterChange} value={filterType}>
        <option value="">Sem Filtro</option>
        <option value="alltype">Ordenar por tipo (alfabético)</option>
        <option value="allrarity">Ordenar por raridade (alfabético)</option>
        <option value="weight">Ordenar por peso (crescente)</option>
        <option value="epicness">Ordenar por epicness (crescente)</option>
        <option value="type">Filtrar por tipo específico</option>
        <option value="raritySpecific">Filtrar por raridade específica</option>
      </select>
      {(filterType === "type" || filterType === "raritySpecific") && (
        <select onChange={handleValueChange} value={filterValue || ""}>
          <option value="" disabled>
            Selecione um valor
          </option>
          {filterType === "type" &&
            Object.values(ItemType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          {filterType === "raritySpecific" &&
            Object.values(ItemRarity).map((rarity) => (
              <option key={rarity} value={rarity}>
                {rarity}
              </option>
            ))}
        </select>
      )}
      <button className="filterButton" onClick={handleApplyFilter}>
        Filter
      </button>
    </div>
  );
};

export default Filter;
