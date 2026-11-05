# Sistema de puntuación del pádel

## 1. Objetivo

PadelApp implementa un sistema de puntuación basado en las reglas tradicionales del pádel.

A diferencia de un marcador numérico convencional, la aplicación controla puntos, juegos, sets y tie-breaks, aplicando automáticamente las reglas correspondientes.

## 2. Puntuación de un juego

La puntuación de cada juego sigue esta secuencia:

| Puntos ganados | Marcador                        |
| -------------- | ------------------------------- |
| 0              | 0                               |
| 1              | 15                              |
| 2              | 30                              |
| 3              | 40                              |
| 4              | Juego, si no existe empate a 40 |

Cuando ambas parejas alcanzan los 40 puntos, se produce una situación de iguales.

### Ventaja

Cuando el marcador está en 40-40:

- Si una pareja gana el siguiente punto, obtiene ventaja (`AD`).
- Si vuelve a ganar, consigue el juego.
- Si pierde el punto con ventaja, el marcador regresa a iguales (40-40).

La aplicación representa la ventaja mediante el valor `"AD"`.

## 3. Finalización de un juego

Un juego se considera ganado cuando una pareja alcanza la puntuación necesaria y cumple las condiciones de ventaja.

Al finalizar un juego:

1. Se incrementa el contador de juegos de la pareja ganadora.
2. Se reinicia la puntuación del juego.
3. Se actualiza la pareja que realiza el saque.
4. Se comprueba si corresponde cambiar de lado.
5. Se comprueba si el set ha terminado.

## 4. Finalización de un set

La configuración permite seleccionar el número de juegos necesarios para ganar un set:

- 4 juegos.
- 6 juegos.
- 8 juegos.

La pareja debe alcanzar el número de juegos establecido y mantener una diferencia mínima de dos juegos respecto a la rival.

Por ejemplo, en un set configurado a 6 juegos:

- 6-0: set terminado.
- 6-4: set terminado.
- 6-5: el set continúa.
- 7-5: set terminado.
- 6-6: se inicia un tie-break, si está habilitado.

Cuando termina un set, la aplicación registra su resultado y duración mediante la función `registrarSet`.

## 5. Tie-break

El tie-break permite resolver un set cuando ambas parejas llegan al empate establecido.

La configuración permite seleccionar:

- Tie-break a 7 puntos.
- Tie-break a 10 puntos.

Para ganar es necesario alcanzar el objetivo configurado con una diferencia mínima de dos puntos.

Ejemplos de un tie-break a 7:

- 7-3: terminado.
- 7-6: continúa.
- 8-6: terminado.

### Orden del saque en el tie-break

El orden del saque es diferente al de un juego normal:

1. La pareja que empieza sacando realiza el primer punto.
2. A partir del segundo punto, los turnos de saque alternan cada dos puntos.

La función `sacadorTieBreak` calcula qué pareja debe sacar según el primer sacador y los puntos disputados.

### Cambios de lado

Durante el tie-break se debe cambiar de lado cada seis puntos disputados.

La propiedad `cambioLadoPendiente` permite comunicar a los jugadores cuándo corresponde realizar ese cambio.

## 6. Saque durante el partido

El marcador almacena la pareja responsable del saque mediante:

`parejaSaque`

En los juegos normales, la pareja que saca cambia después de cada juego.

Durante el tie-break, el orden se calcula mediante la función `sacadorTieBreak`, respetando el primer saque y los turnos posteriores de dos puntos.

## 7. Cambios de lado

La aplicación controla los cambios de lado para avisar a los jugadores.

### Juegos normales

Se muestra el aviso después del primer juego y, posteriormente, después de cada número impar de juegos disputados.

La lógica se basa en el total de juegos ganados por ambas parejas.

### Tie-break

Se muestra el aviso cada seis puntos disputados.

El aviso permanece visible hasta que se registra el siguiente punto.

## 8. Configuración del partido

Antes de comenzar, se pueden seleccionar los siguientes parámetros:

| Parámetro      | Opciones               |
| -------------- | ---------------------- |
| Formato        | Mejor de 3, 5 o 7 sets |
| Juegos por set | 4, 6 u 8               |
| Tie-break      | 7 o 10 puntos          |

La configuración predeterminada es:

- Mejor de 5 sets.
- 6 juegos por set.
- Tie-break a 7 puntos.

## 9. Funciones principales

La lógica del marcador se organiza en diferentes funciones:

| Función                | Responsabilidad                                      |
| ---------------------- | ---------------------------------------------------- |
| `crearMarcadorInicial` | Inicializa el marcador de una partida.               |
| `siguientePuntuacion`  | Calcula la siguiente puntuación de un juego.         |
| `setGanado`            | Comprueba si una pareja ha ganado el set.            |
| `registrarSet`         | Registra el resultado del set terminado.             |
| `sacadorTieBreak`      | Calcula la pareja que debe sacar en el tie-break.    |
| `aplicarTieBreak`      | Gestiona los puntos y la finalización del tie-break. |
| `sumarJuego`           | Registra un juego ganado y actualiza el marcador.    |
| `aplicarPunto`         | Aplica un punto y determina sus consecuencias.       |

Esta separación permite mantener diferenciadas las reglas de puntuación y facilita su mantenimiento.

## 10. Historial y deshacer

PadelApp mantiene un historial de estados del marcador.

Antes de aplicar un nuevo punto, guarda el estado anterior. Esto permite utilizar la función `deshacerUltimoPunto` para recuperar el marcador previo.

El historial contempla los cambios producidos durante los juegos, sets y tie-breaks.

## 11. Posibles ampliaciones

En futuras versiones se podrá ampliar el sistema de puntuación para registrar información individual de cada jugador:

- Jugador que gana el punto.
- Errores no forzados.
- Golpes ganadores.
- Aces.
- Puntos conseguidos mediante el saque.
- Contribución individual al resultado de la pareja.

Estos datos permitirán construir estadísticas individuales y comparativas entre jugadores.
