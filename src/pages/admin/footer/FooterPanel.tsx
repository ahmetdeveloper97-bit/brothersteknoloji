import { useEffect, useMemo, useState } from "react";
import { Banner, Field, Panel, Pill, Toggle, inputClass, textareaClass } from "@/components/base/AdminUI";
import { useStoreCategories } from "@/hooks/useStoreCategories";
import {
  SOCIAL_PLATFORMS,
  fetchFooterSettings,
  getFooterSettings,
  saveFooterSettings,
  socialMeta,
} from "@/lib/siteSettings";
import type { FooterGroup, FooterLink, FooterSettings, FooterSocial, SocialPlatform } from "@/types/admin";

const newId = (prefix: string): string =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

interface FooterPanelProps {
  onNavigate?: (id: string) => void;
}

export default function FooterPanel({ onNavigate }: FooterPanelProps) {
  const [saved, setSaved] = useState<FooterSettings>(() => getFooterSettings());
  const [draft, setDraft] = useState<FooterSettings>(saved);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { roots } = useStoreCategories();

  useEffect(() => {
    let active = true;
    void fetchFooterSettings().then((next) => {
      if (!active) return;
      setSaved(next);
      setDraft(next);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

  const previewLinks = (group: FooterGroup): Array<{ id: string; label: string }> =>
    group.useCategoryLinks && roots.length > 0
      ? roots.slice(0, 6).map((category) => ({ id: category.slug, label: category.name }))
      : group.links.slice(0, 6).map((link) => ({ id: link.id, label: link.label }));

  const patch = (changes: Partial<FooterSettings>) => {
    setDraft((current) => ({ ...current, ...changes }));
    setToast("");
  };

  const patchGroup = (groupId: string, changes: Partial<FooterGroup>) => {
    setDraft((current) => ({
      ...current,
      groups: current.groups.map((group) => (group.id === groupId ? { ...group, ...changes } : group)),
    }));
    setToast("");
  };

  const patchGroupLink = (groupId: string, linkId: string, changes: Partial<FooterLink>) => {
    setDraft((current) => ({
      ...current,
      groups: current.groups.map((group) =>
        group.id === groupId
          ? { ...group, links: group.links.map((link) => (link.id === linkId ? { ...link, ...changes } : link)) }
          : group,
      ),
    }));
    setToast("");
  };

  const addGroupLink = (groupId: string) => {
    setDraft((current) => ({
      ...current,
      groups: current.groups.map((group) =>
        group.id === groupId
          ? { ...group, links: [...group.links, { id: newId("lnk"), label: "Yeni Link", url: "/kategoriler" }] }
          : group,
      ),
    }));
    setToast("");
  };

  const removeGroupLink = (groupId: string, linkId: string) => {
    setDraft((current) => ({
      ...current,
      groups: current.groups.map((group) =>
        group.id === groupId ? { ...group, links: group.links.filter((link) => link.id !== linkId) } : group,
      ),
    }));
    setToast("");
  };

  const addGroup = () => {
    setDraft((current) => ({
      ...current,
      groups: [
        ...current.groups,
        {
          id: newId("grp"),
          title: "Yeni Kolon",
          useCategoryLinks: false,
          links: [{ id: newId("lnk"), label: "Yeni Link", url: "/kategoriler" }],
        },
      ],
    }));
    setToast("");
  };

  const removeGroup = (groupId: string) => {
    setDraft((current) => ({ ...current, groups: current.groups.filter((group) => group.id !== groupId) }));
    setToast("");
  };

  const moveGroup = (groupId: string, direction: -1 | 1) => {
    setDraft((current) => {
      const index = current.groups.findIndex((group) => group.id === groupId);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.groups.length) return current;
      const groups = [...current.groups];
      [groups[index], groups[target]] = [groups[target], groups[index]];
      return { ...current, groups };
    });
    setToast("");
  };

  const patchBottomLink = (linkId: string, changes: Partial<FooterLink>) => {
    setDraft((current) => ({
      ...current,
      bottomLinks: current.bottomLinks.map((link) => (link.id === linkId ? { ...link, ...changes } : link)),
    }));
    setToast("");
  };

  const addBottomLink = () => {
    setDraft((current) => ({
      ...current,
      bottomLinks: [...current.bottomLinks, { id: newId("bot"), label: "Yeni Link", url: "/gizlilik-politikasi" }],
    }));
    setToast("");
  };

  const removeBottomLink = (linkId: string) => {
    setDraft((current) => ({
      ...current,
      bottomLinks: current.bottomLinks.filter((link) => link.id !== linkId),
    }));
    setToast("");
  };

  const patchSocial = (socialId: string, changes: Partial<FooterSocial>) => {
    setDraft((current) => ({
      ...current,
      socials: current.socials.map((social) => (social.id === socialId ? { ...social, ...changes } : social)),
    }));
    setToast("");
  };

  const addSocial = () => {
    setDraft((current) => ({
      ...current,
      socials: [...current.socials, { id: newId("soc"), platform: "instagram" as SocialPlatform, url: "" }],
    }));
    setToast("");
  };

  const removeSocial = (socialId: string) => {
    setDraft((current) => ({ ...current, socials: current.socials.filter((social) => social.id !== socialId) }));
    setToast("");
  };

  const save = async () => {
    if (saving) return;
    setSaving(true);
    setError("");
    const result = await saveFooterSettings(draft);
    setSaving(false);
    if (!result.ok) {
      setError(result.message ?? "Footer bilgileri kaydedilemedi.");
      return;
    }
    const next = getFooterSettings();
    setSaved(next);
    setDraft(next);
    setToast("Footer bilgileri kaydedildi. Artık tüm cihazlarda aynı görünecek.");
    window.setTimeout(() => setToast(""), 3500);
  };

  const reset = () => {
    setDraft(saved);
    setError("");
    setToast("Değişiklikler geri alındı.");
    window.setTimeout(() => setToast(""), 2500);
  };

  return (
    <div className="space-y-4">
      {toast && (
        <div className="flex items-center gap-2 rounded-lg border border-accent-300 bg-accent-50 px-3 py-2.5 text-xs text-accent-900">
          <i className="ri-checkbox-circle-line" />
          {toast}
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-secondary-300 bg-secondary-50 px-3 py-2.5 text-xs text-secondary-950">
          <i className="ri-error-warning-line mt-0.5" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 rounded-lg border border-background-200 bg-background-100 px-3 py-2.5 text-xs text-foreground-600">
          <i className="ri-loader-4-line animate-spin" />
          Sunucudaki güncel footer bilgileri yükleniyor...
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <Panel
            title="Marka & İletişim Bilgileri"
            subtitle="Footer'ın üst bölümünde görünen açıklama ve iletişim kanalları"
            icon="ri-layout-bottom-line"
          >
            <div className="space-y-3">
              <Field label="Marka açıklaması" hint="Footer sol kolonda, logo altında görünür.">
                <textarea
                  value={draft.description}
                  onChange={(event) => patch({ description: event.target.value })}
                  rows={3}
                  maxLength={320}
                  className={textareaClass}
                />
              </Field>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Telefon">
                  <input
                    value={draft.phone}
                    onChange={(event) => patch({ phone: event.target.value })}
                    className={inputClass}
                    placeholder="0850 222 00 11"
                  />
                </Field>
                <Field label="E-posta">
                  <input
                    type="email"
                    value={draft.email}
                    onChange={(event) => patch({ email: event.target.value })}
                    className={inputClass}
                    placeholder="destek@brothersteknoloji.com"
                  />
                </Field>
                <Field label="Kısayol link adı">
                  <input
                    value={draft.trackingLabel}
                    onChange={(event) => patch({ trackingLabel: event.target.value })}
                    className={inputClass}
                    placeholder="Kargo Takibi"
                  />
                </Field>
                <Field label="Kısayol link adresi">
                  <input
                    value={draft.trackingUrl}
                    onChange={(event) => patch({ trackingUrl: event.target.value })}
                    className={inputClass}
                    placeholder="/kargo-takip"
                  />
                </Field>
              </div>
              <Field label="Adres" hint="Footer'da tıklanınca Google Haritalar'da açılan adres satırı.">
                <textarea
                  value={draft.address}
                  onChange={(event) => patch({ address: event.target.value })}
                  rows={2}
                  maxLength={200}
                  className={textareaClass}
                  placeholder="Maslak Mah. Büyükdere Cad. No: 255, Sarıyer / İstanbul"
                />
              </Field>
              <Field label="Güven notu" hint="Ödeme logolarının altında küçük yazı olarak gösterilir.">
                <input
                  value={draft.trustNote}
                  onChange={(event) => patch({ trustNote: event.target.value })}
                  className={inputClass}
                  maxLength={120}
                />
              </Field>
            </div>
          </Panel>

          <Panel
            title="Sosyal Medya"
            subtitle="Footer'da marka açıklamasının altında ikon olarak görünür"
            icon="ri-share-line"
            action={
              <button
                type="button"
                onClick={addSocial}
                className="flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-3 text-[11px] font-semibold text-background-50 hover:bg-primary-700"
              >
                <i className="ri-add-line" />
                Hesap Ekle
              </button>
            }
          >
            <div className="space-y-2">
              {draft.socials.map((social) => (
                <div key={social.id} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2 sm:w-48">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background-100 text-primary-800">
                      <i className={`${socialMeta(social.platform).icon} text-base`} />
                    </span>
                    <select
                      value={social.platform}
                      onChange={(event) =>
                        patchSocial(social.id, { platform: event.target.value as SocialPlatform })
                      }
                      className="h-9 min-w-0 flex-1 rounded-lg border border-background-300 bg-background-50 px-2 text-xs text-foreground-900 outline-none focus:border-primary-500"
                    >
                      {SOCIAL_PLATFORMS.map((platform) => (
                        <option key={platform.id} value={platform.id}>
                          {platform.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    value={social.url}
                    onChange={(event) => patchSocial(social.id, { url: event.target.value })}
                    className="h-9 min-w-0 flex-1 rounded-lg border border-background-300 bg-background-50 px-3 text-xs text-foreground-700 outline-none focus:border-primary-500"
                    placeholder={socialMeta(social.platform).placeholder}
                  />
                  <button
                    type="button"
                    onClick={() => removeSocial(social.id)}
                    aria-label="Sosyal medya hesabını sil"
                    className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-background-300 text-foreground-600 hover:bg-background-200 hover:text-foreground-950"
                  >
                    <i className="ri-close-line" />
                  </button>
                </div>
              ))}
              {draft.socials.length === 0 && (
                <p className="text-[11px] text-foreground-500">
                  Henüz sosyal medya hesabı eklenmedi. Adres boş bırakılan hesaplar footer'da gizlenir.
                </p>
              )}
            </div>
          </Panel>

          <Panel
            title="Link Kolonları"
            subtitle="Footer'daki başlıklı link gruplarını yönetin"
            icon="ri-links-line"
            action={
              <button
                type="button"
                onClick={addGroup}
                className="flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-3 text-[11px] font-semibold text-background-50 hover:bg-primary-700"
              >
                <i className="ri-add-line" />
                Kolon Ekle
              </button>
            }
          >
            <div className="space-y-3">
              {draft.groups.map((group, groupIndex) => (
                <div key={group.id} className="rounded-lg border border-background-200 bg-background-100 p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      value={group.title}
                      onChange={(event) => patchGroup(group.id, { title: event.target.value })}
                      className="h-9 min-w-0 flex-1 rounded-lg border border-background-300 bg-background-50 px-3 text-sm font-semibold text-foreground-900 outline-none focus:border-primary-500"
                      placeholder="Kolon başlığı"
                    />
                    <Pill tone={group.useCategoryLinks ? "info" : "neutral"}>
                      {group.useCategoryLinks ? "Kategoriler" : `${group.links.length} link`}
                    </Pill>
                    <button
                      type="button"
                      onClick={() => moveGroup(group.id, -1)}
                      disabled={groupIndex === 0}
                      aria-label="Yukarı taşı"
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border border-background-300 ${
                        groupIndex === 0
                          ? "cursor-not-allowed text-foreground-300"
                          : "cursor-pointer text-foreground-600 hover:bg-background-200"
                      }`}
                    >
                      <i className="ri-arrow-up-line" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveGroup(group.id, 1)}
                      disabled={groupIndex === draft.groups.length - 1}
                      aria-label="Aşağı taşı"
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border border-background-300 ${
                        groupIndex === draft.groups.length - 1
                          ? "cursor-not-allowed text-foreground-300"
                          : "cursor-pointer text-foreground-600 hover:bg-background-200"
                      }`}
                    >
                      <i className="ri-arrow-down-line" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeGroup(group.id)}
                      aria-label="Kolonu sil"
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-background-300 text-foreground-600 hover:bg-background-200 hover:text-foreground-950"
                    >
                      <i className="ri-delete-bin-line" />
                    </button>
                  </div>

                  <div className="mt-2.5">
                    <Toggle
                      checked={group.useCategoryLinks}
                      onChange={(value) => patchGroup(group.id, { useCategoryLinks: value })}
                      label="Popüler kategorileri otomatik listele"
                      description="Açıkken bu kolon mağaza kategorilerinden ilk 6 tanesini gösterir, elle girilen linkler yok sayılır."
                    />
                  </div>

                  {!group.useCategoryLinks && (
                    <div className="mt-2.5 space-y-2">
                      {group.links.map((link) => (
                        <div key={link.id} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                          <input
                            value={link.label}
                            onChange={(event) => patchGroupLink(group.id, link.id, { label: event.target.value })}
                            className="h-9 min-w-0 flex-1 rounded-lg border border-background-300 bg-background-50 px-3 text-xs text-foreground-900 outline-none focus:border-primary-500"
                            placeholder="Link adı"
                          />
                          <input
                            value={link.url}
                            onChange={(event) => patchGroupLink(group.id, link.id, { url: event.target.value })}
                            className="h-9 min-w-0 flex-1 rounded-lg border border-background-300 bg-background-50 px-3 text-xs text-foreground-600 outline-none focus:border-primary-500"
                            placeholder="/gizlilik-politikasi"
                          />
                          <button
                            type="button"
                            onClick={() => removeGroupLink(group.id, link.id)}
                            aria-label="Linki sil"
                            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-background-300 text-foreground-600 hover:bg-background-200 hover:text-foreground-950"
                          >
                            <i className="ri-close-line" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addGroupLink(group.id)}
                        className="flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-dashed border-background-400 px-3 text-[11px] font-semibold text-foreground-600 hover:bg-background-200"
                      >
                        <i className="ri-add-line" />
                        Bu kolona link ekle
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {draft.groups.length === 0 && (
                <Banner tone="warning">Henüz link kolonu yok. Footer'da kolon görünmesi için en az bir kolon ekleyin.</Banner>
              )}
            </div>
          </Panel>

          <Panel
            title="Alt Bilgi Çubuğu"
            subtitle="Telif metni, altyapı sağlayıcı ve alt linkler"
            icon="ri-copyright-line"
          >
            <div className="space-y-3">
              <Field label="Telif hakkı metni">
                <input
                  value={draft.copyrightText}
                  onChange={(event) => patch({ copyrightText: event.target.value })}
                  className={inputClass}
                  maxLength={140}
                />
              </Field>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Altyapı sağlayıcı adı" hint="Boş bırakılırsa bu bölüm gizlenir.">
                  <input
                    value={draft.providerLabel}
                    onChange={(event) => patch({ providerLabel: event.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Altyapı sağlayıcı adresi">
                  <input
                    value={draft.providerUrl}
                    onChange={(event) => patch({ providerUrl: event.target.value })}
                    className={inputClass}
                    placeholder="https://artsoftware.com.tr"
                  />
                </Field>
              </div>

              <div className="h-px bg-background-200" />

              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-foreground-700">Alt linkler</p>
                <button
                  type="button"
                  onClick={addBottomLink}
                  className="flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-background-100 px-3 text-[11px] font-semibold text-foreground-700 hover:bg-background-200"
                >
                  <i className="ri-add-line" />
                  Link Ekle
                </button>
              </div>

              <div className="space-y-2">
                {draft.bottomLinks.map((link) => (
                  <div key={link.id} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                      value={link.label}
                      onChange={(event) => patchBottomLink(link.id, { label: event.target.value })}
                      className="h-9 min-w-0 flex-1 rounded-lg border border-background-300 bg-background-50 px-3 text-xs text-foreground-900 outline-none focus:border-primary-500"
                      placeholder="Link adı"
                    />
                    <input
                      value={link.url}
                      onChange={(event) => patchBottomLink(link.id, { url: event.target.value })}
                      className="h-9 min-w-0 flex-1 rounded-lg border border-background-300 bg-background-50 px-3 text-xs text-foreground-600 outline-none focus:border-primary-500"
                      placeholder="/cerez-politikasi"
                    />
                    <button
                      type="button"
                      onClick={() => removeBottomLink(link.id)}
                      aria-label="Alt linki sil"
                      className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-background-300 text-foreground-600 hover:bg-background-200 hover:text-foreground-950"
                    >
                      <i className="ri-close-line" />
                    </button>
                  </div>
                ))}
                {draft.bottomLinks.length === 0 && (
                  <p className="text-[11px] text-foreground-500">Alt link eklenmedi.</p>
                )}
              </div>
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Canlı Önizleme" subtitle="Kaydettiğinizde mağaza footer'ı bu şekilde görünür" icon="ri-eye-line">
            <div className="rounded-lg border border-background-200 bg-background-100 p-3.5">
              <p className="font-heading text-sm font-bold text-foreground-950">{draft.copyrightText}</p>
              <p className="mt-2 line-clamp-4 text-[11px] leading-relaxed text-foreground-600">{draft.description}</p>
              <div className="mt-2.5 space-y-1 text-[11px] text-foreground-600">
                {draft.phone && (
                  <p className="flex items-center gap-1.5">
                    <i className="ri-phone-line" />
                    {draft.phone}
                  </p>
                )}
                {draft.email && (
                  <p className="flex items-center gap-1.5">
                    <i className="ri-mail-line" />
                    {draft.email}
                  </p>
                )}
                {draft.trackingUrl && (
                  <p className="flex items-center gap-1.5">
                    <i className="ri-truck-line" />
                    {draft.trackingLabel}
                  </p>
                )}
                {draft.address && (
                  <p className="flex items-start gap-1.5">
                    <i className="ri-map-pin-line mt-0.5" />
                    <span className="leading-relaxed">{draft.address}</span>
                  </p>
                )}
              </div>
              {draft.socials.some((social) => social.url.trim().length > 0) && (
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  {draft.socials
                    .filter((social) => social.url.trim().length > 0)
                    .map((social) => (
                      <span
                        key={social.id}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-background-300 bg-background-50 text-[11px] text-foreground-600"
                      >
                        <i className={socialMeta(social.platform).icon} />
                      </span>
                    ))}
                </div>
              )}
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {draft.groups.map((group) => (
                <div key={group.id} className="rounded-lg border border-background-200 bg-background-50 p-2.5">
                  <p className="font-heading text-[11px] font-bold text-foreground-900">{group.title}</p>
                  <ul className="mt-1.5 space-y-1">
                    {previewLinks(group).map((item) => (
                      <li key={item.id} className="truncate text-[10px] text-foreground-500">
                        {item.label}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {draft.bottomLinks.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2 border-t border-background-200 pt-2.5">
                {draft.bottomLinks.map((link) => (
                  <span key={link.id} className="text-[10px] text-foreground-500">
                    {link.label}
                  </span>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Kısa Bilgi" icon="ri-information-line">
            <ul className="space-y-2 text-[11px] leading-relaxed text-foreground-600">
              <li className="flex items-start gap-1.5">
                <i className="ri-checkbox-circle-line mt-0.5 text-accent-600" />
                Site içi adresler <code className="rounded bg-background-100 px-1">/</code> ile başlar. Örnek:
                <code className="rounded bg-background-100 px-1">/kargo-takip</code>
              </li>
              <li className="flex items-start gap-1.5">
                <i className="ri-checkbox-circle-line mt-0.5 text-accent-600" />
                Dış bağlantılar <code className="rounded bg-background-100 px-1">https://</code> ile tam adres olarak yazılır.
              </li>
              <li className="flex items-start gap-1.5">
                <i className="ri-checkbox-circle-line mt-0.5 text-accent-600" />
                Kaydettiğinizde bilgiler Supabase'e yazılır; farklı cihaz ve tarayıcılarda aynı footer görünür.
              </li>
              <li className="flex items-start gap-1.5">
                <i className="ri-checkbox-circle-line mt-0.5 text-accent-600" />
                Telefon, e-posta ve adres buradan güncellenince kargo takibi ve yasal sayfalar da aynı bilgiyi gösterir.
              </li>
            </ul>
            <button
              type="button"
              onClick={() => onNavigate?.("settings")}
              className="mt-3 flex w-full cursor-pointer items-center justify-between rounded-lg border border-background-200 bg-background-100 px-3 py-2 text-[11px] font-semibold text-foreground-700 hover:bg-background-200"
            >
              Mağaza ve iletişim ayarları
              <i className="ri-arrow-right-s-line" />
            </button>
          </Panel>
        </div>
      </div>

      <div className="sticky bottom-0 z-10 flex flex-wrap items-center gap-2 rounded-xl border border-background-200 bg-background-50 px-4 py-3 shadow-sm">
        <span className={`text-xs ${dirty ? "text-secondary-800" : "text-foreground-500"}`}>
          {dirty ? "Kaydedilmemiş değişiklikler var." : "Tüm değişiklikler kaydedildi."}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            disabled={!dirty}
            className={`h-9 whitespace-nowrap rounded-lg border border-background-300 px-4 text-xs font-medium ${
              dirty ? "cursor-pointer text-foreground-700 hover:bg-background-100" : "cursor-not-allowed text-foreground-400"
            }`}
          >
            Sıfırla
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-4 text-xs font-semibold text-background-50 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <i className={saving ? "ri-loader-4-line animate-spin" : "ri-save-3-line"} />
            {saving ? "Kaydediliyor..." : "Footer'ı Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}