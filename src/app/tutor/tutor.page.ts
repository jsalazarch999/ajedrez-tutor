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
  seleccionada: boolean;
  error: boolean;
}

interface Paso {
  explicacion: string;
  posicion: string;
  desde?: string;
  hasta?: string;
  esInteractivo?: boolean;
  movimientoCorrecto?: { desde: string; hasta: string };
}

interface Leccion {
  titulo: string;
  subtitulo: string;
  descripcion: string;
  pasos: Paso[];
}

interface Modulo {
  icono: string;
  titulo: string;
  descripcion: string;
  lecciones: Leccion[];
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

  pantalla: 'modulos' | 'lecciones' | 'leccion' = 'modulos';
  moduloActivo: Modulo | null = null;
  leccionActiva: Leccion | null = null;
  pasoActual = 0;
  tablero: Casilla[] = [];
  feedback: 'correcto' | 'incorrecto' | null = null;
  seleccion: number | null = null;

  piezas: Record<string, string> = {
    wP:'♙', wR:'♖', wN:'♘', wB:'♗', wQ:'♕', wK:'♔',
    bP:'♟', bR:'♜', bN:'♞', bB:'♝', bQ:'♛', bK:'♚'
  };

  columnas = ['a','b','c','d','e','f','g','h'];

  get tituloHeader(): string {
    if (this.pantalla === 'modulos') return 'Tutor de Ajedrez';
    if (this.pantalla === 'lecciones') return this.moduloActivo?.titulo || '';
    return this.leccionActiva?.titulo || '';
  }

  get pasoActivo(): Paso | null {
    if (!this.leccionActiva) return null;
    return this.leccionActiva.pasos[this.pasoActual];
  }

  get progreso(): number {
    if (!this.leccionActiva) return 0;
    return (this.pasoActual + 1) / this.leccionActiva.pasos.length;
  }

  get esUltimoPaso(): boolean {
    if (!this.leccionActiva) return false;
    return this.pasoActual === this.leccionActiva.pasos.length - 1;
  }

