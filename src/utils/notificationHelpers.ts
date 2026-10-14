import { TableReservation } from '../types';

/**
 * Plays a pleasant restaurant notification chime using the browser's Web Audio API.
 * Does not require external audio files or network requests.
 */
export const playNotificationChime = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // First tone (587.33 Hz - D5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
    gain1.gain.setValueAtTime(0.15, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.4);

    // Second tone (880 Hz - A5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
    gain2.gain.setValueAtTime(0.18, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 0.65);
  } catch (err) {
    console.warn('Audio chime could not be played:', err);
  }
};

export interface ReservationTimeInfo {
  isWithin30Mins: boolean;
  minutesRemaining: number | null;
  statusLabel: string;
  isToday: boolean;
  urgencyLevel: 'urgent' | 'warning' | 'normal' | 'past';
}

/**
 * Parses time strings like "08:30 PM", "12:00 PM" into hours and minutes
 */
const parseTimeSlot = (timeStr: string): { hours: number; minutes: number } | null => {
  if (!timeStr) return null;
  const match = timeStr.trim().match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return { hours, minutes };
};

/**
 * Calculates whether a reservation is within 30 minutes of now
 */
export const getReservationTimeInfo = (
  res: TableReservation,
  simulatedAlertIds: string[] = []
): ReservationTimeInfo => {
  // If manual simulation active for this reservation
  if (simulatedAlertIds.includes(res.id)) {
    return {
      isWithin30Mins: true,
      minutesRemaining: 18,
      statusLabel: '⚠️ 30-Min Alert: Arriving in ~18 mins',
      isToday: true,
      urgencyLevel: 'urgent',
    };
  }

  const isToday =
    res.reservationDate.toLowerCase().includes('today') ||
    res.reservationDate.toLowerCase().includes(
      new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' }).toLowerCase()
    );

  const parsed = parseTimeSlot(res.timeSlot);
  if (!parsed || !isToday) {
    return {
      isWithin30Mins: false,
      minutesRemaining: null,
      statusLabel: res.reservationDate,
      isToday,
      urgencyLevel: 'normal',
    };
  }

  const now = new Date();
  const slotDate = new Date();
  slotDate.setHours(parsed.hours, parsed.minutes, 0, 0);

  const diffMs = slotDate.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);

  // If between 0 and 30 minutes away
  if (diffMins > 0 && diffMins <= 30) {
    return {
      isWithin30Mins: true,
      minutesRemaining: diffMins,
      statusLabel: `🚨 Arriving in ${diffMins} min${diffMins === 1 ? '' : 's'} (${res.timeSlot})`,
      isToday: true,
      urgencyLevel: 'urgent',
    };
  }

  // If between 30 and 60 minutes away
  if (diffMins > 30 && diffMins <= 60) {
    return {
      isWithin30Mins: false,
      minutesRemaining: diffMins,
      statusLabel: `Upcoming in ${diffMins} mins (${res.timeSlot})`,
      isToday: true,
      urgencyLevel: 'warning',
    };
  }

  // If already at or slightly past reservation time today
  if (diffMins <= 0 && diffMins >= -45) {
    return {
      isWithin30Mins: true,
      minutesRemaining: diffMins,
      statusLabel: `⏰ Due Now (${res.timeSlot}) - Ready for Seating`,
      isToday: true,
      urgencyLevel: 'urgent',
    };
  }

  return {
    isWithin30Mins: false,
    minutesRemaining: diffMins,
    statusLabel: `${res.timeSlot}`,
    isToday: true,
    urgencyLevel: diffMins < -45 ? 'past' : 'normal',
  };
};

/**
 * Creates WhatsApp reminder link for 30-minute advance notification
 */
export const create30MinWhatsAppLink = (
  res: TableReservation,
  restaurantName: string
): string => {
  const cleanPhone = res.customerPhone.replace(/\D/g, '');
  const message = `Namaste ${res.customerName}! 🍽️\n\nThis is a friendly reminder from *${restaurantName}*.\n\nYour Table Pre-Booking is scheduled in *30 minutes*:\n📍 *Table:* Table ${res.tableNumber}\n🕒 *Time:* ${res.timeSlot} (${res.reservationDate})\n👥 *Guests:* ${res.guestsCount} Persons\n💰 *Advance Paid:* ₹${res.feeAmount} (100% credited to your food bill)\n\nYour table has been reserved & prepared. We look forward to welcoming you!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};
