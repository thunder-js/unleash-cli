export const externalTypeToInternal = (externalType: string): string => {
  return externalType && externalType.toUpperCase().replace('-', '_') || ''
}
