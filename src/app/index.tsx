import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  // Estados del marcador
  const [puntosA, setPuntosA] = useState(0);
  const [puntosB, setPuntosB] = useState(0);

  // Guarda qué pareja ha conseguido el último punto
  const [ultimoPunto, setUltimoPunto] = useState<"A" | "B" | null>(null);

  // Sumar un punto a la pareja A
  function sumarPuntoA() {
    setPuntosA((actual) => actual + 1);
    setUltimoPunto("A");
  }

  // Sumar un punto a la pareja B
  function sumarPuntoB() {
    setPuntosB((actual) => actual + 1);
    setUltimoPunto("B");
  }

  // Deshacer el último punto anotado
  function deshacerUltimoPunto() {
    if (ultimoPunto === "A") {
      setPuntosA((actual) => Math.max(0, actual - 1));
    }

    if (ultimoPunto === "B") {
      setPuntosB((actual) => Math.max(0, actual - 1));
    }

    setUltimoPunto(null);
  }

  // Reiniciar el marcador
  function reiniciarPartido() {
    setPuntosA(0);
    setPuntosB(0);
    setUltimoPunto(null);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>PADELAPP</Text>

      <Text style={styles.title}>Tu partido, tu marcador.</Text>

      <Text style={styles.subtitle}>
        Controla tus partidos y descubre tus estadísticas.
      </Text>

      {/* Marcador de las dos parejas */}
      <View style={styles.scoreContainer}>
        {/* Pareja A */}
        <View style={styles.team}>
          <Text style={styles.teamName}>PAREJA A</Text>

          <Text style={styles.score}>{puntosA}</Text>

          <Pressable style={styles.button} onPress={sumarPuntoA}>
            <Text style={styles.buttonText}>+ PUNTO</Text>
          </Pressable>
        </View>

        {/* Pareja B */}
        <View style={styles.team}>
          <Text style={styles.teamName}>PAREJA B</Text>

          <Text style={styles.score}>{puntosB}</Text>

          <Pressable style={styles.button} onPress={sumarPuntoB}>
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

      <Text style={styles.footer}>Próximamente: historial y estadísticas</Text>
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
