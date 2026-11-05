# Desarrollo, pruebas y publicación

## 1. Introducción

Este documento describe el entorno de desarrollo de PadelApp, los comandos principales para trabajar con el proyecto y el procedimiento para generar compilaciones instalables mediante Expo Application Services (EAS).

## 2. Entorno de desarrollo

El proyecto utiliza las siguientes herramientas:

- Windows 10.
- Node.js.
- npm.
- Visual Studio Code.
- React Native.
- Expo.
- TypeScript.
- Git.
- GitHub.
- Expo Application Services (EAS).

El proyecto se encuentra organizado en un repositorio Git.

## 3. Requisitos previos

Antes de trabajar con el proyecto es necesario disponer de:

- Node.js instalado.
- npm.
- Git.
- Un editor de código, preferiblemente Visual Studio Code.
- Una cuenta de Expo para utilizar EAS Build.

Para comprobar las instalaciones:

```powershell
node --version
npm --version
git --version
```

## 4. Instalación del proyecto

Clonar el repositorio:

```powershell
git clone https://github.com/MrFranxis/PadelApp.git
```

Acceder al directorio:

```powershell
cd PadelApp
```

Instalar las dependencias:

```powershell
npm.cmd install
```

## 5. Ejecutar la aplicación

Para iniciar el servidor de desarrollo de Expo:

```powershell
npx.cmd expo start
```

Para iniciar Expo con limpieza de caché:

```powershell
npx.cmd expo start -c
```

Para ejecutar la versión web:

```powershell
npx.cmd expo start --web
```

El servidor de Expo permite ejecutar y probar la aplicación durante el desarrollo.

## 6. Comprobación de TypeScript

Antes de validar los cambios se recomienda comprobar que no existen errores de tipos.

Ejecutar:

```powershell
npx.cmd tsc --noEmit
```

Este comando realiza una comprobación de TypeScript sin generar archivos JavaScript.

Si no aparecen errores, la comprobación ha terminado correctamente.

## 7. Control de versiones con Git

Git permite conservar el historial de desarrollo y recuperar versiones anteriores.

Comprobar el estado del repositorio:

```powershell
git status
```

Consultar los cambios realizados:

```powershell
git diff
```

Revisar posibles errores de espacios y finales de línea:

```powershell
git diff --check
```

Añadir los archivos que se desean guardar:

```powershell
git add .
```

Crear un commit:

```powershell
git commit -m "Descripción de los cambios"
```

Enviar los cambios al repositorio remoto:

```powershell
git push origin main
```

Es recomendable revisar siempre los archivos antes de crear un commit.

No se deben añadir archivos temporales, copias de seguridad ni información privada.

## 8. Expo Application Services (EAS)

EAS permite generar compilaciones de la aplicación sin necesidad de configurar manualmente todo el entorno nativo de Android.

El proyecto dispone de un archivo `eas.json` con dos perfiles:

- `preview`: distribución interna para pruebas.
- `production`: perfil destinado a futuras compilaciones de producción.

## 9. Configuración de EAS

Para iniciar sesión:

```powershell
eas.cmd login
```

Para consultar la cuenta activa:

```powershell
eas.cmd whoami
```

El proyecto ya tiene configurado su identificador de EAS y el paquete Android:

`com.mrfranxiss.padelapp`

No es necesario repetir la configuración inicial de EAS.

## 10. Generar una compilación Android de pruebas

Para generar una compilación de distribución interna:

```powershell
eas.cmd build --platform android --profile preview
```

EAS procesa el proyecto y genera un archivo instalable cuando la compilación termina correctamente.

La compilación puede consultarse desde el panel de Expo.

## 11. Instalar y probar la aplicación

Una vez finalizada la compilación:

1. Abrir el enlace del resultado de EAS.
2. Acceder al archivo de instalación Android.
3. Descargar el APK, si ese es el formato generado.
4. Instalarlo en un dispositivo Android.
5. Comprobar las funcionalidades principales.

Las pruebas deben realizarse en un dispositivo físico siempre que sea posible.

## 12. Plan de pruebas

Antes de considerar estable una versión, conviene comprobar:

### Marcador

- Sumar puntos a ambas parejas.
- Comprobar iguales y ventaja.
- Finalizar juegos.
- Finalizar sets.
- Comprobar el tie-break.
- Deshacer puntos.
- Reiniciar una partida.

### Saque y cambios de lado

- Comprobar la alternancia del saque.
- Comprobar el primer saque del tie-break.
- Comprobar los turnos posteriores de dos puntos.
- Comprobar los avisos de cambio de lado.

### Cronómetros

- Comprobar el tiempo total.
- Comprobar el tiempo del set.
- Comprobar el tiempo del juego.
- Comprobar pausa y reanudación.
- Comprobar el comportamiento al bloquear el teléfono.
- Comprobar la recuperación al volver a primer plano.

### Persistencia

- Iniciar una partida.
- Registrar varios puntos.
- Salir de la aplicación.
- Volver a abrirla.
- Comprobar que se recuperan el marcador y los cronómetros.
- Comprobar que el historial permite deshacer el último punto.

### Interfaz

- Comprobar el desplazamiento vertical.
- Revisar los controles.
- Comprobar que no existen elementos cortados.
- Probar distintas resoluciones de pantalla.

## 13. Publicación futura

Cuando la aplicación esté suficientemente probada, se podrá preparar una compilación de producción.

El proceso de publicación incluirá:

1. Validar el código.
2. Ejecutar las pruebas funcionales.
3. Actualizar la versión de la aplicación.
4. Generar la compilación de producción.
5. Revisar el comportamiento en dispositivos reales.
6. Preparar los recursos gráficos y la ficha de la aplicación.
7. Publicar en Google Play cuando se decida comercializarla.

La publicación comercial requerirá completar los requisitos de Google Play y disponer de una cuenta de desarrollador.

## 14. Buenas prácticas

Durante el desarrollo se recomienda:

- Realizar cambios pequeños y controlados.
- Comprobar TypeScript después de modificar la lógica.
- Probar las funcionalidades antes de generar un APK.
- Revisar los cambios antes de crear commits.
- Mantener el repositorio actualizado.
- No guardar contraseñas ni credenciales en Git.
- Documentar las nuevas funcionalidades.
- Conservar las credenciales de firma y configuración de EAS.

## 15. Estado del proyecto

PadelApp dispone de un entorno Expo configurado, un repositorio GitHub y un perfil EAS de distribución interna.

El objetivo de esta fase es consolidar las funcionalidades existentes y realizar pruebas en dispositivos físicos antes de avanzar hacia una publicación comercial.
