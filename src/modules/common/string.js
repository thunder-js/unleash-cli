export const capitalizeFirst = string => `${string[0].toUpperCase()}${string.slice(1)}`
export const camelToKebab = string => string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();