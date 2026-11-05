# Arquitectura de PadelApp

## 1. Introducción

PadelApp es una aplicación móvil desarrollada con React Native y Expo, utilizando TypeScript.

Su objetivo es ofrecer una herramienta para gestionar partidos de pádel, controlar la puntuación, registrar los tiempos de juego y conservar el estado de una partida cuando la aplicación pasa a segundo plano o se cierra.

La arquitectura actual prioriza una aplicación sencilla, funcional y preparada para evolucionar hacia una plataforma con usuarios, estadísticas e historial de partidos.

## 2. Tecnologías utilizadas

| Tecnología   | Función                                                  |
| ------------ | -------------------------------------------------------- |
| React Native | Desarrollo de la interfaz móvil.                         |
| Expo         | Entorno de desarrollo y herramientas para la aplicación. |
| Expo Router  | Navegación y organización de pantallas.                  |
| TypeScript   | Tipado estático y organización de datos.                 |
| React Hooks  | Gestión del estado y ciclo de vida de los componentes.   |
| AsyncStorage | Persistencia local de la partida.                        |
| AppState     | Detección de cambios en el estado de la aplicación.      |
| Git          | Control de versiones.                                    |
| GitHub       | Alojamiento del repositorio.                             |
| EAS Build    | Generación de compilaciones instalables.                 |

## 3. Estructura del proyecto

La estructura principal del proyecto es:

```text
PadelApp/
│
├── assets/
│
├── docs/
│   ├── ARQUITECTURA.md
│   ├── CRONOMETROS_Y_ESTADO_PARTIDA.md
│   └── PUNTUACION_PADEL.md
│
├── src/
│   ├── app/
│   │   ├── index.tsx
│   │   └── index.backup.tsx
│   │
│   └── components/
│       └── app-tabs.web.tsx
│
├── .vscode/
│
├── app.json
├── eas.json
├── package.json
├── package-lock.json
└── README.md
```

Esta estructura representa la organización del proyecto durante la fase actual de desarrollo. Algunos archivos y carpetas pueden variar según la evolución del proyecto.

### Directorio `src/app`

Contiene las pantallas de la aplicación gestionadas mediante Expo Router.

Actualmente, `index.tsx` concentra la pantalla principal y gran parte de la lógica del marcador, cronómetros, configuración y persistencia.

### Directorio `src/components`

Contiene componentes relacionados con la interfaz y su adaptación a distintas plataformas.

### Directorio `assets`

Almacena los recursos estáticos utilizados por la aplicación, como imágenes e iconos.

### Directorio `docs`

Contiene la documentación técnica del proyecto.

### Archivos de configuración

- `app.json`: configuración general de Expo.
- `eas.json`: perfiles y configuración de compilación mediante EAS.
- `package.json`: dependencias y scripts del proyecto.
- `package-lock.json`: versiones concretas de las dependencias instaladas.

## 4. Arquitectura actual

Actualmente, la aplicación utiliza una arquitectura sencilla basada en una pantalla principal.

El archivo `src/app/index.tsx` contiene:

1. Definición de tipos TypeScript.
2. Funciones de lógica del marcador.
3. Gestión del estado mediante React Hooks.
4. Control de cronómetros.
5. Persistencia mediante AsyncStorage.
6. Detección del estado de la aplicación.
7. Componentes y estilos de la interfaz.

Esta organización ha permitido desarrollar y validar las funcionalidades principales sin introducir complejidad innecesaria.

Sin embargo, al aumentar el tamaño del proyecto, será conveniente separar estas responsabilidades.

## 5. Flujo general de funcionamiento

El funcionamiento de la aplicación puede resumirse en el siguiente flujo:

1. El usuario configura el partido.
2. Se inicializa el marcador.
3. Se inicia la partida y sus cronómetros.
4. El usuario registra los puntos.
5. La lógica calcula juegos, sets, saque y cambios de lado.
6. Los estados se actualizan en la interfaz.
7. AsyncStorage conserva el estado de la partida.
8. Si la aplicación pasa a segundo plano, se puede recuperar el estado al volver a abrirla.

## 6. Gestión del estado

React gestiona los datos necesarios para representar la partida.

Se utilizan principalmente los siguientes mecanismos:

- `useState`: mantiene los datos que afectan a la interfaz.
- `useEffect`: ejecuta operaciones relacionadas con el ciclo de vida del componente.
- `useRef`: conserva referencias que no necesitan provocar una nueva renderización.

El estado del marcador se mantiene separado conceptualmente de la configuración y de los controles de la partida.

## 7. Persistencia local

AsyncStorage permite guardar información en el dispositivo.

Actualmente se utiliza para conservar:

- Configuración del partido.
- Marcador actual.
- Historial de estados del marcador.
- Estado de inicio y pausa.
- Marca temporal necesaria para recuperar los cronómetros.

La persistencia permite recuperar una partida en curso sin depender de un servidor externo.

## 8. Arquitectura futura

A medida que PadelApp crezca, se plantea reorganizar el proyecto en módulos independientes.

Una posible estructura futura sería:

```text
src/
│
├── app/
│   ├── index.tsx
│   ├── historial.tsx
│   ├── estadisticas.tsx
│   └── perfil.tsx
│
├── components/
│   ├── marcador/
│   ├── cronometros/
│   ├── jugadores/
│   └── comunes/
│
├── hooks/
│   ├── usePartido.ts
│   ├── useCronometro.ts
│   └── usePersistencia.ts
│
├── services/
│   ├── storage.ts
│   └── api.ts
│
├── types/
│   ├── partido.ts
│   ├── jugador.ts
│   └── estadisticas.ts
│
└── utils/
    ├── puntuacion.ts
    └── tiempo.ts
```

Esta estructura es una propuesta de evolución, no la organización implementada actualmente.

## 9. Evolución hacia una plataforma

En futuras fases se contempla incorporar:

- Registro e inicio de sesión de usuarios.
- Perfiles individuales.
- Historial de partidos.
- Estadísticas personales y compartidas.
- Comparativas entre jugadores.
- Registro de acciones individuales durante los puntos.
- Tarjetas de jugadores con estadísticas.
- Sincronización de información entre dispositivos.
- Integración con relojes inteligentes.

Estas funcionalidades requerirán estudiar una arquitectura con backend y base de datos.

La incorporación de estos servicios se realizará cuando la aplicación local esté suficientemente consolidada.

## 10. Principios de desarrollo

El desarrollo de PadelApp seguirá estos principios:

- Mantener el código comprensible y modular.
- Separar progresivamente la interfaz de la lógica de negocio.
- Utilizar TypeScript para reducir errores.
- Validar cada funcionalidad antes de añadir nuevas.
- Conservar un historial de cambios mediante Git.
- Documentar las decisiones técnicas.
- Priorizar la estabilidad antes de ampliar funcionalidades.

La arquitectura debe permitir que PadelApp evolucione desde un marcador de pádel local hasta una plataforma completa de gestión y análisis de partidos.
