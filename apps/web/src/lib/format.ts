/**
 * Formata CPF no padrão XXX.XXX.XXX-XX
 */
export function formatCPF(cpf: string): string {
  const numbers = cpf.replace(/\D/g, '')
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

/**
 * Formata CNPJ no padrão XX.XXX.XXX/XXXX-XX
 */
export function formatCNPJ(cnpj: string): string {
  const numbers = cnpj.replace(/\D/g, '')
  return numbers.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    '$1.$2.$3/$4-$5'
  )
}

/**
 * Formata CPF ou CNPJ automaticamente
 */
export function formatCpfCnpj(value: string): string {
  if (!value) return '-'

  const numbers = value.replace(/\D/g, '')

  if (numbers.length <= 11) {
    return formatCPF(numbers)
  }

  return formatCNPJ(numbers)
}

/**
 * Formata telefone no padrão (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 */
export function formatPhone(phone: string): string {
  if (!phone) return '-'

  const numbers = phone.replace(/\D/g, '')

  if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  if (numbers.length === 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }

  return phone
}

/**
 * Formata CEP no padrão XXXXX-XXX
 */
export function formatCEP(cep: string): string {
  if (!cep) return '-'

  const numbers = cep.replace(/\D/g, '')
  return numbers.replace(/(\d{5})(\d{3})/, '$1-$2')
}
