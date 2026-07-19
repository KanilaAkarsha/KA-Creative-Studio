import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Loader2 } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';
import { useAuth } from '../context/AuthContext';
import { registerSchema, type RegisterValues } from '../lib/validation';
import type { AuthUser } from '../types';

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const goAfterAuth = (user: AuthUser) => {
    navigate(user.role === 'admin' ? '/admin' : '/account', { replace: true });
  };

  const onSubmit = async (values: RegisterValues) => {
    setServerError(null);
    try {
      await registerUser(values.name, values.email, values.password);
      navigate('/account', { replace: true });
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Could not create your account. Please try again.';
      setServerError(message);
    }
  };

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Sign up to purchase and download digital products"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Log in
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
          <label className="block text-sm font-medium dark:text-txt-primary text-txt-dark mb-2">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            {...register('name')}
            className="form-input w-full px-4 py-3.5 rounded-xl dark:bg-dark-surface bg-light-surface border dark:border-white/10 border-black/10 dark:text-txt-primary text-txt-dark placeholder:dark:text-txt-secondary/50 placeholder:text-txt-muted/50 transition-all duration-300 text-sm"
          />
          {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name.message}</p>}
        </div>

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
            placeholder="At least 8 characters"
            {...register('password')}
            className="form-input w-full px-4 py-3.5 rounded-xl dark:bg-dark-surface bg-light-surface border dark:border-white/10 border-black/10 dark:text-txt-primary text-txt-dark placeholder:dark:text-txt-secondary/50 placeholder:text-txt-muted/50 transition-all duration-300 text-sm"
          />
          {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium dark:text-txt-primary text-txt-dark mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Repeat your password"
            {...register('confirmPassword')}
            className="form-input w-full px-4 py-3.5 rounded-xl dark:bg-dark-surface bg-light-surface border dark:border-white/10 border-black/10 dark:text-txt-primary text-txt-dark placeholder:dark:text-txt-secondary/50 placeholder:text-txt-muted/50 transition-all duration-300 text-sm"
          />
          {errors.confirmPassword && (
            <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-glow w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Sign Up</span>
              <UserPlus className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6">
        <GoogleAuthButton onSuccess={goAfterAuth} />
      </div>
    </AuthLayout>
  );
}