  modulos: Modulo[] = [
    {
      icono: '📚',
      titulo: 'Principios Fundamentales',
      descripcion: 'Las bases del ajedrez: valor de piezas, centro y desarrollo.',
      lecciones: [
        {
          titulo: 'Valor de las piezas',
          subtitulo: 'Aprende cuánto vale cada pieza',
          descripcion: 'Conoce el valor relativo de cada pieza para tomar mejores decisiones.',
          pasos: [
            {
              explicacion: 'El Peón es la pieza más débil — vale 1 punto. Son la base de tu ejército y controlan casillas importantes.',
              posicion: '8/8/8/8/8/8/4P3/8',
              desde: 'e2', hasta: 'e4'
            },
            {
              explicacion: 'El Caballo vale 3 puntos. Se mueve en L y es la única pieza que puede saltar sobre otras. Es más fuerte en el centro.',
              posicion: '8/8/8/8/4N3/8/8/8',
              desde: 'e4', hasta: 'f6'
            },
            {
              explicacion: 'El Alfil vale 3 puntos. Se mueve en diagonal y siempre permanece en casillas del mismo color. Dos alfiles juntos son muy poderosos.',
              posicion: '8/8/8/8/2B5/8/8/8',
              desde: 'c4', hasta: 'f7'
            },
            {
              explicacion: 'La Torre vale 5 puntos. Se mueve en líneas rectas y es más poderosa en filas abiertas. Dos torres juntas son devastadoras.',
              posicion: '8/8/8/8/8/8/8/4R3',
              desde: 'e1', hasta: 'e8'
            },
            {
              explicacion: 'La Dama vale 9 puntos — la pieza más poderosa. Combina los movimientos de torre y alfil. Pero cuidado con sacarla demasiado temprano.',
              posicion: '8/8/8/8/8/8/8/4Q3',
              desde: 'e1', hasta: 'h4'
            },
            {
              explicacion: 'El Rey no tiene valor numérico — ¡es el objetivo del juego! Debe mantenerse protegido en la apertura y mediojuego, pero en el final se convierte en una pieza activa.',
              posicion: '8/8/8/8/8/8/8/4K3',
              desde: 'e1', hasta: 'e2'
            },
          ]
        },
        {
          titulo: 'Control del centro',
          subtitulo: 'Por qué el centro es tan importante',
          descripcion: 'Las casillas e4, d4, e5 y d5 son las más importantes del tablero.',
          pasos: [
            {
              explicacion: 'El centro del tablero son las casillas e4, d4, e5 y d5. Quien controla el centro tiene más espacio y sus piezas tienen más movilidad.',
              posicion: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
              desde: 'e2', hasta: 'e4'
            },
            {
              explicacion: 'Una pieza en el centro puede atacar más casillas. Este caballo en e4 controla 8 casillas. Un caballo en la esquina solo controla 2.',
              posicion: '8/8/8/8/4N3/8/8/8',
              desde: 'e4', hasta: 'f6'
            },
            {
              explicacion: '¡Ahora practica! Mueve el peón de e2 a e4 para tomar control del centro.',
              posicion: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
              esInteractivo: true,
              movimientoCorrecto: { desde: 'e2', hasta: 'e4' }
            },
          ]
        },
      ]
    },
    {
      icono: '⚔️',
      titulo: 'Aperturas con Blancas',
      descripcion: 'Las mejores aperturas para jugar con piezas blancas.',
      lecciones: [
        {
          titulo: '🇮🇹 Apertura Italiana',
          subtitulo: 'La más recomendada para principiantes',
          descripcion: 'Desarrolla piezas rápido y controla el centro.',
          pasos: [
            {
              explicacion: 'La Italiana comienza con e4 — controlas el centro y abres líneas para el alfil y la dama.',
              posicion: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR',
              desde: 'e2', hasta: 'e4'
            },
            {
              explicacion: 'Las negras responden e5. Ahora jugamos Nf3 — desarrollamos el caballo atacando el peón e5.',
              posicion: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R',
              desde: 'g1', hasta: 'f3'
            },
            {
              explicacion: 'Las negras desarrollan Nc6. Ahora Bc4 — el Alfil Italiano apunta al débil f7 del rey negro.',
              posicion: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R',
              desde: 'f1', hasta: 'c4'
            },
            {
              explicacion: '¡Practica! Mueve el alfil de f1 a c4 para completar la Apertura Italiana.',
              posicion: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R',
              esInteractivo: true,
              movimientoCorrecto: { desde: 'f1', hasta: 'c4' }
            },
          ]
        },
        {
          titulo: '🏰 Apertura Española',
          subtitulo: 'La favorita de los grandes maestros',
          descripcion: 'Una de las aperturas más estudiadas del ajedrez.',
          pasos: [
            {
              explicacion: 'La Española empieza igual que la Italiana: e4, e5, Nf3. Pero el tercer movimiento es diferente.',
              posicion: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R',
              desde: 'g1', hasta: 'f3'
            },
            {
              explicacion: 'Bb5 — el movimiento característico. El alfil presiona al caballo c6 que defiende el peón e5. No capturamos inmediatamente, mantenemos la tensión.',
              posicion: 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R',
              desde: 'f1', hasta: 'b5'
            },
            {
              explicacion: '¡Practica! Mueve el alfil de f1 a b5 para jugar la Apertura Española.',
              posicion: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R',
              esInteractivo: true,
              movimientoCorrecto: { desde: 'f1', hasta: 'b5' }
            },
          ]
        },
      ]
    },
    {
      icono: '🛡️',
      titulo: 'Defensas con Negras',
      descripcion: 'Aprende a jugar sólido y agresivo con piezas negras.',
      lecciones: [
        {
          titulo: '🐉 Defensa Siciliana',
          subtitulo: 'La más popular contra 1.e4',
          descripcion: 'Crea desequilibrio desde el inicio.',
          pasos: [
            {
              explicacion: 'Las blancas juegan e4. La Siciliana responde con c5 — en lugar de pelear por el centro directamente, creas tensión asimétrica.',
              posicion: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR',
              desde: 'c7', hasta: 'c5'
            },
            {
              explicacion: 'Blancas juegan Nf3, negras d6. Blancas avanzan d4 — las negras capturan cxd4 ganando control del centro con el caballo.',
              posicion: 'rnbqkbnr/pp2pppp/3p4/8/3pP3/5N2/PPP2PPP/RNBQKB1R',
              desde: 'c5', hasta: 'd4'
            },
            {
              explicacion: '¡Practica! Juega c5 para iniciar la Defensa Siciliana contra e4.',
              posicion: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR',
              esInteractivo: true,
              movimientoCorrecto: { desde: 'c7', hasta: 'c5' }
            },
          ]
        },
        {
          titulo: '♞ Defensa Nimzo-India',
          subtitulo: 'Favorita de los jugadores posicionales',
          descripcion: 'Clava al caballo y crea desequilibrio posicional.',
          pasos: [
            {
              explicacion: 'Contra 1.d4 Nf6 2.c4 e6 3.Nc3, las negras juegan Bb4 — el movimiento definitorio de la Nimzo-India. El alfil clava al caballo c3.',
              posicion: 'rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR',
              desde: 'f8', hasta: 'b4'
            },
            {
              explicacion: '¡Practica! Mueve el alfil de f8 a b4 para jugar la Nimzo-India.',
              posicion: 'rnbqk2r/pppp1ppp/4pn2/8/2PP4/2N5/PP2PPPP/R1BQKBNR',
              esInteractivo: true,
              movimientoCorrecto: { desde: 'f8', hasta: 'b4' }
            },
          ]
        },
      ]
    },
    {
      icono: '⚡',
      titulo: 'Combinaciones Clásicas',
      descripcion: 'Los mates y combinaciones más famosos de la historia.',
      lecciones: [
        {
          titulo: '🤪 Mate del Loco',
          subtitulo: 'El mate más rápido del ajedrez — 2 jugadas',
          descripcion: 'Aprende por qué nunca debes debilitar tu rey en la apertura.',
          pasos: [
            {
              explicacion: 'El Mate del Loco ocurre cuando blancas debilitan fatalmente su rey. Primero juegan f3 — un error grave que debilita la diagonal h4-e1.',
              posicion: 'rnbqkbnr/pppppppp/8/8/8/5P2/PPPPP1PP/RNBQKBNR',
              desde: 'f2', hasta: 'f3'
            },
            {
              explicacion: 'Las negras responden e5 ocupando el centro. Ahora blancas cometen el segundo error: g4, debilitando aún más al rey.',
              posicion: 'rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR',
              desde: 'g2', hasta: 'g4'
            },
            {
              explicacion: '¡Mate! La dama negra va a h4 — jaque mate. El rey blanco no puede moverse, nadie puede bloquear ni capturar la dama. Moraleja: nunca debilites las casillas alrededor de tu rey.',
              posicion: 'rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR',
              desde: 'd8', hasta: 'h4'
            },
            {
              explicacion: '¡Ahora practica! Eres las negras. Mueve la dama a h4 para dar jaque mate.',
              posicion: 'rnb1kbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR',
              esInteractivo: true,
              movimientoCorrecto: { desde: 'd8', hasta: 'h4' }
            },
          ]
        },
        {
          titulo: '👨‍💼 Mate del Pastor',
          subtitulo: 'El mate más famoso — 4 jugadas',
          descripcion: 'Una trampa clásica que debes conocer para evitarla.',
          pasos: [
            {
              explicacion: 'El Mate del Pastor intenta dar mate en 4 jugadas explotando el punto débil f7. Empieza con e4.',
              posicion: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR',
              desde: 'e2', hasta: 'e4'
            },
            {
              explicacion: 'Después de e4 e5, jugamos Bc4 — el alfil apunta directamente a f7, el punto más débil del rey negro.',
              posicion: 'rnbqkbnr/pppp1ppp/8/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR',
              desde: 'f1', hasta: 'c4'
            },
            {
              explicacion: 'Ahora Qh5 — la dama amenaza f7 junto con el alfil. Si las negras no ven la amenaza, viene el mate.',
              posicion: 'rnbqkbnr/pppp1ppp/8/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR',
              desde: 'd1', hasta: 'h5'
            },
            {
              explicacion: '¡Mate del Pastor! Qxf7 es jaque mate — la dama en f7 está protegida por el alfil en c4 y el rey negro no puede escapar.',
              posicion: 'rnbqkb1r/pppp1Qpp/2n5/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR',
              desde: 'h5', hasta: 'f7'
            },
            {
              explicacion: '¡Practica! Mueve la dama de h5 a f7 para dar el Mate del Pastor.',
              posicion: 'rnbqkbnr/pppp1ppp/8/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR',
              esInteractivo: true,
              movimientoCorrecto: { desde: 'h5', hasta: 'f7' }
            },
          ]
        },
      ]
    },
  ];

