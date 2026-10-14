import React from 'react';
import { QrCode, Edit2, Users, Clock, UserCheck, CheckCircle, RefreshCw } from 'lucide-react';
import { RestaurantTable, TableStatus } from '../../types';
import { TableStatusBadge } from '../common/StatusBadge';

interface TableCardProps {
  table: RestaurantTable;
  onViewQR: (table: RestaurantTable) => void;
  onEdit: (table: RestaurantTable) => void;
  onStatusChange?: (tableId: string, status: TableStatus) => void;
  onVacate?: (tableId: string) => void;
}

export const TableCard: React.FC<TableCardProps> = ({
  table,
  onViewQR,
  onEdit,
  onStatusChange,
  onVacate,
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
        table.status === 'OCCUPIED'
          ? 'border-red-200/90 ring-1 ring-red-400/20 bg-gradient-to-b from-red-50/20 to-white'
          : table.status === 'RESERVED'
          ? 'border-amber-200/90 ring-1 ring-amber-400/20 bg-gradient-to-b from-amber-50/20 to-white'
          : 'border-neutral-100 hover:border-neutral-200'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm font-mono shadow-2xs ${
                table.status === 'OCCUPIED'
                  ? 'bg-red-600 text-white'
                  : table.status === 'RESERVED'
                  ? 'bg-amber-600 text-white'
                  : table.status === 'INACTIVE'
                  ? 'bg-neutral-400 text-white'
                  : 'bg-neutral-900 text-white'
              }`}
            >
              T{table.tableNumber}
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900 font-serif-brand">
                Table {table.tableNumber}
              </h4>
              <div className="flex items-center gap-1 text-[11px] text-neutral-500">
                <Users className="w-3 h-3 text-neutral-400" />
                <span>Capacity: {table.capacity} guests</span>
              </div>
            </div>
          </div>
          <TableStatusBadge status={table.status} />
        </div>

        {/* Occupied Details Banner */}
        {table.status === 'OCCUPIED' && (
          <div className="my-3 px-3 py-2.5 bg-red-50/80 border border-red-200/70 rounded-xl text-xs space-y-1.5 text-red-950">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[11px] text-red-900 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>Occupied / Seated</span>
              </span>
              {table.occupiedSince && (
                <span className="text-[10px] text-red-700 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{table.occupiedSince}</span>
                </span>
              )}
            </div>

            {table.currentOrderId && (
              <div className="text-[11px] font-mono font-semibold text-red-800">
                Ref: {table.currentOrderId}
              </div>
            )}

            {table.bookedByName && (
              <div className="text-[11px] text-neutral-700 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-red-600 shrink-0" />
                <span className="font-semibold text-neutral-900 truncate">
                  {table.bookedByName}
                </span>
                {table.bookedByPhone && (
                  <span className="text-neutral-500 font-mono text-[10px]">
                    ({table.bookedByPhone})
                  </span>
                )}
              </div>
            )}

            {onVacate && (
              <button
                type="button"
                onClick={() => onVacate(table.id)}
                className="w-full mt-1.5 py-1 px-2 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
              >
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                <span>Mark Vacated / Available</span>
              </button>
            )}
          </div>
        )}

        {/* Reserved Details Banner */}
        {table.status === 'RESERVED' && (
          <div className="my-3 px-3 py-2 bg-amber-50/90 border border-amber-200/80 rounded-xl text-xs text-amber-950 flex items-center justify-between">
            <span className="font-semibold text-[11px]">Table Reserved</span>
            {onStatusChange && (
              <button
                type="button"
                onClick={() => onStatusChange(table.id, 'OCCUPIED')}
                className="text-[10px] font-bold text-amber-900 underline hover:text-amber-700 cursor-pointer"
              >
                Seat Guests →
              </button>
            )}
          </div>
        )}

        {/* Admin Quick Status Change Dropdown */}
        <div className="mt-3 pt-2 border-t border-neutral-100/80">
          <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1">
            Change Status (Admin Control):
          </label>
          <select
            value={table.status}
            onChange={(e) => onStatusChange && onStatusChange(table.id, e.target.value as TableStatus)}
            aria-label={`Change status for Table ${table.tableNumber}`}
            className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-white focus:bg-white text-neutral-800 focus:outline-none focus:border-amber-600 transition-colors cursor-pointer"
          >
            <option value="AVAILABLE">🟢 AVAILABLE (Free)</option>
            <option value="OCCUPIED">🔴 OCCUPIED (Seated/Booked)</option>
            <option value="RESERVED">🟡 RESERVED (Pre-booked)</option>
            <option value="INACTIVE">⚪ INACTIVE (Maintenance)</option>
          </select>
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center gap-2">
        <button
          onClick={() => onViewQR(table)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <QrCode className="w-3.5 h-3.5 text-amber-400" />
          <span>View QR</span>
        </button>
        <button
          onClick={() => onEdit(table)}
          className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors border border-neutral-200 cursor-pointer"
          title="Edit Table"
          aria-label={`Edit Table ${table.tableNumber}`}
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
