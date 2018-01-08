export const capitalizeFirst = (text: string): string => `${text[0].toUpperCase()}${text.slice(1)}`
export const camelToKebab = (text: string): string => text.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
export const uncapitalizeFirst = (text: string): string => `${text[0].toLowerCase()}${text.slice(1)}`
export const removeSpaces = (text: string): string => text.replace(' ', '')
export const removeHyphen = (text: string): string => text.replace('-', '')
export const toLowerCase = (text: string): string => text && text.toLowerCase() || ''
