# Modelo de datos y persistencia

## 1. Introducción

PadelApp utiliza TypeScript para definir la estructura de los datos que intervienen durante un partido.

Los tipos permiten establecer qué información contiene cada objeto y qué valores son válidos.

Actualmente, los datos de la partida se gestionan localmente mediante el estado de React y se conservan utilizando AsyncStorage.

## 2. Tipos principales

### Puntuacion

Representa la puntuación de una pareja durante un juego.

```tsx
type Puntuacion = 0 | 15 | 30 | 40 | "AD";
```

Los valores representan los estados posibles de un juego, incluida la ventaja.

### Pareja

Identifica a una de las dos parejas que participan en el partido.

```tsx
type Pareja = "A" | "B";
```

Se utiliza para identificar qué pareja gana puntos, juegos, sets o realiza el saque.

### Configuracion

Contiene las reglas seleccionadas antes de iniciar el partido.

```tsx
type Configuracion = {
  mejorDe: 3 | 5 | 7;
  juegosPorSet: 4 | 6 | 8;
  puntosTieBreak: 7 | 10;
  primerSaque: Pareja;
};
```

Esta configuración permite adaptar el funcionamiento del marcador a distintos formatos de partido.

### ResultadoSet

Representa el resultado de un set terminado.

```tsx
type ResultadoSet = {
  parejaA: number;
  parejaB: number;
  tiempo: number;
};
```

Almacena los juegos conseguidos por cada pareja y la duración del set.

### Marcador

Es el tipo principal para representar el estado de una partida.

Contiene la puntuación actual, los juegos, los sets, los cronómetros y otros datos necesarios para controlar el partido.

Entre sus propiedades se encuentran:

- Puntuación de la pareja A y B.
- Juegos ganados por cada pareja.
- Sets ganados.
- Resultados de los sets finalizados.
- Tiempo total del partido.
- Tiempo del set actual.
- Tiempo del juego actual.
- Estado del tie-break.
- Puntos del tie-break.
- Pareja responsable del saque.
- Primer saque del tie-break.
- Indicador de cambio de lado pendiente.
- Estado de finalización del partido.

La definición completa de `Marcador` se mantiene en el código fuente para evitar duplicar aquí una versión que pueda quedar desactualizada.

## 3. Historial de estados

PadelApp utiliza un historial de marcadores para permitir deshacer el último punto.

El historial almacena estados anteriores del marcador:

```tsx
historial: Marcador[];
```

Antes de aplicar un punto, se conserva una copia del estado anterior.

Cuando se ejecuta `deshacerUltimoPunto`, se recupera el último estado almacenado y se elimina esa entrada del historial.

Este mecanismo permite corregir errores durante el partido sin tener que reiniciar la partida completa.

## 4. PartidaGuardada

Para conservar la partida entre sesiones, se utiliza un tipo específico llamado `PartidaGuardada`.

```tsx
type PartidaGuardada = {
  version: 1;
  config: Configuracion;
  marcador: Marcador;
  historial: Marcador[];
  partidoIniciado: boolean;
  pausado?: boolean;
  ultimaMarcaTiempo?: number | null;
};
```

### Descripción de las propiedades

| Propiedad | Función |
|---|---|
| `version` | Identifica la versión del formato de datos guardado. |
| `config` | Conserva la configuración del partido. |
| `marcador` | Guarda el estado actual de la partida. |
| `historial` | Conserva los estados anteriores del marcador. |
| `partidoIniciado` | Indica si la partida está iniciada. |
| `pausado` | Indica si la partida está pausada. |
| `ultimaMarcaTiempo` | Permite calcular el tiempo transcurrido desde la última referencia temporal. |

Las propiedades opcionales permiten gestionar estados en los que esos valores no estén disponibles.

## 5. Almacenamiento local con AsyncStorage

AsyncStorage proporciona almacenamiento persistente de pares clave-valor en el dispositivo.

PadelApp utiliza una clave para almacenar la partida actual.

El proceso de guardado consiste en:

1. Crear un objeto con la información que debe conservarse.
2. Convertir el objeto a texto mediante `JSON.stringify`.
3. Guardar el resultado mediante `AsyncStorage.setItem`.

Conceptualmente:

```tsx
await AsyncStorage.setItem(
  CLAVE_PARTIDA,
  JSON.stringify(partida)
);
```

Para recuperar los datos:

```tsx
const datos = await AsyncStorage.getItem(CLAVE_PARTIDA);
```

Si existen datos, se convierten nuevamente en un objeto mediante `JSON.parse`.

La aplicación comprueba la versión del formato guardado antes de restaurar la partida.

## 6. Recuperación de una partida

Al iniciar la aplicación:

1. Se consulta AsyncStorage.
2. Se comprueba si existe una partida guardada.
3. Se analiza la información almacenada.
4. Se comprueba que la versión sea compatible.
5. Se restaura la configuración.
6. Se restaura el marcador y el historial.
7. Se recupera el estado de inicio y pausa.
8. Si la partida estaba activa, se calcula el tiempo transcurrido desde la última marca temporal.

De esta forma se puede continuar una partida sin perder el resultado alcanzado.

## 7. Relación entre AppState y persistencia

AppState permite conocer cuándo la aplicación pasa a primer plano o segundo plano.

Cuando vuelve a primer plano, PadelApp comprueba si existe una partida activa y no pausada.

En ese caso, actualiza los cronómetros utilizando la diferencia entre marcas temporales.

AsyncStorage conserva los datos para que también puedan recuperarse después de cerrar y volver a abrir la aplicación.

Son dos mecanismos complementarios:

- AppState detecta cambios en el ciclo de vida de la aplicación.
- AsyncStorage conserva los datos entre sesiones.

## 8. Limitaciones actuales

La persistencia actual es local al dispositivo.

Esto significa que:

- No existe sincronización entre dispositivos.
- No hay cuentas de usuario.
- No se dispone de una base de datos remota.
- El historial permite deshacer puntos de la partida actual, pero no constituye un historial permanente de partidos terminados.
- Los datos dependen del almacenamiento local de la aplicación.

## 9. Evolución futura del modelo de datos

Cuando PadelApp incorpore usuarios y estadísticas, será necesario ampliar el modelo.

Se contemplan entidades como:

### Usuario

Representará a cada persona registrada en la plataforma.

### Jugador

Permitirá identificar a los participantes de un partido y asociarlos a sus estadísticas.

### Partido

Conservará los datos de un partido terminado, incluyendo participantes, resultado, duración y fecha.

### EventoPunto

Registrará las acciones individuales que suceden durante cada punto.

Por ejemplo:

- Punto ganado.
- Error no forzado.
- Golpe ganador.
- Ace.
- Punto ganado al resto.

Estos datos permitirán analizar la contribución individual de cada jugador.

### EstadisticasJugador

Permitirá calcular indicadores de rendimiento y construir comparativas entre jugadores.

## 10. Consideraciones de diseño

La evolución del almacenamiento local hacia una solución con backend deberá mantener los siguientes principios:

- Separar el modelo de datos de la interfaz.
- Validar los datos recuperados.
- Gestionar las versiones del formato de almacenamiento.
- Evitar perder partidas durante actualizaciones.
- Permitir sincronización futura entre dispositivos.
- Mantener un historial de partidos independiente del historial de deshacer puntos.