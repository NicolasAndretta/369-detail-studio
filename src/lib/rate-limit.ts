// ============================================================
// Freno de fuerza bruta para el login del panel.
//
// Vive en la memoria del proceso: sin Redis, sin dependencias, sin costo.
// Alcanza de sobra para un panel de dos personas. Si algún día el sitio
// corre en varias instancias a la vez, cada una lleva su propia cuenta
// (el freno afloja, pero nunca deja de existir).
// ============================================================

interface Intento {
  fallos: number;
  /** Momento en que se olvidan los fallos si no hay más intentos. */
  expira: number;
  /** Si está bloqueado, hasta cuándo. */
  bloqueadoHasta: number;
}

const intentos = new Map<string, Intento>();

// 8 intentos y 10 min de castigo. Es un equilibrio pensado para el caso real:
// Nico y el primo salen por la MISMA IP (el wifi del taller), así que un
// límite muy corto los deja afuera a los dos por un dedazo en el celular.
// Aun así, 8 intentos cada 10 minutos son ~1.150 pruebas por día: contra una
// clave de 16 caracteres, tardarían más que la edad del universo.
const MAX_FALLOS = 8;
const VENTANA_MS = 15 * 60 * 1000; // se olvidan los fallos tras 15 min sin actividad
const BLOQUEO_MS = 10 * 60 * 1000; // castigo al pasarse
const MAX_CLAVES = 5_000; // techo de memoria por si alguien rota IPs

function limpiarVencidos(ahora: number): void {
  for (const [clave, dato] of intentos) {
    if (dato.expira < ahora && dato.bloqueadoHasta < ahora) intentos.delete(clave);
  }
}

/** IP del cliente, contemplando el proxy de Hostinger/Vercel. */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "desconocida";
}

export interface EstadoLimite {
  permitido: boolean;
  /** Segundos que faltan para poder reintentar (solo si está bloqueado). */
  esperaSegundos: number;
}

/** ¿Esta IP puede intentar entrar? No cuenta el intento, solo consulta. */
export function chequearLimite(clave: string): EstadoLimite {
  const ahora = Date.now();
  const dato = intentos.get(clave);

  if (dato && dato.bloqueadoHasta > ahora) {
    return {
      permitido: false,
      esperaSegundos: Math.ceil((dato.bloqueadoHasta - ahora) / 1000),
    };
  }
  return { permitido: true, esperaSegundos: 0 };
}

/** Registra un intento fallido y bloquea si se pasó del máximo. */
export function registrarFallo(clave: string): void {
  const ahora = Date.now();

  if (intentos.size > MAX_CLAVES) limpiarVencidos(ahora);

  const dato = intentos.get(clave);

  // Sin registro previo, o el anterior ya venció: arranca de cero.
  if (!dato || dato.expira < ahora) {
    intentos.set(clave, {
      fallos: 1,
      expira: ahora + VENTANA_MS,
      bloqueadoHasta: 0,
    });
    return;
  }

  dato.fallos += 1;
  dato.expira = ahora + VENTANA_MS;
  if (dato.fallos >= MAX_FALLOS) {
    dato.bloqueadoHasta = ahora + BLOQUEO_MS;
    dato.fallos = 0; // el castigo ya está aplicado; después se empieza de nuevo
  }
}

/** Login correcto: se borra el historial de esa IP. */
export function limpiarFallos(clave: string): void {
  intentos.delete(clave);
}
