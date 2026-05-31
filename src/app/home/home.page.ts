import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
         IonButtons, IonIcon, IonChip } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { refreshOutline } from 'ionicons/icons';

interface Casilla {
  pieza: string | null;
  esClara: boolean;
  seleccionada: boolean;
  movimientoPosible: boolean;
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

  // Piezas unicode
  piezas: Record<string, string> = {
    wP:'♙', wR:'♖', wN:'♘', wB:'♗', wQ:'♕', wK:'♔',
    bP:'♟', bR:'♜', bN:'♞', bB:'♝', bQ:'♛', bK:'♚'
  };

  posicionInicial = [
    'bR','bN','bB','bQ','bK','bB','bN','bR',
    'bP','bP','bP','bP','bP','bP','bP','bP',
    '','','','','','','','',
    '','','','','','','','',
    '','','','','','','','',
    '','','','','','','','',
    'wP','wP','wP','wP','wP','wP','wP','wP',
    'wR','wN','wB','wQ','wK','wB','wN','wR',
  ];

  ngOnInit() {
    addIcons({ refreshOutline });
    this.nuevaPartida();
  }

  nuevaPartida() {
    this.tablero = [];
    this.turno = 'w';
    this.seleccion = null;
    this.mensaje = 'Selecciona una pieza blanca';
    this.historial = [];

    for (let i = 0; i < 64; i++) {
      const fila = Math.floor(i / 8);
      const col = i % 8;
      const pieza = this.posicionInicial[i];
      this.tablero.push({
        pieza: pieza ? this.piezas[pieza] : null,
        esClara: (fila + col) % 2 === 0,
        seleccionada: false,
        movimientoPosible: false,
      });
    }
  }

  onCasillaClick(i: number) {
    if (this.turno !== 'w') return;
    const casilla = this.tablero[i];

    if (this.seleccion === null) {
      // Seleccionar pieza blanca
      if (casilla.pieza && this.esPiezaBlanca(casilla.pieza)) {
        this.limpiarSeleccion();
        this.tablero[i].seleccionada = true;
        this.seleccion = i;
        this.mensaje = 'Pieza seleccionada — elige destino';
      }
    } else {
      if (i === this.seleccion) {
        this.limpiarSeleccion();
        this.mensaje = 'Selecciona una pieza blanca';
        return;
      }
      // Mover
      this.mover(this.seleccion, i);
    }
  }

  mover(desde: number, hasta: number) {
    const pieza = this.tablero[desde].pieza!;
    const destino = this.tablero[hasta].pieza;

    // No capturar piezas propias
    if (destino && this.esPiezaBlanca(destino)) {
      this.limpiarSeleccion();
      this.tablero[hasta].seleccionada = true;
      this.seleccion = hasta;
      return;
    }

    // Registrar jugada
    const cols = 'abcdefgh';
    const desde_col = cols[desde % 8];
    const desde_fila = 8 - Math.floor(desde / 8);
    const hasta_col = cols[hasta % 8];
    const hasta_fila = 8 - Math.floor(hasta / 8);
    this.historial.push(`${desde_col}${desde_fila}${hasta_col}${hasta_fila}`);

    // Ejecutar movimiento
    this.tablero[hasta].pieza = pieza;
    this.tablero[desde].pieza = null;
    this.limpiarSeleccion();

    this.turno = 'b';
    this.mensaje = 'Turno de negras...';

    // IA mueve después de 500ms
    setTimeout(() => this.moverIA(), 500);
  }

  moverIA() {
    const movimientos: [number, number][] = [];

    for (let i = 0; i < 64; i++) {
      if (this.tablero[i].pieza && !this.esPiezaBlanca(this.tablero[i].pieza!)) {
        for (let j = 0; j < 64; j++) {
          if (!this.tablero[j].pieza || this.esPiezaBlanca(this.tablero[j].pieza!)) {
            movimientos.push([i, j]);
          }
        }
      }
    }

    if (movimientos.length === 0) return;

    // Priorizar capturas
    const capturas = movimientos.filter(([, j]) => 
      this.tablero[j].pieza && this.esPiezaBlanca(this.tablero[j].pieza!)
    );
    const mov = capturas.length > 0 
      ? capturas[Math.floor(Math.random() * capturas.length)]
      : movimientos[Math.floor(Math.random() * movimientos.length)];

    const cols = 'abcdefgh';
    const dc = cols[mov[0] % 8], df = 8 - Math.floor(mov[0] / 8);
    const hc = cols[mov[1] % 8], hf = 8 - Math.floor(mov[1] / 8);
    this.historial.push(`${dc}${df}${hc}${hf}`);

    this.tablero[mov[1]].pieza = this.tablero[mov[0]].pieza;
    this.tablero[mov[0]].pieza = null;

    this.turno = 'w';
    this.mensaje = 'Selecciona una pieza blanca';
  }

  esPiezaBlanca(pieza: string): boolean {
    return ['♙','♖','♘','♗','♕','♔'].includes(pieza);
  }

  limpiarSeleccion() {
    this.tablero.forEach(c => { c.seleccionada = false; c.movimientoPosible = false; });
    this.seleccion = null;
  }

  copiarReporte() {
    let texto = '=== REPORTE DE PARTIDA ===\n';
    for (let i = 0; i < this.historial.length; i += 2) {
      texto += `${Math.floor(i/2)+1}. ${this.historial[i]} ${this.historial[i+1] || ''}\n`;
    }
    navigator.clipboard.writeText(texto);
    this.mensaje = '¡Reporte copiado!';
  }
}