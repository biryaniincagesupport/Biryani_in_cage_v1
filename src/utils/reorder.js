import { MENU } from '@/data/menu';
import { cartKey } from '@/utils/cart';

// Re-resolve a past order's items against today's MENU.
// - Match by menu_id (id is stable across menu edits).
// - If the dish exists, use today's price for that variant.
// - If a variant's price slot is gone (e.g. half-plate removed), fall
//   back to the existing variant if available.
// - If the dish itself is no longer on the menu, mark as unavailable.
//
// Returns { lines: [...], unavailable: [...] } where lines are ready to
// be passed to addItem() and unavailable lists items the user picked
// that we couldn't restore.

export function rebuildLinesFromOrder(orderItems) {
  const lines = [];
  const unavailable = [];

  for (const it of orderItems ?? []) {
    const menuItem = MENU.find((m) => m.id === it.menu_id);

    if (!menuItem) {
      unavailable.push({ name: it.name, reason: 'no longer on menu' });
      continue;
    }

    // Resolve price: prefer the variant the user originally picked.
    let price;
    let variantId = it.variant ?? null;
    let variantLabel = null;

    if (variantId === 'half') {
      if (menuItem.priceHalf) {
        price = menuItem.priceHalf;
        variantLabel = 'Half';
      } else {
        // half-plate retired since — fall back to full
        price = menuItem.price;
        variantId = null;
        variantLabel = null;
      }
    } else if (variantId === 'full') {
      price = menuItem.price;
      variantLabel = menuItem.priceHalf ? 'Full' : null;
      variantId = menuItem.priceHalf ? 'full' : null;
    } else {
      price = menuItem.price;
    }

    const key = cartKey(menuItem.id, variantId);
    const name = variantLabel ? `${menuItem.name} (${variantLabel})` : menuItem.name;

    // Stack same-key adds by replicating quantity.
    for (let q = 0; q < (it.quantity ?? 1); q++) {
      lines.push({
        key,
        itemId: menuItem.id,
        name,
        price,
        variant: variantId,
        variantLabel,
        veg: menuItem.veg,
      });
    }
  }

  return { lines, unavailable };
}
