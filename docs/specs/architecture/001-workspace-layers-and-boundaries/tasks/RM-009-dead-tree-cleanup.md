# RM-009 — Remove dead projects, folders and stale paths

- **Findings:** AF-010
- **Requirements:** AR-008
- **Depends on:** RM-008
- **Owner:** workspace maintenance
- **Exact paths:** candidates in `docs/architecture/frontend-inventory.md`;
  affected project/alias/Jest/Metro/docs references

## Work

- [x] Confirm zero consumers/generated runtime need for each candidate.
- [x] Remove empty permission project and source folders or assign real ownership.
- [x] Remove stale aliases/config mappings/docs created by deletion.

## Verification

Consumer search, empty-dir/project scan, Nx graph, lint/typecheck/tests/builds.

## Checkpoint

AF-010 verified when no candidate remains without a documented responsibility.
