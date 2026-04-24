import type { Icon } from '@phosphor-icons/react';
import {
  Waves, Bank, ForkKnife, Tree, MusicNotes,
  UsersThree, Heart, Backpack,
  Buildings, Palette, MapPin, ShoppingBag, Coffee,
} from '@phosphor-icons/react';
import type { InterestId } from '@/types/trip';

export const INTEREST_ICONS: Record<InterestId, Icon> = {
  praia:    Waves,
  cultura:  Bank,
  gastro:   ForkKnife,
  natureza: Tree,
  noite:    MusicNotes,
  familia:  UsersThree,
  romance:  Heart,
  solo:     Backpack,
};

export const ACTIVITY_TYPE_ICONS: Record<string, Icon> = {
  Monumento:   Buildings,
  Restaurante: ForkKnife,
  Museu:       Palette,
  Bairro:      MapPin,
  Palácio:     Buildings,
  Igreja:      Buildings,
  Compras:     ShoppingBag,
  Café:        Coffee,
};
