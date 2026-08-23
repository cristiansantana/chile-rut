# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Non-string runtime inputs are now handled consistently without changing the public TypeScript signatures.
- Invalid-input errors now use normalized messages without a duplicated `Error:` prefix.
- Updated the build-time `esbuild` dependency to address a low-severity development-server vulnerability.

### Changed

- Simplified internal RUT normalization while preserving the supported string formats.
- Replaced exhaustive invariant loops with focused success, failure and installed-artifact compatibility cases.
- Hardened CI and extended installed-package verification through Node.js 26.

## [1.0.9] - 2026-08-23

### Fixed

- `validateRut` now returns `false` instead of throwing when the identifier consists only of zeros.
- The build toolchain now matches the documented Node.js 16.14 minimum.

### Changed

- Development and package builds now use Node.js 24 while the published library continues to support Node.js 16.14 and newer.
- CI now builds one tarball and verifies the installed artifact across Node.js 16, 18, 20, 22 and 24, including its TypeScript declarations.
- The published package now declares its root ESM entry point explicitly and marks itself as side-effect free.
- Package contents are now restricted to runtime artifacts and essential documentation, with an automated manifest check.
- Production type checking now uses the same ESM module semantics as the published package while tests continue to run through CommonJS.
- Updated the build toolchain and raised dependency auditing to moderate severity.
- Removed circular dependencies between internal format validators, normalizers and check-digit utilities.
- Expanded tests and added coverage requirements for all public functions.
- Added deterministic invariant and fuzz tests to the source and installed-package suites.
- Updated compatible development dependencies and CI validation across Node.js 16, 18, 20, 22 and 24.
- Documented the complete public API, supported formats, runtime requirements and release checks.
