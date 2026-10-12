import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Loader2, LogIn, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "wouter";
import { getSupabase } from "@/lib/supabase";

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const started = useRef(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void (async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const oauthError = params.get("error_description") || params.get("error");
        if (oauthError) throw new Error(oauthError.replace(/\+/g, " "));
        const code = params.get("code");
        const supabase = await getSupabase();
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        }
        const { data } = await supabase.auth.getSession();
        if (!data.session) throw new Error("Google sign-in did not return a session.");
        window.history.replaceState({}, document.title, "/dashboard");
        setLocation("/dashboard");
      } catch (callbackError) {
        setError(callbackError instanceof Error ? callbackError.message : "Google sign-in could not be completed.");
      }
    })();
  }, [setLocation]);

  return <div className="auth-screen"><div className="auth-card"><Link href="/" className="brand-lockup"><span className="brand-mark"><ShoppingBag size={18} /></span><span>QuickStore</span></Link>{error ? <><div className="auth-icon"><LogIn size={22} /></div><h1>Sign-in didn’t finish.</h1><p>{error}</p><Link href="/dashboard" className="button button-blue button-lg button-wide">Try Google sign-in again</Link><Link href="/" className="auth-back"><ArrowLeft size={14} /> Back to QuickStore home</Link></> : <><div className="auth-icon"><Loader2 size={22} className="spin" /></div><h1>Finishing sign-in…</h1><p>We’re securely setting up your merchant workspace.</p></>}</div></div>;
}
