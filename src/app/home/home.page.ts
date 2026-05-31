import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
         IonButtons, IonIcon, IonChip } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { refreshOutline } from 'ionicons/icons';
import { Chess } from 'chess.js';

interface Casilla {
  pieza: string | null;
  esClara: boolean;
  seleccionada: boolean;
  movimientoPosible: boolean;
}

interface Nivel {
  nombre: string;
  valor: number;
  color: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent,
          IonButton, IonButtons, IonIcon, IonChip, RouterLink],
})
export class HomePage implements OnInit {

  tablero: Casilla[] = [];
  turno: 'w' | 'b' = 'w';
  seleccion: number | null = null;
  mensaje = 'Selecciona una pieza blanca';
  historial: string[] = [];
  chess = new Chess();
  nivelActual = 1;

  niveles: Nivel[] = [
    { nombre: '🟢 Básico',      valor: 1, color: 'success' },
    { nombre: '🟡 Intermedio',  valor: 2, color: 'warning' },
    { nombre: '🔴 Avanzado',    valor: 3, color: 'danger'  },
  ];

  piezas: Record<string, string> = {
    wP:'♙', wR:'♖', wN:'♘', wB:'♗', wQ:'♕', wK:'♔',
    bP:'♟', bR:'♜', bN:'♞', bB:'♝', bQ:'♛', bK:'♚'
  };

  columnas = ['a','b','c','d','e','f','g','h'];

  // Valores de piezas para evaluación
  valorPieza: Record<string, number> = {
    p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000
  };

  // Tablas de posición para evaluar dónde están las piezas
  tablaPeon = [
     0,  0,  0,  0,  0,  0,  0,  0,
    50, 50, 50, 50, 50, 50, 50, 50,
    10, 10, 20, 30, 30, 20, 10, 10,
     5,  5, 10, 25, 25, 10,  5,  5,
     0,  0,  0, 20, 20,  0,  0,  0,
     5, -5,-10,  0,  0,-10, -5,  5,
     5, 10, 10,-20,-20, 10, 10,  5,
     0,  0,  0,  0,  0,  0,  0,  0
  ];

  tablaCaballo = [
    -50,-40,-30,-30,-30,-30,-40,-50,
    -40,-20,  0,  0,  0,  0,-20,-40,
    -30,  0, 10, 15, 15, 10,  0,-30,
    -30,  5, 15, 20, 20, 15,  5,-30,
    -30,  0, 15, 20, 20, 15,  0,-30,
    -30,  5, 10, 15, 15, 10,  5,-30,
    -40,-20,  0,  5,  5,  0,-20,-40,
    -50,-40,-30,-30,-30,-30,-40,-50
  ];

  ngOnInit() {
    addIcons({ refreshOutline });
    this.actualizarTablero();
  }

  cambiarNivel(nivel: number) {
    this.nivelActual = nivel;
    this.nuevaPartida();
  }

  indiceToCasilla(i: number): string {
    const col = this.columnas[i % 8];
    const fila = 8 - Math.floor(i / 8);
    return `${col}${fila}`;
  }

  casillaToIndice(casilla: string): number {
    const col = this.columnas.indexOf(casilla[0]);
    const fila = 8 - parseInt(casilla[1]);
    return fila * 8 + col;
  }

  actualizarTablero() {
    const board = this.chess.board();
    this.tablero = [];

    for (let fila = 0; fila < 8; fila++) {
      for (let col = 0; col < 8; col++) {
        const pieza = board[fila][col];
        const esClara = (fila + col) % 2 === 0;
        this.tablero.push({
          pieza: pieza ? this.piezas[pieza.color + pieza.type.toUpperCase()] : null,
          esClara,
          seleccionada: false,
          movimientoPosible: false,
        });
      }
    }

    this.turno = this.chess.turn();

    if (this.chess.isCheckmate()) {
      this.mensaje = this.turno === 'w' ? '⬛ Jaque mate — Ganan las negras' : '⬜ ¡Ganaste!';
    } else if (this.chess.isDraw()) {
      this.mensaje = '½ Tablas';
    } else if (this.chess.inCheck()) {
      this.mensaje = '¡Jaque! Protege tu rey';
    } else {
      this.mensaje = this.turno === 'w' ? 'Selecciona una pieza blanca' : 'Negras pensando...';
    }
  }

