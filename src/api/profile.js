import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

// ─────────────────────────────────────────────────────────────────────────
// Profile + saved addresses + customer order history.
// All queries RLS-gated by auth.uid() = user_id, so callers only ever see
// their own data.
// ─────────────────────────────────────────────────────────────────────────

const requireSb = () => {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
};

// ─── Profile ────────────────────────────────────────────────────────────

export async function fetchProfile(userId) {
  requireSb();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function upsertProfile(userId, patch) {
  requireSb();
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...patch }, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// ─── Addresses ──────────────────────────────────────────────────────────

export async function listAddresses(userId) {
  requireSb();
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function addAddress(userId, payload) {
  requireSb();
  // If marked default, clear default flag on existing addresses first.
  if (payload.is_default) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', userId);
  }
  const { data, error } = await supabase
    .from('addresses')
    .insert({ user_id: userId, ...payload })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateAddress(userId, id, patch) {
  requireSb();
  if (patch.is_default) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', userId);
  }
  const { data, error } = await supabase
    .from('addresses')
    .update(patch)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteAddress(userId, id) {
  requireSb();
  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
  return { ok: true };
}

// ─── Customer order history ─────────────────────────────────────────────

export async function fetchMyOrders(userId, { limit = 50 } = {}) {
  requireSb();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data ?? [];
}
