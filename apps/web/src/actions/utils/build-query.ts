interface BuildQueryParams {
  execute: string
  parameters?: Record<string, any>
  fields: string[]
}

export function buildQuery({ execute, parameters, fields }: BuildQueryParams) {
  const paramsString = parameters
    ? Object.entries(parameters)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join(', ')
    : ''

  const fieldsString = fields.join(' ')

  const executeWithParams = paramsString ? `${execute}(${paramsString})` : execute

  return `
    query {
      ${executeWithParams} {
        ${fieldsString}
      }
    }
  `
}