  ngOnInit() {
    addIcons({ arrowBackOutline });
    this.inicializarTableroVacio();
  }

  seleccionarModulo(modulo: Modulo) {
    this.moduloActivo = modulo;
    this.pantalla = 'lecciones';
  }

  seleccionarLeccion(leccion: Leccion) {
    this.leccionActiva = leccion;
    this.pasoActual = 0;
    this.feedback = null;
    this.seleccion = null;
    this.pantalla = 'leccion';
    const paso = leccion.pasos[0];
    this.cargarPosicion(paso.posicion, paso.desde, paso.hasta);
  }

  volverAtras() {
    if (this.pantalla === 'leccion') {
      this.pantalla = 'lecciones';
      this.leccionActiva = null;
      this.inicializarTableroVacio();
    } else if (this.pantalla === 'lecciones') {
      this.pantalla = 'modulos';
      this.moduloActivo = null;
    } else {
      window.history.back();
    }
  }

  onCasillaClick(i: number) {
    if (!this.pasoActivo?.esInteractivo) return;
    if (this.feedback === 'correcto') return;

    const casilla = this.indiceToCasilla(i);

    if (this.seleccion === null) {
      if (this.tablero[i].pieza) {
        this.limpiarSeleccion();
        this.tablero[i].seleccionada = true;
        this.seleccion = i;
      }
    } else {
      const desde = this.indiceToCasilla(this.seleccion);
      const correcto = this.pasoActivo.movimientoCorrecto;

      if (correcto && desde === correcto.desde && casilla === correcto.hasta) {
        this.feedback = 'correcto';
        this.tablero[this.seleccion].resaltada = true;
        this.tablero[i].destino = true;
        this.tablero[i].pieza = this.tablero[this.seleccion].pieza;
        this.tablero[this.seleccion].pieza = null;
      } else {
        this.feedback = 'incorrecto';
        this.tablero[i].error = true;
        setTimeout(() => {
          this.tablero[i].error = false;
          this.feedback = null;
          this.limpiarSeleccion();
        }, 1000);
      }
      this.tablero[this.seleccion].seleccionada = false;
      this.seleccion = null;
    }
  }

