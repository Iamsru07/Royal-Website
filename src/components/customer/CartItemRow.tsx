import React, { useState } from 'react';
import { Minus, Plus, Trash2, ImageOff } from 'lucide-react';
import { CartItem } from '../../types';
import { VegNonVegBadge } from '../common/StatusBadge';
import { useRestaurant } from '../../context/RestaurantContext';

interface CartItemRowProps {
  item: CartItem;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
  const { updateCartQuantity, removeFromCart } = useRestaurant();
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex items-center gap-3 py-3 border-b border-neutral-100 last:border-b-0">
      {/* Thumbnail */}
      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-100">
        {!imageError ? (
          <img
            src={item.food.imageUrl}
            alt={item.food.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-400">
            <ImageOff className="w-5 h-5 text-neutral-300" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <VegNonVegBadge type={item.food.foodType} size="sm" />
          <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 truncate font-serif-brand">
            {item.food.name}
          </h4>
        </div>
        <div className="flex items-baseline gap-1 text-xs text-neutral-500 font-mono">
          <span>₹{item.food.price}</span>
          <span className="text-[11px] text-neutral-400">× {item.quantity}</span>
          <span className="font-semibold text-neutral-900 ml-auto">
            ₹{item.food.price * item.quantity}
          </span>
        </div>

        {/* Stepper & Delete */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center bg-neutral-100 border border-neutral-200/80 rounded-lg p-0.5">
            <button
              onClick={() => updateCartQuantity(item.food.id, item.quantity - 1)}
              className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-white rounded transition-colors"
              aria-label={`Decrease ${item.food.name} quantity`}
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-6 text-center text-xs font-bold text-neutral-900 tabular-nums">
              {item.quantity}
            </span>
            <button
              onClick={() => updateCartQuantity(item.food.id, item.quantity + 1)}
              className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-white rounded transition-colors"
              aria-label={`Increase ${item.food.name} quantity`}
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={() => removeFromCart(item.food.id)}
            className="p-1 text-neutral-400 hover:text-red-600 rounded transition-colors"
            title="Remove item"
            aria-label={`Remove ${item.food.name} from cart`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
