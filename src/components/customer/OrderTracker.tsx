import React from 'react';
import { Order, OrderStatus } from '../../types';
import {
  FileCheck2,
  CheckCircle2,
  ChefHat,
  BellRing,
  Utensils,
  Check,
  XCircle,
} from 'lucide-react';

interface OrderTrackerProps {
  order: Order;
}

const steps: { status: OrderStatus; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
  {
    status: 'Received',
    label: 'Order Received',
    description: 'Sent to the kitchen terminal',
    icon: FileCheck2,
  },
  {
    status: 'Confirmed',
    label: 'Kitchen Confirmed',
    description: 'Head chef accepted order',
    icon: CheckCircle2,
  },
  {
    status: 'Preparing',
    label: 'Cooking & Crafting',
    description: 'Fresh ingredients on the fire',
    icon: ChefHat,
  },
  {
    status: 'Ready',
    label: 'Ready for Service',
    description: 'Plated and garnished',
    icon: BellRing,
  },
  {
    status: 'Served',
    label: 'Served to Table',
    description: 'Delivered to Table ' + '12',
    icon: Utensils,
  },
  {
    status: 'Completed',
    label: 'Order Finished',
    description: 'Dining session completed',
    icon: Check,
  },
];

export const OrderTracker: React.FC<OrderTrackerProps> = ({ order }) => {
  if (order.status === 'Cancelled') {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-4">
        <XCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-red-900 font-serif-brand">
            Order Cancelled
          </h4>
          <p className="text-xs text-red-700 mt-1">
            This order was cancelled. If you need any assistance, please speak with our floor manager or request staff.
          </p>
        </div>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex((s) => s.status === order.status);

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 p-6 md:p-8 shadow-xs">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
        <div>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-neutral-400">
            Live Kitchen Tracking
          </span>
          <h3 className="text-lg font-bold text-neutral-900 font-serif-brand">
            Table {order.tableNumber} Progress
          </h3>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-neutral-400 block">Est. Time</span>
          <span className="text-sm font-bold text-amber-700 font-mono">
            {order.estimatedPrepTime} mins
          </span>
        </div>
      </div>

      {/* Visual Step Tracker (Vertical on mobile, horizontal on tablet/desktop) */}
      <div className="relative">
        <div className="hidden md:flex items-center justify-between relative z-10 mb-8">
          {/* Background Track Line */}
          <div className="absolute top-5 left-6 right-6 h-0.5 bg-neutral-200 -z-1" />
          <div
            className="absolute top-5 left-6 h-0.5 bg-amber-600 transition-all duration-500 -z-1"
            style={{
              width: `${Math.max(0, (currentStepIndex / (steps.length - 1)) * 100)}%`,
            }}
          />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step.status}
                className="flex flex-col items-center text-center max-w-[120px]"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-amber-600 text-white ring-4 ring-amber-100 shadow-md scale-110'
                      : isCompleted
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`mt-2 text-xs font-semibold ${
                    isCurrent
                      ? 'text-amber-900'
                      : isCompleted
                      ? 'text-neutral-800'
                      : 'text-neutral-400'
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-[10px] text-neutral-400 mt-0.5 leading-tight">
                  {step.status === 'Served' ? `Delivered to T-${order.tableNumber}` : step.description}
                </span>
              </div>
            );
          })}
        </div>

        {/* Mobile Vertical Tracker */}
        <div className="md:hidden space-y-4 relative pl-8">
          <div className="absolute top-3 bottom-3 left-4 w-0.5 bg-neutral-200 -z-1" />
          <div
            className="absolute top-3 left-4 w-0.5 bg-amber-600 transition-all duration-500 -z-1"
            style={{
              height: `${Math.max(0, (currentStepIndex / (steps.length - 1)) * 100)}%`,
            }}
          />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div key={step.status} className="flex items-start gap-3 relative">
                <div
                  className={`-ml-8 w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    isCurrent
                      ? 'bg-amber-600 text-white ring-4 ring-amber-100 shadow-sm'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4
                    className={`text-xs font-semibold ${
                      isCurrent
                        ? 'text-amber-900'
                        : isCompleted
                        ? 'text-neutral-900'
                        : 'text-neutral-400'
                    }`}
                  >
                    {step.label}
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    {step.status === 'Served' ? `Delivered to Table ${order.tableNumber}` : step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
