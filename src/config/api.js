/**
 * Configuración centralizada de la API.
 * La URL base se lee desde la variable de entorno VITE_API_BASE_URL.
 * Para cambiar el servidor, basta con modificar el archivo .env.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Construye una URL completa del servidor (sin el sufijo /api).
 * Útil para assets como imágenes de perfil que están servidos
 * directamente por el backend.
 * @param {string} path - Ruta relativa del recurso (ej: /uploads/avatar.png)
 * @returns {string} URL completa del servidor
 */
export const getServerUrl = (path) => {
    const base = API_BASE_URL.replace(/\/api\/?$/, '');
    return `${base}${path}`;
};
