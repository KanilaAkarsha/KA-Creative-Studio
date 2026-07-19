import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import type { AuthUser } from '../../types';

interface GoogleAuthButtonProps {
  onSuccess: (user: AuthUser) => void;
}

export default function GoogleAuthButton({ onSuccess }: GoogleAuthButtonProps) {
  const { loginWithGoogle } = useAuth();
  const { showToast } = useToast();

  const handleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      showToast('Google sign-in did not return a credential. Please try again.', 'error');
      return;
    }
    try {
      const user = await loginWithGoogle(response.credential);
      onSuccess(user);
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Google sign-in failed. Please try again.';
      showToast(message, 'error');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 dark:bg-white/10 bg-black/10" />
        <span className="text-xs dark:text-txt-secondary text-txt-muted">or continue with</span>
        <div className="h-px flex-1 dark:bg-white/10 bg-black/10" />
      </div>
      <div className="flex justify-center [&>div]:w-full">
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => showToast("Google sign-in failed.", "error")}
            theme="filled_blue"
            size="large"
            text="signin_with"
            shape="pill"
            width="100%"
        />
      </div>
    </div>
  );
}
