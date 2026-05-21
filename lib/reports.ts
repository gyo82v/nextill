import type { MenuItem } from "@/firebase/menu";

export function createMenuNameById(menuItems: MenuItem[]) {
  return new Map(menuItems.map((item) => [item.id, item.name]));
}

export function sortItemsSales(
  itemsSales?: Record<string, number> | null
) {
  return itemsSales ? Object.entries(itemsSales).sort((a, b) => b[1] - a[1]) : [];
}