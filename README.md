# Chile-Rut

Chile-Rut is a utility for working with the Chilean identification number (known as RUT or RUN).

## Features

- Validating a RUT (Chilean identification number) using its check digit.
- Obtaining the check digit for a RUT.
- Verifying if the format of a RUT is correct.

## Installation

```sh
npm install @cristiansantana/chile-rut
```

## Usage

### Get CheckDigit

Use the `getCheckDigit` function with a RUT Id as parameter.

#### Example without format validation
```js
import { getCheckDigit } from "@cristiansantana/chile-rut";

const rutId = "12345678";

try {
    const digit = getCheckDigit(rutId);
    console.log(digit); // -> output expected: 5
} catch (error) {
    // Error: rutId has non valid format
    // ...   
}
```

#### Example with format validation
```js
import { getCheckDigit, validateRutIdFormat } from "@cristiansantana/chile-rut";

const rutId = "12345678";

if (validateRutIdFormat(rutId)) {
    const digit = getCheckDigit(rutId);
    console.log(digit); // -> output expected: 5
}
else {
    // Error: rutId has non valid format
    // ...
}
```

#### Supported formats

`getCheckDigit` support the parameter rutId as:

- "12345678"
- "12.345.678"
- "12,345,678"
- "012.345.678"

### Validate a RUT

Use the `validateRut` function with a RUT as parameter for validate it.

```js
import { validateRut } from "@cristiansantana/chile-rut";

console.log(validateRut("12345678-5")); // -> output expected: true
console.log(validateRut("12345678-6")); // -> output expected: false
```

#### Supported formats

`validateRut` support the parameter rut as:

- "12345678-5"
- "12.345.678-5"
- "12,345,678-5"
- "012.345.678-5"
