import { getSupabase } from '@/hooks/useXP';

export async function logEvent(name: string, props?: Record<string, any>) {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id ?? null;
  const { error } = await supabase.rpc('log_event', { p_user_id: userId, p_name: name, p_props: props ?? {} });
  if (error) console.warn('log_event error', error.message);
}