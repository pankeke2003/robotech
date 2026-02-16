const API_BASE_URL = "http://localhost:3000/api";

export const dataService = {
  /**
   * Obtiene la lista de torneos (con paginación y filtros opcionales)
   */
  getTournaments: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/tournaments?${query}`);
      if (!response.ok) throw new Error("Error cargando torneos");
      return await response.json();
    } catch (error) {
      console.error(error);
      return { data: [], total: 0 };
    }
  },

  /**
   * Obtiene la lista de clubes
   */
  getClubs: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/clubs?${query}`);
      if (!response.ok) throw new Error("Error cargando clubes");
      return await response.json();
    } catch (error) {
      console.error(error);
      return { data: [], total: 0 };
    }
  },

  /**
   * Obtiene categorías (si existe el endpoint, asumimos que sí o mockeamos si falla)
   */
  getCategories: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/categories?${query}`, {
        headers: {
          "Authorization": `Bearer ${token || ""}`
        }
      });
      if (!response.ok) return []; // Fallback silencioso
      const data = await response.json();
      console.log({ data });
      return data.data || [];
    } catch {
      return [];
    }
  },

  /**
   * Obtiene noticias
   */
  getNews: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      // Using the real API endpoint we just created in the backend
      const response = await fetch(`${API_BASE_URL}/news?${query}`);

      if (!response.ok) {
        // If the backend isn't running or returns error, throw to trigger fallback
        throw new Error("Error cargando noticias desde API");
      }

      const data = await response.json();
      return data; // Expected { data: [] }
    } catch (error) {
      console.error(error);
      // Fallback mock data only if API fails
      return {
        data: [
          {
            id: 1,
            title: "Torneo Nacional 2026",
            content:
              "Inscripciones abiertas para el evento mas grande del año.",
            image: "https://picsum.photos/seed/news1/800/600",
            created_at: new Date().toISOString(),
          },
          {
            id: 2,
            title: "Nuevas Reglas de Combate",
            content: "Se han actualizado las normativas de seguridad y peso.",
            image: "https://picsum.photos/seed/news2/800/600",
            created_at: new Date().toISOString(),
          },
          {
            id: 3,
            title: "Entrevista al Campeón",
            content: "Conoce los secretos detrás del robot 'Destructor'.",
            image: "https://picsum.photos/seed/news3/800/600",
            created_at: new Date().toISOString(),
          },
        ],
      };
    }
  },
  /**
   * Obtiene usuarios (para conteo de competidores)
   */
  getUsers: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      // Note: This endpoint might require Auth. If 401, we handle carefully in UI.
      const response = await fetch(`${API_BASE_URL}/users?${query}`, {
        headers: {
          // Try to attach token if it exists, though dataService usually just fetches
          // If your auth logic handles appending token globally or we rely on cookie, this is fine.
          // Assuming headers are handled or we try public access.
          // If strict auth is needed, this might return 401 for guests.
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      if (!response.ok) return { data: [], total: 0 };
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return { data: [], total: 0 };
    }
  },

  /**
   * Obtiene los robots de un usuario específico
   */
  getUserRobots: async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/robots?competitor_id=${userId}`, {
        headers: {
          "Authorization": `Bearer ${token || ""}`
        }
      });
      if (!response.ok) throw new Error("Error cargando robots");
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error fetching user robots:", error);
      return [];
    }
  },

  /**
   * Obtiene detalle de un torneo con inscripciones
   */
  getTournamentDetails: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tournaments/${id}`);
      if (!response.ok) throw new Error("Error cargando torneo");
      return await response.json();
    } catch (error) {
      console.error("Error fetching tournament details:", error);
      return null;
    }
  },

  /**
   * Actualiza estado de inscripción (Aprobar/Rechazar)
   */
  updateRegistrationStatus: async (registrationId, status) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/registrations/${registrationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: JSON.stringify({ is_approved: status === "approved" }),
        },
      );
      return await response.json();
    } catch (error) {
      console.error("Error updating registration:", error);
      return { success: false };
    }
  },

  /**
   * Registrarse en un torneo
   */
  registerForTournament: async (tournamentId, robotId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) throw new Error("User not logged in");

      const response = await fetch(`${API_BASE_URL}/tournaments/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          tournament_id: tournamentId,
          robot_id: robotId,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error);
      }
      return await response.json();
    } catch (error) {
      console.error("Error registering:", error);
      throw error;
    }
  },

  /**
   * Iniciar torneo (Solo jueces asignados o admin)
   */
  startTournament: async (tournamentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/start`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token || ""}`,
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al iniciar torneo");
      return data;
    } catch (error) {
      console.error("Error starting tournament:", error);
      throw error;
    }
  },

  /**
   * Confirmar ganador de un combate (Solo jueces asignados o admin)
   */
  confirmWinner: async (matchId, winnerId, victoryType = 'knockout') => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/matches/${matchId}/result`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token || ""}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          winner_id: winnerId,
          victory_type: victoryType
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al confirmar ganador");
      return data;
    } catch (error) {
      console.error("Error confirming winner:", error);
      throw error;
    }
  },

  /**
   * Obtiene el ranking de competidores
   */
  getRankings: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/rankings/competitors?${query}`, {
        headers: {
          "Authorization": `Bearer ${token || ""}`
        }
      });
      if (!response.ok) throw new Error("Error cargando rankings");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching rankings:", error);
      return { data: [], total: 0 };
    }
  },
};
