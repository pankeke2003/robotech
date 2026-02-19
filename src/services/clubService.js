import { API_BASE_URL } from "../config/api";

const API_URL = `${API_BASE_URL}/clubs`;

export const clubService = {
    /**
     * Crea un nuevo club
     * @param {object} clubData 
     * @param {string} token 
     */
    createClub: async (clubData) => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(clubData),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || data.error || "Error al crear el club");
        return data;
    },

    /**
     * Obtiene la lista de clubes disponibles (Público)
     */
    getClubs: async () => {
        const response = await fetch(`${API_URL}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Error al obtener clubes");
        return data; // Retorna { total: number, data: Club[] }
    },

    /**
     * Solicita unirse a un club
     * @param {number} clubId 
     */
    joinClub: async (clubId) => {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");
        if (!user || !user.id || !token) throw new Error("Debes iniciar sesión para unirse a un club");

        const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                competitor: {
                    club_id: Number(clubId)
                }
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || data.error || "Error al solicitar unirse al club");

        // Actualizar el usuario en el storage para que la UI se entere del cambio de club (aunque esté pendiente)
        const updatedUser = {
            ...user,
            competitor: {
                ...(user.competitor || {}),
                club_id: Number(clubId),
                is_approved: false
            }
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        return data;
    }
};
