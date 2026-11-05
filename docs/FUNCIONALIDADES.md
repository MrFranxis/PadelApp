# Funcionalidades de PadelApp

## 1. Descripción general

PadelApp es una aplicación móvil diseñada para gestionar partidos de pádel.

Permite configurar una partida, controlar la puntuación siguiendo las reglas del pádel, gestionar los tiempos de juego y recuperar el estado de una partida después de salir de la aplicación.

La aplicación está desarrollada con React Native, Expo y TypeScript.

## 2. Configuración del partido

Antes de comenzar una partida, el usuario puede establecer sus reglas.

Las opciones disponibles son:

| Configuración | Opciones |
|---|---|
| Formato del partido | Mejor de 3, 5 o 7 sets |
| Juegos por set | 4, 6 u 8 |
| Puntos del tie-break | 7 o 10 |

La configuración predeterminada es:

- Mejor de 5 sets.
- 6 juegos por set.
- Tie-break a 7 puntos.

## 3. Marcador

La pantalla principal muestra el resultado de las dos parejas:

- Pareja A.
- Pareja B.

El marcador permite registrar los puntos de cada pareja y actualiza automáticamente la puntuación.

### Puntuación de pádel

Se contemplan los siguientes estados:

- 0.
- 15.
- 30.
- 40.
- Ventaja (AD).

Cuando se cumplen las condiciones necesarias, se registra automáticamente el juego.

### Juegos y sets

La aplicación controla los juegos ganados por cada pareja y los sets completados.

Cuando una pareja cumple las condiciones de victoria de un set, se registra el resultado y se prepara el siguiente.

### Tie-break

Cuando se alcanza el empate establecido para iniciar un tie-break, la aplicación cambia al sistema de puntuación por puntos.

Se controla:

- La puntuación de ambas parejas.
- El orden de saque.
- La condición de victoria por dos puntos de diferencia.
- Los cambios de lado cada seis puntos.

## 4. Gestión del saque

La aplicación identifica qué pareja debe realizar el saque.

En