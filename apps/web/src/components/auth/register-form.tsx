'use client'

import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { type UseFormRegister, type FieldErrors } from 'react-hook-form'

import { type SignUpInput, signUpSchema } from '@/schemas/auth'
import { signUpAction } from '@/actions/auth/sign-up'
import { AuthFormField } from './auth-form-field'
import { SubmitButton } from './submit-button'

export interface RegisterFormViewProps {
  onSubmit: (e?: React.BaseSyntheticEvent) => void
  register: UseFormRegister<SignUpInput>
  errors: FieldErrors<SignUpInput>
  isPending: boolean
  serverError?: string
}

export function RegisterFormView({
  onSubmit,
  register,
  errors,
  isPending,
  serverError,
}: RegisterFormViewProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <AuthFormField
        id="name"
        label="Nome"
        type="text"
        placeholder="Seu nome"
        error={errors.name?.message}
        registration={register('name')}
      />

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

      {serverError && (
        <p className="text-sm text-destructive">{serverError}</p>
      )}

      <SubmitButton
        isPending={isPending}
        label="Criar conta"
        pendingLabel="Criando conta..."
      />
    </form>
  )
}

export function RegisterForm() {
  const { form, handleSubmitWithAction, action } = useHookFormAction(
    signUpAction,
    zodResolver(signUpSchema),
    {
      formProps: {
        defaultValues: {
          name: '',
          email: '',
          password: '',
        },
      },
    },
  )

  return (
    <RegisterFormView
      onSubmit={handleSubmitWithAction}
      register={form.register}
      errors={form.formState.errors}
      isPending={action.isPending}
      serverError={action.result?.serverError}
    />
  )
}
