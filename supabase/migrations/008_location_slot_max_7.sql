-- Raise the layout_slot ceiling from 6 to 7 to match the 7-card bento grid.
alter table public.home_location_cards
  drop constraint if exists home_location_cards_layout_slot_check;

alter table public.home_location_cards
  add constraint home_location_cards_layout_slot_check
    check (layout_slot between 1 and 7);
