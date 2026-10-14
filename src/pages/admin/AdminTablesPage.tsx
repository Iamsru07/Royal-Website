import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Grid, QrCode, CheckCircle2, AlertCircle, Bookmark, Sparkles, RefreshCw } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { TableCard } from '../../components/admin/TableCard';
import { RestaurantTable, TableStatus } from '../../types';
import { Modal } from '../../components/common/Modal';
import { QRCodePlaceholder } from '../../components/common/QRCodePlaceholder';

export const AdminTablesPage: React.FC = () => {
  const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
  const { tables, addTable, editTable, updateTableStatus, vacateTable, reservations, updateReservationStatus, showToast } = useRestaurant();

  const [activeTabFilter, setActiveTabFilter] = useState<'All' | TableStatus>('All');
  const [selectedQRTable, setSelectedQRTable] = useState<RestaurantTable | null>(null);
  const [editingTable, setEditingTable] = useState<RestaurantTable | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [tableNumber, setTableNumber] = useState('');
  const [capacity, setCapacity] = useState('4');
  const [status, setStatus] = useState<TableStatus>('AVAILABLE');

  const openAddModal = () => {
    const nextNum = (tables.length + 1).toString().padStart(2, '0');
    setTableNumber(nextNum);
    setCapacity('4');
    setStatus('AVAILABLE');
    setIsAddModalOpen(true);
  };

  const openEditModal = (tbl: RestaurantTable) => {
    setEditingTable(tbl);
    setTableNumber(tbl.tableNumber);
    setCapacity(tbl.capacity.toString());
    setStatus(tbl.status);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableNumber.trim()) return;

    addTable({
      tableNumber: tableNumber.trim(),
      capacity: parseInt(capacity, 10) || 4,
      status,
    });
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTable) return;

    editTable(editingTable.id, {
      tableNumber: tableNumber.trim(),
      capacity: parseInt(capacity, 10) || 4,
      status,
    });
    setEditingTable(null);
  };

  const availableCount = tables.filter((t) => t.status === 'AVAILABLE').length;
  const occupiedCount = tables.filter((t) => t.status === 'OCCUPIED').length;
  const reservedCount = tables.filter((t) => t.status === 'RESERVED').length;
  const inactiveCount = tables.filter((t) => t.status === 'INACTIVE').length;

  const handleVacateAll = () => {
    if (occupiedCount === 0) {
      showToast('No tables are currently occupied', 'info');
      return;
    }
    tables.forEach((t) => {
      if (t.status === 'OCCUPIED') {
        vacateTable(t.id);
      }
    });
    showToast(`All ${occupiedCount} occupied tables marked as Available ✓`, 'success');
  };

  const filteredTables = tables.filter((t) => {
    if (activeTabFilter === 'All') return true;
    return t.status === activeTabFilter;
  });

  return (
    <>
      <AdminHeader
        title="Table & Floor Management"
        subtitle="Live table booking occupancy, guest seating status & admin controls"
        onMenuToggle={toggleSidebar}
        actions={
          <div className="flex items-center gap-2">
            {occupiedCount > 0 && (
              <button
                onClick={handleVacateAll}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                title="Mark all occupied tables as available"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Vacate All ({occupiedCount})</span>
              </button>
            )}
            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Table</span>
            </button>
          </div>
        }
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Live Seating Stats Overview Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-2xs flex items-center justify-between">
            <div>
              <div className="text-xs text-neutral-500 font-medium">Available (Free)</div>
              <div className="text-2xl font-bold font-serif-brand text-emerald-600 mt-0.5">
                {availableCount}
              </div>
              <div className="text-[10px] text-neutral-400">Ready for booking</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-2xs flex items-center justify-between">
            <div>
              <div className="text-xs text-neutral-500 font-medium">Occupied (Seated)</div>
              <div className="text-2xl font-bold font-serif-brand text-red-600 mt-0.5">
                {occupiedCount}
              </div>
              <div className="text-[10px] text-red-500 font-medium">Booked / Active orders</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <span className="w-3.5 h-3.5 rounded-full bg-red-500 animate-pulse" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-2xs flex items-center justify-between">
            <div>
              <div className="text-xs text-neutral-500 font-medium">Reserved</div>
              <div className="text-2xl font-bold font-serif-brand text-amber-600 mt-0.5">
                {reservedCount}
              </div>
              <div className="text-[10px] text-neutral-400">Pre-booked dining</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Bookmark className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-2xs flex items-center justify-between">
            <div>
              <div className="text-xs text-neutral-500 font-medium">Total Tables</div>
              <div className="text-2xl font-bold font-serif-brand text-neutral-900 mt-0.5">
                {tables.length}
              </div>
              <div className="text-[10px] text-neutral-400">{inactiveCount} inactive / repair</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center font-bold">
              <Grid className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Live Sync Notice */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
            <div>
              <span className="font-bold">Real-time Booking Sync:</span> Jab bhi koi user kisi table se order ya booking karta hai, wo table yahan turant <span className="font-mono font-bold text-red-700 bg-red-100 px-1 py-0.5 rounded">OCCUPIED</span> ho jati hai. Admin kisi bhi samay table card ke status dropdown ya "Mark Vacated" button se status badal sakta hai.
            </div>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-2xl overflow-x-auto no-scrollbar">
            {(['All', 'AVAILABLE', 'OCCUPIED', 'RESERVED', 'INACTIVE'] as const).map(
              (filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveTabFilter(filter)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                    activeTabFilter === filter
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {filter} ({filter === 'All' ? tables.length : tables.filter(t => t.status === filter).length})
                </button>
              )
            )}
          </div>

          <div className="text-xs text-neutral-500 font-mono hidden sm:block">
            {filteredTables.length} Tables Displayed
          </div>
        </div>

        {/* Table Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTables.map((tbl) => (
            <TableCard
              key={tbl.id}
              table={tbl}
              onViewQR={(table) => setSelectedQRTable(table)}
              onEdit={(table) => openEditModal(table)}
              onStatusChange={updateTableStatus}
              onVacate={vacateTable}
            />
          ))}
        </div>

        {/* Advance Table Reservations Ledger */}
        {reservations.length > 0 && (
          <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-neutral-900 font-serif-brand">
                  Customer Advance Table Reservations (Paid Fee Ledger)
                </h3>
              </div>
              <span className="text-xs text-neutral-500 font-medium">
                {reservations.filter((r) => r.status === 'Confirmed').length} Active Bookings
              </span>
            </div>

            <div className="divide-y divide-neutral-100 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-neutral-400 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-2 px-3">Table</th>
                    <th className="py-2 px-3">Guest Name & Phone</th>
                    <th className="py-2 px-3">Seating Date & Slot</th>
                    <th className="py-2 px-3">Advance Fee</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3 text-right">Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {reservations.map((res) => (
                    <tr key={res.id} className="hover:bg-neutral-50/50">
                      <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">
                        Table {res.tableNumber}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-neutral-900">{res.customerName}</div>
                        <div className="text-[11px] text-neutral-500 font-mono">{res.customerPhone}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="text-neutral-800">{res.reservationDate}</div>
                        <div className="text-amber-700 font-semibold text-[11px]">{res.timeSlot} ({res.guestsCount} Guests)</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-mono font-bold text-emerald-700">₹{res.feeAmount}</span>
                        <span className="text-[10px] text-neutral-400 block font-mono">Paid via {res.paymentMethod}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            res.status === 'Confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-neutral-200 text-neutral-700'
                          }`}
                        >
                          {res.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {res.status === 'Confirmed' ? (
                          <button
                            onClick={() => {
                              updateReservationStatus(res.id, 'Completed');
                              updateTableStatus(`tbl-${res.tableNumber}`, 'OCCUPIED');
                            }}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Seat Guest
                          </button>
                        ) : (
                          <span className="text-neutral-400 text-[11px]">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {selectedQRTable && (
        <Modal
          isOpen={!!selectedQRTable}
          onClose={() => setSelectedQRTable(null)}
          title={`Table ${selectedQRTable.tableNumber} QR Code`}
          subtitle="Place this standee on table for customer mobile ordering"
          maxWidth="sm"
        >
          <QRCodePlaceholder tableNumber={selectedQRTable.tableNumber} />
        </Modal>
      )}

      {/* Add Table Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Dining Table"
        subtitle="Configure table number and guest seating capacity"
        maxWidth="md"
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Table Number
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 17"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Seating Capacity (Guests)
            </label>
            <input
              type="number"
              min="1"
              max="20"
              required
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Initial Table Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TableStatus)}
              className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
            >
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="OCCUPIED">OCCUPIED</option>
              <option value="RESERVED">RESERVED</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          <div className="flex gap-2 justify-end pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 bg-neutral-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-xl"
            >
              Save Table
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Table Modal */}
      {editingTable && (
        <Modal
          isOpen={!!editingTable}
          onClose={() => setEditingTable(null)}
          title={`Edit Table ${editingTable.tableNumber}`}
          subtitle="Update floor capacity and operational status"
          maxWidth="md"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Table Number
              </label>
              <input
                type="text"
                required
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Seating Capacity (Guests)
              </label>
              <input
                type="number"
                min="1"
                max="20"
                required
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Table Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TableStatus)}
                className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="OCCUPIED">OCCUPIED</option>
                <option value="RESERVED">RESERVED</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setEditingTable(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 bg-neutral-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-xl"
              >
                Update Table
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};
