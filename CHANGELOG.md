# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.9] - 2026-08-23

### Fixed

- `validateRut` now returns `false` instead of throwing when the identifier consists only of zeros.
- The build toolchain now matches the documented Node.js 16.14 minimum.

### Changed

- Development and package builds now use Node.js 24 while the published library continues to support Node.js 16.14 and newer.
- CI now builds one tarball and verifies the installed artifact across Node.js 16, 18, 20, 22 and 24, including its TypeScript declarations.
- Production type checking now uses the same ESM module semantics as the published package while tests continue to run through CommonJS.
- Updated the build toolchain and raised dependency auditing to moderate severity.
- Removed circular dependencies between internal format validators, normalizers and check-digit utilities.
- Expanded tests and added coverage requirements for all public functions.
- Updated compatible development dependencies and CI validation across Node.js 16, 18, 20, 22 and 24.
- Documented the complete public API, supported formats, runtime requirements and release checks.
