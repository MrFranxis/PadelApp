# PadelApp — Modelo `Jugador`

## Objetivo de este paso

Crear el primer modelo de datos de PadelApp para representar a una persona que
participa en un partido. Todavía no se crea una pantalla de registro, no se
guardan jugadores en una base de datos y no se conecta Supabase.

Archivo creado:

```text
src/
└── types/
    └── jugador.ts
```

## Código

El archivo `src/types/jugador.ts` contiene:

```ts
/**
 * Representa a una persona que participa en un partido de pádel.
 *
 * Este tipo es independiente de una cuenta de usuario:
 * podremos registrar jugadores aunque todavía no estén registrados
 * en PadelApp.
 */
export type Jugador = {
  /**
   * Identificador único del jugador dentro de PadelApp.
   * Más adelante podremos generarlo con crypto.randomUUID()
   * o asignarlo desde la base de datos.
   */
  id: string;

  /** Nombre de pila del jugador. */
  nombre: string;

  /** Apellidos del jugador. Es opcional porque no siempre los conoceremos. */
  apellidos?: string;

  /** Ruta o URL de la fotografía de perfil. */
  fotoUrl?: string;

  /**
   * Identificador de la cuenta de PadelApp, si el jugador tiene una.
   * Se deja opcional para admitir jugadores invitados o locales.
   */
  usuarioId?: string;
};
```

## Explicación de cada propiedad

| Propiedad | Tipo | Obligatoria | Uso |
|---|---|---:|---|
| `id` | `string` | Sí | Identifica de forma única al jugador. |
| `nombre` | `string` | Sí | Nombre visible del jugador. |
| `apellidos` | `string` | No | Permite guardar los apellidos cuando se conocen. |
| `fotoUrl` | `string` | No | En el futuro apuntará a la imagen de perfil. |
| `usuarioId` | `string` | No | Relacionará al jugador con una cuenta registrada. |

## Conceptos de TypeScript

### `export`

Permite utilizar `Jugador` desde otros archivos.

### `type`

Define la estructura que debe tener un objeto. No crea por sí mismo un objeto
ni almacena información en memoria.

### `string`

Indica que el valor debe ser texto.

### Propiedades opcionales (`?`)

Por ejemplo, `apellidos?: string` significa que la propiedad puede existir
con un texto o no aparecer en el objeto.

### Separar jugador y usuario

Un jugador no tiene por qué tener una cuenta. En un partido podemos introducir
a cuatro participantes aunque solo uno o ninguno esté registrado. Si más
adelante alguno crea una cuenta, `usuarioId` permitirá vincular ambos conceptos.

Esta separación evita obligarnos a implementar autenticación antes de tiempo.

## Ejemplo de uso futuro

Este ejemplo es ilustrativo. No hay que añadirlo todavía a `index.tsx`:

```ts
import type { Jugador } from "../types/jugador";

const jugadorEjemplo: Jugador = {
  id: "jugador-001",
  nombre: "Carlos",
  apellidos: "García",
};
```

`import type` importa únicamente la definición de TypeScript. No añade código
de ejecución a la aplicación.

## Qué cambia en la aplicación ahora

- Se añade el archivo `src/types/jugador.ts`.
- No se modifica el marcador.
- No se modifica la puntuación de pádel.
- No se modifica el cronómetro.
- No se añade todavía una interfaz para seleccionar jugadores.
- No se necesita instalar ninguna dependencia.

Por tanto, el comportamiento actual de PadelApp debe seguir siendo el mismo.

## Comprobación

Desde la carpeta del proyecto:

```powershell
npx.cmd expo start --web
```

Comprueba que la aplicación sigue abriéndose correctamente.

Después revisa los cambios:

```powershell
git status
```

El archivo nuevo debería aparecer como no rastreado hasta que lo añadamos a Git.

## Siguiente punto de desarrollo

Crear el modelo `EventoPunto`, que representará cada punto disputado.

Deberá permitir distinguir:

- La pareja que gana el punto.
- El jugador que realiza la acción.
- El tipo de acción: winner, error no forzado, error forzado o saque directo.
- La fecha y hora del evento.

No todos los puntos tendrán que tener un jugador o una acción clasificada:
si no se conoce el detalle, el punto podrá registrarse igualmente.

Más adelante conectaremos estos eventos con el marcador y haremos que
`deshacerUltimoPunto()` revierta también el último evento para mantener
correctas las estadísticas.
