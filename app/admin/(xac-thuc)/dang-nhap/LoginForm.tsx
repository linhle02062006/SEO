"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, LogIn, Eye, EyeOff } from "lucide-react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = { ok: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Đang đăng nhập...
        </>
      ) : (
        <>
          <LogIn className="size-4" />
          Đăng nhập
        </>
      )}
    </button>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="mt-8 space-y-5" noValidate>
      {next ? <input type="hidden" name="next" value={next} /> : null}

      {state.message && (
        <div
          role="alert"
          className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {state.message}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-ink-800"
        >
          Email quản trị
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          placeholder="email@congty.vn"
          className="h-11 w-full rounded-lg border border-ink-200 px-3.5 text-sm outline-none transition placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        {state.errors?.email && (
          <p className="mt-1.5 text-xs text-rose-600">{state.errors.email}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-ink-800"
        >
          Mật khẩu
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="h-11 w-full rounded-lg border border-ink-200 px-3.5 pr-11 text-sm outline-none transition placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        {state.errors?.password && (
          <p className="mt-1.5 text-xs text-rose-600">{state.errors.password}</p>
        )}
      </div>

      <SubmitButton />
    </form>
  );
}
