import { FC } from "react";
import { Item } from "../state/useStore";

interface ItemTooltipProps {
  item: Item;
}

const ItemTooltip: FC<ItemTooltipProps> = ({ item }) => {
  return (
    <div className="item-tooltip">
      <div>
        <strong>Name:</strong> {item.name}
      </div>
      <div>
        <strong>Type:</strong> {item.type}
      </div>
      <div>
        <strong>Rarity:</strong> {item.rarity}
      </div>
      {item.weight !== null && item.weight !== 0 && (
        <div>
          <strong>Weight:</strong> {item.weight}
        </div>
      )}
      {item.epicness !== null && item.epicness !== 0 && (
        <div>
          <strong>Epicness:</strong> {item.epicness}
        </div>
      )}
      {item.defense !== null && item.defense !== 0 && (
        <div>
          <strong>Defense:</strong> {item.defense}
        </div>
      )}
      {item.damage !== null && item.damage !== 0 && (
        <div>
          <strong>Damage:</strong> {item.damage}
        </div>
      )}
    </div>
  );
};

export default ItemTooltip;
