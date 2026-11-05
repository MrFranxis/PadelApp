Cronómetros y estado de la partida

1. Objetivo

PadelApp dispone de tres cronómetros independientes que permiten controlar la duración de un partido:

Tiempo total del partido.

Tiempo del set actual.

Tiempo del juego actual.

El sistema permite pausar y reanudar el partido, conservar su estado en el almacenamiento local y recuperar la partida cuando se vuelve a abrir la aplicación.

2. Cronómetros

Los tres contadores están incluidos en el tipo Marcador:

Propiedad

Descripción

tiempoTotal

Tiempo acumulado del partido.

tiempoSet

Tiempo del set que se está disputando.

tiempoJuego

Tiempo del juego actual.

Los tiempos se almacenan en segundos y se presentan mediante formatearTiempo(), que utiliza el formato HH:MM:SS.

3. Medición del tiempo real

La aplicación utiliza Date.now() para calcular el tiempo transcurrido.

La referencia temporal se almacena en:

const ultimaMarcaTiempo = useRef<number | null>(null);

useRef permite conservar una referencia entre renderizados sin provocar por sí mismo una actualización de la interfaz.

La función actualizarCronometro() realiza las siguientes operaciones:

Obtiene la hora actual.

Recupera la última marca temporal.

Calcula los segundos transcurridos.

Actualiza la referencia temporal.

Incrementa los tres cronómetros.

El intervalo de un segundo permite refrescar los contadores mientras el partido está activo. El cálculo utiliza el tiempo real transcurrido, en lugar de asumir que cada ejecución del intervalo representa exactamente un segundo.

4. Pausar y reanudar

La función alternarPausa() controla el estado del partido.

Al pausar:

Se contabiliza el tiempo pendiente.

Se activa el estado pausado.

Se detiene el intervalo mediante la limpieza del efecto de React.

Al reanudar:

Se establece una nueva referencia temporal.

Se desactiva pausado.

El intervalo vuelve a ejecutarse.

No se permite registrar puntos cuando el partido está pausado o terminado.

5. Gestión del intervalo con useEffect

El intervalo solamente funciona cuando se cumplen estas condiciones:

El partido ha comenzado.

No está pausado.

No ha terminado.

Se ejecuta cada segundo y se elimina mediante clearInterval() cuando cambian las condiciones o se desmonta el componente.

Esto evita mantener intervalos activos cuando no son necesarios.

6. Aplicación en segundo plano y recuperación

La aplicación utiliza AppState de React Native para detectar los cambios de estado de la aplicación.

Cuando vuelve al estado active, se comprueba que:

El partido esté iniciado.

No esté pausado.

No haya terminado.

Si se cumplen las condiciones, se ejecuta actualizarCronometro() para contabilizar el tiempo transcurrido.

La recuperación también tiene en cuenta la última marca temporal guardada. De esta manera, el tiempo transcurrido mientras la aplicación no estaba activa puede añadirse a los contadores.

El sistema no depende de que JavaScript siga ejecutándose continuamente en segundo plano.

7. Persistencia con AsyncStorage

La aplicación utiliza @react-native-async-storage/async-storage para guardar localmente el estado de la partida.

La clave de almacenamiento se utiliza para recuperar el último estado guardado.

Se persisten los siguientes datos:

Versión del formato guardado.

Configuración del partido.

Marcador completo.

Historial de estados anteriores.

Estado de inicio del partido.

Estado de pausa.

Última marca temporal.

AsyncStorage.setItem() guarda la información serializada mediante JSON.stringify().

AsyncStorage.getItem() recupera la información, que se transforma de nuevo en un objeto mediante JSON.parse().

8. Tipo PartidaGuardada

El tipo PartidaGuardada define la estructura de los datos persistidos.

type PartidaGuardada = {
  version: 1;
  config: Configuracion;
  marcador: Marcador;
  historial: Marcador[];
  partidoIniciado: boolean;
  pausado?: boolean;
  ultimaMarcaTiempo?: number | null;
};

La propiedad version permite identificar el formato de los datos guardados y facilita futuras modificaciones de la estructura.

9. Recuperación al iniciar la aplicación

Durante la recuperación:

Se consulta AsyncStorage.

Se comprueba que existan datos.

Se valida la versión del formato.

Se restaura la configuración.

Se recupera el historial.

Se recupera el estado del partido.

Se calcula el tiempo transcurrido desde la última marca temporal cuando corresponde.

Se muestra la pantalla correspondiente.

Mientras se recuperan los datos se muestra una pantalla de carga para evitar presentar temporalmente un marcador incorrecto.

10. Reinicio de la partida

La función reiniciarPartido():

Elimina la referencia temporal anterior.

Crea un marcador inicial.

Vacía el historial de puntos.

Devuelve la aplicación a la pantalla de configuración.

Restablece el estado de inicio y pausa.

La configuración seleccionada se conserva.

11. Consideraciones técnicas

La aplicación utiliza almacenamiento local. Esto permite recuperar una partida en el mismo dispositivo, pero no equivale a disponer de una cuenta de usuario ni de sincronización entre dispositivos.

La continuidad del cronómetro se basa en marcas temporales y cálculos con Date.now(). No requiere mantener un proceso JavaScript ejecutándose permanentemente en segundo plano.

La persistencia actual está orientada a recuperar la partida guardada. No debe confundirse con un historial permanente de múltiples partidos terminados.