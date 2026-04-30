import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

// ─────────────────────────────────────────────────────────────────────────
// Cart state. Context + useReducer + localStorage. Guest-first — no auth
// required to add items. Persisted under STORAGE_KEY so the cart survives
// reloads. Each line is keyed by `${itemId}:${variant}` (variant optional).
// ─────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'bic-cart-v1';
const CartContext = createContext(null);

const initialState = { items: {} };

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return action.state || initialState;

    case 'ADD': {
      const { key } = action.payload;
      const existing = state.items[key];
      const quantity = existing ? existing.quantity + 1 : 1;
      return {
        ...state,
        items: {
          ...state.items,
          [key]: { ...action.payload, quantity },
        },
      };
    }

    case 'DECREMENT': {
      const existing = state.items[action.key];
      if (!existing) return state;
      if (existing.quantity <= 1) {
        const { [action.key]: _removed, ...rest } = state.items;
        return { ...state, items: rest };
      }
      return {
        ...state,
        items: {
          ...state.items,
          [action.key]: { ...existing, quantity: existing.quantity - 1 },
        },
      };
    }

    case 'REMOVE': {
      const { [action.key]: _removed, ...rest } = state.items;
      return { ...state, items: rest };
    }

    case 'CLEAR':
      return initialState;

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Hydrate once on mount (after first render so SSR-safe).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: 'HYDRATE', state: JSON.parse(raw) });
    } catch {
      // bad JSON — wipe and start fresh
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Persist on every change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or disabled — silent fail */
    }
  }, [state]);

  const value = useMemo(() => {
    const items = Object.values(state.items);
    const itemCount = items.reduce((s, i) => s + i.quantity, 0);
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

    return {
      items,
      itemCount,
      subtotal,
      isEmpty: items.length === 0,
      addItem: (line) => dispatch({ type: 'ADD', payload: line }),
      decrement: (key) => dispatch({ type: 'DECREMENT', key }),
      remove: (key) => dispatch({ type: 'REMOVE', key }),
      clear: () => dispatch({ type: 'CLEAR' }),
      getQuantity: (key) => state.items[key]?.quantity ?? 0,
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
