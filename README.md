# PadelApp 🎾

Aplicación móvil para llevar el marcador y controlar los partidos de pádel. Está desarrollada con **React Native**, **Expo** y **TypeScript**.

PadelApp permite configurar las reglas antes de empezar, registrar los puntos de dos parejas, gestionar juegos y sets, resolver los tie-breaks, controlar el servicio, registrar cambios de lado, medir la duración del partido y recuperar una partida después de cerrar o minimizar la aplicación.

El proyecto se encuentra en desarrollo y cuenta con una primera versión funcional que implementa la lógica principal de puntuación y gestión de partidos.

---

## Índice

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos e instalación](#requisitos-e-instalación)
- [Cómo se utiliza](#cómo-se-utiliza)
- [Modelo de datos y tipos](#modelo-de-datos-y-tipos)
- [Configuración del partido](#configuración-del-partido)
- [Funciones y lógica del marcador](#funciones-y-lógica-del-marcador)
- [Estado de React y cronómetros](#estado-de-react-y-cronómetros)
- [Persistencia y recuperación de partidas](#persistencia-y-recuperación-de-partidas)
- [Servicio y cambios de lado](#servicio-y-cambios-de-lado)
- [Interfaz y estilos](#interfaz-y-estilos)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Documentación técnica](#documentación-técnica)
- [Cambios implementados](#cambios-implementados)
- [Próximas implementaciones](#próximas-implementaciones)
- [Repositorio](#repositorio)

---

## Características

### Configuración previa

Antes de iniciar un partido se pueden seleccionar:

| Ajuste                              | Opciones               |
| ----------------------------------- | ---------------------- |
| Formato del partido                 | Mejor de 3, 5 o 7 sets |
| Juegos necesarios para ganar un set | 4, 6 u 8 juegos        |
| Puntos mínimos del tie-break        | 7 o 10 puntos          |

Los sets se ganan siempre con una diferencia mínima de dos juegos. En el tie-break también se necesitan dos puntos de diferencia.

### Marcador

- Dos parejas identificadas como A y B.
- Puntuación normal de pádel: 0, 15, 30, 40 y ventaja.
- Gestión automática de iguales y ventajas.
- Recuento automático de juegos y sets.
- Activación del tie-break según la configuración.
- Finalización automática del partido.
- Tabla con los resultados de cada set.
- Visualización de los puntos del tie-break.
- Identificación de la pareja que tiene el servicio.
- Alternancia del servicio durante los juegos y tie-breaks.
- Avisos de cambio de lado durante el partido.

### Tiempo y controles

- Cronómetro total del partido.
- Cronómetro del set actual.
- Cronómetro del juego actual.
- Pausar y reanudar el partido.
- Registro de la duración de los juegos terminados.
- Registro de la duración de cada set.
- Deshacer el último punto, recuperando el estado anterior del marcador.
- Guardado automático de la partida en el almacenamiento local.
- Recuperación de la partida al volver a abrir la aplicación.
- Actualización del tiempo transcurrido al regresar a la aplicación después de minimizarla o bloquear el dispositivo.

---

## Tecnologías

- **React Native:** construcción de la interfaz para aplicaciones móviles.
- **Expo:** herramientas para desarrollar, ejecutar y generar versiones de la aplicación.
- **TypeScript:** tipado estático para los datos, funciones y componentes.
- **React Hooks:** gestión del estado y de los efectos secundarios.
- **AsyncStorage:** almacenamiento local para guardar y recuperar el estado de la partida.
- **AppState:** detección de los cambios de estado de la aplicación, por ejemplo, al pasar a segundo plano o regresar a primer plano.
- **EAS Build:** generación de compilaciones instalables para dispositivos móviles.
- **Git y GitHub:** control de versiones y alojamiento del repositorio.

---

## Requisitos e instalación

### Requisitos

Para trabajar con el proyecto se necesita:

- Node.js.
- npm.
- Git.
- Un dispositivo móvil Android o iOS, o un entorno compatible para ejecutar la aplicación.

### Clonar el repositorio

```bash
git clone https://github.com/MrFranxis/PadelApp.git
cd PadelApp
```

### Instalar dependencias

```bash
npm install
```

En Windows PowerShell, si la política de ejecución impide utilizar los comandos `.ps1`, se pueden utilizar sus equivalentes:

```powershell
npm.cmd install
```

### Iniciar Expo

Para iniciar el servidor de desarrollo:

```bash
npx expo start
```

En Windows PowerShell:

```powershell
npx.cmd expo start
```

Para ejecutar la aplicación en el navegador:

```bash
npx expo start --web
```

Si existen problemas con la caché de Expo:

```bash
npx expo start -c
```

En Windows PowerShell:

```powershell
npx.cmd expo start -c
```

---

## Cómo se utiliza

1. Abre la aplicación.
2. En la pantalla de configuración selecciona el formato del partido, los juegos por set y los puntos del tie-break.
3. Pulsa **COMENZAR PARTIDO**.
4. Consulta el marcador, los cronómetros y la pareja que tiene el servicio.
5. Pulsa **+ PUNTO** en la pareja que haya ganado cada punto.
6. La aplicación actualiza automáticamente la puntuación, los juegos, los sets y el estado del partido.
7. Utiliza **PAUSAR PARTIDO** o **REANUDAR PARTIDO** para controlar los cronómetros y la entrada de puntos.
8. Utiliza **DESHACER ÚLTIMO PUNTO** para recuperar el marcador anterior.
9. Si minimizas o bloqueas el dispositivo, al regresar la aplicación recupera el estado y actualiza el tiempo transcurrido.
10. Pulsa **NUEVO PARTIDO** para volver a la configuración e iniciar otra partida.

---

## Modelo de datos y tipos

Los tipos se declaran al principio de `src/app/index.tsx`. Sirven para describir qué datos admite cada parte del marcador y permiten que TypeScript detecte usos incompatibles.

### `Puntuacion`

```ts
type Puntuacion = 0 | 15 | 30 | 40 | "AD";
```

Representa la puntuación de un juego normal. Es una unión de valores permitidos: no se puede asignar cualquier número. `"AD"` representa la ventaja.

### `Pareja`

```ts
type Pareja = "A" | "B";
```

Identifica a la pareja ganadora de un punto, juego o set, y también permite determinar qué pareja tiene el servicio.

### `Configuracion`

```ts
type Configuracion = {
  mejorDe: 3 | 5 | 7;
  juegosPorSet: 4 | 6 | 8;
  puntosTieBreak: 7 | 10;
};
```

Contiene las reglas elegidas antes de iniciar el partido:

- `mejorDe`: número máximo de sets del formato.
- `juegosPorSet`: juegos necesarios para poder ganar el set.
- `puntosTieBreak`: puntuación mínima objetivo del desempate.

La diferencia de dos puntos o juegos se comprueba en la lógica; no es un campo configurable.

### `ResultadoSet`

```ts
type ResultadoSet = {
  parejaA: number;
  parejaB: number;
  tieBreakA?: number;
  tieBreakB?: number;
  duracion: number;
};
```

Guarda el resultado de un set terminado:

- `parejaA` y `parejaB`: juegos obtenidos por cada pareja.
- `tieBreakA` y `tieBreakB`: puntos del desempate, si el set se decidió mediante tie-break. Son opcionales porque no todos los sets tienen desempate.
- `duracion`: duración del set en segundos.

### `Marcador`

`Marcador` representa el estado completo de la partida.

| Propiedad                            | Tipo             | Significado                                          |
| ------------------------------------ | ---------------- | ---------------------------------------------------- |
| `puntosA`, `puntosB`                 | `Puntuacion`     | Puntos del juego normal.                             |
| `juegosA`, `juegosB`                 | `number`         | Juegos del set actual.                               |
| `setsA`, `setsB`                     | `number`         | Sets ganados por cada pareja.                        |
| `resultadosSets`                     | `ResultadoSet[]` | Resultados de los sets terminados.                   |
| `tieBreak`                           | `boolean`        | Indica si se está jugando un desempate.              |
| `puntosTieBreakA`, `puntosTieBreakB` | `number`         | Puntos del tie-break.                                |
| `partidoTerminado`                   | `boolean`        | Indica si una pareja ha ganado el partido.           |
| `tiempoTotal`                        | `number`         | Segundos transcurridos en el partido.                |
| `tiempoSet`                          | `number`         | Segundos del set actual.                             |
| `tiempoJuego`                        | `number`         | Segundos del juego actual.                           |
| `duracionesJuegos`                   | `number[]`       | Duración en segundos de los juegos terminados.       |
| `parejaSaque`                        | `Pareja`         | Pareja que tiene el servicio.                        |
| `primerSaqueTieBreak`                | `Pareja?`        | Pareja que comienza sacando en el tie-break.         |
| `cambioLadoPendiente`                | `boolean`        | Indica si debe mostrarse el aviso de cambio de lado. |

### `PartidaGuardada`

Este tipo representa los datos que se almacenan localmente para poder recuperar una partida.

```ts
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

Sus propiedades son:

- `version`: versión del formato de datos guardado.
- `config`: configuración utilizada en el partido.
- `marcador`: estado completo de la partida.
- `historial`: estados anteriores del marcador para poder deshacer puntos.
- `partidoIniciado`: indica si la partida estaba iniciada.
- `pausado`: indica si la partida estaba pausada.
- `ultimaMarcaTiempo`: referencia temporal utilizada para calcular el tiempo transcurrido.

La aplicación utiliza **AsyncStorage** para guardar estos datos en el dispositivo y recuperarlos cuando vuelve a abrirse.

El historial de este tipo permite deshacer acciones durante la partida; no representa todavía un historial permanente de diferentes partidos terminados.

---

## Configuración del partido

En `HomeScreen`, el estado `config` se inicializa con:

```ts
{
  mejorDe: 5,
  juegosPorSet: 6,
  puntosTieBreak: 7
}
```

Por tanto, la configuración inicial es **mejor de cinco sets**, con sets a seis juegos y tie-break a siete puntos.

Las opciones disponibles son:

- Formato: `[3, 5, 7]`.
- Juegos por set: `[4, 6, 8]`.
- Puntos de tie-break: `[7, 10]`.

La expresión `as const` conserva esos valores como literales de TypeScript y permite asignarlos a las propiedades restringidas de `Configuracion`.

El número de sets que hay que ganar se calcula con:

```ts
Math.ceil(config.mejorDe / 2);
```

Así, en un mejor de cinco hacen falta tres sets; en un mejor de tres hacen falta dos; y en un mejor de siete hacen falta cuatro.

La configuración se puede cambiar antes de iniciar el partido. Al comenzar, `iniciarPartido()` reinicia el marcador, pero conserva las opciones seleccionadas en `config`.

---

## Funciones y lógica del marcador

Las funciones auxiliares reciben datos y devuelven resultados. En general, las funciones que modifican el marcador devuelven un **nuevo objeto** mediante el operador spread (`...`), en lugar de modificar directamente el objeto recibido.

### `otraPareja(pareja: Pareja): Pareja`

Devuelve la pareja contraria:

- Si recibe `"A"`, devuelve `"B"`.
- Si recibe `"B"`, devuelve `"A"`.

Se utiliza en la alternancia del servicio y en la lógica del tie-break.

### `crearMarcadorInicial(): Marcador`

Crea y devuelve un marcador nuevo con todos los contadores a cero, arrays vacíos, tie-break desactivado y partido sin terminar.

También inicializa los tres cronómetros a cero, establece la pareja que comienza sacando y deja desactivado el aviso de cambio de lado.

Se utiliza al inicializar el estado y al comenzar o reiniciar un partido.

### `formatearTiempo(segundos: number): string`

Convierte una cantidad de segundos en texto con formato `HH:MM:SS`.

1. Divide los segundos entre 3600 para obtener las horas.
2. Calcula los minutos con el resto de la división entre 3600.
3. Obtiene los segundos restantes.
4. Convierte cada valor a texto y utiliza `padStart(2, "0")` para completar con un cero cuando sea necesario.
5. Une los tres valores con `:`.

Ejemplo: `3661` se muestra como `01:01:01`.

### `siguientePuntuacion(actual: Puntuacion): Puntuacion`

Avanza la puntuación normal:

```text
0 → 15 → 30 → 40
```

Si recibe un valor distinto de esos tres, lo devuelve sin cambios. La gestión de ventaja y de fin de juego se realiza en `aplicarPunto()`.

### `setGanado(juegosA, juegosB, juegosNecesarios): Pareja | null`

Comprueba si una pareja ha ganado el set.

- La pareja debe haber alcanzado o superado `juegosNecesarios`.
- Debe tener al menos dos juegos de ventaja.
- Devuelve `"A"` o `"B"` si encuentra una ganadora.
- Devuelve `null` si todavía no hay ganador.

Por ejemplo, con seis juegos necesarios, 6-4 gana el set, mientras que 6-5 todavía no lo gana.

### `sacadorTieBreak(primerSaque, puntosJugados): Pareja`

Calcula qué pareja debe sacar en el siguiente punto del tie-break.

La secuencia aplicada es:

1. El primer sacador realiza un punto.
2. Después, el servicio se alterna en turnos de dos puntos.
3. La función utiliza el número de puntos disputados para determinar la pareja que tiene el servicio.

### `registrarSet(marcador, ganador, resultadoA, resultadoB, config, puntosTB?)`

Registra un set terminado y prepara el marcador para el siguiente.

Sus responsabilidades son:

1. Incrementar los sets de la pareja ganadora.
2. Calcular los sets necesarios para ganar el partido.
3. Determinar si el partido ha terminado.
4. Crear un objeto `ResultadoSet` con el tanteo, la puntuación opcional del tie-break y la duración del set.
5. Añadir el resultado al array `resultadosSets`.
6. Reiniciar puntos, juegos, tie-break y cronómetros del set y del juego.
7. Mantener el cronómetro total, el historial de juegos y los resultados de sets anteriores.

Los parámetros `resultadoA` y `resultadoB` permiten guardar el tanteo definitivo del set. En un tie-break, el juego de desempate se refleja como un juego adicional en el resultado, por ejemplo, 7-6.

### `aplicarTieBreak(marcador, ganador, config): Marcador`

Suma un punto a la pareja que lo ha ganado en el desempate.

Después comprueba dos condiciones:

- Que la pareja haya alcanzado al menos `config.puntosTieBreak`.
- Que tenga una diferencia de dos puntos o más.

También actualiza la pareja que tiene el servicio y comprueba si corresponde mostrar el aviso de cambio de lado.

Cuando se cumplen las condiciones de victoria, llama a `registrarSet()`. También guarda los puntos finales del tie-break en `ResultadoSet`.

### `sumarJuego(marcador, ganador, config): Marcador`

Se ejecuta cuando una pareja gana un juego normal.

1. Incrementa el contador de juegos de la pareja ganadora.
2. Reinicia los puntos normales a cero.
3. Añade la duración del juego terminado a `duracionesJuegos`.
4. Reinicia el cronómetro del juego.
5. Alterna la pareja que tiene el servicio.
6. Comprueba si corresponde realizar un cambio de lado.
7. Comprueba si se ha ganado el set mediante `setGanado()`.
8. Si el set ha terminado, llama a `registrarSet()`.
9. Si ambas parejas han alcanzado el número de juegos configurado, activa el tie-break.

### `aplicarPunto(marcador, ganador, config): Marcador`

Es la función central de la puntuación. Decide qué ocurre cuando una pareja gana un punto.

- Si `marcador.tieBreak` es `true`, delega el punto en `aplicarTieBreak()`.
- Si ambas parejas están a 40, concede ventaja a quien gane el punto.
- Si una pareja tiene ventaja y vuelve a ganar, gana el juego.
- Si la pareja contraria gana mientras existe una ventaja, el marcador vuelve a 40-40.
- Cuando una pareja gana el juego, llama a `sumarJuego()`.

La función también elimina el aviso de cambio de lado anterior al registrar el siguiente punto.

Devuelve el nuevo marcador; no actualiza directamente el estado de React.

---

## Estado de React y cronómetros

El componente principal es `HomeScreen`.

### Estados utilizados

Entre los estados principales se encuentran:

- `config`: configuración elegida para el partido.
- `marcador`: estado completo del marcador y de los cronómetros.
- `historial`: array de estados `Marcador` anteriores, utilizado para deshacer.
- `partidoIniciado`: indica si ya se ha pasado de la pantalla de configuración al marcador.
- `pausado`: controla si el partido está detenido.
- `cargando`: indica si se está recuperando la información almacenada.
- `partidoRecuperado`: permite controlar el estado de recuperación de una partida.

`useState` permite conservar estos valores entre renderizados. Sus funciones setter actualizan el estado y provocan que React vuelva a representar la interfaz con los datos nuevos.

### `useRef` y la referencia temporal

La aplicación utiliza una referencia:

```ts
const ultimaMarcaTiempo = useRef<number | null>(null);
```

`useRef` conserva un valor entre renderizados sin provocar una nueva representación de la interfaz cuando cambia.

En este caso, almacena la última referencia temporal utilizada para calcular cuánto tiempo ha transcurrido.

### `actualizarCronometro()`

La función utiliza `Date.now()` para calcular el tiempo real transcurrido desde la última actualización.

La diferencia entre la marca temporal actual y la anterior se convierte en segundos y se suma a:

- `tiempoTotal`.
- `tiempoSet`.
- `tiempoJuego`.

De esta manera, los cronómetros no dependen exclusivamente de contar las ejecuciones de un intervalo.

### `useEffect` y el intervalo

Un efecto de React controla la actualización periódica de los cronómetros.

El intervalo funciona solamente cuando:

- El partido ha comenzado.
- El partido no está pausado.
- El partido no ha terminado.

La actualización periódica permite refrescar los tiempos mostrados en pantalla.

La función de limpieza `clearInterval(intervalo)` detiene el intervalo anterior cuando cambian las dependencias del efecto o el componente se desmonta.

### `iniciarPartido()`

Reinicia el marcador y el historial, establece la marca temporal inicial, marca el partido como iniciado y lo deja en marcha (`pausado` pasa a `false`).

No modifica la configuración seleccionada.

### `sumarPunto(ganador: Pareja)`

Ignora la acción si el partido está pausado o terminado. En caso contrario:

1. Guarda el marcador actual en `historial`.
2. Actualiza el marcador aplicando el punto mediante `aplicarPunto()`.

### `deshacerUltimoPunto()`

Comprueba si hay estados anteriores. Si los hay, recupera el último marcador guardado y elimina esa entrada del historial con `slice(0, -1)`.

Al recuperar el objeto anterior también se recuperan los juegos, sets, desempates, resultados y tiempos que estaban en ese estado.

### `reiniciarPartido()`

Crea un marcador inicial, vacía el historial, vuelve a la pantalla de configuración y deja el partido detenido.

La configuración seleccionada se conserva y se limpia la referencia temporal de la partida anterior.

---

## Persistencia y recuperación de partidas

PadelApp utiliza **AsyncStorage** para guardar localmente la información de una partida.

Esto permite que el usuario pueda salir de la aplicación, minimizarla o cerrar el proceso y recuperar posteriormente el estado guardado.

### Guardado automático

La aplicación utiliza:

```ts
AsyncStorage.setItem(CLAVE_PARTIDA, JSON.stringify(partida));
```

El objeto guardado contiene:

- La versión del formato de datos.
- La configuración del partido.
- El marcador completo.
- El historial para deshacer puntos.
- El estado de inicio.
- El estado de pausa.
- La última marca temporal.

El guardado se realiza mediante un efecto de React cuando cambian los datos relevantes de la partida.

### Recuperación de la partida

Al iniciar el componente, la aplicación intenta recuperar los datos mediante:

```ts
AsyncStorage.getItem(CLAVE_PARTIDA);
```

Después convierte el contenido almacenado en un objeto mediante `JSON.parse()` y comprueba que la versión del formato sea compatible.

Si existe una partida válida, restaura:

- La configuración.
- El marcador.
- El historial.
- El estado de inicio.
- El estado de pausa.

### Recuperación del tiempo transcurrido

La aplicación utiliza la última marca temporal guardada y `Date.now()` para calcular el tiempo que ha pasado desde la última referencia.

Si el partido estaba iniciado y no estaba pausado, el tiempo transcurrido se incorpora a los cronómetros correspondientes.

Así se evita depender de que un intervalo de JavaScript siga ejecutándose mientras la aplicación está en segundo plano.

### Detección del regreso a primer plano

React Native proporciona `AppState`, que permite detectar cambios en el estado de la aplicación.

La aplicación escucha el evento:

```ts
AppState.addEventListener("change", (estado) => {
  // Comprobación del estado de la aplicación.
});
```

Cuando la aplicación vuelve al estado `active`, se actualiza el cronómetro si el partido está iniciado, no está pausado y no ha terminado.

**Importante:** el cronómetro no necesita mantener un proceso JavaScript ejecutándose continuamente en segundo plano. El tiempo transcurrido se calcula al recuperar la aplicación utilizando referencias temporales.

---

## Servicio y cambios de lado

La aplicación incorpora una lógica específica para controlar qué pareja tiene el servicio y cuándo corresponde cambiar de lado.

### Servicio durante los juegos

El estado `parejaSaque` identifica a la pareja que tiene el servicio.

Cuando termina un juego, la función `sumarJuego()` alterna automáticamente el servicio entre las parejas A y B.

### Servicio durante el tie-break

El tie-break sigue una secuencia diferente:

1. El primer sacador realiza un único punto.
2. A partir de ahí, cada pareja realiza dos servicios consecutivos.
3. La función `sacadorTieBreak()` calcula qué pareja debe sacar en función de los puntos disputados.

El campo `primerSaqueTieBreak` conserva la referencia de la pareja que inició el desempate.

### Cambios de lado durante los juegos

La aplicación establece un aviso después del primer juego y posteriormente al finalizar cada número impar de juegos.

El campo `cambioLadoPendiente` permite mostrar este aviso en la interfaz.

### Cambios de lado durante el tie-break

Durante el tie-break se comprueba el número de puntos disputados.

Cuando se alcanza un múltiplo de seis puntos, se activa el aviso de cambio de lado.

El aviso desaparece al registrar el siguiente punto.

---

## Interfaz y estilos

La interfaz se construye con componentes de React Native:

- `View`: agrupa elementos y define contenedores.
- `Text`: muestra títulos, resultados, etiquetas y tiempos.
- `Pressable`: crea botones táctiles y opciones de configuración.
- `ScrollView`: permite desplazarse por el contenido de la pantalla.
- `StyleSheet.create`: centraliza los estilos de la aplicación.

La pantalla cambia según `partidoIniciado`:

- Antes de iniciar, muestra las opciones de configuración.
- Durante el partido, muestra cronómetros, resultados por sets, puntuación de las parejas y controles.

Los estilos utilizan una base oscura (`#101820`) y verde lima (`#B6E65C`) para destacar la marca, los botones y la información importante.

---

## Estructura del proyecto

La estructura principal del proyecto es:

```text
PadelApp/
│
├── docs/
│   ├── ARQUITECTURA.md
│   ├── FUNCIONALIDADES.md
│   ├── PUNTUACION_PADEL.md
│   ├── CRONOMETROS_Y_ESTADO_PARTIDA.md
│   ├── DATOS_Y_PERSISTENCIA.md
│   ├── DESARROLLO_Y_PUBLICACION.md
│   └── HOJA_DE_RUTA.md
│
├── src/
│   ├── app/
│   │   └── index.tsx
│   │
│   └── components/
│       └── app-tabs.web.tsx
│
├── app.json
├── eas.json
├── package.json
├── package-lock.json
└── README.md
```

### Responsabilidad de los archivos principales

- `src/app/index.tsx`: contiene actualmente los tipos, las funciones de puntuación, la lógica de la partida, la gestión de estados, la persistencia, los cronómetros y la interfaz principal.
- `src/components/app-tabs.web.tsx`: contiene la adaptación de los componentes de navegación para la versión web.
- `app.json`: configuración general de Expo y de la aplicación.
- `eas.json`: configuración de los perfiles de compilación de EAS.
- `package.json`: dependencias y scripts del proyecto.
- `package-lock.json`: versiones concretas de las dependencias instaladas.
- `docs/`: documentación técnica del proyecto.
- `README.md`: documentación general y guía de referencia.

La lógica principal sigue concentrada en `src/app/index.tsx`. Una de las mejoras previstas es dividirla en módulos independientes para facilitar su mantenimiento.

---

## Documentación técnica

El proyecto dispone de documentación adicional en la carpeta `docs/`.

| Documento                                                               | Contenido                                                      |
| ----------------------------------------------------------------------- | -------------------------------------------------------------- |
| [Arquitectura](docs/ARQUITECTURA.md)                                    | Organización y arquitectura de la aplicación.                  |
| [Funcionalidades](docs/FUNCIONALIDADES.md)                              | Descripción de las funcionalidades implementadas.              |
| [Puntuación del pádel](docs/PUNTUACION_PADEL.md)                        | Reglas de puntuación, juegos, sets y tie-break.                |
| [Cronómetros y estado de partida](docs/CRONOMETROS_Y_ESTADO_PARTIDA.md) | Funcionamiento de los tiempos y recuperación de la aplicación. |
| [Datos y persistencia](docs/DATOS_Y_PERSISTENCIA.md)                    | Tipos de datos y almacenamiento local.                         |
| [Desarrollo y publicación](docs/DESARROLLO_Y_PUBLICACION.md)            | Entorno de desarrollo y proceso de compilación.                |
| [Hoja de ruta](docs/HOJA_DE_RUTA.md)                                    | Evolución y futuras funcionalidades.                           |

---

## Cambios implementados

Resumen de la evolución funcional:

1. Creación de una pantalla de marcador para dos parejas.
2. Incorporación de la puntuación normal de pádel: 0, 15, 30, 40 y ventaja.
3. Gestión de iguales, ventajas y finalización de juegos.
4. Recuento de juegos y sets con diferencia mínima de dos.
5. Activación del tie-break según la configuración.
6. Tie-break configurable a 7 o 10 puntos, siempre con dos puntos de diferencia.
7. Registro de resultados de sets y de la puntuación del tie-break.
8. Finalización automática del partido según el formato elegido.
9. Historial para deshacer el último punto.
10. Cronómetros total, del set y del juego, con pausa y reanudación.
11. Registro y visualización de duraciones de juegos y sets.
12. Control de la pareja que tiene el servicio.
13. Alternancia del servicio durante los juegos y tie-breaks.
14. Avisos de cambio de lado.
15. Guardado automático de la partida mediante AsyncStorage.
16. Recuperación del estado de la partida al volver a abrir la aplicación.
17. Actualización del tiempo transcurrido al regresar desde segundo plano.
18. Preparación de perfiles de compilación mediante EAS Build.
19. Documentación técnica del funcionamiento de la aplicación.

---

## Próximas implementaciones

Las siguientes mejoras se plantean como trabajo futuro; no deben considerarse funcionalidades ya disponibles salvo que se incorporen posteriormente al código.

### Prioridad alta

- **Historial permanente de partidos:** guardar partidos terminados para consultarlos después de cerrar la aplicación.
- **Nombres de jugadores y parejas:** permitir sustituir las etiquetas genéricas A y B por nombres.
- **Registro de usuarios:** incorporar cuentas para identificar a cada jugador y asociar sus partidos.

### Estadísticas

- Puntos ganados por cada pareja.
- Juegos y sets ganados.
- Duración media de juegos y sets.
- Porcentaje de puntos ganados con el servicio.
- Resumen estadístico al terminar el partido.
- Estadísticas individuales de cada jugador.
- Registro de la contribución de cada jugador dentro de la pareja.
- Comparación de estadísticas entre usuarios.
- Estadísticas compartibles.

### Tarjetas de jugadores

- Crear tarjetas visuales de jugadores inspiradas en las cartas de FIFA.
- Mostrar estadísticas y atributos individuales.
- Permitir comparar tarjetas entre jugadores.
- Actualizar los atributos según el rendimiento registrado en los partidos.

### Mejoras de experiencia

- Mejorar la adaptación a diferentes tamaños de pantalla.
- Añadir confirmación antes de reiniciar un partido.
- Mejorar la presentación de las estadísticas y del historial.
- Incorporar pruebas automáticas para validar las reglas de puntuación y los casos límite.
- Mejorar la experiencia de uso durante los partidos.

### Evolución técnica

- Separar la lógica del marcador, los tipos y la interfaz en módulos independientes.
- Crear componentes reutilizables.
- Incorporar pruebas unitarias para `aplicarPunto`, `sumarJuego`, `aplicarTieBreak` y `registrarSet`.
- Revisar y ampliar la persistencia de los datos.
- Incorporar un sistema de autenticación y almacenamiento remoto cuando el proyecto lo requiera.
- Preparar y probar la aplicación en dispositivos Android e iOS.
- Estudiar la integración con relojes inteligentes, comenzando por Wear OS y valorando posteriormente Apple Watch.

### Evolución del proyecto

PadelApp nace como una herramienta para gestionar el marcador de un partido de pádel, pero su objetivo a largo plazo es evolucionar hacia una plataforma de seguimiento del rendimiento deportivo.

La evolución prevista contempla perfiles de jugadores, estadísticas individuales y colectivas, historial de partidos, comparativas y funcionalidades sociales.

---

## Repositorio

Código fuente:

[github.com/MrFranxis/PadelApp](https://github.com/MrFranxis/PadelApp)

---

_PadelApp es un proyecto en desarrollo. Las funcionalidades descritas como implementadas corresponden a la versión documentada del proyecto. Las propuestas de la hoja de ruta todavía no forman parte necesariamente de la aplicación._
