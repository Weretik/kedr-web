# ADR-0001: Expo Router for Mobile

**Status:** Accepted\
**Date:** 2026-07-27

## Context

The application is built with Expo and needs native navigation, deep links, and predictable route placement.

## Decision

Use Expo Router. Files in `apps/mobile/src/app` define routes and layouts; they remain thin adapters to domain feature libraries.

## Consequences

- Routes, route groups, and dynamic segments are defined by the file structure.
- Do not duplicate navigation with a manually maintained React Navigation map.
- Do not place non-route components, hooks, or tests in `src/app`.
