import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

// ==========================================
// 1. TIPOS Y CONFIGURACIÓN
// ==========================================

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
};

// ==========================================
// 2. FUNCIONES AUXILIARES
// ==========================================

function crearMarcadorInicial(): Marcador {
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
  if (juegosA >= juegosNecesarios && juegosA - juegosB >= 2) {
    return "A";
  }

  if (juegosB >= juegosNecesarios && juegosB - juegosA >= 2) {
    return "B";
  }

  return null;
}

// ==========================================
// 3. GESTIÓN DE SETS
// ==========================================

function registrarSet(
  marcador: Marcador,
  ganador: Pareja,
  resultadoA: number,
  resultadoB: number,
  config: Configuracion,
  puntosTB?: { a: number; b: number },
): Marcador {
  const nuevoSetsA = marcador.setsA + (ganador === "A" ? 1 : 0);
  const nuevoSetsB = marcador.setsB + (ganador === "B" ? 1 : 0);

  const setsNecesarios = Math.ceil(config.mejorDe / 2);
  const partidoTerminado =
    nuevoSetsA >= setsNecesarios || nuevoSetsB >= setsNecesarios;

  const nuevoResultado: ResultadoSet = {
    parejaA: resultadoA,
    parejaB: resultadoB,
    tieBreakA: puntosTB?.a,
    tieBreakB: puntosTB?.b,
    duracion: marcador.tiempoSet,
  };

  return {
    ...marcador,
    setsA: nuevoSetsA,
    setsB: nuevoSetsB,
    resultadosSets: [...marcador.resultadosSets, nuevoResultado],
    puntosA: 0,
    puntosB: 0,
    juegosA: 0,
    juegosB: 0,
    tieBreak: false,
    puntosTieBreakA: 0,
    puntosTieBreakB: 0,
    tiempoSet: 0,
    tiempoJuego: 0,
    partidoTerminado,
  };
}

// ==========================================
// 4. GESTIÓN DEL TIE-BREAK
// ==========================================

function aplicarTieBreak(
  marcador: Marcador,
  ganador: Pareja,
  config: Configuracion,
): Marcador {
  const puntosA = marcador.puntosTieBreakA + (ganador === "A" ? 1 : 0);
  const puntosB = marcador.puntosTieBreakB + (ganador === "B" ? 1 : 0);

  const nuevoMarcador: Marcador = {
    ...marcador,
    puntosTieBreakA: puntosA,
    puntosTieBreakB: puntosB,
  };

  const diferencia = Math.abs(puntosA - puntosB);

  if (puntosA >= config.puntosTieBreak && diferencia >= 2) {
    return registrarSet(
      nuevoMarcador,
      "A",
      marcador.juegosA + 1,
      marcador.juegosB,
      config,
      { a: puntosA, b: puntosB },
    );
  }

  if (puntosB >= config.puntosTieBreak && diferencia >= 2) {
    return registrarSet(
      nuevoMarcador,
      "B",
      marcador.juegosA,
      marcador.juegosB + 1,
      config,
      { a: puntosA, b: puntosB },
    );
  }

  return nuevoMarcador;
}

// ==========================================
// 5. GESTIÓN DE JUEGOS
// ==========================================

function sumarJuego(
  marcador: Marcador,
  ganador: Pareja,
  config: Configuracion,
): Marcador {
  const nuevoMarcador: Marcador = {
    ...marcador,
    juegosA: marcador.juegosA + (ganador === "A" ? 1 : 0),
    juegosB: marcador.juegosB + (ganador === "B" ? 1 : 0),
    puntosA: 0,
    puntosB: 0,
    duracionesJuegos: [...marcador.duracionesJuegos, marcador.tiempoJuego],
    tiempoJuego: 0,
  };

  const ganadorSet = setGanado(
    nuevoMarcador.juegosA,
    nuevoMarcador.juegosB,
    config.juegosPorSet,
  );

  if (ganadorSet !== null) {
    return registrarSet(
      nuevoMarcador,
      ganadorSet,
      nuevoMarcador.juegosA,
      nuevoMarcador.juegosB,
      config,
    );
  }

  if (
    nuevoMarcador.juegosA === config.juegosPorSet &&
    nuevoMarcador.juegosB === config.juegosPorSet
  ) {
    return {
      ...nuevoMarcador,
      tieBreak: true,
    };
  }

  return nuevoMarcador;
}

// ==========================================
// 6. GESTIÓN DE PUNTOS
// ==========================================

