export interface StickerCategory {
  name: string;
  stickers: string[];
}

// Manually define sticker categories and their images
// This needs to be updated when adding new stickers
export const STICKER_CATEGORIES: StickerCategory[] = [
  {
    name: 'Bán Mình Cho Tư Bản',
    stickers: Array.from({ length: 15 }, (_, i) => 
      `/assets/images/stickers/Bán Mình Cho Tư Bản/${i + 1}.png`
    ),
  },
  {
    name: 'Creative Vibes',
    stickers: Array.from({ length: 13 }, (_, i) => 
      `/assets/images/stickers/Creative Vibes/${i + 1}.png`
    ),
  },
  {
    name: 'Cò Lõ',
    stickers: Array.from({ length: 11 }, (_, i) => 
      `/assets/images/stickers/Cò Lõ/${i + 1}.png`
    ),
  },
  {
    name: 'Mèo Méo',
    stickers: Array.from({ length: 13 }, (_, i) => 
      `/assets/images/stickers/Mèo Méo/${i + 1}.png`
    ),
  },
  {
    name: 'Quàng thượng on the mic',
    stickers: Array.from({ length: 12 }, (_, i) => 
      `/assets/images/stickers/Quàng thượng on the mic/${i + 1}.png`
    ),
  },
];
