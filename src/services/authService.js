const API_URL = "http://127.0.0.1:3000/api/auth";

export const authService = {
    /**
     * Inicia sesión en el servidor
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<Object>} Respuesta del servidor con token y usuario
     */
    login: async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, user_password: password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al iniciar sesión");
            }

            // Guardar sesión si es exitoso
            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Cierra sesión
     */
    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },

    /**
     * Obtiene el usuario actual
     */
    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem("user"));
    },

    /**
     * Obtiene el token actual
     */
    getToken: () => {
        return localStorage.getItem("token");
    },

    /**
     * Sube una imagen al servidor
     * @param {File} file 
     */
    uploadUserImage: async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("http://127.0.0.1:3000/api/upload", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) throw new Error("Error al subir la imagen");
        return await response.json();
    },

    /**
     * Actualiza el perfil del usuario
     * @param {number} userId 
     * @param {object} data 
     */
    updateUserProfile: async (userId, data) => {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://127.0.0.1:3000/api/users/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error("Error al actualizar perfil");
        return await response.json();
    },

    /**
     * Solicita un enlace de recuperación de contraseña
     * @param {string} email 
     */
    forgotPassword: async (email) => {
        const response = await fetch(`${API_URL}/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Error al solicitar recuperación");
        return data;
    },

    /**
     * Restablece la contraseña con el token
     * @param {string} token 
     * @param {string} newPassword 
     */
    resetPassword: async (token, newPassword) => {
        const response = await fetch(`${API_URL}/reset-password/${token}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newPassword }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Error al restablecer contraseña");
        return data;
    },

    /**
     * Registra un nuevo usuario
     * @param {object} userData
     */
    register: async (userData) => {
        const response = await fetch(`${API_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        const data = await response.json();
        if (!response.ok) {
            const errorMessage = data.errors ? data.errors.join(", ") : (data.error || "Error al registrarse");
            throw new Error(errorMessage);
        }
        return data;
    }
};
