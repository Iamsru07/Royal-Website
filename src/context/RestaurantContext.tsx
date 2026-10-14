import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AdvertisementBanner,
  CartItem,
  Customer,
  FoodCategory,
  FoodItem,
  Order,
  OrderStatus,
  PaymentRecord,
  RestaurantSettings,
  RestaurantTable,
  TableReservation,
  TableStatus,
} from '../types';
import {
  initialAdvertisements,
  initialCustomers,
  initialFoodItems,
  initialOrders,
  initialPayments,
  initialReservations,
  initialSettings,
  initialTables,
  mockCategories,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  isLoggedIn: boolean;
}

interface RestaurantContextType {
  // Food & Categories
  foods: FoodItem[];
  categories: FoodCategory[];
  addFood: (food: Omit<FoodItem, 'id'>) => void;
  updateFood: (id: string, food: Partial<FoodItem>) => void;
  deleteFood: (id: string) => void;
  addCategory: (name: string) => void;
  deleteCategory: (name: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (food: FoodItem, quantity?: number) => void;
  updateCartQuantity: (foodId: string, quantity: number) => void;
  removeFromCart: (foodId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTaxes: number;
  cartTotal: number;
  totalCartItemsCount: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Table
  selectedTable: string;
  setSelectedTable: (table: string) => void;
  tables: RestaurantTable[];
  updateTableStatus: (tableId: string, status: TableStatus) => void;
  addTable: (table: Omit<RestaurantTable, 'id'>) => void;
  editTable: (id: string, table: Partial<RestaurantTable>) => void;
  bookTable: (
    tableNumber: string,
    customerName?: string,
    customerPhone?: string,
    guests?: number
  ) => { success: boolean; message: string };
  vacateTable: (tableId: string) => void;

  // Reservations (Advance Booking with per-booking fee)
  reservations: TableReservation[];
  createReservation: (data: {
    tableNumber: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    guestsCount: number;
    reservationDate: string;
    timeSlot: string;
    specialRequests?: string;
    feeAmount: number;
    paymentMethod: 'UPI' | 'Card' | 'NetBanking';
  }) => TableReservation;
  cancelReservation: (reservationId: string) => void;
  updateReservationStatus: (reservationId: string, status: 'Confirmed' | 'Seated' | 'Completed' | 'Cancelled') => void;
  deleteReservation: (reservationId: string) => void;


  // Orders
  orders: Order[];
  createOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    paymentMethod: 'Cash' | 'Online';
    specialNotes?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;

  // Customers & Payments (User Details)
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id'>) => Customer;
  updateCustomer: (id: string, updated: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  registerUser: (
    name: string,
    phone: string,
    password: string,
    email?: string
  ) => { success: boolean; message: string; customer?: Customer };
  authenticateUser: (
    phone: string,
    password: string
  ) => {
    success: boolean;
    status: 'SUCCESS' | 'USER_NOT_FOUND' | 'WRONG_PASSWORD';
    message: string;
    customer?: Customer;
  };
  payments: PaymentRecord[];

  // Advertisements
  advertisements: AdvertisementBanner[];
  addAdvertisement: (ad: Omit<AdvertisementBanner, 'id'>) => void;
  updateAdvertisement: (id: string, ad: Partial<AdvertisementBanner>) => void;
  deleteAdvertisement: (id: string) => void;
  toggleAdvertisementStatus: (id: string) => void;

  // Settings
  settings: RestaurantSettings;
  updateSettings: (newSettings: Partial<RestaurantSettings>) => void;

  // User Auth Profile
  user: UserProfile;
  loginUser: (phone: string, name?: string) => void;
  logoutUser: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  // Toast
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [foods, setFoods] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem('royal_taste_foods');
    if (saved) {
      try {
        const parsed: FoodItem[] = JSON.parse(saved);
        return parsed.map((item) => {
          const matchInitial = initialFoodItems.find((init) => init.id === item.id);
          return {
            ...item,
            images: (item.images && item.images.length > 1)
              ? item.images
              : (matchInitial?.images || (item.images && item.images.length > 0 ? item.images : [item.imageUrl])),
          };
        });
      } catch (e) {
        return initialFoodItems;
      }
    }
    return initialFoodItems;
  });

  const [categories, setCategories] = useState<FoodCategory[]>(() => {
    const saved = localStorage.getItem('royal_taste_categories');
    return saved ? JSON.parse(saved) : mockCategories;
  });

  const [tables, setTables] = useState<RestaurantTable[]>(() => {
    const saved = localStorage.getItem('royal_taste_tables');
    return saved ? JSON.parse(saved) : initialTables;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('royal_taste_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('royal_taste_customers');
    if (saved) {
      try {
        const parsed: Customer[] = JSON.parse(saved);
        return parsed.map((c) => ({
          ...c,
          password: c.password || 'password123',
          createdAt: c.createdAt || '15 Jan 2026',
        }));
      } catch (e) {
        return initialCustomers;
      }
    }
    return initialCustomers;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('royal_taste_payments');
    return saved ? JSON.parse(saved) : initialPayments;
  });

  const [settings, setSettings] = useState<RestaurantSettings>(() => {
    const saved = localStorage.getItem('royal_taste_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...initialSettings,
          ...parsed,
          reservationFeePerBooking:
            parsed.reservationFeePerBooking !== undefined
              ? Number(parsed.reservationFeePerBooking)
              : initialSettings.reservationFeePerBooking || 99,
        };
      } catch {
        return initialSettings;
      }
    }
    return initialSettings;
  });

