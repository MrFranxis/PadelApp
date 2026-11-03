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
