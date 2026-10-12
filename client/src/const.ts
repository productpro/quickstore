import { getSupabase } from "@/lib/supabase";

export const startLogin = async () => {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: "offline", prompt: "select_account" },
      },
    });
    if (error) throw error;
  } catch (error) {
    console.error("[Supabase Auth] Google sign-in failed", error);
    window.alert(error instanceof Error ? error.message : "Google sign-in could not be started.");
  }
};