  const [advertisements, setAdvertisements] = useState<AdvertisementBanner[]>(() => {
    const saved = localStorage.getItem('royal_taste_advertisements');
    return saved ? JSON.parse(saved) : initialAdvertisements;
  });

  const [reservations, setReservations] = useState<TableReservation[]>(() => {
    const saved = localStorage.getItem('royal_taste_reservations');
    return saved ? JSON.parse(saved) : initialReservations;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('royal_taste_cart');
    return saved ? JSON.parse(saved) : [
      { food: initialFoodItems[0], quantity: 2 }, // Paneer Tikka
      { food: initialFoodItems[13], quantity: 1 }, // Veg Burger
    ];
  });

  const [selectedTable, setSelectedTable] = useState<string>(() => {
    // Check URL search param if present on startup
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tbl = params.get('table');
      if (tbl) return tbl;
    }
    return '12';
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('royal_taste_user');
    return saved
      ? JSON.parse(saved)
      : {
          name: 'Aarav Mehta',
          phone: '+91 98765 43210',
          email: 'aarav.mehta@example.com',
          isLoggedIn: true,
        };
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Local storage synchronization
  useEffect(() => {
    localStorage.setItem('royal_taste_foods', JSON.stringify(foods));
  }, [foods]);

  useEffect(() => {
    localStorage.setItem('royal_taste_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('royal_taste_tables', JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem('royal_taste_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('royal_taste_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('royal_taste_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('royal_taste_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('royal_taste_advertisements', JSON.stringify(advertisements));
  }, [advertisements]);

  useEffect(() => {
    localStorage.setItem('royal_taste_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('royal_taste_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('royal_taste_user', JSON.stringify(user));
  }, [user]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.food.price * item.quantity, 0);
  const cartTaxes = Math.round((cartSubtotal * (settings.taxRatePercent / 100)) * 10) / 10;
  const cartTotal = cartSubtotal + cartTaxes;
  const totalCartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = (food: FoodItem, quantity: number = 1) => {
    if (food.availability === 'OUT OF STOCK') {
      showToast(`${food.name} is currently out of stock`, 'error');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.food.id === food.id);
      if (existing) {
        return prev.map((item) =>
          item.food.id === food.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { food, quantity }];
    });
    showToast(`Added ${food.name} to order ✓`, 'success');
  };

  const updateCartQuantity = (foodId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(foodId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.food.id === foodId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (foodId: string) => {
    const item = cart.find((i) => i.food.id === foodId);
    setCart((prev) => prev.filter((i) => i.food.id !== foodId));
    if (item) {
      showToast(`Removed ${item.food.name} from cart`, 'info');
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  // Food Management
  const addFood = (foodData: Omit<FoodItem, 'id'>) => {
    const newFood: FoodItem = {
      ...foodData,
      id: `f-${Date.now()}`,
    };
    setFoods((prev) => [newFood, ...prev]);
    showToast(`Added "${newFood.name}" to menu`, 'success');
  };

  const updateFood = (id: string, updated: Partial<FoodItem>) => {
    setFoods((prev) => prev.map((f) => (f.id === id ? { ...f, ...updated } : f)));
    showToast('Menu item updated successfully', 'success');
  };

  const deleteFood = (id: string) => {
    const item = foods.find((f) => f.id === id);
    setFoods((prev) => prev.filter((f) => f.id !== id));
    showToast(`Deleted ${item?.name || 'item'}`, 'info');
  };

  const addCategory = (name: string) => {
    const trimmed = name.trim() as FoodCategory;
    if (trimmed && !categories.includes(trimmed)) {
      setCategories((prev) => [...prev, trimmed]);
      showToast(`Category "${trimmed}" created`, 'success');
    }
  };

  const deleteCategory = (name: string) => {
    if (name === 'All') return;
    setCategories((prev) => prev.filter((c) => c !== name));
    showToast(`Category "${name}" removed`, 'info');
  };

  // Helper for matching table numbers ('01' vs '1')
  const matchesTableNumber = (tblNumA: string, tblNumB: string) => {
    if (!tblNumA || !tblNumB) return false;
    if (tblNumA.trim() === tblNumB.trim()) return true;
    const numA = parseInt(tblNumA.replace(/\D/g, ''), 10);
    const numB = parseInt(tblNumB.replace(/\D/g, ''), 10);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA === numB;
    }
    return false;
  };

  // Tables
  const updateTableStatus = (tableId: string, status: TableStatus) => {
    const now = new Date();
    const timeString = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    setTables((prev) =>
      prev.map((tbl) => {
        if (tbl.id === tableId || tbl.tableNumber === tableId || matchesTableNumber(tbl.tableNumber, tableId)) {
          if (status === 'AVAILABLE') {
            return {
              ...tbl,
              status,
              currentOrderId: undefined,
              occupiedSince: undefined,
              bookedByName: undefined,
              bookedByPhone: undefined,
              bookedGuests: undefined,
            };
          } else if (status === 'OCCUPIED') {
            return {
              ...tbl,
              status,
              occupiedSince: tbl.occupiedSince || timeString,
            };
          }
          return { ...tbl, status };
        }
        return tbl;
      })
    );
    showToast(`Table status changed to ${status}`, 'success');
  };

  const vacateTable = (tableId: string) => {
    setTables((prev) =>
      prev.map((tbl) =>
        tbl.id === tableId || tbl.tableNumber === tableId || matchesTableNumber(tbl.tableNumber, tableId)
          ? {
              ...tbl,
              status: 'AVAILABLE' as TableStatus,
              currentOrderId: undefined,
              occupiedSince: undefined,
              bookedByName: undefined,
              bookedByPhone: undefined,
              bookedGuests: undefined,
            }
          : tbl
      )
    );
    showToast('Table vacated and marked AVAILABLE ✓', 'info');
  };

  const bookTable = (
    tableNumber: string,
    customerName?: string,
    customerPhone?: string,
    guests?: number
  ) => {
    const now = new Date();
    const timeString = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const guestName = customerName || user.name || 'Guest Diner';
    const guestPhone = customerPhone || user.phone || '+91 98765 00000';
    const bookingRef = `BOOK-${Math.floor(1000 + Math.random() * 9000)}`;

    setTables((prev) =>
      prev.map((t) => {
        if (t.tableNumber === tableNumber || matchesTableNumber(t.tableNumber, tableNumber)) {
          return {
            ...t,
            status: 'OCCUPIED' as TableStatus,
            currentOrderId: bookingRef,
            occupiedSince: timeString,
            bookedByName: guestName,
            bookedByPhone: guestPhone,
            bookedGuests: guests || t.capacity,
          };
        }
        return t;
      })
    );

    setSelectedTable(tableNumber);
    showToast(`Table ${tableNumber} is booked & marked OCCUPIED in Admin Panel! ✓`, 'success');
    return { success: true, message: `Table ${tableNumber} booked successfully` };
  };

  const addTable = (tableData: Omit<RestaurantTable, 'id'>) => {
    const newTable: RestaurantTable = {
      ...tableData,
      id: `tbl-${Date.now()}`,
    };
    setTables((prev) => [...prev, newTable]);
    showToast(`Table ${newTable.tableNumber} added`, 'success');
  };

  const editTable = (id: string, updated: Partial<RestaurantTable>) => {
    setTables((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
    showToast('Table details saved', 'success');
  };

  // Table Reservations with Advance Per-Booking Fee
  const createReservation = (data: {
    tableNumber: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    guestsCount: number;
    reservationDate: string;
    timeSlot: string;
    specialRequests?: string;
    feeAmount: number;
    paymentMethod: 'UPI' | 'Card' | 'NetBanking';
  }): TableReservation => {
    const resId = `RT-RES-${Math.floor(1000 + Math.random() * 9000)}`;
    const txnRef = `${data.paymentMethod.toUpperCase()}_RES_${Date.now().toString().slice(-6)}`;
    const now = new Date();
    const timeString = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newReservation: TableReservation = {
      id: resId,
      tableNumber: data.tableNumber,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      guestsCount: data.guestsCount,
      reservationDate: data.reservationDate,
      timeSlot: data.timeSlot,
      specialRequests: data.specialRequests,
      feeAmount: data.feeAmount,
      feePaymentStatus: 'Paid',
      paymentMethod: data.paymentMethod,
      transactionRef: txnRef,
      status: 'Confirmed',
      createdAt: timeString,
    };

    setReservations((prev) => [newReservation, ...prev]);

    // Update table status to OCCUPIED in Admin Panel as user requested
    setTables((prev) =>
      prev.map((t) => {
        if (t.tableNumber === data.tableNumber || matchesTableNumber(t.tableNumber, data.tableNumber)) {
          return {
            ...t,
            status: 'OCCUPIED' as TableStatus,
            currentOrderId: resId,
            occupiedSince: `${data.reservationDate} (${data.timeSlot})`,
            bookedByName: data.customerName,
            bookedByPhone: data.customerPhone,
            bookedGuests: data.guestsCount,
          };
        }
        return t;
      })
    );

    // Record advance booking fee payment in Payments ledger
    const newPayment: PaymentRecord = {
      id: `pay-res-${Date.now()}`,
      orderId: resId,
      customerName: data.customerName,
      amount: data.feeAmount,
      method: 'Online',
      status: 'Paid',
      date: timeString,
      transactionRef: txnRef,
    };
    setPayments((prev) => [newPayment, ...prev]);

    setSelectedTable(data.tableNumber);
    showToast(
      `Table ${data.tableNumber} reserved! Advance fee ₹${data.feeAmount} paid & Table marked OCCUPIED. ✓`,
      'success'
    );
    return newReservation;
  };

  const cancelReservation = (reservationId: string) => {
    const res = reservations.find((r) => r.id === reservationId);
    if (res) {
      setReservations((prev) =>
        prev.map((r) => (r.id === reservationId ? { ...r, status: 'Cancelled' as const } : r))
      );
      // Vacate table if occupied/reserved by this reservation
      setTables((prev) =>
        prev.map((t) =>
          (t.tableNumber === res.tableNumber || matchesTableNumber(t.tableNumber, res.tableNumber)) &&
          t.currentOrderId === reservationId
            ? {
                ...t,
                status: 'AVAILABLE' as TableStatus,
                currentOrderId: undefined,
                occupiedSince: undefined,
                bookedByName: undefined,
                bookedByPhone: undefined,
                bookedGuests: undefined,
              }
            : t
        )
      );
      showToast(`Reservation ${reservationId} cancelled and table freed ✓`, 'info');
    }
  };

  const updateReservationStatus = (
    reservationId: string,
    status: 'Confirmed' | 'Seated' | 'Completed' | 'Cancelled'
  ) => {
    const target = reservations.find((r) => r.id === reservationId);
    setReservations((prev) =>
      prev.map((r) => (r.id === reservationId ? { ...r, status } : r))
    );

    if (target) {
      if (status === 'Seated') {
        // Table becomes occupied with reservation guest
        setTables((prev) =>
          prev.map((t) =>
            t.tableNumber === target.tableNumber || matchesTableNumber(t.tableNumber, target.tableNumber)
              ? {
                  ...t,
                  status: 'OCCUPIED' as TableStatus,
                  currentOrderId: reservationId,
                  occupiedSince: `${target.reservationDate} (${target.timeSlot})`,
                  bookedByName: target.customerName,
                  bookedByPhone: target.customerPhone,
                  bookedGuests: target.guestsCount,
                }
              : t
          )
        );
      } else if (status === 'Completed' || status === 'Cancelled') {
        // Free table
        setTables((prev) =>
          prev.map((t) =>
            (t.tableNumber === target.tableNumber || matchesTableNumber(t.tableNumber, target.tableNumber)) &&
            t.currentOrderId === reservationId
              ? {
                  ...t,
                  status: 'AVAILABLE' as TableStatus,
                  currentOrderId: undefined,
                  occupiedSince: undefined,
                  bookedByName: undefined,
                  bookedByPhone: undefined,
                  bookedGuests: undefined,
                }
              : t
          )
        );
      }
    }
    showToast(`Reservation status updated to ${status}`, 'success');
  };

  const deleteReservation = (reservationId: string) => {
    const target = reservations.find((r) => r.id === reservationId);
    setReservations((prev) => prev.filter((r) => r.id !== reservationId));
    if (target) {
      setTables((prev) =>
        prev.map((t) =>
          (t.tableNumber === target.tableNumber || matchesTableNumber(t.tableNumber, target.tableNumber)) &&
          t.currentOrderId === reservationId
            ? {
                ...t,
                status: 'AVAILABLE' as TableStatus,
                currentOrderId: undefined,
                occupiedSince: undefined,
                bookedByName: undefined,
                bookedByPhone: undefined,
                bookedGuests: undefined,
              }
            : t
        )
      );
    }
    showToast(`Reservation ${reservationId} deleted`, 'info');
  };


  // Orders
  const createOrder = (orderData: {
    customerName: string;
    customerPhone: string;
    paymentMethod: 'Cash' | 'Online';
    specialNotes?: string;
  }) => {
    const orderNumber = `RT-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const timeString = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newOrder: Order = {
      id: orderNumber,
      tableNumber: selectedTable,
      customerName: orderData.customerName || user.name || 'Guest Customer',
      customerPhone: orderData.customerPhone || user.phone || '+91 98765 00000',
      items: cart.map((ci) => ({
        foodId: ci.food.id,
        foodName: ci.food.name,
        foodType: ci.food.foodType,
        price: ci.food.price,
        quantity: ci.quantity,
      })),
      subtotal: cartSubtotal,
      taxes: cartTaxes,
      total: cartTotal,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'Online' ? 'Paid' : 'Pending',
      status: 'Received',
      createdAt: timeString,
      estimatedPrepTime: settings.defaultPrepTimeMinutes,
      specialNotes: orderData.specialNotes,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Also update payments
    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      orderId: newOrder.id,
      customerName: newOrder.customerName,
      amount: newOrder.total,
      method: newOrder.paymentMethod,
      status: newOrder.paymentStatus,
      date: timeString,
      transactionRef:
        newOrder.paymentMethod === 'Online'
          ? `UPI_TXN_${Math.floor(1000000 + Math.random() * 9000000)}`
          : `CASH_TBL_${selectedTable}`,
    };
    setPayments((prev) => [newPayment, ...prev]);

    // Mark current table occupied in admin panel
    setTables((prev) =>
      prev.map((t) =>
        t.tableNumber === selectedTable || matchesTableNumber(t.tableNumber, selectedTable)
          ? {
              ...t,
              status: 'OCCUPIED' as TableStatus,
              currentOrderId: newOrder.id,
              occupiedSince: timeString,
              bookedByName: newOrder.customerName,
              bookedByPhone: newOrder.customerPhone,
            }
          : t
      )
    );

    // Empty cart
    clearCart();

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Order #${orderId} marked as ${status}`, 'success');
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId);
  };

  // Advertisements
  const addAdvertisement = (adData: Omit<AdvertisementBanner, 'id'>) => {
    const newAd: AdvertisementBanner = {
      ...adData,
      id: `ad-${Date.now()}`,
    };
    setAdvertisements((prev) => [newAd, ...prev]);
    showToast(`Created promotion "${newAd.title}"`, 'success');
  };

  const updateAdvertisement = (id: string, updated: Partial<AdvertisementBanner>) => {
    setAdvertisements((prev) =>
      prev.map((ad) => (ad.id === id ? { ...ad, ...updated } : ad))
    );
    showToast('Promotion banner updated successfully', 'success');
  };

  const deleteAdvertisement = (id: string) => {
    setAdvertisements((prev) => prev.filter((ad) => ad.id !== id));
    showToast('Promotion banner deleted', 'info');
  };

  const toggleAdvertisementStatus = (id: string) => {
    setAdvertisements((prev) =>
      prev.map((ad) => {
        if (ad.id === id) {
          const nextState = !ad.isActive;
          showToast(
            nextState ? `Activated "${ad.title}"` : `Deactivated "${ad.title}"`,
            'info'
          );
          return { ...ad, isActive: nextState };
        }
        return ad;
      })
    );
  };

  // Settings
  const updateSettings = (newSettings: Partial<RestaurantSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Restaurant settings saved', 'success');
  };

  // Customers & User Details Management
  const addCustomer = (customerData: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: `c-${Date.now()}`,
      createdAt: customerData.createdAt || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    showToast(`User details saved for ${newCustomer.name}`, 'success');
    return newCustomer;
  };

  const updateCustomer = (id: string, updated: Partial<Customer>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
    showToast('User details updated', 'success');
  };

  const deleteCustomer = (id: string) => {
    const item = customers.find((c) => c.id === id);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    showToast(`Removed user ${item?.name || ''}`, 'info');
  };

  // Register new customer / user
  const registerUser = (
    name: string,
    phone: string,
    password: string,
    email?: string
  ): { success: boolean; message: string; customer?: Customer } => {
    const digitsOnly = phone.replace(/\D/g, '').slice(-10);
    if (digitsOnly.length !== 10) {
      return { success: false, message: 'Invalid mobile number. Exactly 10 digits required.' };
    }

    // Check if user already exists with this 10-digit number
    const existing = customers.find((c) => c.phone.replace(/\D/g, '').slice(-10) === digitsOnly);
    if (existing) {
      return {
        success: false,
        message: `An account with mobile number ${digitsOnly} already exists. Please sign in with your password.`,
      };
    }

    const formattedPhone = `+91 ${digitsOnly.slice(0, 5)} ${digitsOnly.slice(5)}`;
    const newCustomer: Customer = {
      id: `c-${Date.now()}`,
      name: name.trim(),
      phone: formattedPhone,
      password: password,
      email: email?.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      totalOrders: 0,
      totalSpend: 0,
      lastOrderDate: 'Just registered',
      status: 'Active',
      createdAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    setCustomers((prev) => [newCustomer, ...prev]);

    // Automatically log user in
    setUser({
      phone: formattedPhone,
      name: newCustomer.name,
      email: newCustomer.email || '',
      isLoggedIn: true,
    });

    showToast(`Account created! Welcome, ${newCustomer.name}`, 'success');
    return { success: true, message: 'Account registered successfully', customer: newCustomer };
  };

  // Authenticate user by 10-digit phone & password
  const authenticateUser = (
    phone: string,
    password: string
  ): {
    success: boolean;
    status: 'SUCCESS' | 'USER_NOT_FOUND' | 'WRONG_PASSWORD';
    message: string;
    customer?: Customer;
  } => {
    const digitsOnly = phone.replace(/\D/g, '').slice(-10);
    if (digitsOnly.length !== 10) {
      return {
        success: false,
        status: 'USER_NOT_FOUND',
        message: 'Invalid mobile number. Please enter exactly 10 digits.',
      };
    }

    const matched = customers.find((c) => c.phone.replace(/\D/g, '').slice(-10) === digitsOnly);
    if (!matched) {
      return {
        success: false,
        status: 'USER_NOT_FOUND',
        message: `No account found with mobile number ${digitsOnly}. Please create an account.`,
      };
    }

    const expectedPassword = matched.password || 'password123';
    if (expectedPassword !== password) {
      return {
        success: false,
        status: 'WRONG_PASSWORD',
        message: 'Incorrect password for this mobile number. Please try again.',
        customer: matched,
      };
    }

    // Success! Log the user in
    setUser({
      phone: matched.phone,
      name: matched.name,
      email: matched.email || '',
      isLoggedIn: true,
    });

    showToast(`Welcome back, ${matched.name}!`, 'success');
    return {
      success: true,
      status: 'SUCCESS',
      message: `Signed in as ${matched.name}`,
      customer: matched,
    };
  };

  // Auth User
  const loginUser = (phone: string, name: string = 'Aarav Mehta') => {
    setUser({
      phone,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      isLoggedIn: true,
    });
    showToast(`Welcome back, ${name}!`, 'success');
  };

  const logoutUser = () => {
    setUser({
      name: 'Guest Diner',
      phone: '',
      email: '',
      isLoggedIn: false,
    });
    showToast('Logged out successfully', 'info');
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...profile }));
    showToast('Profile updated', 'success');
  };

  return (
    <RestaurantContext.Provider
      value={{
        foods,
        categories,
        addFood,
        updateFood,
        deleteFood,
        addCategory,
        deleteCategory,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartTaxes,
        cartTotal,
        totalCartItemsCount,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        selectedTable,
        setSelectedTable,
        tables,
        updateTableStatus,
        addTable,
        editTable,
        bookTable,
        vacateTable,
        reservations,
        createReservation,
        cancelReservation,
        updateReservationStatus,
        deleteReservation,
        orders,
        createOrder,
        updateOrderStatus,
        getOrderById,
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        registerUser,
        authenticateUser,
        payments,
        advertisements,
        addAdvertisement,
        updateAdvertisement,
        deleteAdvertisement,
        toggleAdvertisementStatus,
        settings,
        updateSettings,
        user,
        loginUser,
        logoutUser,
        updateUserProfile,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
