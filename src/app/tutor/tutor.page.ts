import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
         IonButtons, IonIcon, IonCard, IonCardHeader, IonCardTitle,
         IonCardSubtitle, IonCardContent, IonProgressBar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

interface Casilla {
  pieza: string | null;
  esClara: boolean;
  resaltada: boolean;
  destino: boolean;
}

interface Paso {
  explicacion: string;
  posicion: string;
  desde?: string;
  hasta?: string;
}

interface Leccion {
  titulo: string;
  subtitulo: string;
  descripcion: string;
  pasos: Paso[];
}

@Component({
  selector: 'app-tutor',
  templateUrl: 'tutor.page.html',
  styleUrls: ['tutor.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, IonHeader, IonToolbar, IonTitle,
            IonContent, IonButton, IonButtons, IonIcon, IonCard,
            IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
            IonProgressBar],
})
export class TutorPage implements OnInit {

  tablero: Casilla[] = [];
  leccionActiva: Leccion | null = null;
  pasoActual = 0;

  piezas: Record<string, string> = {
    wP:'♙', wR:'♖', wN:'♘', wB:'♗', wQ:'♕', wK:'♔',
    bP:'♟', bR:'♜', bN:'♞', bB:'♝', bQ:'♛', bK:'♚'
  };

  columnas = ['a','b','c','d','e','f','g','h'];

  lecciones: Leccion[] = [
    {
      titulo: '🇮🇹 Apertura Italiana',
      subtitulo: 'La apertura más recomendada para principiantes',
      descripcion: 'Aprende a desarrollar tus piezas rápido y controlar el centro.',
      pasos: [
        {
          explicacion: 'La Apertura Italiana es perfecta para aprender los principios del ajedrez: controlar el centro, desarrollar piezas y enrocar. Comienza con 1.e4 — el peón al centro.',
          posicion: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR',
          desde: 'e2', hasta: 'e4'
        },
        {
          explicacion: 'Las negras responden e5, también ocupando el centro. Ahora desarrollamos el caballo con 2.Nf3 — ataca el peón e5 y controla casillas importantes.',
          posicion: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R',
          desde: 'g1', hasta: 'f3'
        },
        {
          explicacion: 'Las negras desarrollan su caballo a c6. Ahora jugamos 3.Bc4 — el Alfil Italiano. Apunta al punto débil f7, cerca del rey negro.',
          posicion: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R',
          desde: 'f1', hasta: 'c4'
        },
        {
          explicacion: 'Esta es la posición italiana clásica. Tus piezas están activas y el centro controlado. El siguiente paso es enrocar para proteger al rey. ¡Excelente apertura!',
          posicion: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R',
          desde: 'e1', hasta: 'g1'
        },
      ]
    },
    {
      titulo: '🏰 Apertura Española',
      subtitulo: 'La apertura favorita de los grandes maestros',
      descripcion: 'Una de las aperturas más estudiadas y poderosas del ajedrez.',
      pasos: [
        {
          explicacion: 'La Apertura Española o Ruy López es usada por los mejores jugadores del mundo. Empieza igual que la italiana: 1.e4 controlando el centro.',
          posicion: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR',
          desde: 'e2', hasta: 'e4'
        },
        {
          explicacion: 'Después de e5 y Nf3, jugamos 3.Bb5 — el movimiento característico de la Española. El alfil presiona el caballo que defiende el peón e5.',
          posicion: 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R',
          desde: 'f1', hasta: 'b5'
        },
        {
          explicacion: 'La idea no es capturar el caballo inmediatamente, sino mantener la presión. Las negras juegan a6 para atacar el alfil. Retiramos con Ba4.',
          posicion: 'r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R',
          desde: 'b5', hasta: 'a4'
        },
        {
          explicacion: 'Enrocamos con O-O para poner al rey seguro. La Española es una apertura de largo plazo — la presión sobre el centro se mantendrá muchos movimientos.',
          posicion: 'r1bqkbnr/1ppp1ppp/p1n5/4p3/B3P3/5N2/PPPP1PPP/RNBQK2R',
          desde: 'e1', hasta: 'g1'
        },
      ]
    },
    {
      titulo: '🐉 Defensa Siciliana',
      subtitulo: 'La defensa más popular contra 1.e4',
      descripcion: 'Aprende a jugar con negras de forma agresiva y desequilibrada.',
      pasos: [
        {
          explicacion: 'La Defensa Siciliana empieza con 1...c5 de las negras en respuesta a e4. En lugar de ocupar el centro, las negras crean tensión asimétrica.',
          posicion: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR',
          desde: 'c7', hasta: 'c5'
        },
        {
          explicacion: 'Las blancas juegan 2.Nf3 desarrollando el caballo. Las negras responden d6 preparando el desarrollo del alfil y controlando e5.',
          posicion: 'rnbqkbnr/pp2pppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R',
          desde: 'd7', hasta: 'd6'
        },
        {
          explicacion: 'Las blancas juegan d4 abriendo el centro. Las negras capturan cxd4 — ahora tienen un peón de más en el centro. Esta es la idea de la Siciliana.',
          posicion: 'rnbqkbnr/pp2pppp/3p4/8/3pP3/5N2/PPP2PPP/RNBQKB1R',
          desde: 'c5', hasta: 'd4'
        },
        {
          explicacion: 'Las blancas recapturan Nxd4. La posición es asimétrica — blancas tienen más espacio, negras tienen ventaja en el flanco de dama. ¡Esto hace la Siciliana tan interesante!',
          posicion: 'rnbqkbnr/pp2pppp/3p4/8/3NP3/8/PPP2PPP/RNBQKB1R',
          desde: 'f3', hasta: 'd4'
        },
      ]
    },
    {
      titulo: '♞ Defensa Nimzo-India',
      subtitulo: 'La defensa favorita de los jugadores posicionales',
      descripcion: 'Una defensa sólida y creativa que desequilibra el juego desde temprano.',
      pasos: [
        {
          explicacion: 'La Nimzo-India empieza con 1.d4 — blancas controlan el centro con el peón de dama. Es una apertura más posicional que 1.e4.',
          posicion: 'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR',
          desde: 'd2', hasta: 'd4'
        },
        {
          explicacion: 'Las negras responden Nf6 — el caballo ataca el centro sin avanzar peones. Blancas juegan c4 expandiendo el control central.',
          posicion: 'rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR',
          desde: 'c2', hasta: 'c4'
        },
        {
          explicacion: 'Las negras juegan e6 preparando el alfil. Blancas desarrollan el caballo a c3. Ahora viene el movimiento clave de la Nimzo.',
          posicion: 'rnbqkb1r/pppp1ppp/4pn2/8/2PP4/2N5/PP2PPPP/R1BQKBNR',
          desde: 'b1', hasta: 'c3'
        },
        {
          explicacion: 'Bb4 — el movimiento definitorio de la Nimzo-India. El alfil clava al caballo c3 que defiende d4. Las negras crean presión sin avanzar peones al centro. ¡Esto es ajedrez posicional!',
          posicion: 'rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR',
          desde: 'f8', hasta: 'b4'
        },
      ]
    },
  ];

