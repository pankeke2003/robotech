const API_URL = "http://127.0.0.1:3000/api/clubs";

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
    }
};
