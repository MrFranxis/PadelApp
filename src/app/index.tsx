import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import {
  AppState,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// ======================================================
// 1. TIPOS
// ======================================================

type Puntuacion = 0 | 15 | 30 | 40 | "AD";
type Pareja = "A" | "B";

type Configuracion = {
  mejorDe: 3 | 5 | 7;
  juegosPorSet: 4 | 6 | 8;
  puntosTieBreak: 7 | 10;
};

type ResultadoSet = {
  parejaA: number;
  parejaB: number;
  tieBreakA?: number;
  tieBreakB?: number;
  duracion: number;
};

type Marcador = {
  puntosA: Puntuacion;
  puntosB: Puntuacion;
  juegosA: number;
  juegosB: number;
  setsA: number;
  setsB: number;
  resultadosSets: ResultadoSet[];
  tieBreak: boolean;
  puntosTieBreakA: number;
  puntosTieBreakB: number;
  partidoTerminado: boolean;
  tiempoTotal: number;
  tiempoSet: number;
  tiempoJuego: number;
  duracionesJuegos: number[];
  parejaSaque: Pareja;
  primerSaqueTieBreak?: Pareja;
  cambioLadoPendiente: boolean;
};

type PartidaGuardada = {
  version: 1;
  config: Configuracion;
  marcador: Marcador;
  historial: Marcador[];
  partidoIniciado: boolean;
  pausado?: boolean;
  ultimaMarcaTiempo?: number | null;
};

// ======================================================
// 2. CONSTANTES Y FUNCIONES AUXILIARES
// ======================================================

const CLAVE_PARTIDA = "@padelapp/partida-v1";

function otraPareja(pareja: Pareja): Pareja {
  return pareja === "A" ? "B" : "A";
}

function crearMarcadorInicial(primerSaque: Pareja = "A"): Marcador {
  return {
    puntosA: 0,
    puntosB: 0,
    juegosA: 0,
    juegosB: 0,
    setsA: 0,
    setsB: 0,
    resultadosSets: [],
    tieBreak: false,
    puntosTieBreakA: 0,
    puntosTieBreakB: 0,
    partidoTerminado: false,
    tiempoTotal: 0,
    tiempoSet: 0,
    tiempoJuego: 0,
    duracionesJuegos: [],
    parejaSaque: primerSaque,
    cambioLadoPendiente: false,
  };
}

function formatearTiempo(segundos: number): string {
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  const segundosRestantes = segundos % 60;

  return [horas, minutos, segundosRestantes]
    .map((valor) => String(valor).padStart(2, "0"))
    .join(":");
}

function siguientePuntuacion(actual: Puntuacion): Puntuacion {
  if (actual === 0) return 15;
  if (actual === 15) return 30;
  if (actual === 30) return 40;
  return actual;
}

function setGanado(
  juegosA: number,
  juegosB: number,
  juegosNecesarios: number,
): Pareja | null {
  if (juegosA >= juegosNecesarios && juegosA - juegosB >= 2) return "A";
  if (juegosB >= juegosNecesarios && juegosB - juegosA >= 2) return "B";
  return null;
}

/**
 * En el tie-break:
 * - El primer sacador realiza un punto.
 * - Después se alternan turnos de dos puntos.
 *
 * puntosJugados indica cuántos puntos se han disputado antes del siguiente.
 */
function sacadorTieBreak(primerSaque: Pareja, puntosJugados: number): Pareja {
  if (puntosJugados === 0) return primerSaque;

  const turno = Math.floor((puntosJugados + 1) / 2);
  return turno % 2 === 0 ? primerSaque : otraPareja(primerSaque);
}

// ======================================================
// 3. GESTIÓN DE SETS
// ======================================================

function registrarSet(
  marcador: Marcador,
  ganador: Pareja,
  resultadoA: number,
  resultadoB: number,
  config: Configuracion,
  puntosTB?: { a: number; b: number },
): Marcador {
  const setsA = marcador.setsA + (ganador === "A" ? 1 : 0);
  const setsB = marcador.setsB + (ganador === "B" ? 1 : 0);
  const setsNecesarios = Math.ceil(config.mejorDe / 2);

  const resultado: ResultadoSet = {
    parejaA: resultadoA,
    parejaB: resultadoB,
    tieBreakA: puntosTB?.a,
    tieBreakB: puntosTB?.b,
    duracion: marcador.tiempoSet,
  };

  // Tras un tie-break, comienza sacando la pareja contraria
  // a la que realizó el primer saque del desempate.
  const siguienteSaque =
    marcador.tieBreak && marcador.primerSaqueTieBreak
      ? otraPareja(marcador.primerSaqueTieBreak)
      : marcador.parejaSaque;

  return {
    ...marcador,
    setsA,
    setsB,
    resultadosSets: [...marcador.resultadosSets, resultado],
    puntosA: 0,
    puntosB: 0,
    juegosA: 0,
    juegosB: 0,
    tieBreak: false,
    puntosTieBreakA: 0,
    puntosTieBreakB: 0,
    partidoTerminado: setsA >= setsNecesarios || setsB >= setsNecesarios,
    tiempoSet: 0,
    tiempoJuego: 0,
    parejaSaque: siguienteSaque,
    primerSaqueTieBreak: undefined,
    cambioLadoPendiente: false,
  };
}

// ======================================================
// 4. GESTIÓN DEL TIE-BREAK
// ======================================================

function aplicarTieBreak(
  marcador: Marcador,
  ganador: Pareja,
  config: Configuracion,
): Marcador {
  const puntosA = marcador.puntosTieBreakA + (ganador === "A" ? 1 : 0);
  const puntosB = marcador.puntosTieBreakB + (ganador === "B" ? 1 : 0);
  const puntosJugados = puntosA + puntosB;
  const primerSaque = marcador.primerSaqueTieBreak ?? marcador.parejaSaque;

  const actualizado: Marcador = {
    ...marcador,
    puntosTieBreakA: puntosA,
    puntosTieBreakB: puntosB,
    parejaSaque: sacadorTieBreak(primerSaque, puntosJugados),
    cambioLadoPendiente: puntosJugados > 0 && puntosJugados % 6 === 0,
  };

  const diferencia = Math.abs(puntosA - puntosB);

  if (puntosA >= config.puntosTieBreak && diferencia >= 2) {
    return registrarSet(
      actualizado,
      "A",
      marcador.juegosA + 1,
      marcador.juegosB,
      config,
      { a: puntosA, b: puntosB },
    );
  }

  if (puntosB >= config.puntosTieBreak && diferencia >= 2) {
    return registrarSet(
      actualizado,
      "B",
      marcador.juegosA,
      marcador.juegosB + 1,
      config,
      { a: puntosA, b: puntosB },
    );
  }

  return actualizado;
}

// ======================================================
// 5. GESTIÓN DE JUEGOS
// ======================================================

function sumarJuego(
  marcador: Marcador,
  ganador: Pareja,
  config: Configuracion,
): Marcador {
  const juegosA = marcador.juegosA + (ganador === "A" ? 1 : 0);
  const juegosB = marcador.juegosB + (ganador === "B" ? 1 : 0);

  // El saque cambia de pareja al terminar cada juego.
  const siguienteSaque = otraPareja(marcador.parejaSaque);

  const actualizado: Marcador = {
    ...marcador,
    juegosA,
    juegosB,
    puntosA: 0,
    puntosB: 0,
    duracionesJuegos: [...marcador.duracionesJuegos, marcador.tiempoJuego],
    tiempoJuego: 0,
    parejaSaque: siguienteSaque,

    // En pádel se cambia de lado tras el primer juego
    // y, posteriormente, al finalizar cada número impar.
    cambioLadoPendiente: (juegosA + juegosB) % 2 === 1,
  };

  const ganadorSet = setGanado(juegosA, juegosB, config.juegosPorSet);

  if (ganadorSet !== null) {
    return registrarSet(actualizado, ganadorSet, juegosA, juegosB, config);
  }

  // El tie-break comienza al llegar al empate indicado.
  if (juegosA === config.juegosPorSet && juegosB === config.juegosPorSet) {
    return {
      ...actualizado,
      tieBreak: true,
      primerSaqueTieBreak: siguienteSaque,
    };
  }

  return actualizado;
}

// ======================================================
// 6. GESTIÓN DE PUNTOS
// ======================================================

function aplicarPunto(
  marcador: Marcador,
  ganador: Pareja,
  config: Configuracion,
): Marcador {
  // El aviso de cambio de lado desaparece al registrar el siguiente punto.
  const base: Marcador = {
    ...marcador,
    cambioLadoPendiente: false,
  };

  if (base.tieBreak) {
    return aplicarTieBreak(base, ganador, config);
  }

  const { puntosA, puntosB } = base;

  if (ganador === "A") {
    if (puntosA === "AD") return sumarJuego(base, "A", config);

    if (puntosB === "AD") {
      return { ...base, puntosA: 40, puntosB: 40 };
    }

    if (puntosA === 40 && puntosB === 40) {
      return { ...base, puntosA: "AD" };
    }

    if (puntosA === 40) return sumarJuego(base, "A", config);

    return { ...base, puntosA: siguientePuntuacion(puntosA) };
  }

  if (puntosB === "AD") return sumarJuego(base, "B", config);

  if (puntosA === "AD") {
    return { ...base, puntosA: 40, puntosB: 40 };
  }

  if (puntosA === 40 && puntosB === 40) {
    return { ...base, puntosB: "AD" };
  }

  if (puntosB === 40) return sumarJuego(base, "B", config);

  return { ...base, puntosB: siguientePuntuacion(puntosB) };
}

// ======================================================
// 7. PANTALLA PRINCIPAL
// ======================================================

export default function HomeScreen() {
  const [config, setConfig] = useState<Configuracion>({
    mejorDe: 5,
    juegosPorSet: 6,
    puntosTieBreak: 7,
  });

  const [primerSaque, setPrimerSaque] = useState<Pareja>("A");
  const [marcador, setMarcador] = useState<Marcador>(crearMarcadorInicial("A"));
  const [historial, setHistorial] = useState<Marcador[]>([]);
  const [partidoIniciado, setPartidoIniciado] = useState(false);
  const [pausado, setPausado] = useState(true);

  // Evita guardar el estado inicial antes de recuperar el guardado.
  const [cargando, setCargando] = useState(true);
  const [partidoRecuperado, setPartidoRecuperado] = useState(false);

  // Guarda el instante de la última actualización del cronómetro.
  const ultimaMarcaTiempo = useRef<number | null>(null);

  // Actualiza los cronómetros según el tiempo real transcurrido.
  function actualizarCronometro() {
    const ahora = Date.now();
    const ultimaMarca = ultimaMarcaTiempo.current;

    if (ultimaMarca === null) {
      ultimaMarcaTiempo.current = ahora;
      return;
    }

    const segundosTranscurridos = Math.floor((ahora - ultimaMarca) / 1000);

    if (segundosTranscurridos <= 0) return;

    // Avanzamos la referencia para no contar dos veces el mismo tiempo.
    ultimaMarcaTiempo.current = ultimaMarca + segundosTranscurridos * 1000;

    setMarcador((actual) => ({
      ...actual,
      tiempoTotal: actual.tiempoTotal + segundosTranscurridos,
      tiempoSet: actual.tiempoSet + segundosTranscurridos,
      tiempoJuego: actual.tiempoJuego + segundosTranscurridos,
    }));
  }

  // ----------------------------------------------------
  // 7.1 Recuperar una partida guardada al abrir la app
  // ----------------------------------------------------

  useEffect(() => {
    async function recuperarPartida() {
      try {
        const guardado = await AsyncStorage.getItem(CLAVE_PARTIDA);

        if (guardado) {
          const partida: PartidaGuardada = JSON.parse(guardado);

          if (partida.version === 1) {
            setConfig(partida.config);
            setHistorial(partida.historial);
            setPartidoIniciado(partida.partidoIniciado);

            const estabaPausado = partida.pausado ?? true;
            setPausado(estabaPausado);

            const ahora = Date.now();
            const ultimaMarca = partida.ultimaMarcaTiempo ?? null;

            let marcadorRecuperado = partida.marcador;

            // Si la partida estaba en marcha, contabilizamos también
            // el tiempo transcurrido mientras la aplicación estuvo cerrada.
            if (
              partida.partidoIniciado &&
              !estabaPausado &&
              !partida.marcador.partidoTerminado &&
              ultimaMarca !== null
            ) {
              const segundosTranscurridos = Math.max(
                0,
                Math.floor((ahora - ultimaMarca) / 1000),
              );

              marcadorRecuperado = {
                ...partida.marcador,
                tiempoTotal:
                  partida.marcador.tiempoTotal + segundosTranscurridos,
                tiempoSet: partida.marcador.tiempoSet + segundosTranscurridos,
                tiempoJuego:
                  partida.marcador.tiempoJuego + segundosTranscurridos,
              };
            }

            setMarcador(marcadorRecuperado);

            // La referencia comienza desde el momento de recuperación.
            ultimaMarcaTiempo.current =
              partida.partidoIniciado && !estabaPausado ? ahora : ultimaMarca;

            setPartidoRecuperado(partida.partidoIniciado);
          }
        }
      } catch (error) {
        console.warn("No se pudo recuperar la partida:", error);
      } finally {
        setCargando(false);
      }
    }

    recuperarPartida();
  }, []);

  // ----------------------------------------------------
  // 7.2 Guardar automáticamente todos los datos
  // ----------------------------------------------------

  useEffect(() => {
    if (cargando) return;

    const partida: PartidaGuardada = {
      version: 1,
      config,
      marcador,
      historial,
      partidoIniciado,
      pausado,
      ultimaMarcaTiempo: ultimaMarcaTiempo.current,
    };

    AsyncStorage.setItem(CLAVE_PARTIDA, JSON.stringify(partida)).catch(
      (error) => console.warn("No se pudo guardar la partida:", error),
    );
  }, [cargando, config, marcador, historial, partidoIniciado, pausado]);

  // ----------------------------------------------------
  // 7.3 Detectar cuándo volvemos a la aplicación
  // ----------------------------------------------------

  useEffect(() => {
    const suscripcion = AppState.addEventListener("change", (estado) => {
      if (
        estado === "active" &&
        partidoIniciado &&
        !pausado &&
        !marcador.partidoTerminado
      ) {
        actualizarCronometro();
      }
    });

    return () => suscripcion.remove();
  }, [partidoIniciado, pausado, marcador.partidoTerminado]);

  // ----------------------------------------------------
  // 7.4 Cronómetros basados en tiempo real
  // ----------------------------------------------------

  useEffect(() => {
    if (!partidoIniciado || pausado || marcador.partidoTerminado) {
      return;
    }

    // Si no existe referencia, iniciamos el seguimiento.
    if (ultimaMarcaTiempo.current === null) {
      ultimaMarcaTiempo.current = Date.now();
    }

    const intervalo = setInterval(() => {
      actualizarCronometro();
    }, 1000);

    return () => clearInterval(intervalo);
  }, [partidoIniciado, pausado, marcador.partidoTerminado]);

  // ----------------------------------------------------
  // 7.5 Acciones del partido
  // ----------------------------------------------------

  function alternarPausa() {
    if (marcador.partidoTerminado || !partidoIniciado) return;

    if (pausado) {
      // Al reanudar, comenzamos a contar desde este instante.
      ultimaMarcaTiempo.current = Date.now();
      setPausado(false);
    } else {
      // Contabilizamos el tiempo pendiente antes de pausar.
      actualizarCronometro();
      setPausado(true);
    }

    setPartidoRecuperado(false);
  }

  function iniciarPartido() {
    // La referencia temporal comienza exactamente al iniciar el partido.
    ultimaMarcaTiempo.current = Date.now();

    setMarcador(crearMarcadorInicial(primerSaque));
    setHistorial([]);
    setPartidoIniciado(true);
    setPausado(false);
    setPartidoRecuperado(false);
  }

  function sumarPunto(ganador: Pareja) {
    if (pausado || marcador.partidoTerminado) return;

    // Guardamos el estado anterior para permitir deshacer.
    setHistorial((actual) => [...actual, marcador]);
    setMarcador((actual) => aplicarPunto(actual, ganador, config));
  }

  function deshacerUltimoPunto() {
    if (historial.length === 0) return;

    const anterior = historial[historial.length - 1];
    setMarcador(anterior);
    setHistorial((actual) => actual.slice(0, -1));
  }

  function reiniciarPartido() {
    // Eliminamos la referencia temporal del partido anterior.
    ultimaMarcaTiempo.current = null;

    setMarcador(crearMarcadorInicial(primerSaque));
    setHistorial([]);
    setPartidoIniciado(false);
    setPausado(true);
    setPartidoRecuperado(false);
  }

  // Mientras se lee el almacenamiento no mostramos una pantalla incorrecta.
  if (cargando) {
    return (
      <View style={[styles.screen, styles.loadingContainer]}>
        <Text style={styles.logo}>PADELAPP</Text>
        <Text style={styles.subtitle}>Recuperando partido...</Text>
      </View>
    );
  }

  // ====================================================
  // 8. PANTALLA DE CONFIGURACIÓN
  // ====================================================

  if (!partidoIniciado) {
    return (
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator
      >
        <Text style={styles.logo}>PADELAPP</Text>
        <Text style={styles.title}>Configurar partido</Text>
        <Text style={styles.subtitle}>
          Personaliza las reglas antes de jugar.
        </Text>

        <View style={styles.configCard}>
          <Text style={styles.configTitle}>FORMATO DEL PARTIDO</Text>
          <View style={styles.optionsRow}>
            {([3, 5, 7] as const).map((valor) => (
              <Pressable
                key={valor}
                style={[
                  styles.optionButton,
                  config.mejorDe === valor && styles.optionSelected,
                ]}
                onPress={() =>
                  setConfig((actual) => ({ ...actual, mejorDe: valor }))
                }
              >
                <Text
                  style={[
                    styles.optionText,
                    config.mejorDe === valor && styles.optionTextSelected,
                  ]}
                >
                  {valor} sets
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.configDescription}>
            Se gana al conseguir {Math.ceil(config.mejorDe / 2)} sets.
          </Text>
        </View>

        <View style={styles.configCard}>
          <Text style={styles.configTitle}>JUEGOS PARA GANAR UN SET</Text>
          <View style={styles.optionsRow}>
            {([4, 6, 8] as const).map((valor) => (
              <Pressable
                key={valor}
                style={[
                  styles.optionButton,
                  config.juegosPorSet === valor && styles.optionSelected,
                ]}
                onPress={() =>
                  setConfig((actual) => ({ ...actual, juegosPorSet: valor }))
                }
              >
                <Text
                  style={[
                    styles.optionText,
                    config.juegosPorSet === valor && styles.optionTextSelected,
                  ]}
                >
                  {valor} juegos
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.configDescription}>
            Siempre con dos juegos de diferencia.
          </Text>
        </View>

        <View style={styles.configCard}>
          <Text style={styles.configTitle}>PUNTOS DEL TIE-BREAK</Text>
          <View style={styles.optionsRow}>
            {([7, 10] as const).map((valor) => (
              <Pressable
                key={valor}
                style={[
                  styles.optionButton,
                  config.puntosTieBreak === valor && styles.optionSelected,
                ]}
                onPress={() =>
                  setConfig((actual) => ({
                    ...actual,
                    puntosTieBreak: valor,
                  }))
                }
              >
                <Text
                  style={[
                    styles.optionText,
                    config.puntosTieBreak === valor &&
                      styles.optionTextSelected,
                  ]}
                >
                  {valor} puntos
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.configDescription}>
            Se necesitan dos puntos de diferencia.
          </Text>
        </View>

        {/* Selección de la pareja que comienza sacando */}
        <View style={styles.configCard}>
          <Text style={styles.configTitle}>PRIMER SAQUE</Text>
          <View style={styles.optionsRow}>
            {(["A", "B"] as const).map((pareja) => (
              <Pressable
                key={pareja}
                style={[
                  styles.optionButton,
                  primerSaque === pareja && styles.optionSelected,
                ]}
                onPress={() => setPrimerSaque(pareja)}
              >
                <Text
                  style={[
                    styles.optionText,
                    primerSaque === pareja && styles.optionTextSelected,
                  ]}
                >
                  🎾 PAREJA {pareja}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.configDescription}>
            La pelota indicará qué pareja tiene el saque durante el partido.
          </Text>
        </View>

        <Pressable style={styles.startButton} onPress={iniciarPartido}>
          <Text style={styles.startButtonText}>COMENZAR PARTIDO</Text>
        </Pressable>
      </ScrollView>
    );
  }

  // ====================================================
  // 9. PANTALLA DEL MARCADOR
  // ====================================================

  const setsNecesarios = Math.ceil(config.mejorDe / 2);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator
    >
      <Text style={styles.logo}>PADELAPP</Text>
      <Text style={styles.title}>Marcador del partido</Text>

      {partidoRecuperado && (
        <View style={styles.noticeCard}>
          <Text style={styles.noticeText}>
            PARTIDO RECUPERADO · Revisa el marcador y pulsa reanudar.
          </Text>
        </View>
      )}

      {/* Cronómetros */}
      <View style={styles.timerCard}>
        <Text style={styles.timerLabel}>DURACIÓN DEL PARTIDO</Text>
        <Text style={styles.timerMain}>
          {formatearTiempo(marcador.tiempoTotal)}
        </Text>

        <View style={styles.timerRow}>
          <View style={styles.timerSmall}>
            <Text style={styles.timerLabel}>SET ACTUAL</Text>
            <Text style={styles.timerValue}>
              {formatearTiempo(marcador.tiempoSet)}
            </Text>
          </View>
          <View style={styles.timerSmall}>
            <Text style={styles.timerLabel}>JUEGO ACTUAL</Text>
            <Text style={styles.timerValue}>
              {formatearTiempo(marcador.tiempoJuego)}
            </Text>
          </View>
        </View>
      </View>

      {/* Resultado por sets */}
      <View style={styles.scoreTable}>
        <Text style={styles.sectionTitle}>RESULTADO POR SETS</Text>

        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>PAREJA</Text>
          {marcador.resultadosSets.map((_, index) => (
            <Text key={index} style={styles.tableHeader}>
              SET {index + 1}
            </Text>
          ))}
          {!marcador.partidoTerminado && (
            <Text style={styles.tableHeader}>ACTUAL</Text>
          )}
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.tableTeam}>A</Text>
          {marcador.resultadosSets.map((set, index) => (
            <View key={index} style={styles.tableResult}>
              <Text style={styles.tableNumber}>{set.parejaA}</Text>
              {set.tieBreakA !== undefined && (
                <Text style={styles.tieBreakSmall}>({set.tieBreakA})</Text>
              )}
            </View>
          ))}
          {!marcador.partidoTerminado && (
            <Text style={styles.tableNumber}>{marcador.juegosA}</Text>
          )}
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.tableTeam}>B</Text>
          {marcador.resultadosSets.map((set, index) => (
            <View key={index} style={styles.tableResult}>
              <Text style={styles.tableNumber}>{set.parejaB}</Text>
              {set.tieBreakB !== undefined && (
                <Text style={styles.tieBreakSmall}>({set.tieBreakB})</Text>
              )}
            </View>
          ))}
          {!marcador.partidoTerminado && (
            <Text style={styles.tableNumber}>{marcador.juegosB}</Text>
          )}
        </View>
      </View>

      {/* Marcador y pareja que saca */}
      <View style={styles.scoreContainer}>
        <View style={styles.team}>
          <View style={styles.teamHeading}>
            <Text style={styles.teamName}>PAREJA A</Text>
            {marcador.parejaSaque === "A" && (
              <Text style={styles.serveBall}>🎾</Text>
            )}
          </View>

          <Text style={styles.games}>
            Sets: {marcador.setsA}/{setsNecesarios}
          </Text>

          {marcador.tieBreak ? (
            <>
              <Text style={styles.tieBreakTitle}>TIE-BREAK</Text>
              <Text style={styles.score}>{marcador.puntosTieBreakA}</Text>
            </>
          ) : (
            <>
              <Text style={styles.games}>Juegos: {marcador.juegosA}</Text>
              <Text style={styles.score}>{marcador.puntosA}</Text>
            </>
          )}

          <Pressable
            style={[
              styles.button,
              (pausado || marcador.partidoTerminado) && styles.disabledButton,
            ]}
            disabled={pausado || marcador.partidoTerminado}
            onPress={() => sumarPunto("A")}
          >
            <Text style={styles.buttonText}>+ PUNTO</Text>
          </Pressable>
        </View>

        <View style={styles.team}>
          <View style={styles.teamHeading}>
            <Text style={styles.teamName}>PAREJA B</Text>
            {marcador.parejaSaque === "B" && (
              <Text style={styles.serveBall}>🎾</Text>
            )}
          </View>

          <Text style={styles.games}>
            Sets: {marcador.setsB}/{setsNecesarios}
          </Text>

          {marcador.tieBreak ? (
            <>
              <Text style={styles.tieBreakTitle}>TIE-BREAK</Text>
              <Text style={styles.score}>{marcador.puntosTieBreakB}</Text>
            </>
          ) : (
            <>
              <Text style={styles.games}>Juegos: {marcador.juegosB}</Text>
              <Text style={styles.score}>{marcador.puntosB}</Text>
            </>
          )}

          <Pressable
            style={[
              styles.button,
              (pausado || marcador.partidoTerminado) && styles.disabledButton,
            ]}
            disabled={pausado || marcador.partidoTerminado}
            onPress={() => sumarPunto("B")}
          >
            <Text style={styles.buttonText}>+ PUNTO</Text>
          </Pressable>
        </View>
      </View>

      {/* Avisos de pista y tie-break */}
      {marcador.cambioLadoPendiente && (
        <View style={styles.noticeCard}>
          <Text style={styles.noticeText}>↔ CAMBIO DE LADO</Text>
        </View>
      )}

      {marcador.tieBreak && (
        <Text style={styles.statusText}>
          TIE-BREAK A {config.puntosTieBreak} PUNTOS
        </Text>
      )}

      {marcador.partidoTerminado && (
        <View style={styles.winnerCard}>
          <Text style={styles.winnerText}>¡PARTIDO TERMINADO!</Text>
          <Text style={styles.winnerSubtitle}>
            {marcador.setsA > marcador.setsB
              ? "¡GANA LA PAREJA A!"
              : "¡GANA LA PAREJA B!"}
          </Text>
        </View>
      )}

      {/* Duración de los sets */}
      {marcador.resultadosSets.length > 0 && (
        <View style={styles.durationCard}>
          <Text style={styles.sectionTitle}>DURACIÓN DE LOS SETS</Text>
          {marcador.resultadosSets.map((set, index) => (
            <View key={index} style={styles.durationRow}>
              <Text style={styles.durationText}>
                Set {index + 1}: {set.parejaA}-{set.parejaB}
              </Text>
              <Text style={styles.durationText}>
                {formatearTiempo(set.duracion)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Últimos juegos */}
      {marcador.duracionesJuegos.length > 0 && (
        <View style={styles.durationCard}>
          <Text style={styles.sectionTitle}>ÚLTIMOS JUEGOS</Text>
          {marcador.duracionesJuegos.slice(-3).map((duracion, index) => (
            <View key={index} style={styles.durationRow}>
              <Text style={styles.durationText}>
                Juego{" "}
                {marcador.duracionesJuegos.length -
                  Math.min(3, marcador.duracionesJuegos.length) +
                  index +
                  1}
              </Text>
              <Text style={styles.durationText}>
                {formatearTiempo(duracion)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Controles */}
      <Pressable
        style={styles.secondaryButton}
        disabled={marcador.partidoTerminado}
        onPress={alternarPausa}
      >
        <Text style={styles.secondaryButtonText}>
          {pausado ? "REANUDAR PARTIDO" : "PAUSAR PARTIDO"}
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.secondaryButton,
          historial.length === 0 && styles.disabledButton,
        ]}
        disabled={historial.length === 0}
        onPress={deshacerUltimoPunto}
      >
        <Text style={styles.secondaryButtonText}>DESHACER ÚLTIMO PUNTO</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={reiniciarPartido}>
        <Text style={styles.secondaryButtonText}>NUEVO PARTIDO</Text>
      </Pressable>

      {pausado && !marcador.partidoTerminado && (
        <Text style={styles.statusText}>PARTIDO EN PAUSA</Text>
      )}
    </ScrollView>
  );
}

// ======================================================
// 10. ESTILOS
// ======================================================

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#101820",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
    width: "100%",
  },
  logo: {
    color: "#B6E65C",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 4,
    marginBottom: 15,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    color: "#AAB7C4",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  configCard: {
    backgroundColor: "#1C2B36",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    marginBottom: 12,
  },
  configTitle: {
    color: "#B6E65C",
    fontWeight: "bold",
    fontSize: 13,
    marginBottom: 14,
  },
  configDescription: {
    color: "#AAB7C4",
    fontSize: 12,
    marginTop: 10,
    lineHeight: 18,
  },
  optionsRow: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
  },
  optionButton: {
    flex: 1,
    minHeight: 44,
    justifyContent: "center",
    backgroundColor: "#263744",
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 4,
    alignItems: "center",
  },
  optionSelected: {
    backgroundColor: "#B6E65C",
  },
  optionText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  optionTextSelected: {
    color: "#101820",
  },
  startButton: {
    backgroundColor: "#B6E65C",
    padding: 16,
    minHeight: 50,
    justifyContent: "center",
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 8,
  },
  startButtonText: {
    color: "#101820",
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
  },
  timerCard: {
    backgroundColor: "#1C2B36",
    width: "100%",
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 14,
  },
  timerLabel: {
    color: "#AAB7C4",
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
  },
  timerMain: {
    color: "#B6E65C",
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 10,
    fontVariant: ["tabular-nums"],
  },
  timerRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 8,
    gap: 8,
  },
  timerSmall: {
    flex: 1,
    alignItems: "center",
    gap: 5,
  },
  timerValue: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    fontVariant: ["tabular-nums"],
  },
  scoreTable: {
    backgroundColor: "#1C2B36",
    borderRadius: 12,
    padding: 12,
    width: "100%",
    marginBottom: 14,
  },
  sectionTitle: {
    color: "#B6E65C",
    fontWeight: "bold",
    fontSize: 13,
    marginBottom: 12,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#344754",
  },
  tableHeader: {
    color: "#AAB7C4",
    fontSize: 10,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  tableTeam: {
    color: "#B6E65C",
    fontWeight: "bold",
    fontSize: 15,
    flex: 1,
    textAlign: "center",
  },
  tableNumber: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  tableResult: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  tieBreakSmall: {
    color: "#AAB7C4",
    fontSize: 9,
  },
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
  team: {
    flex: 1,
    minWidth: 0,
    backgroundColor: "#1C2B36",
    borderRadius: 15,
    padding: 12,
    alignItems: "center",
  },
  teamHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  teamName: {
    color: "#AAB7C4",
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
  },
  serveBall: {
    fontSize: 20,
  },
  games: {
    color: "#B6E65C",
    fontSize: 12,
    marginTop: 9,
    textAlign: "center",
  },
  score: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "bold",
    marginVertical: 16,
    fontVariant: ["tabular-nums"],
  },
  tieBreakTitle: {
    color: "#B6E65C",
    fontWeight: "bold",
    marginTop: 12,
    fontSize: 12,
  },
  button: {
    backgroundColor: "#B6E65C",
    paddingVertical: 13,
    paddingHorizontal: 6,
    borderRadius: 10,
    width: "100%",
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#101820",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  disabledButton: {
    opacity: 0.4,
  },
  statusText: {
    color: "#B6E65C",
    fontWeight: "bold",
    marginTop: 12,
    fontSize: 12,
    textAlign: "center",
  },
  noticeCard: {
    backgroundColor: "#263744",
    borderWidth: 1,
    borderColor: "#B6E65C",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  noticeText: {
    color: "#B6E65C",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  winnerCard: {
    backgroundColor: "#263744",
    borderWidth: 1,
    borderColor: "#B6E65C",
    padding: 15,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 15,
  },
  winnerText: {
    color: "#B6E65C",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  winnerSubtitle: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  durationCard: {
    backgroundColor: "#1C2B36",
    borderRadius: 12,
    padding: 15,
    width: "100%",
    marginTop: 12,
  },
  durationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    paddingVertical: 5,
  },
  durationText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontVariant: ["tabular-nums"],
  },
  secondaryButton: {
    backgroundColor: "#263744",
    padding: 14,
    minHeight: 46,
    justifyContent: "center",
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 12,
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
});