  get progreso(): number {
    if (!this.leccionActiva) return 0;
    return (this.pasoActual + 1) / this.leccionActiva.pasos.length;
  }

  get esUltimoPaso(): boolean {
    if (!this.leccionActiva) return false;
    return this.pasoActual === this.leccionActiva.pasos.length - 1;
  }

  ngOnInit() {
    addIcons({ arrowBackOutline });
    this.inicializarTableroVacio();
  }

  inicializarTableroVacio() {
    this.tablero = [];
    for (let i = 0; i < 64; i++) {
      const fila = Math.floor(i / 8);
      const col = i % 8;
      this.tablero.push({
        pieza: null,
        esClara: (fila + col) % 2 === 0,
        resaltada: false,
        destino: false,
      });
    }
  }

  cargarPosicion(fen: string, desde?: string, hasta?: string) {
    this.inicializarTableroVacio();
    const partes = fen.split(' ');
    const filas = partes[0].split('/');

    for (let f = 0; f < 8; f++) {
      let col = 0;
      for (const char of filas[f]) {
        if (isNaN(+char)) {
          const color = char === char.toUpperCase() ? 'w' : 'b';
          const tipo = char.toUpperCase();
          const idx = f * 8 + col;
          this.tablero[idx].pieza = this.piezas[color + tipo] || null;
          col++;
        } else {
          col += +char;
        }
      }
    }

    // Resaltar movimiento
    if (desde) {
      const idxDesde = this.casillaToIndice(desde);
      this.tablero[idxDesde].resaltada = true;
    }
    if (hasta) {
      const idxHasta = this.casillaToIndice(hasta);
      this.tablero[idxHasta].destino = true;
    }
  }

  casillaToIndice(casilla: string): number {
    const col = this.columnas.indexOf(casilla[0]);
    const fila = 8 - parseInt(casilla[1]);
    return fila * 8 + col;
  }

  iniciarLeccion(leccion: Leccion) {
    this.leccionActiva = leccion;
    this.pasoActual = 0;
    const paso = leccion.pasos[0];
    this.cargarPosicion(paso.posicion, paso.desde, paso.hasta);
  }

  pasoSiguiente() {
    if (!this.leccionActiva) return;
    if (this.esUltimoPaso) {
      this.volverAlMenu();
      return;
    }
    this.pasoActual++;
    const paso = this.leccionActiva.pasos[this.pasoActual];
    this.cargarPosicion(paso.posicion, paso.desde, paso.hasta);
  }

  pasoAnterior() {
    if (this.pasoActual === 0) return;
    this.pasoActual--;
    const paso = this.leccionActiva!.pasos[this.pasoActual];
    this.cargarPosicion(paso.posicion, paso.desde, paso.hasta);
  }

  volverAlMenu() {
    this.leccionActiva = null;
    this.pasoActual = 0;
    this.inicializarTableroVacio();
  }
}