'use client'

import { useActionState, useId, useState } from 'react'
import { signInWithCustomToken, signOut } from 'firebase/auth'
import { AlertCircle, Eye, EyeOff, Info, Loader2 } from 'lucide-react'
import {
  adminLoginAction,
  merchantLoginAction,
  completeCustomerPhoneAuth,
  createCustomerPhoneSession,
  type AuthFormState,
} from '@/app/actions/auth'
import { phoneAuth } from '@/lib/firebase/client'
import { sendPhoneOtp } from '@/lib/firebase/phone-otp'
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

type AuthAction = (
  state: AuthFormState,
  formData: FormData,
) => Promise<AuthFormState>

const currentPassword: Field = {
  name: 'password',
  label: 'Password',
  type: 'password',
  autoComplete: 'current-password',
}

const variants = {
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
      {
        name: 'email',
        label: 'Admin email',
        type: 'email',
        autoComplete: 'username',
        inputMode: 'email',
        placeholder: 'admin@zuppio.in',
        autoCapitalize: 'none',
      },
      currentPassword,
    ],
  },
} satisfies Record<
  string,
  { action: AuthAction; submit: string; fields: Field[] }
>

type AuthVariant = 'customer-login' | 'customer-register' | 'merchant' | 'admin'

type AuthFormProps = {
  variant?: AuthVariant
  firebaseReady?: boolean
  mode?: 'signin'
  role?: 'merchant' | 'admin'
}

export function AuthForm({
  variant,
  role,
  firebaseReady = true,
}: AuthFormProps) {
  const resolvedVariant = variant ?? role ?? 'customer-login'

  if (
    resolvedVariant === 'customer-login' ||
    resolvedVariant === 'customer-register'
  ) {
    return (
      <CustomerPhoneForm
        mode={resolvedVariant === 'customer-register' ? 'register' : 'login'}
        firebaseReady={firebaseReady}
      />
    )
  }

  return (
    <StaffPasswordForm
      variant={resolvedVariant}
      firebaseReady={firebaseReady}
    />
  )
}

