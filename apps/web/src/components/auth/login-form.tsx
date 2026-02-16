'use client'

import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { type UseFormRegister, type FieldErrors } from 'react-hook-form'

import { type SignInInput, signInSchema } from '@/schemas/auth'
import { signInAction } from '@/actions/auth/sign-in'
import { AuthFormField } from './auth-form-field'
import { SubmitButton } from './submit-button'

export interface LoginFormViewProps {
  onSubmit: (e?: React.BaseSyntheticEvent) => void
  register: UseFormRegister<SignInInput>
  errors: FieldErrors<SignInInput>
  isPending: boolean
  serverError?: string
}

export function LoginFormView({
  onSubmit,
  register,
  errors,
  isPending,
  serverError,
}: LoginFormViewProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <AuthFormField
        id="email"
        label="E-mail"
        type="email"
        placeholder="seu@email.com"
        error={errors.email?.message}
        registration={register('email')}
      />

      <AuthFormField
        id="password"
        label="Senha"
        type="password"
        placeholder="********"
        error={errors.password?.message}
        registration={register('password')}
      />

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <SubmitButton
        isPending={isPending}
        label="Entrar"
        pendingLabel="Entrando..."
      />
    </form>
  )
}

export function LoginForm() {
  const { form, handleSubmitWithAction, action } = useHookFormAction(
    signInAction,
    zodResolver(signInSchema),
    {
      formProps: {
        defaultValues: {
          email: '',
          password: '',
        },
      },
    }
  )

  return (
    <LoginFormView
      onSubmit={handleSubmitWithAction}
      register={form.register}
      errors={form.formState.errors}
      isPending={action.isPending}
      serverError={action.result?.serverError}
    />
  )
}
