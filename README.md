# Chile-Rut

[![Build status](https://github.com/cristiansantana/chile-rut/actions/workflows/build.yml/badge.svg)](https://github.com/cristiansantana/chile-rut/actions/workflows/build.yml)

Chile-Rut is an ESM JavaScript package with TypeScript declarations for working with the Chilean identification number known as RUT or RUN.

It validates syntax and modulo-11 check digits. It does **not** verify whether a RUT has been legally issued or currently exists.

## Requirements

- Node.js 16.14 or newer.
- An environment that supports ECMAScript modules (ESM).

## Installation

```sh
npm install @cristiansantana/chile-rut
```

## Usage

```js
import { getCheckDigit, validateRut } from "@cristiansantana/chile-rut";
```

### Validate a RUT

Pass the complete RUT, including the hyphen and check digit, to `validateRut`. It returns a boolean and does not throw for malformed input.

```js
validateRut("12.345.678-5"); // true
validateRut("12345678-5"); // true
validateRut("18.765.002-K"); // true

validateRut("12.345.678-6"); // false: incorrect check digit
validateRut("12 345 678-5"); // false: unsupported format
```

Validation confirms that the syntax and modulo-11 check digit are correct. It does not confirm that the RUT has been legally issued or currently exists.

### Get a check digit

Pass the identifier without the hyphen or check digit to `getCheckDigit`. The identifier can be written with or without grouping separators.

```js
getCheckDigit("12.345.678"); // "5"
getCheckDigit("12345678"); // "5"
getCheckDigit("18.765.002"); // "K"
```

You can use the result to build a complete RUT:

```js
const rutId = "20.123.456";
const checkDigit = getCheckDigit(rutId); // "5"
const rut = `${rutId}-${checkDigit}`; // "20.123.456-5"
```

### Edge cases

An identifier consisting only of zeros is not considered a valid RUT. Validation returns `false`, while calculating its check digit throws an `Error`.

```js
validateRut("0-0"); // false
getCheckDigit("0"); // throws
```

## API

### `getCheckDigit(rutId)`

Calculates the modulo-11 check digit for a RUT identifier and returns it as a string. It throws an `Error` when the identifier has an unsupported format or consists only of zeros.

```js
getCheckDigit("12345678"); // "5"
getCheckDigit("18.765.002"); // "K"
getCheckDigit("19.876.543"); // "0"
getCheckDigit("0"); // throws
```

### `validateRut(rut)`

Returns `true` when the complete RUT has a supported format and the correct check digit. It returns `false` for malformed RUTs, incorrect check digits and identifiers consisting only of zeros.

```js
validateRut("12345678-5"); // true
validateRut("18.765.002-k"); // true
validateRut("19.876.543-0"); // true
validateRut("0-0"); // false
```

### `validateRutFormat(rut)`

Checks syntax only. It does not calculate the check digit, so a value can have a valid format while not being a valid RUT.

```js
validateRutFormat("12.345.678-5"); // true
validateRutFormat("123456785"); // false
validateRutFormat("0-0"); // true (syntactically valid)
```

### `validateRutIdFormat(rutId)`

Checks whether an identifier uses a supported syntax. This is a format check only; `"0"` has a valid format even though `getCheckDigit("0")` throws.

```js
validateRutIdFormat("12345678"); // true
validateRutIdFormat("12.345.678"); // true
validateRutIdFormat("12.345,678"); // false
```

### `validateRutCheckDigitFormat(checkDigit)`

Returns `true` for one numeric digit or the letter `K`, in either case.

```js
validateRutCheckDigitFormat("5"); // true
validateRutCheckDigitFormat("K"); // true
validateRutCheckDigitFormat("k"); // true
validateRutCheckDigitFormat("10"); // false
```

## Supported formats

RUT identifiers can be unseparated or grouped consistently with dots or commas. Leading zeros are accepted and removed before calculating the check digit.

```text
12345678
12.345.678
12,345,678
012345678
00.012.345.678
```

Complete RUTs use a hyphen before the check digit:

```text
12345678-5
12.345.678-5
12,345,678-5
18.765.002-K
18.765.002-k
```

Mixed or incomplete grouping separators are rejected.

## Development

Install the locked dependencies and run the complete release check:

```sh
npm ci
npm run check
```

Individual commands are also available:

```sh
npm run format-check
npm run type-check
npm test
npm run test-coverage
npm run build
npm run smoke-test
```

Before preparing a release, run `npm audit --audit-level=high` and inspect the package with `npm pack --dry-run --json`. Publishing and tagging remain manual steps.

## Project information

- [Changelog](./CHANGELOG.md)
- [Issue tracker](https://github.com/cristiansantana/chile-rut/issues)
- [Source repository](https://github.com/cristiansantana/chile-rut)
- [ISC license](./LICENSE)