  pasoSiguiente() {
    if (!this.leccionActiva) return;
    if (this.esUltimoPaso) {
      this.pantalla = 'lecciones';
      this.leccionActiva = null;
      this.inicializarTableroVacio();
      return;
    }
    this.pasoActual++;
    this.feedback = null;
    this.seleccion = null;
    const paso = this.leccionActiva.pasos[this.pasoActual];
    this.cargarPosicion(paso.posicion, paso.desde, paso.hasta);
  }

  pasoAnterior() {
    if (this.pasoActual === 0) return;
    this.pasoActual--;
    this.feedback = null;
    this.seleccion = null;
    const paso = this.leccionActiva!.pasos[this.pasoActual];
    this.cargarPosicion(paso.posicion, paso.desde, paso.hasta);
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
        seleccionada: false,
        error: false,
      });
    }
  }

  cargarPosicion(fen: string, desde?: string, hasta?: string) {
    this.inicializarTableroVacio();
    const filas = fen.split('/');

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

    if (desde) this.tablero[this.casillaToIndice(desde)].resaltada = true;
    if (hasta) this.tablero[this.casillaToIndice(hasta)].destino = true;
  }

  limpiarSeleccion() {
    this.tablero.forEach(c => {
      c.seleccionada = false;
      c.error = false;
    });
    this.seleccion = null;
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
}