function aplicarPunto(
  marcador: Marcador,
  ganador: Pareja,
  config: Configuracion,
): Marcador {
  if (marcador.tieBreak) {
    return aplicarTieBreak(marcador, ganador, config);
  }

  const { puntosA, puntosB } = marcador;

  if (ganador === "A") {
    if (puntosA === "AD") {
      return sumarJuego(marcador, "A", config);
    }

    if (puntosB === "AD") {
      return {
        ...marcador,
        puntosA: 40,
        puntosB: 40,
      };
    }

    if (puntosA === 40 && puntosB === 40) {
      return {
        ...marcador,
        puntosA: "AD",
      };
    }

    if (puntosA === 40) {
      return sumarJuego(marcador, "A", config);
    }

    return {
      ...marcador,
      puntosA: siguientePuntuacion(puntosA),
    };
  }

  if (puntosB === "AD") {
    return sumarJuego(marcador, "B", config);
  }

  if (puntosA === "AD") {
    return {
      ...marcador,
      puntosA: 40,
      puntosB: 40,
    };
  }

  if (puntosA === 40 && puntosB === 40) {
    return {
      ...marcador,
      puntosB: "AD",
    };
  }

  if (puntosB === 40) {
    return sumarJuego(marcador, "B", config);
  }

  return {
    ...marcador,
    puntosB: siguientePuntuacion(puntosB),
  };
}

// ==========================================
// 7. COMPONENTE PRINCIPAL
// ==========================================

export default function HomeScreen() {
  const [config, setConfig] = useState<Configuracion>({
    mejorDe: 5,
    juegosPorSet: 6,
    puntosTieBreak: 7,
  });

  const [marcador, setMarcador] = useState<Marcador>(crearMarcadorInicial);

  const [historial, setHistorial] = useState<Marcador[]>([]);
  const [partidoIniciado, setPartidoIniciado] = useState(false);
  const [pausado, setPausado] = useState(true);

  // CRONÓMETROS
  useEffect(() => {
    if (!partidoIniciado || pausado || marcador.partidoTerminado) {
      return;
    }

    const intervalo = setInterval(() => {
      setMarcador((actual) => ({
        ...actual,
        tiempoTotal: actual.tiempoTotal + 1,
        tiempoSet: actual.tiempoSet + 1,
        tiempoJuego: actual.tiempoJuego + 1,
      }));
    }, 1000);

    return () => clearInterval(intervalo);
  }, [partidoIniciado, pausado, marcador.partidoTerminado]);

  // INICIAR PARTIDO
  function iniciarPartido() {
    setMarcador(crearMarcadorInicial());
    setHistorial([]);
    setPartidoIniciado(true);
    setPausado(false);
  }

  // SUMAR PUNTO
  function sumarPunto(ganador: Pareja) {
    if (pausado || marcador.partidoTerminado) {
      return;
    }

    setHistorial((actual) => [...actual, marcador]);
    setMarcador((actual) => aplicarPunto(actual, ganador, config));
  }

  // DESHACER ÚLTIMO PUNTO
  function deshacerUltimoPunto() {
    if (historial.length === 0) {
      return;
    }

    const anterior = historial[historial.length - 1];
    setMarcador(anterior);
    setHistorial((actual) => actual.slice(0, -1));
  }

  // REINICIAR PARTIDO
  function reiniciarPartido() {
    setMarcador(crearMarcadorInicial());
    setHistorial([]);
    setPartidoIniciado(false);
    setPausado(true);
  }
  // ==========================================
  // 8. PANTALLA DE CONFIGURACIÓN
  // ==========================================

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
                  setConfig((actual) => ({
                    ...actual,
                    mejorDe: valor,
                  }))
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
                  setConfig((actual) => ({
                    ...actual,
                    juegosPorSet: valor,
                  }))
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

        <Pressable style={styles.startButton} onPress={iniciarPartido}>
          <Text style={styles.startButtonText}>COMENZAR PARTIDO</Text>
        </Pressable>
      </ScrollView>
    );
  }

  // ==========================================
  // 9. PANTALLA DEL MARCADOR
  // ==========================================

  const setsNecesarios = Math.ceil(config.mejorDe / 2);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator
    >
      <Text style={styles.logo}>PADELAPP</Text>

      <Text style={styles.title}>Marcador del partido</Text>

      {/* CRONÓMETRO TOTAL */}
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

      {/* RESULTADO POR SETS */}
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

        {/* Pareja A */}
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

        {/* Pareja B */}
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

      {/* PUNTUACIÓN ACTUAL */}
      <View style={styles.scoreContainer}>
        <View style={styles.team}>
          <Text style={styles.teamName}>PAREJA A</Text>

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
          <Text style={styles.teamName}>PAREJA B</Text>

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

      {/* ESTADO DEL PARTIDO */}
      {marcador.tieBreak && (
        <Text style={styles.statusText}>
          Desempate a {config.puntosTieBreak} puntos
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

      {/* DURACIÓN DE LOS SETS */}
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

      {/* ÚLTIMOS JUEGOS */}
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

      {/* CONTROLES */}
      <Pressable
        style={styles.secondaryButton}
        disabled={marcador.partidoTerminado}
        onPress={() => setPausado((actual) => !actual)}
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
// ==========================================
// 10. ESTILOS
// ==========================================

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#101820",
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

  teamName: {
    color: "#AAB7C4",
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
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
