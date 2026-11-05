# Hoja de ruta de PadelApp

## 1. Visión del proyecto

PadelApp nace como una aplicación móvil para gestionar partidos de pádel, controlar la puntuación y registrar los tiempos de juego.

El objetivo a largo plazo es evolucionar hacia una plataforma que permita a los jugadores registrar sus partidos, analizar su rendimiento, comparar estadísticas y construir un historial deportivo.

La intención es desarrollar un producto propio, con posibilidades de crecimiento y futura comercialización.

## 2. Estado actual

La primera versión funcional incluye:

- Configuración de partidos.
- Formatos de 3, 5 y 7 sets.
- Configuración de juegos por set.
- Tie-break configurable.
- Puntuación real del pádel.
- Control de juegos y sets.
- Gestión del saque.
- Cambios de lado.
- Tres cronómetros.
- Pausa y reanudación.
- Deshacer el último punto.
- Reinicio de partido.
- Persistencia local mediante AsyncStorage.
- Recuperación de partidas.
- Adaptación a dispositivos móviles.
- Compilación Android mediante EAS.

Esta versión constituye la base sobre la que se desarrollarán las siguientes fases.

## 3. Fase 1: Consolidación de la aplicación

<badge color="success">En desarrollo</badge>

Objetivo: conseguir una versión estable y fiable del marcador.

Tareas:

- Completar las pruebas funcionales.
- Comprobar el comportamiento en partidos reales.
- Revisar la recuperación después de bloquear el teléfono.
- Verificar los cronómetros.
- Revisar el comportamiento del saque.
- Comprobar los cambios de lado.
- Corregir errores detectados durante las pruebas.
- Mejorar la documentación.
- Revisar la estructura del código.

Resultado esperado: una aplicación de marcador estable que pueda utilizarse durante partidos reales.

## 4. Fase 2: Refactorización y mantenimiento

Objetivo: preparar el código para incorporar nuevas funcionalidades sin aumentar innecesariamente su complejidad.

Actualmente, gran parte de la lógica se encuentra en `src/app/index.tsx`.

Se plantea separar progresivamente:

- Componentes visuales.
- Lógica de puntuación.
- Gestión de cronómetros.
- Persistencia.
- Tipos de datos.
- Funciones auxiliares.

La nueva estructura deberá facilitar el mantenimiento, las pruebas y el trabajo de futuros colaboradores.

Resultado esperado: una base de código modular y preparada para crecer.

## 5. Fase 3: Jugadores y registro de usuarios

Objetivo: permitir que cada jugador tenga una identidad dentro de PadelApp.

Funcionalidades previstas:

- Registro de usuarios.
- Inicio y cierre de sesión.
- Perfil personal.
- Nombre y fotografía.
- Identificación de compañeros y rivales.
- Asociación de jugadores a los partidos.

Resultado esperado: cada usuario podrá disponer de su propio historial deportivo.

## 6. Fase 4: Historial de partidos

Objetivo: conservar los partidos terminados y permitir consultarlos posteriormente.

Cada partido podrá incluir:

- Fecha.
- Duración.
- Jugadores participantes.
- Resultado final.
- Resultado de cada set.
- Configuración utilizada.
- Estadísticas registradas.

Los partidos podrán consultarse desde el perfil de cada usuario.

Resultado esperado: disponer de un historial deportivo personal.

## 7. Fase 5: Estadísticas individuales

Objetivo: analizar el rendimiento de cada jugador.

Se plantea registrar acciones individuales durante cada punto.

Ejemplos:

- Puntos ganadores.
- Errores no forzados.
- Aces.
- Dobles faltas.
- Puntos ganados al resto.
- Puntos ganados mediante el saque.
- Contribución individual al resultado de la pareja.

Las estadísticas permitirán conocer mejor el rendimiento de cada jugador, independientemente del resultado final.

Resultado esperado: disponer de información útil para analizar la evolución deportiva.

## 8. Fase 6: Tarjetas de jugadores

