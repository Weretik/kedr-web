# Admin retail prices from a file consumer contract

## Machine contract

- OpenAPI: [OpenAPI snapshot](../openapi/openapi.json)
- Operations: `getAdminRetailPriceStatus` (`GET /api/admin/retail-prices`), `importAdminRetailPrices` (`POST /api/admin/retail-prices/import`, `multipart/form-data`), `unlockAdminRetailPrices` (`POST /api/admin/retail-prices/unlock`)
- Generated types: `components['schemas']['RetailPriceStatusDto']`, `components['schemas']['RetailPriceImportResultDto']`
- Consumer: Admin [retail prices from a file](../../features/admin/retail-prices.md)
- Backend source: KedrStore spec `catalog/010-retail-prices-from-file`; policy `CanManageProducts`, import under the `HeavyOperation` rate limit

## Request projection

The import sends the form fields `file` (the .xlsx Blob, up to 10 MB) and `protectFromOneC` (`true` by default; `true` keeps the prices from the file from the 1C sync). Unlock and status take no body.

## Response projection

- Status: price type id and name the site shows, `lockedCount`, `lastLockedAt` (UTC, shown in Kyiv time). The Admin shows the locked line only when `lockedCount > 0`.
- Import result: `changed`, `unchanged`, `notFoundCount` with up to 50 `notFoundCodes`, `withoutPriceCount` with up to 50 `withoutPriceCodes`, and the new `status`.
- Errors: 400 problem with `errors.file` for a wrong file; 413 for a body over the limit; 409 when a 1C price sync changed the same prices at the same moment (try again). The Admin shows each in Ukrainian.

## Repeats

No `Idempotency-Key`: the import sets target values and the unlock clears a flag, so a repeat changes nothing more. The Admin locks both buttons while either request runs, and RTK Query does not retry mutations.
