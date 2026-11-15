const STEPS = [
  {
    icon: "ri-shopping-bag-3-line",
    title: "Siparişinizi tamamlayın",
    text: "Sepetinizdeki ürünlerle sipariş oluşturun ve ödeme adımında havale/EFT seçeneğini işaretleyin.",
  },
  {
    icon: "ri-bank-line",
    title: "Hesabı seçip ödemeyi yapın",
    text: "Size uygun banka hesabına, sipariş tutarını internet bankacılığı veya mobil uygulama ile gönderin.",
  },
  {
    icon: "ri-file-text-line",
    title: "Açıklamaya sipariş no yazın",
    text: "Havale açıklama alanına mutlaka sipariş numaranızı ekleyin; eşleştirme bu numarayla yapılır.",
  },
  {
    icon: "ri-mail-send-line",
    title: "Dekontu bize iletin",
    text: "Ödeme dekontunu destek ekibimize gönderin. Ödemeniz onaylandığında siparişiniz kargoya verilir.",
  },
];

export default function PaymentSteps() {
  return (
    <div className="rounded-xl border border-background-200 bg-background-50 p-4">
      <p className="flex items-center gap-2 font-heading text-sm font-bold text-foreground-950">
        <i className="ri-route-line text-base text-primary-700" />
        Havale ile ödeme nasıl yapılır?
      </p>
      <ol className="mt-3 space-y-3">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 font-heading text-[11px] font-bold text-primary-800">
              {index + 1}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground-900">{step.title}</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-foreground-600">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}