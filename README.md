# PadelApp 🎾

Aplicación móvil para llevar el marcador de partidos de pádel. Está
desarrollada con **React Native**, **Expo** y **TypeScript**.

PadelApp permite configurar las reglas antes de empezar, registrar los
puntos de dos parejas, gestionar juegos y sets, resolver los tie-breaks,
controlar la duración del partido y deshacer el último punto.

> Estado del proyecto: versión funcional en desarrollo. La aplicación ya
> incluye configuración del partido, marcador, tie-break, cronómetros y
> controles básicos de partido.

------------------------------------------------------------------------

## Índice

-   [Características](#características)
-   [Tecnologías](#tecnologías)
-   [Requisitos e instalación](#requisitos-e-instalación)
-   [Cómo se utiliza](#cómo-se-utiliza)
-   [Modelo de datos y tipos](#modelo-de-datos-y-tipos)
-   [Configuración del partido](#configuración-del-partido)
-   [Funciones y lógica del marcador](#funciones-y-lógica-del-marcador)
-   [Estado de React y cronómetros](#estado-de-react-y-cronómetros)
-   [Interfaz y estilos](#interfaz-y-estilos)
-   [Estructura del proyecto](#estructura-del-proyecto)
-   [Cambios implementados](#cambios-implementados)
-   [Próximas implementaciones](#próximas-implementaciones)

------------------------------------------------------------------------

## Características

### Configuración previa

Antes de iniciar un partido se pueden seleccionar:

  Ajuste                                Opciones
  ------------------------------------- ------------------------
  Formato del partido                   Mejor de 3, 5 o 7 sets
  Juegos necesarios para ganar un set   4, 6 u 8 juegos
  Puntos mínimos del tie-break          7 o 10 puntos

Los sets se ganan siempre con una diferencia mínima de dos juegos. En el
tie-break también se necesitan dos puntos de diferencia.

### Marcador

-   Dos parejas: A y B.
-   Puntuación normal de pádel: 0, 15, 30, 40 y ventaja.
-   Gestión de iguales y ventaja.
-   Recuento automático de juegos y sets.
-   Activación del tie-break cuando ambas parejas alcanzan el número de
    juegos configurado.
-   Finalización automática del partido cuando una pareja consigue los
    sets necesarios.
-   Tabla con los resultados de cada set.
-   En los sets decididos mediante tie-break se muestra también la
    puntuación del desempate.

### Tiempo y controles

-   Cronómetro total del partido.
-   Cronómetro del set actual.
-   Cronómetro del juego actual.
-   Pausar y reanudar el partido.
-   Registro de la duración de los juegos terminados.
-   Registro de la duración de cada set.
-   Deshacer el último punto.

------------------------------------------------------------------------

## Tecnologías

-   **React Native:** construcción de la interfaz para aplicaciones
    móviles.
-   **Expo:** herramientas para desarrollar y ejecutar el proyecto.
-   **TypeScript:** tipado estático para los datos y funciones.
-   **React Hooks:** gestión del estado y de los efectos secundarios.
-   **Git y GitHub:** control de versiones y alojamiento del
    repositorio.

------------------------------------------------------------------------

## Requisitos e instalación

Se necesita tener instalado Node.js y npm.

Clona el repositorio:

``` bash
git clone https://github.com/MrFranxis/PadelApp.git
cd PadelApp
```

Instala las dependencias:

``` bash
npm install
```

Inicia Expo para ejecutar la aplicación en el navegador:

``` bash
npx expo start --web
```

En Windows PowerShell, si la política de ejecución impide utilizar los
comandos `.ps1`, se pueden utilizar sus equivalentes:

``` powershell
npm.cmd install
npx.cmd expo start --web
```

Expo también permite iniciar el proyecto sin el parámetro `--web` y
abrirlo en un dispositivo o emulador compatible.

------------------------------------------------------------------------

## Cómo se utiliza

1.  Abre la aplicación.
2.  En la pantalla de configuración selecciona el formato del partido,
    los juegos por set y los puntos del tie-break.
3.  Pulsa **COMENZAR PARTIDO**.
4.  El partido comienza y los cronómetros se ponen en marcha.
5.  Pulsa **+ PUNTO** en la pareja que haya ganado cada punto.
6.  La aplicación actualiza automáticamente la puntuación, los juegos,
    los sets y el estado del partido.
7.  Utiliza **PAUSAR PARTIDO** o **REANUDAR PARTIDO** para controlar los
    cronómetros y la entrada de puntos.
8.  Utiliza **DESHACER ÚLTIMO PUNTO** para recuperar el marcador
    anterior.
9.  Pulsa **NUEVO PARTIDO** para volver a la configuración e iniciar
    otra partida.

------------------------------------------------------------------------

## Modelo de datos y tipos

Los tipos se declaran al principio de `src/app/index.tsx`. Sirven para
describir qué datos admite cada parte del marcador y permiten que
TypeScript detecte usos incompatibles.

### `Puntuacion`

``` ts
type Puntuacion = 0 | 15 | 30 | 40 | "AD";
```

Representa la puntuación de un juego normal. Es una unión de valores
permitidos: no se puede asignar cualquier número. `"AD"` representa la
ventaja.

### `Pareja`

``` ts
type Pareja = "A" | "B";
```

Identifica a la pareja ganadora de un punto, juego o set. Limita el
valor a `"A"` o `"B"`.

### `Configuracion`

``` ts
type Configuracion = {
  mejorDe: 3 | 5 | 7;
  juegosPorSet: 4 | 6 | 8;
  puntosTieBreak: 7 | 10;
};
```

Contiene las reglas elegidas antes de iniciar el partido:

-   `mejorDe`: número máximo de sets del formato.
-   `juegosPorSet`: juegos necesarios para poder ganar el set.
-   `puntosTieBreak`: puntuación mínima objetivo del desempate.

La diferencia de dos puntos o juegos se comprueba en la lógica; no es un
campo configurable.

### `ResultadoSet`

``` ts
type ResultadoSet = {
  parejaA: number;
  parejaB: number;
  tieBreakA?: number;
  tieBreakB?: number;
  duracion: number;
};
```

Guarda el resultado de un set terminado:

-   `parejaA` y `parejaB`: juegos obtenidos por cada pareja.
-   `tieBreakA` y `tieBreakB`: puntos del desempate, si el set se
    decidió mediante tie-break. Son opcionales porque no todos los sets
    tienen desempate.
-   `duracion`: duración del set en segundos.

### `Marcador`

`Marcador` representa el estado completo de la partida.

  -----------------------------------------------------------------------
  Propiedad               Tipo                    Significado
  ----------------------- ----------------------- -----------------------
  `puntosA`, `puntosB`    `Puntuacion`            Puntos del juego normal

  `juegosA`, `juegosB`    `number`                Juegos del set actual

  `setsA`, `setsB`        `number`                Sets ganados por cada
                                                  pareja

  `resultadosSets`        `ResultadoSet[]`        Resultados de los sets
                                                  terminados

  `tieBreak`              `boolean`               Indica si se está
                                                  jugando un desempate

  `puntosTieBreakA`,      `number`                Puntos del tie-break
  `puntosTieBreakB`                               

  `partidoTerminado`      `boolean`               Indica si una pareja ya
                                                  ha ganado el partido

  `tiempoTotal`           `number`                Segundos transcurridos
                                                  en el partido

  `tiempoSet`             `number`                Segundos del set actual

  `tiempoJuego`           `number`                Segundos del juego
                                                  actual

  `duracionesJuegos`      `number[]`              Duración en segundos de
                                                  los juegos terminados
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## Configuración del partido

En `HomeScreen`, el estado `config` se inicializa con:

``` ts
{
  mejorDe: 5,
  juegosPorSet: 6,
  puntosTieBreak: 7
}
```

Por tanto, la configuración inicial es **mejor de cinco sets**, con sets
a seis juegos y tie-break a siete puntos.

Las opciones visibles se generan con los arrays `[3, 5, 7]`, `[4, 6, 8]`
y `[7, 10]`. La expresión `as const` conserva esos valores como
literales de TypeScript y permite asignarlos a las propiedades
restringidas de `Configuracion`.

El número de sets que hay que ganar se calcula con:

``` ts
Math.ceil(config.mejorDe / 2)
```

Así, en un mejor de cinco hacen falta tres sets; en un mejor de tres
hacen falta dos; y en un mejor de siete hacen falta cuatro.

La configuración se puede cambiar antes de iniciar el partido. Al
comenzar, `iniciarPartido` reinicia el marcador, pero conserva las
opciones seleccionadas en `config`.

------------------------------------------------------------------------

## Funciones y lógica del marcador

Las funciones auxiliares reciben datos y devuelven resultados. En
general, las funciones que modifican el marcador devuelven un **nuevo
objeto** mediante el operador spread (`...`), en lugar de modificar
directamente el objeto recibido.

### `crearMarcadorInicial(): Marcador`

Crea y devuelve un marcador nuevo con todos los contadores a cero,
arrays vacíos, tie-break desactivado y partido sin terminar. También
inicializa los tres cronómetros a cero.

Se utiliza al inicializar el estado y al comenzar o reiniciar un
partido.

### `formatearTiempo(segundos: number): string`

Convierte una cantidad de segundos en texto con formato `HH:MM:SS`.

1.  Divide los segundos entre 3600 para obtener las horas.
2.  Calcula los minutos con el resto de la división entre 3600.
3.  Obtiene los segundos restantes.
4.  Convierte cada valor a texto y utiliza `padStart(2, "0")` para
    completar con un cero cuando sea necesario.
5.  Une los tres valores con `:`.

Ejemplo: `3661` se muestra como `01:01:01`.

### `siguientePuntuacion(actual: Puntuacion): Puntuacion`

Avanza la puntuación normal:

``` text
0 → 15 → 30 → 40
```

Si recibe un valor distinto de esos tres (por ejemplo, 40 o `"AD"`), lo
devuelve sin cambios. La gestión de ventaja y de fin de juego se realiza
en `aplicarPunto`.

### `setGanado(juegosA, juegosB, juegosNecesarios): Pareja | null`

Comprueba si una pareja ha ganado el set.

-   La pareja debe haber alcanzado o superado `juegosNecesarios`.
-   Debe tener al menos dos juegos de ventaja.
-   Devuelve `"A"` o `"B"` si encuentra una ganadora.
-   Devuelve `null` si todavía no hay ganador.

Por ejemplo, con seis juegos necesarios, 6-4 gana el set, mientras que
6-5 todavía no lo gana.

### `registrarSet(marcador, ganador, resultadoA, resultadoB, config, puntosTB?)`

Registra un set terminado y prepara el marcador para el siguiente.

Sus responsabilidades son:

1.  Incrementar los sets de la pareja ganadora.
2.  Calcular los sets necesarios para ganar el partido.
3.  Determinar si el partido ha terminado.
4.  Crear un objeto `ResultadoSet` con el tanteo, la puntuación opcional
    del tie-break y la duración del set.
5.  Añadir el resultado al array `resultadosSets`.
6.  Reiniciar puntos, juegos, tie-break y cronómetros del set y del
    juego.
7.  Mantener el cronómetro total, el historial de juegos y los
    resultados de sets anteriores.

Los parámetros `resultadoA` y `resultadoB` permiten guardar el tanteo
definitivo del set. En un tie-break, el juego de desempate se refleja
como un juego adicional en el resultado, por ejemplo, 7-6.

### `aplicarTieBreak(marcador, ganador, config): Marcador`

Suma un punto a la pareja que lo ha ganado en el desempate.

Después comprueba dos condiciones:

-   Que la pareja haya alcanzado al menos `config.puntosTieBreak`.
-   Que tenga una diferencia de dos puntos o más.

Cuando se cumplen ambas, llama a `registrarSet`. También guarda los
puntos finales del tie-break en `ResultadoSet`. Si nadie ha ganado
todavía, devuelve el marcador actualizado con los nuevos puntos del
desempate.

### `sumarJuego(marcador, ganador, config): Marcador`

Se ejecuta cuando una pareja gana un juego normal.

1.  Incrementa el contador de juegos de la pareja ganadora.
2.  Reinicia los puntos normales a cero.
3.  Añade la duración del juego terminado a `duracionesJuegos`.
4.  Reinicia el cronómetro del juego.
5.  Comprueba si se ha ganado el set mediante `setGanado`.
6.  Si el set ha terminado, llama a `registrarSet`.
7.  Si ambas parejas han alcanzado exactamente `config.juegosPorSet`,
    activa el tie-break.

### `aplicarPunto(marcador, ganador, config): Marcador`

Es la función central de la puntuación. Decide qué ocurre cuando una
pareja gana un punto.

-   Si `marcador.tieBreak` es `true`, delega el punto en
    `aplicarTieBreak`.
-   En un juego normal, gestiona el avance de 0 a 15, 30 y 40.
-   Si ambas parejas están a 40, concede ventaja a quien gane el punto.
-   Si una pareja tiene ventaja y vuelve a ganar, gana el juego.
-   Si la pareja contraria gana mientras existe una ventaja, el marcador
    vuelve a 40-40.
-   Cuando una pareja gana el juego, llama a `sumarJuego`.

La función devuelve el nuevo marcador; no actualiza directamente el
estado de React.

------------------------------------------------------------------------

## Estado de React y cronómetros

El componente principal es `HomeScreen`.

### Estados utilizados

-   `config`: configuración elegida para el partido.
-   `marcador`: estado completo del marcador y de los cronómetros.
-   `historial`: array de estados `Marcador` anteriores, utilizado para
    deshacer.
-   `partidoIniciado`: indica si ya se ha pasado de la pantalla de
    configuración al marcador.
-   `pausado`: controla si el partido está detenido.

`useState` permite conservar estos valores entre renderizados. Sus
funciones setter actualizan el estado y provocan que React vuelva a
representar la interfaz con los datos nuevos.

### `useEffect` y el intervalo

El efecto de React crea un intervalo de un segundo solamente cuando:

-   El partido ha comenzado.
-   El partido no está pausado.
-   El partido no ha terminado.

Cada segundo actualiza `tiempoTotal`, `tiempoSet` y `tiempoJuego`,
sumando uno a cada contador.

La función de limpieza `clearInterval(intervalo)` detiene el intervalo
anterior cuando cambian las dependencias del efecto o el componente se
desmonta. Esto evita mantener intervalos activos innecesarios.

### `iniciarPartido()`

Reinicia el marcador y el historial, marca el partido como iniciado y lo
deja en marcha (`pausado` pasa a `false`). No modifica la configuración
seleccionada.

### `sumarPunto(ganador: Pareja)`

Ignora la acción si el partido está pausado o terminado. En caso
contrario:

1.  Guarda el marcador actual en `historial`.
2.  Actualiza el marcador aplicando el punto mediante `aplicarPunto`.

### `deshacerUltimoPunto()`

Comprueba si hay estados anteriores. Si los hay, recupera el último
marcador guardado y elimina esa entrada del historial con
`slice(0, -1)`.

Como el historial almacena el objeto `Marcador` completo, deshacer puede
recuperar también juegos, sets, desempates, resultados y tiempos que
estaban en ese estado anterior.

### `reiniciarPartido()`

Crea un marcador inicial, vacía el historial, vuelve a la pantalla de
configuración y deja el partido pausado. La configuración seleccionada
se conserva.

------------------------------------------------------------------------

## Interfaz y estilos

La interfaz se construye con componentes de React Native:

-   `View`: agrupa elementos y define contenedores.
-   `Text`: muestra títulos, resultados, etiquetas y tiempos.
-   `Pressable`: crea botones táctiles y opciones de configuración.
-   `StyleSheet.create`: centraliza los estilos de la aplicación.

La pantalla cambia según `partidoIniciado`:

-   Antes de iniciar, muestra las opciones de configuración.
-   Durante el partido, muestra cronómetros, resultados por sets,
    puntuación de las parejas y controles.

Los estilos utilizan una base oscura (`#101820`) y verde lima
(`#B6E65C`) para destacar la marca, los botones y la información
importante.

------------------------------------------------------------------------

## Estructura del proyecto

La lógica principal documentada se encuentra en:

``` text
PadelApp/
└── src/
    └── app/
        └── index.tsx
```

`src/app/index.tsx` contiene los tipos, las funciones de puntuación, el
componente `HomeScreen` y los estilos.

Esta documentación describe el código compartido de ese archivo. No se
detallan otros archivos o carpetas porque no forman parte del código
revisado para esta documentación.

------------------------------------------------------------------------

## Cambios implementados

Resumen de la evolución funcional:

1.  Creación de una pantalla de marcador para dos parejas.
2.  Incorporación de la puntuación normal de pádel: 0, 15, 30, 40 y
    ventaja.
3.  Gestión de iguales, ventajas y finalización de juegos.
4.  Recuento de juegos y sets con diferencia mínima de dos.
5.  Activación del tie-break al llegar ambas parejas al número de juegos
    configurado.
6.  Tie-break configurable a 7 o 10 puntos, siempre con dos puntos de
    diferencia.
7.  Registro de resultados de sets y de la puntuación del tie-break.
8.  Finalización automática del partido según el formato elegido.
9.  Historial para deshacer el último punto.
10. Cronómetros total, del set y del juego, con pausa y reanudación.
11. Registro y visualización de duraciones de juegos y sets.
12. Pantalla de configuración y marcador con presentación de resultados
    por sets.

------------------------------------------------------------------------

## Próximas implementaciones

Las siguientes mejoras se plantean como trabajo futuro; no deben
considerarse funcionalidades ya disponibles salvo que se incorporen
posteriormente al código.

### Prioridad alta

-   **Persistencia de partidos:** guardar partidos terminados para
    consultarlos después de cerrar la aplicación.
-   **Historial de partidos:** consultar resultados anteriores, fechas,
    duración y configuración utilizada.
-   **Nombres de jugadores y parejas:** permitir sustituir las etiquetas
    genéricas A y B por nombres.

### Estadísticas

-   Puntos ganados por cada pareja.
-   Juegos y sets ganados.
-   Duración media de juegos y sets.
-   Porcentaje de puntos ganados con el servicio, si se incorpora el
    seguimiento del saque.
-   Resumen estadístico al terminar el partido.

### Mejoras de experiencia

-   Mejorar la adaptación a diferentes tamaños de pantalla.
-   Añadir confirmación antes de reiniciar un partido.
-   Mejorar la presentación de las estadísticas y del historial.
-   Incorporar pruebas automáticas para validar las reglas de puntuación
    y los casos límite.

### Evolución técnica

-   Separar la lógica del marcador, los tipos y la interfaz en módulos
    independientes.
-   Añadir pruebas unitarias para `aplicarPunto`, `sumarJuego`,
    `aplicarTieBreak` y `registrarSet`.
-   Revisar la persistencia y recuperación del estado ante cierres
    inesperados.
-   Preparar y probar la aplicación en dispositivos Android e iOS.

------------------------------------------------------------------------

## Repositorio

Código fuente:
[github.com/MrFranxis/PadelApp](https://github.com/MrFranxis/PadelApp)

------------------------------------------------------------------------

*PadelApp es un proyecto en desarrollo. Las reglas y funcionalidades
descritas corresponden al código revisado para esta versión de la
documentación.*
