// Requisitos de contraseña para registrarse.
// Quien los hace cumplir de verdad es Supabase (Authentication > Sign In / Providers > Email):
// esto solo avisa antes de enviar el formulario, así que los dos sitios tienen que decir lo mismo.

export const LONGITUD_MINIMA_PASSWORD = 10

const REQUISITOS_PASSWORD = [
    { id: 'longitud', texto: `Al menos ${LONGITUD_MINIMA_PASSWORD} caracteres`, cumple: (password) => password.length >= LONGITUD_MINIMA_PASSWORD },
    { id: 'minuscula', texto: 'Una letra minúscula', cumple: (password) => /[a-z]/.test(password) },
    { id: 'mayuscula', texto: 'Una letra mayúscula', cumple: (password) => /[A-Z]/.test(password) },
    { id: 'numero', texto: 'Un número', cumple: (password) => /\d/.test(password) },
]

// Devuelve cada requisito con si la contraseña lo cumple o no
export function evaluarPassword(password) {
    return REQUISITOS_PASSWORD.map(({ id, texto, cumple }) => ({ id, texto, cumple: cumple(password) }))
}
