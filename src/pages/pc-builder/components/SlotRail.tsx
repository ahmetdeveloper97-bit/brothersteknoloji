import type { PcSelection, PcSlot, PcSlotId } from "@/types/pcBuilder";
import { selectedPart } from "@/lib/pcBuilder";

interface SlotRailProps {
  slots: PcSlot[];
  selection: PcSelection;
  activeSlot: PcSlotId;
  issueSlots: string[];
  onSelect: (slot: PcSlotId) => void;
}

const money = (value: number): string => new Intl.NumberFormat("tr-TR").format(Math.round(value));

export default function SlotRail({ slots, selection, activeSlot, issueSlots, onSelect }: SlotRailProps) {
  const filled = slots.filter((slot) => selectedPart(selection, slot.id)).length;
  const percent = Math.round((filled / slots.length) * 100);

  return (
    <aside className="rounded-2xl border border-background-200 bg-background-50 p-3 shadow-sm lg:sticky lg:top-[282px]">
      <div className="flex items-center justify-between px-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-500">Bileşenler</p>
        <span className="rounded-full bg-background-100 px-2 py-0.5 text-[11px] font-semibold text-foreground-700">
          {filled}/{slots.length}
        </span>
      </div>
      <div className="mx-1 mt-2 h-1.5 overflow-hidden rounded-full bg-background-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-700 to-primary-500 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
        {slots.map((slot) => {
          const part = selectedPart(selection, slot.id);
          const active = slot.id === activeSlot;
          const hasIssue = issueSlots.includes(slot.id);
          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => onSelect(slot.id)}
              className={`flex w-[178px] shrink-0 cursor-pointer items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left transition-all lg:w-full lg:min-w-0 ${
                active
                  ? "border-primary-500 bg-primary-50"
                  : hasIssue
                    ? "border-accent-300 bg-accent-50"
                    : "border-transparent hover:bg-background-100"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  part ? "bg-primary-100 text-primary-700" : "bg-background-100 text-foreground-500"
                }`}
              >
                <i className={`${slot.icon} text-[15px]`} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1">
                  <span className="truncate text-[13px] font-semibold text-foreground-900">{slot.name}</span>
                  {slot.required && <span className="text-[10px] font-bold text-accent-600">*</span>}
                </span>
                <span className="block truncate text-[11px] text-foreground-500">
                  {part ? part.name : slot.required ? "Seçim bekliyor" : "Opsiyonel"}
                </span>
                {part && (
                  <span className="mt-0.5 block text-[11px] font-semibold text-primary-700">
                    {money(part.price)} ₺
                  </span>
                )}
              </span>
              {hasIssue ? (
                <i className="ri-error-warning-fill shrink-0 text-sm text-accent-600" />
              ) : part ? (
                <i className="ri-checkbox-circle-fill shrink-0 text-sm text-primary-600" />
              ) : (
                <i className="ri-arrow-right-s-line shrink-0 text-sm text-foreground-400" />
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}