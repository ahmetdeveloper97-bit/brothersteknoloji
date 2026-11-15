export interface AnnouncementItem {
  id: string;
  text: string;
  active: boolean;
}

export interface AnnouncementSettings {
  items: AnnouncementItem[];
}