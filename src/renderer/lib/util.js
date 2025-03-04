// Makes PGP error messages user friendly
export function friendlyError (error) {
  return error.message.slice(
    error.message.lastIndexOf('Error'),
    error.message.length
  )
}
// Makes a deep clone of an object
export function clone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

// Generates a hash code for a string
export function hashCode (string) {
  for (var i = 0, h = 0; i < string.length; i++)
    h = (Math.imul(31, h) + string.charCodeAt(i)) | 0
  return h
}