Objetivo: crear una representación visual del rendimiento de cada jugador.

Inspiradas en las tarjetas de jugadores de videojuegos deportivos, especialmente FIFA, las tarjetas mostrarán:

- Fotografía.
- Nombre.
- Nivel general.
- Estadísticas principales.
- Fortalezas.
- Evolución del rendimiento.

Las valoraciones deberán calcularse a partir de datos reales de los partidos, evitando puntuaciones arbitrarias.

También se contempla compartir estas tarjetas con otros jugadores.

Resultado esperado: una funcionalidad visual atractiva que permita compartir y comparar el rendimiento.

## 9. Fase 7: Comparativas y comunidad

Objetivo: conectar los perfiles y estadísticas de los jugadores.

Funcionalidades previstas:

- Comparación entre dos jugadores.
- Comparación de parejas.
- Estadísticas compartidas.
- Historial de enfrentamientos.
- Evolución del rendimiento.
- Posibles rankings.

Resultado esperado: convertir PadelApp en una plataforma que aporte valor más allá del marcador.

## 10. Fase 8: Backend y sincronización

Objetivo: permitir que los datos estén disponibles desde distintos dispositivos.

Será necesario incorporar:

- Backend.
- Base de datos remota.
- Autenticación.
- API.
- Sincronización de partidos.
- Gestión de perfiles.
- Seguridad y control de acceso.

Se estudiarán tecnologías adecuadas para estas necesidades antes de implementar esta fase.

La incorporación de un backend se realizará cuando las funcionalidades locales estén consolidadas y exista una necesidad real de sincronización.

## 11. Fase 9: Integración con relojes inteligentes

Objetivo: ampliar la experiencia de uso durante los partidos.

La primera plataforma que se estudiará será Wear OS.

Posibles funcionalidades:

- Visualización del marcador.
- Consulta del tiempo de partido.
- Notificaciones de cambios de juego.
- Controles básicos desde el reloj.
- Sincronización con el teléfono.

Posteriormente se estudiará la compatibilidad con Apple Watch.

Resultado esperado: permitir consultar información del partido sin tener que utilizar constantemente el teléfono.

## 12. Modelo de negocio

PadelApp se plantea como un producto propio con posibilidades de comercialización.

La estrategia inicial será validar el producto con jugadores reales antes de realizar inversiones importantes.

Se estudiarán diferentes posibilidades:

- Aplicación gratuita con funcionalidades básicas.
- Versión de pago.
- Funcionalidades premium.
- Suscripciones.
- Servicios adicionales para clubes.

La estrategia comercial se decidirá en función de la respuesta de los usuarios y de los costes de mantenimiento.

## 13. Propiedad y colaboradores

El proyecto se desarrollará inicialmente de forma independiente.

Si en el futuro participan otras personas, la distribución de responsabilidades y participación se determinará según la aportación concreta de cada colaborador.

La constitución de una empresa se valorará cuando existan usuarios, ingresos o una actividad comercial que justifique dar ese paso.

## 14. Estrategia de crecimiento

El desarrollo seguirá un enfoque progresivo:

1. Construir una aplicación funcional.
2. Validarla con jugadores reales.
3. Corregir errores y mejorar la experiencia.
4. Preparar una versión comercial.
5. Conseguir los primeros usuarios.
6. Analizar el uso y las necesidades reales.
7. Incorporar nuevas funcionalidades.
8. Escalar la infraestructura cuando sea necesario.

No se pretende desarrollar todas las funcionalidades desde el principio, sino construir una base sólida y evolucionar según las necesidades del producto.

## 15. Objetivo a largo plazo

El objetivo es que PadelApp evolucione desde un marcador digital hasta una plataforma de análisis y gestión deportiva especializada en pádel.

La aplicación deberá permitir jugar, registrar, analizar, compartir y comparar partidos y estadísticas.

Cada fase deberá aportar valor real al producto y mantener una arquitectura sostenible.