function CustomerPhoneForm({
  mode,
  firebaseReady,
}: {
  mode: 'login' | 'register'
  firebaseReady: boolean
}) {
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [stage, setStage] = useState<'phone' | 'otp'>('phone')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  

  const baseId = useId()

  async function handleSendOtp() {
    setMessage('')

    const digits = mobile.replace(/\D/g, '').slice(-10)

    if (mode === 'register' && name.trim().length < 2) {
      setMessage('Please enter your full name.')
      return
    }

    if (!/^[6-9]\d{9}$/.test(digits)) {
      setMessage('Enter a valid 10-digit Indian mobile number.')
      return
    }

    if (!firebaseReady) {
      setMessage('Firebase setup is incomplete.')
      return
    }

    setBusy(true)

    try {
      const result = await sendPhoneOtp(`+91${digits}`)
      
      setMobile(digits)
      setStage('otp')
      setMessage('OTP sent. Please check your mobile.')
    } catch (error) {
  console.error('Firebase OTP error:', error)
  const code = (error as { code?: string }).code
  setMessage(
    `OTP error: ${code ?? 'unknown'} — ${
      error instanceof Error ? error.message : 'Please try again.'
    }`
  )

      setMessage(
        code === 'auth/too-many-requests'
          ? 'Too many attempts. Please try again later.'
          : code === 'auth/invalid-phone-number'
            ? 'The mobile number is invalid.'
            : 'Could not send OTP. Check Firebase Phone Authentication settings and try again.',
      )
    } finally {
      setBusy(false)
    }
  }


async function handleVerifyOtp() {
  setMessage('')

  if (!/^\d{6}$/.test(otp)) {
    setMessage('Enter the 6-digit OTP.')
    return
  }

  setBusy(true)

  try {
    const digits = mobile.replace(/\D/g, '').slice(-10)

    const customToken = await verifyPhoneOtp(
      digits,
      otp,
      mode,
      name,
    )

    const credential = await signInWithCustomToken(
      phoneAuth,
      customToken,
    )

    const refreshedToken = await credential.user.getIdToken(true)

    await createCustomerPhoneSession(refreshedToken)
  } catch (error) {
    console.error('MiniMoth OTP error:', error)

    setMessage(
      error instanceof Error
        ? error.message
        : 'OTP verification failed. Please try again.',
    )
    setOtp('')
  } finally {
    setBusy(false)
  }
}


  return (
    <div className="flex flex-col gap-4">
      {!firebaseReady && (
        <p className="rounded-xl bg-secondary p-3 text-sm">
          Firebase setup is required before customer OTP login can work.
        </p>
      )}

      {mode === 'register' && (
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`${baseId}-name`}
            className="text-sm font-semibold"
          >
            Full name
          </label>
          <input
            id={`${baseId}-name`}
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={stage === 'otp' || busy}
            autoComplete="name"
            placeholder="Enter your full name"
            maxLength={80}
            className="h-12 rounded-xl border border-input bg-card px-3 outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={`${baseId}-mobile`}
          className="text-sm font-semibold"
        >
          Mobile number
        </label>

        <div className="flex h-12 items-center rounded-xl border border-input bg-card focus-within:ring-2 focus-within:ring-ring/40">
          <span className="border-r px-3 text-sm font-medium text-muted-foreground">
            +91
          </span>
          <input
            id={`${baseId}-mobile`}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="98765 43210"
            value={mobile}
            onChange={(event) =>
              setMobile(
                event.target.value.replace(/\D/g, '').slice(-10),
              )
            }
            disabled={stage === 'otp' || busy}
            className="h-full w-full rounded-xl bg-transparent px-3 outline-none"
          />
        </div>
      </div>

      {stage === 'otp' && (
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`${baseId}-otp`}
            className="text-sm font-semibold"
          >
            6-digit OTP
          </label>
          <input
            id={`${baseId}-otp`}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="Enter OTP"
            maxLength={6}
            value={otp}
            onChange={(event) =>
              setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))
            }
            className="h-12 rounded-xl border border-input bg-card px-3 tracking-widest outline-none focus:ring-2 focus:ring-ring/40"
          />
          <button
            type="button"
            onClick={() => {
              setStage('phone')
              setOtp('')
              
              setMessage('')
            }}
            disabled={busy}
            className="self-start text-sm font-semibold text-primary hover:underline"
          >
            Change mobile number
          </button>
        </div>
      )}

      {message && (
        <p
          role="status"
          className="flex gap-2 rounded-xl bg-secondary p-3 text-sm leading-relaxed"
        >
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{message}</span>
        </p>
      )}

      {stage === 'phone' ? (
        <button
          type="button"
          onClick={handleSendOtp}
          disabled={busy || !firebaseReady}
          className={cn(buttonVariants(), 'h-12 text-base font-bold')}
        >
          {busy && <Loader2 className="size-4 animate-spin" />}
          {busy ? 'Sending OTP…' : 'Send OTP'}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleVerifyOtp}
          disabled={busy}
          className={cn(buttonVariants(), 'h-12 text-base font-bold')}
        >
          {busy && <Loader2 className="size-4 animate-spin" />}
          {busy ? 'Verifying…' : 'Verify OTP and continue'}
        </button>
      )}

      
    </div>
  )
}

function StaffPasswordForm({
  variant,
  firebaseReady,
}: {
  variant: 'merchant' | 'admin'
  firebaseReady: boolean
}) {
  const config = variants[variant]
  const initialState: AuthFormState = { status: 'idle' }

  const [state, formAction, pending] = useActionState(
    config.action,
    initialState,
  )

  const baseId = useId()

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      {!firebaseReady && (
        <p className="flex gap-2 rounded-xl bg-secondary p-3 text-sm">
          <Info className="size-4 shrink-0" aria-hidden="true" />
          Firebase credentials are not configured.
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
            <AlertCircle
              className="mt-0.5 size-4 shrink-0"
              aria-hidden="true"
            />
          )}
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className={cn(buttonVariants(), 'h-12 text-base font-bold')}
      >
        {pending && (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        )}
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
        <input
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
          required
          className="h-full w-full min-w-0 rounded-xl bg-transparent px-3 text-base outline-none placeholder:text-muted-foreground"
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((value) => !value)}
            className="mr-1 flex size-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
            aria-label={revealed ? 'Hide password' : 'Show password'}
          >
            {revealed ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {field.hint && (
        <p className="text-xs text-muted-foreground">{field.hint}</p>
      )}

      {error && (
        <p className="text-xs font-medium text-destructive">{error}</p>
      )}
    </div>
  )
}
