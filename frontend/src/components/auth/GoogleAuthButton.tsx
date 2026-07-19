import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import type { AuthUser } from "../../types";

interface GoogleAuthButtonProps {
    onSuccess: (user: AuthUser) => void;
}

declare global {
    interface Window {
        google: any;
    }
}

export default function GoogleAuthButton({
                                             onSuccess,
                                         }: GoogleAuthButtonProps) {
    const { loginWithGoogle } = useAuth();
    const { showToast } = useToast();

    const [loading, setLoading] = useState(false);
    const hiddenButton = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!window.google) return;

        window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,

            callback: async (response: any) => {
                try {
                    setLoading(true);

                    const user = await loginWithGoogle(response.credential);

                    onSuccess(user);
                } catch (err: any) {
                    showToast(
                        err?.response?.data?.message ||
                        "Google sign-in failed.",
                        "error"
                    );
                } finally {
                    setLoading(false);
                }
            },
        });

        window.google.accounts.id.renderButton(hiddenButton.current, {
            theme: "outline",
            size: "large",
            width: 250,
        });
    }, []);

    const handleGoogleClick = () => {
        const btn =
            hiddenButton.current?.querySelector("div[role='button']") as HTMLElement;

        btn?.click();
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-3">
                <div className="h-px flex-1 dark:bg-white/10 bg-black/10" />
                <span className="text-xs dark:text-txt-secondary text-txt-muted">
          or continue with
        </span>
                <div className="h-px flex-1 dark:bg-white/10 bg-black/10" />
            </div>

            {/* Hidden Google button */}
            <div
                ref={hiddenButton}
                style={{
                    position: "absolute",
                    opacity: 0,
                    pointerEvents: "none",
                }}
            />

            {/* Your custom button */}
            <button
                type="button"
                onClick={handleGoogleClick}
                disabled={loading}
                className="btn-glow w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-transparent border-2 border-primary dark:text-white text-black font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Signing in...</span>
                    </>
                ) : (
                    <>
                        <FcGoogle className="w-5 h-5" />
                        <span>Continue with Google</span>
                    </>
                )}
            </button>
        </div>
    );
}