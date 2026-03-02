export async function waitFor(
  assertions: () => void | Promise<void>,
  maxDuration = 1000,
  interval = 10,
): Promise<void> {
  const start = Date.now()

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      await assertions()
      return
    } catch (err) {
      if (Date.now() - start > maxDuration) {
        throw err
      }
      await new Promise((resolve) => setTimeout(resolve, interval))
    }
  }
}
