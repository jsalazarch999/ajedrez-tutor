import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
         IonButtons, IonIcon, IonChip } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { refreshOutline } from 'ionicons/icons';
import { Chess } from 'chess.js';

interface Casilla {
  pieza: string | null;
  esClara: boolean;
  seleccionada: boolean;
  movimientoPosible: boolean;
  indice: number;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent,
            IonButton, IonButtons, IonIcon, IonChip],
})
export class HomePage implements OnInit {

  tablero: Casilla[] = [];
  turno: 'w' | 'b' = 'w';
  seleccion: number | null = null;
  mensaje = 'Selecciona una pieza blanca';
  historial: string[] = [];
  chess = new Chess();

  piezas: Record<string, string> = {
    wP:'♙', wR:'♖', wN:'♘', wB:'♗', wQ:'♕', wK:'♔',
    bP:'♟', bR:'♜', bN:'♞', bB:'♝', bQ:'♛', bK:'♚'
  };

  columnas = ['a','b','c','d','e','f','g','h'];

  ngOnInit() {
    addIcons({ refreshOutline });
    this.actualizarTablero();
  }

  indiceToCasilla(i: number): string {
    const col = this.columnas[i % 8];
    const fila = 8 - Math.floor(i / 8);
    return `${col}${fila}`;
  }

  actualizarTablero() {
    const board = this.chess.board();
    this.tablero = [];

    for (let fila = 0; fila < 8; fila++) {
      for (let col = 0; col < 8; col++) {
        const pieza = board[fila][col];
        const esClara = (fila + col) % 2 === 0;
        const i = fila * 8 + col;

        this.tablero.push({
          pieza: pieza ? this.piezas[pieza.color + pieza.type.toUpperCase()] : null,
          esClara,
          seleccionada: false,
          movimientoPosible: false,
          indice: i
        });
      }
    }

    this.turno = this.chess.turn();

    if (this.chess.isCheckmate()) {
      this.mensaje = this.turno === 'w' ? '⬛ Jaque mate — Ganan las negras' : '⬜ Jaque mate — ¡Ganaste!';
    } else if (this.chess.isDraw()) {
      this.mensaje = '½ Tablas';
    } else if (this.chess.inCheck()) {
      this.mensaje = '¡Jaque!';
    } else {
      this.mensaje = this.turno === 'w' ? 'Selecciona una pieza blanca' : 'Turno de negras...';
    }
  }

  onCasillaClick(i: number) {
    if (this.chess.isGameOver()) return;
    if (this.turno !== 'w') return;

    const casilla = this.indiceToCasilla(i);

    if (this.seleccion === null) {
      // Verificar que hay una pieza blanca aquí
      const movimientos = this.chess.moves({ square: casilla as any, verbose: true });
      if (movimientos.length > 0) {
        this.limpiarSeleccion();
        this.tablero[i].seleccionada = true;
        this.seleccion = i;
        // Mostrar movimientos posibles
        movimientos.forEach(m => {
          const destIdx = this.casillaToIndice(m.to);
          this.tablero[destIdx].movimientoPosible = true;
        });
        this.mensaje = 'Elige destino';
      }
    } else {
      const desde = this.indiceToCasilla(this.seleccion);
      const hasta = casilla;

      try {
        const resultado = this.chess.move({ from: desde as any, to: hasta as any, promotion: 'q' });
        if (resultado) {
          this.historial.push(resultado.san);
          this.limpiarSeleccion();
          this.actualizarTablero();

          // IA mueve después de 500ms
          if (!this.chess.isGameOver()) {
            setTimeout(() => this.moverIA(), 500);
          }
        }
      } catch {
        // Movimiento inválido — reseleccionar
        this.limpiarSeleccion();
        const movimientos = this.chess.moves({ square: casilla as any, verbose: true });
        if (movimientos.length > 0) {
          this.tablero[i].seleccionada = true;
          this.seleccion = i;
          movimientos.forEach(m => {
            const destIdx = this.casillaToIndice(m.to);
            this.tablero[destIdx].movimientoPosible = true;
          });
        }
      }
    }
  }

  casillaToIndice(casilla: string): number {
    const col = this.columnas.indexOf(casilla[0]);
    const fila = 8 - parseInt(casilla[1]);
    return fila * 8 + col;
  }

  moverIA() {
    const movimientos = this.chess.moves({ verbose: true });
    if (!movimientos.length) return;

    // Priorizar capturas, luego centro, luego aleatorio
    const capturas = movimientos.filter(m => m.captured);
    const mov = capturas.length > 0
      ? capturas[Math.floor(Math.random() * capturas.length)]
      : movimientos[Math.floor(Math.random() * movimientos.length)];

    this.chess.move(mov);
    this.historial.push(mov.san);
    this.actualizarTablero();
  }

  limpiarSeleccion() {
    this.tablero.forEach(c => {
      c.seleccionada = false;
      c.movimientoPosible = false;
    });
    this.seleccion = null;
  }

  nuevaPartida() {
    this.chess.reset();
    this.historial = [];
    this.seleccion = null;
    this.actualizarTablero();
  }

  copiarReporte() {
    let texto = '=== REPORTE DE PARTIDA ===\nBlancas: Jugador | Negras: IA\n\nJugadas:\n';
    for (let i = 0; i < this.historial.length; i += 2) {
      texto += `${Math.floor(i/2)+1}. ${this.historial[i]} ${this.historial[i+1] || ''}\n`;
    }
    texto += `\nTotal movimientos: ${this.historial.length}`;
    navigator.clipboard.writeText(texto);
    this.mensaje = '¡Reporte copiado!';
  }
}