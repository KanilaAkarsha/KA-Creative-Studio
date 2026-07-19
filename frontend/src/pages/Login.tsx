import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, Loader2 } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';
import { useAuth } from '../context/AuthContext';
import { loginSchema, type LoginValues } from '../lib/validation';
import type { AuthUser } from '../types';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const from = (location.state as { from?: string } | null)?.from;

  const goAfterLogin = (user: AuthUser) => {
    navigate(from || (user.role === 'admin' ? '/admin' : '/account'), { replace: true });
  };

  const onSubmit = async (values: LoginValues) => {
    setServerError(null);
    try {
      const user = await login(values.email, values.password);
      goAfterLogin(user);
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Invalid email or password';
      setServerError(message);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Log in to manage your account and downloads"
      footer={
        <>
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {serverError && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {serverError}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium dark:text-txt-primary text-txt-dark mb-2">
            Email Address
          </label>
          <input
            type="email"
            placeholder="john@example.com"
            {...register('email')}
            className="form-input w-full px-4 py-3.5 rounded-xl dark:bg-dark-surface bg-light-surface border dark:border-white/10 border-black/10 dark:text-txt-primary text-txt-dark placeholder:dark:text-txt-secondary/50 placeholder:text-txt-muted/50 transition-all duration-300 text-sm"
          />
          {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium dark:text-txt-primary text-txt-dark mb-2">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            {...register('password')}
            className="form-input w-full px-4 py-3.5 rounded-xl dark:bg-dark-surface bg-light-surface border dark:border-white/10 border-black/10 dark:text-txt-primary text-txt-dark placeholder:dark:text-txt-secondary/50 placeholder:text-txt-muted/50 transition-all duration-300 text-sm"
          />
          {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-glow w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Logging in...</span>
            </>
          ) : (
            <>
              <span>Log In</span>
              <LogIn className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6">
        <GoogleAuthButton onSuccess={goAfterLogin} />
      </div>
    </AuthLayout>
  );
}
