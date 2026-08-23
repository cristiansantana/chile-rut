# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.9] - 2026-08-23

### Fixed

- `validateRut` now returns `false` instead of throwing when the identifier consists only of zeros.
- Non-string runtime inputs are now handled consistently without changing the public TypeScript signatures.
- Invalid-input errors now use normalized messages without a duplicated `Error:` prefix.
- The build toolchain now matches the documented Node.js 16.14 minimum.
- Updated the build-time `esbuild` dependency to address a low-severity development-server vulnerability.

### Changed

- Development and package builds now use Node.js 24 while the published library continues to support Node.js 16.14 and newer.
- CI now builds one tarball and verifies the installed artifact across Node.js 16, 18, 20, 22, 24 and 26, including its TypeScript declarations.
- CI now uses pinned actions, minimal permissions, concurrency controls, timeouts and automated dependency updates.
- The published package now declares its root ESM entry point explicitly and marks itself as side-effect free.
- Package contents are now restricted to runtime artifacts and essential documentation, with an automated manifest check.
- Production type checking now uses the same ESM module semantics as the published package while tests continue to run through CommonJS.
- Updated the build toolchain and raised dependency auditing to low severity.
- Removed circular dependencies between internal format validators, normalizers and check-digit utilities.
- Simplified internal RUT normalization while preserving the supported string formats.
- Expanded focused success, failure and installed-artifact compatibility tests, with 100% coverage requirements.
- Updated compatible development dependencies and CI validation across Node.js 16, 18, 20, 22, 24 and 26.
- Documented the complete public API, supported formats, runtime requirements and release checks.
