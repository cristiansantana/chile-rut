# Chile-Rut

[English](./README.md) | [Español](./README.es.md)

[![Build main](https://img.shields.io/github/actions/workflow/status/cristiansantana/chile-rut/build.yml?branch=main&event=push&label=build%20main&logo=github)](https://github.com/cristiansantana/chile-rut/actions/workflows/build.yml?query=branch%3Amain)
[![Node.js](https://img.shields.io/node/v/@cristiansantana/chile-rut?logo=node.js&label=Node.js)](https://www.npmjs.com/package/@cristiansantana/chile-rut)
[![Entorno](https://img.shields.io/badge/entorno-Browser%20%2B%20Node.js-2ea44f?logo=javascript)](#compatibilidad)

Chile-Rut es un paquete de JavaScript ESM con declaraciones de TypeScript para trabajar con el número de identificación chileno conocido como RUT o RUN.

Valida la sintaxis y los dígitos verificadores mediante módulo 11. **No** comprueba si un RUT ha sido emitido legalmente o si existe actualmente.

## Compatibilidad

Chile-Rut funciona tanto en navegadores modernos como en aplicaciones de Node.js.

| Entorno | Compatibilidad |
| --- | --- |
| Navegadores modernos | ✅ |
| Node.js 26.x | ✅ |
| Node.js 24.x | ✅ |
| Node.js 22.x | ✅ |
| Node.js 20.x | ✅ |
| Node.js 18.x | ✅ |
| Node.js 16.14 o superior | ✅ |

Para aplicaciones nuevas en producción, usa una versión de Node.js con soporte vigente.

## Requisitos

- Node.js 16.14 o posterior.
- Un entorno compatible con módulos ECMAScript (ESM).

## Instalación

```sh
npm install @cristiansantana/chile-rut
```

## Uso

```js
import { getCheckDigit, validateRut } from "@cristiansantana/chile-rut";
```

La raíz del paquete es el único punto de entrada público. No se admiten importaciones desde rutas internas de `src` ni `dist`.

### Validar un RUT

Pasa el RUT completo, incluido el guion y el dígito verificador, a `validateRut`. Devuelve un valor booleano y no lanza errores ante entradas malformadas.

```js
validateRut("12.345.678-5"); // true
validateRut("12345678-5"); // true
validateRut("18.765.002-K"); // true

validateRut("12.345.678-6"); // false: dígito verificador incorrecto
validateRut("12 345 678-5"); // false: formato no admitido
```

La validación confirma que la sintaxis y el dígito verificador de módulo 11 sean correctos. No confirma que el RUT haya sido emitido legalmente o que exista actualmente.

### Obtener un dígito verificador

Pasa el identificador sin el guion ni el dígito verificador a `getCheckDigit`. El identificador puede escribirse con o sin separadores de agrupación.

```js
getCheckDigit("12.345.678"); // "5"
getCheckDigit("12345678"); // "5"
getCheckDigit("18.765.002"); // "K"
```

Puedes usar el resultado para construir un RUT completo:

```js
const rutId = "20.123.456";
const checkDigit = getCheckDigit(rutId); // "5"
const rut = `${rutId}-${checkDigit}`; // "20.123.456-5"
```

### Casos límite

Un identificador compuesto únicamente por ceros no se considera un RUT válido. La validación devuelve `false`, mientras que calcular su dígito verificador lanza un `Error`.

```js
validateRut("0-0"); // false
getCheckDigit("0"); // lanza un error
```

## API

### `getCheckDigit(rutId)`

Calcula el dígito verificador de módulo 11 para un identificador de RUT y lo devuelve como texto. Lanza un `Error` cuando el identificador tiene un formato no admitido o está compuesto únicamente por ceros.

```js
getCheckDigit("12345678"); // "5"
getCheckDigit("18.765.002"); // "K"
getCheckDigit("19.876.543"); // "0"
getCheckDigit("0"); // lanza un error
```

### `validateRut(rut)`

Devuelve `true` cuando el RUT completo tiene un formato admitido y el dígito verificador correcto. Devuelve `false` para RUT malformados, dígitos verificadores incorrectos e identificadores compuestos únicamente por ceros.

```js
validateRut("12345678-5"); // true
validateRut("18.765.002-k"); // true
validateRut("19.876.543-0"); // true
validateRut("0-0"); // false
```

### `validateRutFormat(rut)`

Comprueba solamente la sintaxis. No calcula el dígito verificador, por lo que un valor puede tener un formato válido sin ser un RUT válido.

```js
validateRutFormat("12.345.678-5"); // true
validateRutFormat("123456785"); // false
validateRutFormat("0-0"); // true (sintácticamente válido)
```

### `validateRutIdFormat(rutId)`

Comprueba si un identificador usa una sintaxis admitida. Es solo una comprobación de formato; `"0"` tiene un formato válido aunque `getCheckDigit("0")` lance un error.

```js
validateRutIdFormat("12345678"); // true
validateRutIdFormat("12.345.678"); // true
validateRutIdFormat("12.345,678"); // false
```

### `validateRutCheckDigitFormat(checkDigit)`

Devuelve `true` para un único dígito numérico o la letra `K`, en cualquiera de sus mayúsculas o minúsculas.

```js
validateRutCheckDigitFormat("5"); // true
validateRutCheckDigitFormat("K"); // true
validateRutCheckDigitFormat("k"); // true
validateRutCheckDigitFormat("10"); // false
```

## Formatos admitidos

Los identificadores de RUT pueden escribirse sin separadores o agruparse de forma coherente con puntos o comas. Se aceptan ceros iniciales y se eliminan antes de calcular el dígito verificador.

```text
12345678
12.345.678
12,345,678
012345678
00.012.345.678
```

Los RUT completos usan un guion antes del dígito verificador:

```text
12345678-5
12.345.678-5
12,345,678-5
18.765.002-K
18.765.002-k
```

No se admiten separadores de agrupación mezclados ni incompletos.

## Desarrollo

El uso del paquete publicado requiere Node.js 16.14 o posterior. El desarrollo y la compilación del paquete requieren Node.js 24.

Selecciona la versión de desarrollo, instala las dependencias bloqueadas y ejecuta la comprobación completa previa a una publicación:

```sh
nvm use
npm ci
npm run check
```

También hay comandos individuales disponibles:

```sh
npm run format-check
npm run type-check
npm test
npm run test-coverage
npm run build
npm run smoke-test
npm run package-check
```

`npm run check` también verifica la lista exacta de archivos que se publicarían. Antes de preparar una publicación, ejecuta `npm audit --audit-level=low`. La integración continua genera el tarball una vez con Node.js 24 y luego instala y prueba ese mismo artefacto, incluidas sus declaraciones de TypeScript, en Node.js 16.14, 18, 20, 22, 24 y 26. También importa y ejecuta ese artefacto en un navegador real sin interfaz. La publicación y el etiquetado siguen siendo pasos manuales.

## Información del proyecto

- [Registro de cambios](./CHANGELOG.md)
- [Seguimiento de incidencias](https://github.com/cristiansantana/chile-rut/issues)
- [Repositorio de código fuente](https://github.com/cristiansantana/chile-rut)
- [Licencia ISC](./LICENSE)
