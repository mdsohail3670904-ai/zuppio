'use client'

import { useActionState, useId, useState } from 'react'
import { AlertCircle, Eye, EyeOff, Info, Loader2 } from 'lucide-react'
import {
  adminLoginAction,
  customerLoginAction,
  merchantLoginAction,
  registerCustomerAction,
  type AuthFormState,
} from '@/app/actions/auth'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Field = {
  name: string
  label: string
  type: 'text' | 'tel' | 'email' | 'password'
  autoComplete: string
  placeholder?: string
  inputMode?: 'numeric' | 'email' | 'tel' | 'text'
  prefix?: string
  hint?: string
  autoCapitalize?: 'none' | 'characters' | 'words'
}

const mobileField: Field = {
  name: 'mobile',
  label: 'Mobile number',
  type: 'tel',
  autoComplete: 'tel-national',
  inputMode: 'tel',
  placeholder: '98765 43210',
  prefix: '+91',
}

const currentPassword: Field = {
  name: 'password',
  label: 'Password',
  type: 'password',
  autoComplete: 'current-password',
}

const variants = {
  'customer-register': {
    action: registerCustomerAction,
    submit: 'Create account',
    fields: [
      { name: 'name', label: 'Full name', type: 'text', autoComplete: 'name', placeholder: 'Priya Sharma', autoCapitalize: 'words' },
      mobileField,
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        autoComplete: 'new-password',
        hint: 'At least 8 characters, with a letter and a number.',
      },
      { name: 'confirmPassword', label: 'Confirm password', type: 'password', autoComplete: 'new-password' },
    ],
  },
  'customer-login': {
    action: customerLoginAction,
    submit: 'Log in',
    fields: [mobileField, currentPassword],
  },
  merchant: {
    action: merchantLoginAction,
    submit: 'Log in as merchant',
    fields: [
      {
        name: 'merchantId',
        label: 'Merchant ID',
        type: 'text',
        autoComplete: 'username',
        placeholder: 'ZUP-M-1001',
        autoCapitalize: 'characters',
        hint: 'Issued by Zuppio when your restaurant is approved.',
      },
      currentPassword,
    ],
  },
  admin: {
    action: adminLoginAction,
    submit: 'Log in as admin',
    fields: [
      { name: 'email', label: 'Admin email', type: 'email', autoComplete: 'username', inputMode: 'email', placeholder: 'admin@zuppio.in', autoCapitalize: 'none' },
      currentPassword,
    ],
  },
} satisfies Record<string, { action: unknown; submit: string; fields: Field[] }>

export type AuthVariant = keyof typeof variants

const initialState: AuthFormState = { status: 'idle' }

export function AuthForm({ variant, firebaseReady }: { variant: AuthVariant; firebaseReady: boolean }) {
  const config = variants[variant]
  const [state, formAction, pending] = useActionState(config.action, initialState)
  const baseId = useId()

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      {!firebaseReady && (
        <p className="flex gap-2 rounded-xl bg-secondary p-3 text-sm leading-relaxed text-secondary-foreground">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>
            <strong className="font-semibold">Setup required:</strong> Firebase credentials are not added yet, so this
            form validates input but cannot sign anyone in.
          </span>
        </p>
      )}

      {config.fields.map((field) => (
        <FormField
          key={field.name}
          id={`${baseId}-${field.name}`}
          field={field}
          error={state.fieldErrors?.[field.name]}
          defaultValue={state.values?.[field.name]}
        />
      ))}

      {state.message && (
        <p
          role="alert"
          className={cn(
            'flex gap-2 rounded-xl p-3 text-sm leading-relaxed',
            state.status === 'not_configured'
              ? 'bg-secondary text-secondary-foreground'
              : 'bg-destructive/10 text-destructive',
          )}
        >
          {state.status === 'not_configured' ? (
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          ) : (
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          )}
          {state.message}
        </p>
      )}

      <button type="submit" disabled={pending} className={cn(buttonVariants(), 'h-12 text-base font-bold')}>
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        {pending ? 'Please wait…' : config.submit}
      </button>
    </form>
  )
}

function FormField({
  id,
  field,
  error,
  defaultValue,
}: {
  id: string
  field: Field
  error?: string
  defaultValue?: string
}) {
  const [revealed, setRevealed] = useState(false)
  const isPassword = field.type === 'password'
  const describedBy = [error && `${id}-error`, field.hint && `${id}-hint`].filter(Boolean).join(' ') || undefined

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {field.label}
      </label>
      <div
        className={cn(
          'flex h-12 items-center rounded-xl border bg-card focus-within:ring-3',
          error
            ? 'border-destructive focus-within:ring-destructive/30'
            : 'border-input focus-within:border-ring focus-within:ring-ring/40',
        )}
      >
        {field.prefix && <span className="border-r px-3 text-sm font-medium text-muted-foreground">{field.prefix}</span>}
        <input
          // Remount on server response so restored values replace stale input.
          key={defaultValue}
          id={id}
          name={field.name}
          type={isPassword && revealed ? 'text' : field.type}
          autoComplete={field.autoComplete}
          inputMode={field.inputMode}
          autoCapitalize={field.autoCapitalize}
          placeholder={field.placeholder}
          defaultValue={isPassword ? undefined : defaultValue}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          required
          className="h-full w-full min-w-0 rounded-xl bg-transparent px-3 text-base outline-none placeholder:text-muted-foreground"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            className="mr-1 flex size-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
            aria-label={revealed ? `Hide ${field.label.toLowerCase()}` : `Show ${field.label.toLowerCase()}`}
            aria-pressed={revealed}
          >
            {revealed ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
          </button>
        )}
      </div>
      {field.hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {field.hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
