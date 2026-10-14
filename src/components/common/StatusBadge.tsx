import React from 'react';
import { FoodType, OrderStatus, PaymentStatus, TableStatus } from '../../types';

interface VegNonVegBadgeProps {
  type: FoodType;
  size?: 'sm' | 'md';
}

export const VegNonVegBadge: React.FC<VegNonVegBadgeProps> = ({ type, size = 'md' }) => {
  const isVeg = type === 'veg';
  const boxSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';

  return (
    <span
      className={`inline-flex items-center justify-center border ${
        isVeg ? 'border-emerald-600' : 'border-red-600'
      } rounded-[3px] ${boxSize} bg-white p-[2px] shrink-0`}
      title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
      aria-label={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
    >
      <span
        className={`rounded-full ${dotSize} ${
          isVeg ? 'bg-emerald-600' : 'bg-red-600'
        }`}
      />
    </span>
  );
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      case 'Received':
        return 'text-blue-700 bg-blue-50 border-blue-200/60';
      case 'Confirmed':
        return 'text-indigo-700 bg-indigo-50 border-indigo-200/60';
      case 'Preparing':
        return 'text-amber-700 bg-amber-50 border-amber-200/60';
      case 'Ready':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200/60';
      case 'Served':
        return 'text-teal-700 bg-teal-50 border-teal-200/60';
      case 'Completed':
        return 'text-neutral-700 bg-neutral-100 border-neutral-200/60';
      case 'Cancelled':
        return 'text-red-700 bg-red-50 border-red-200/60';
      default:
        return 'text-neutral-600 bg-neutral-50 border-neutral-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase rounded-md border ${getStyle()}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
};

interface TableStatusBadgeProps {
  status: TableStatus;
}

export const TableStatusBadge: React.FC<TableStatusBadgeProps> = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      case 'AVAILABLE':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200/80';
      case 'OCCUPIED':
        return 'text-amber-700 bg-amber-50 border-amber-200/80';
      case 'RESERVED':
        return 'text-purple-700 bg-purple-50 border-purple-200/80';
      case 'INACTIVE':
        return 'text-neutral-500 bg-neutral-100 border-neutral-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold tracking-wider rounded border uppercase ${getStyle()}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
};

interface PaymentBadgeProps {
  status: PaymentStatus;
}

export const PaymentBadge: React.FC<PaymentBadgeProps> = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      case 'Paid':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Pending':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Failed':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'Refunded':
        return 'text-neutral-600 bg-neutral-100 border-neutral-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded border uppercase tracking-wider ${getStyle()}`}>
      {status}
    </span>
  );
};
