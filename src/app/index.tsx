import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

// Puntuaciones posibles durante un juego
type Puntuacion = 0 | 15 | 30 | 40 | "AD";

// Pareja que gana un punto
type Pareja = "A" | "B";

// Marcador completo
type Marcador = {
  puntosA: Puntuacion;
  puntosB: Puntuacion;
  juegosA: number;
  juegosB: number;
};

// Avanzar una puntuación normal
function siguientePuntuacion(actual: Puntuacion): Puntuacion {
  if (actual === 0) return 15;
  if (actual === 15) return 30;
  if (actual === 30) return 40;

  return actual;
}

// Calcular el resultado después de ganar un punto
function aplicarPunto(marcador: Marcador, ganador: Pareja): Marcador {
  const { puntosA, puntosB, juegosA, juegosB } = marcador;

  // La pareja A gana el punto
  if (ganador === "A") {
    // A tenía ventaja: gana el juego
    if (puntosA === "AD") {
      return {
        puntosA: 0,
        puntosB: 0,
        juegosA: juegosA + 1,
        juegosB,
      };
    }

    // B tenía ventaja: volvemos a iguales
    if (puntosB === "AD") {
      return {
        ...marcador,
        puntosA: 40,
        puntosB: 40,
      };
    }

    // Ambos estaban a 40: ventaja para A
    if (puntosA === 40 && puntosB === 40) {
      return {
        ...marcador,
        puntosA: "AD",
      };
    }

    // A estaba a 40 y B tenía menos: A gana el juego
    if (puntosA === 40) {
      return {
        puntosA: 0,
        puntosB: 0,
        juegosA: juegosA + 1,
        juegosB,
      };
    }

    // Avance normal de A
    return {
      ...marcador,
      puntosA: siguientePuntuacion(puntosA),
    };
  }

  // La pareja B gana el punto

  // B tenía ventaja: gana el juego
  if (puntosB === "AD") {
    return {
      puntosA: 0,
      puntosB: 0,
      juegosA,
      juegosB: juegosB + 1,
    };
  }

  // A tenía ventaja: volvemos a iguales
  if (puntosA === "AD") {
    return {
      ...marcador,
      puntosA: 40,
      puntosB: 40,
    };
  }

  // Ambos estaban a 40: ventaja para B
  if (puntosA === 40 && puntosB === 40) {
    return {
      ...marcador,
      puntosB: "AD",
    };
  }

  // B estaba a 40 y A tenía menos: B gana el juego
  if (puntosB === 40) {
    return {
      puntosA: 0,
      puntosB: 0,
      juegosA,
      juegosB: juegosB + 1,
    };
  }

  // Avance normal de B
  return {
    ...marcador,
    puntosB: siguientePuntuacion(puntosB),
  };
}

export default function HomeScreen() {
  // Estado inicial del marcador
  const [marcador, setMarcador] = useState<Marcador>({
    puntosA: 0,
    puntosB: 0,
    juegosA: 0,
    juegosB: 0,
  });

  // Historial para deshacer puntos
  const [historial, setHistorial] = useState<Marcador[]>([]);

  // Registrar un punto
  function sumarPunto(ganador: Pareja) {
    // Guardamos el marcador anterior
    setHistorial((actual) => [...actual, marcador]);

    // Calculamos el nuevo marcador
    setMarcador((actual) => aplicarPunto(actual, ganador));
  }

  // Deshacer el último punto
  function deshacerUltimoPunto() {
    if (historial.length === 0) return;

    const marcadorAnterior = historial[historial.length - 1];

    setMarcador(marcadorAnterior);

    setHistorial((actual) => actual.slice(0, -1));
  }

  // Reiniciar el partido
  function reiniciarPartido() {
    setMarcador({
      puntosA: 0,
      puntosB: 0,
      juegosA: 0,
      juegosB: 0,
    });

    setHistorial([]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>PADELAPP</Text>

      <Text style={styles.title}>Tu partido, tu marcador.</Text>

      <Text style={styles.subtitle}>
        Controla tus partidos y descubre tus estadísticas.
      </Text>

      {/* Marcador de las parejas */}
      <View style={styles.scoreContainer}>
        {/* Pareja A */}
        <View style={styles.team}>
          <Text style={styles.teamName}>PAREJA A</Text>

          <Text style={styles.games}>Juegos: {marcador.juegosA}</Text>

          <Text style={styles.score}>{marcador.puntosA}</Text>

          <Pressable style={styles.button} onPress={() => sumarPunto("A")}>
            <Text style={styles.buttonText}>+ PUNTO</Text>
          </Pressable>
        </View>

        {/* Pareja B */}
        <View style={styles.team}>
          <Text style={styles.teamName}>PAREJA B</Text>

          <Text style={styles.games}>Juegos: {marcador.juegosB}</Text>

          <Text style={styles.score}>{marcador.puntosB}</Text>

          <Pressable style={styles.button} onPress={() => sumarPunto("B")}>
            <Text style={styles.buttonText}>+ PUNTO</Text>
          </Pressable>
        </View>
      </View>

      {/* Botones de control */}
      <Pressable style={styles.secondaryButton} onPress={deshacerUltimoPunto}>
        <Text style={styles.secondaryButtonText}>DESHACER ÚLTIMO PUNTO</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={reiniciarPartido}>
        <Text style={styles.secondaryButtonText}>REINICIAR PARTIDO</Text>
      </Pressable>

      <Text style={styles.footer}>
        Próximamente: sets, historial y estadísticas
      </Text>
    </View>
  );
}

// Estilos de la aplicación
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101820",
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },

  logo: {
    color: "#B6E65C",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 4,
    marginBottom: 25,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },

  subtitle: {
    color: "#AAB7C4",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
  },

  scoreContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 15,
  },

  team: {
    flex: 1,
    backgroundColor: "#1C2B36",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },

  teamName: {
    color: "#AAB7C4",
    fontSize: 14,
    fontWeight: "bold",
  },

  games: {
    color: "#B6E65C",
    fontSize: 14,
    marginTop: 12,
  },

  score: {
    color: "#FFFFFF",
    fontSize: 55,
    fontWeight: "bold",
    marginVertical: 20,
  },

  button: {
    backgroundColor: "#B6E65C",
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },

  buttonText: {
    color: "#101820",
    fontSize: 14,
    fontWeight: "bold",
  },

  secondaryButton: {
    backgroundColor: "#263744",
    padding: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 15,
  },

  secondaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 13,
  },

  footer: {
    color: "#AAB7C4",
    fontSize: 12,
    marginTop: 35,
  },
});
