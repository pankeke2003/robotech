// ✅ tournamentLogic.js — solo lógica JS (sin JSX)
export function setupTournamentLogic() {
  class TournamentBracket {
    constructor() {
      this.container = document.getElementById("tournamentContainer");
      this.canvas = document.getElementById("tournamentCanvas");
      this.matchesContainer = document.getElementById("matchesContainer");
      this.connectionLines = document.getElementById("connectionLines");
      this.winnerDisplay = document.getElementById("winnerDisplay");
      this.zoomInBtn = document.getElementById("zoomIn");
      this.zoomOutBtn = document.getElementById("zoomOut");
      this.resetZoomBtn = document.getElementById("resetZoom");
      this.zoomLevelDisplay = document.getElementById("zoomLevel");

      // Estado
      this.zoom = 1;
      this.pan = { x: 0, y: 0 };
      this.isDragging = false;
      this.dragStart = { x: 0, y: 0 };

      // Constantes
      this.MIN_ZOOM = 0.5;
      this.MAX_ZOOM = 3;
      this.ZOOM_STEP = 0.2;
      this.ROUND_SPACING = 280;
      this.MATCH_HEIGHT = 100;

      this.players = this.generatePlayers(8);
      this.matches = this.generateMatches();
      this.init();
    }

    generatePlayers(count) {
      return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        name: `Jugador ${i + 1}`,
      }));
    }

    generateMatches() {
      const matches = [];
      let matchId = 1;

      // Cuartos
      for (let i = 0; i < 4; i++) {
        matches.push({
          id: matchId++,
          player1: this.players[i * 2],
          player2: this.players[i * 2 + 1],
          winner: i % 2 === 0 ? this.players[i * 2] : this.players[i * 2 + 1],
          round: 1,
          position: i,
        });
      }

      // Semis
      for (let i = 0; i < 2; i++) {
        const prev1 = matches[i * 2];
        const prev2 = matches[i * 2 + 1];
        matches.push({
          id: matchId++,
          player1: prev1.winner,
          player2: prev2.winner,
          winner: prev1.winner,
          round: 2,
          position: i,
        });
      }

      // Final
      const semifinal1 = matches[4];
      const semifinal2 = matches[5];
      matches.push({
        id: matchId++,
        player1: semifinal1.winner,
        player2: semifinal2.winner,
        winner: semifinal1.winner,
        round: 3,
        position: 0,
      });

      return matches;
    }

    init() {
      this.renderMatches();
      this.renderLines();
      this.renderWinner();
      this.attachEventListeners();
      this.updateZoomDisplay();
    }

    getMatchPosition(round, pos) {
      const baseTop = 100;
      let spacing = this.MATCH_HEIGHT;
      if (round === 2) spacing = this.MATCH_HEIGHT * 2;
      if (round === 3) spacing = this.MATCH_HEIGHT * 4;

      return {
        left: round * this.ROUND_SPACING + 50,
        top: baseTop + pos * spacing * 2,
      };
    }

    createPlayerCard(player, isWinner = false) {
      const card = document.createElement("div");
      card.className = `player-card ${isWinner ? "winner" : "regular"}`;
      card.innerHTML = `
        <div class="player-avatar">
          <svg class="user-icon" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <span class="player-name">${player?.name || "Jugador"}</span>
      `;
      return card;
    }

    renderMatches() {
      this.matchesContainer.innerHTML = "";
      this.matches.forEach((m) => {
        const pos = this.getMatchPosition(m.round, m.position);
        const div = document.createElement("div");
        div.className = "match";
        div.style.left = `${pos.left}px`;
        div.style.top = `${pos.top}px`;

        const p1 = this.createPlayerCard(m.player1, m.winner?.id === m.player1?.id);
        const p2 = this.createPlayerCard(m.player2, m.winner?.id === m.player2?.id);

        div.appendChild(p1);
        div.appendChild(p2);
        this.matchesContainer.appendChild(div);
      });
    }

    renderLines() {
      this.connectionLines.innerHTML = "";
      this.matches.forEach((m) => {
        if (m.round > 1) {
          const current = this.getMatchPosition(m.round, m.position);
          const prevMatches = this.matches.filter(
            (pm) => pm.round === m.round - 1 && Math.floor(pm.position / 2) === m.position
          );
          prevMatches.forEach((pm) => {
            const prev = this.getMatchPosition(pm.round, pm.position);
            const x1 = prev.left + 140;
            const y1 = prev.top + 50;
            const x2 = current.left;
            const y2 = current.top + 50;
            const midX = (x1 + x2) / 2;

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`);
            path.setAttribute("stroke", "#9ca3af");
            path.setAttribute("stroke-width", "2");
            path.setAttribute("fill", "none");

            this.connectionLines.appendChild(path);
          });
        }
      });
    }

    renderWinner() {
      const finalMatch = this.matches[this.matches.length - 1];
      if (finalMatch?.winner) {
        const pos = this.getMatchPosition(3, 0);
        this.winnerDisplay.style.left = `${pos.left + 300}px`;
        this.winnerDisplay.style.top = `${pos.top}px`;
        this.winnerDisplay.innerHTML = `
          <div class="winner-content">
            <div class="winner-avatar">
              <svg class="user-icon" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="winner-info">
              <p class="winner-label">Ganador</p>
              <p class="winner-name">${finalMatch.winner.name}</p>
            </div>
          </div>`;
      }
    }

    updateTransform() {
      this.canvas.style.transform = `translate(${this.pan.x}px, ${this.pan.y}px) scale(${this.zoom})`;
    }

    updateZoomDisplay() {
      this.zoomLevelDisplay.textContent = `${Math.round(this.zoom * 100)}%`;
      this.zoomInBtn.disabled = this.zoom >= this.MAX_ZOOM;
      this.zoomOutBtn.disabled = this.zoom <= this.MIN_ZOOM;
    }

    setZoom(newZoom) {
      this.zoom = Math.max(this.MIN_ZOOM, Math.min(this.MAX_ZOOM, newZoom));
      this.updateTransform();
      this.updateZoomDisplay();
    }

    handleZoomIn() { this.setZoom(this.zoom + this.ZOOM_STEP); }
    handleZoomOut() { this.setZoom(this.zoom - this.ZOOM_STEP); }
    handleResetZoom() {
      this.zoom = 1;
      this.pan = { x: 0, y: 0 };
      this.updateTransform();
      this.updateZoomDisplay();
    }

    attachEventListeners() {
      this.zoomInBtn.addEventListener("click", () => this.handleZoomIn());
      this.zoomOutBtn.addEventListener("click", () => this.handleZoomOut());
      this.resetZoomBtn.addEventListener("click", () => this.handleResetZoom());
    }
  }

  // Inicializa una vez que React haya renderizado el DOM
  new TournamentBracket();
}