  onCasillaClick(i: number) {
    if (this.chess.isGameOver() || this.turno !== 'w') return;

    const casilla = this.indiceToCasilla(i);

    if (this.seleccion === null) {
      const movimientos = this.chess.moves({ square: casilla as any, verbose: true });
      if (movimientos.length > 0) {
        this.limpiarSeleccion();
        this.tablero[i].seleccionada = true;
        this.seleccion = i;
        movimientos.forEach(m => {
          const idx = this.casillaToIndice(m.to);
          this.tablero[idx].movimientoPosible = true;
        });
        this.mensaje = 'Elige destino';
      }
    } else {
      const desde = this.indiceToCasilla(this.seleccion);
      try {
        const resultado = this.chess.move({ from: desde as any, to: casilla as any, promotion: 'q' });
        if (resultado) {
          this.historial.push(resultado.san);
          this.limpiarSeleccion();
          this.actualizarTablero();
          if (!this.chess.isGameOver()) {
            const demora = this.nivelActual === 3 ? 1200 : this.nivelActual === 2 ? 800 : 400;
            setTimeout(() => this.moverIA(), demora);
          }
        }
      } catch {
        this.limpiarSeleccion();
        const movimientos = this.chess.moves({ square: casilla as any, verbose: true });
        if (movimientos.length > 0) {
          this.tablero[i].seleccionada = true;
          this.seleccion = i;
          movimientos.forEach(m => {
            const idx = this.casillaToIndice(m.to);
            this.tablero[idx].movimientoPosible = true;
          });
        }
      }
    }
  }

  // ── IA ──────────────────────────────────────────────

  moverIA() {
    if (this.chess.isGameOver()) return;

    let mov;
    if (this.nivelActual === 1) {
      mov = this.iaBásica();
    } else if (this.nivelActual === 2) {
      mov = this.minimax(2, false, -Infinity, Infinity).mov;
    } else {
      mov = this.minimax(3, false, -Infinity, Infinity).mov;
    }

    if (mov) {
      this.chess.move(mov);
      this.historial.push(typeof mov === 'string' ? mov : mov.san || '');
      this.actualizarTablero();
    }
  }

  iaBásica() {
    const movimientos = this.chess.moves({ verbose: true });
    const capturas = movimientos.filter(m => m.captured);
    return capturas.length > 0
      ? capturas[Math.floor(Math.random() * capturas.length)]
      : movimientos[Math.floor(Math.random() * movimientos.length)];
  }

  minimax(profundidad: number, esMaximizador: boolean, alfa: number, beta: number): { puntuacion: number, mov: any } {
    if (profundidad === 0 || this.chess.isGameOver()) {
      return { puntuacion: this.evaluarTablero(), mov: null };
    }

    const movimientos = this.chess.moves({ verbose: true });
    let mejorMov = movimientos[0];

    if (esMaximizador) {
      let mejor = -Infinity;
      for (const mov of movimientos) {
        this.chess.move(mov);
        const { puntuacion } = this.minimax(profundidad - 1, false, alfa, beta);
        this.chess.undo();
        if (puntuacion > mejor) { mejor = puntuacion; mejorMov = mov; }
        alfa = Math.max(alfa, mejor);
        if (beta <= alfa) break;
      }
      return { puntuacion: mejor, mov: mejorMov };
    } else {
      let mejor = Infinity;
      for (const mov of movimientos) {
        this.chess.move(mov);
        const { puntuacion } = this.minimax(profundidad - 1, true, alfa, beta);
        this.chess.undo();
        if (puntuacion < mejor) { mejor = puntuacion; mejorMov = mov; }
        beta = Math.min(beta, mejor);
        if (beta <= alfa) break;
      }
      return { puntuacion: mejor, mov: mejorMov };
    }
  }

  evaluarTablero(): number {
    if (this.chess.isCheckmate()) return this.chess.turn() === 'b' ? 9999 : -9999;
    if (this.chess.isDraw()) return 0;

    let puntuacion = 0;
    const board = this.chess.board();

    for (let fila = 0; fila < 8; fila++) {
      for (let col = 0; col < 8; col++) {
        const pieza = board[fila][col];
        if (!pieza) continue;

        const idx = fila * 8 + col;
        const idxInvertido = (7 - fila) * 8 + col;
        let valor = this.valorPieza[pieza.type] || 0;

        // Bonus posicional
        if (pieza.type === 'p') valor += pieza.color === 'w' ? this.tablaPeon[idxInvertido] : this.tablaPeon[idx];
        if (pieza.type === 'n') valor += pieza.color === 'w' ? this.tablaCaballo[idxInvertido] : this.tablaCaballo[idx];

        puntuacion += pieza.color === 'w' ? -valor : valor;
      }
    }

    return puntuacion;
  }

  // ────────────────────────────────────────────────────

  limpiarSeleccion() {
    this.tablero.forEach(c => { c.seleccionada = false; c.movimientoPosible = false; });
    this.seleccion = null;
  }

  nuevaPartida() {
    this.chess.reset();
    this.historial = [];
    this.seleccion = null;
    this.actualizarTablero();
  }

  copiarReporte() {
    const nivelNombre = this.niveles.find(n => n.valor === this.nivelActual)?.nombre || '';
    let texto = '=== REPORTE DE PARTIDA ===\n';
    texto += `Blancas: Jugador | Negras: IA (${nivelNombre})\n\nJugadas:\n`;
    for (let i = 0; i < this.historial.length; i += 2) {
      texto += `${Math.floor(i/2)+1}. ${this.historial[i]} ${this.historial[i+1] || ''}\n`;
    }
    texto += `\nTotal movimientos: ${this.historial.length}`;
    navigator.clipboard.writeText(texto);
    this.mensaje = '¡Reporte copiado!';
  }
}