# Comprehensive TypeScript Type Fix Plan

## Problem Analysis
Supabase's type inference is failing - TypeScript infers `never` for all database operations despite having Database types. This is a known issue with `@supabase/ssr` type propagation.

## Root Cause
The `Database` generic isn't properly propagating through the query chain in `@supabase/ssr`. TypeScript can't infer types from `.from()` calls.

## Solution Strategy
Cast `.from()` calls to `any` to bypass type checking, then use explicit Insert/Update/Row types for data.

## Files to Fix

### 1. app/api/search/route.ts
- Issue: `.insert()` on property_searches fails
- Fix: Cast `.from('property_searches')` to `any` before insert

### 2. app/(auth)/signup/page.tsx  
- Issue: Already has `as any` but may need verification
- Status: Check if working

### 3. lib/usage.ts
- Issue: `.insert()` on usage_tracking may fail
- Fix: Cast `.from('usage_tracking')` to `any` before insert

### 4. app/api/stripe/webhook/route.ts
- Issue: Multiple `.insert()` and `.update()` operations
- Fix: Cast all `.from()` calls to `any`

## Implementation Pattern

```typescript
// For inserts:
const { data, error } = await (supabase.from('table_name') as any).insert(insertData)

// For updates:
await (supabase.from('table_name') as any).update(updateData).eq('id', id)

// For selects (keep as is, but ensure result typing):
const { data } = await supabase.from('table_name').select('*')
const typedData = data as TableRow[]
```

## Execution Order
1. Fix app/api/search/route.ts
2. Verify app/(auth)/signup/page.tsx
3. Fix lib/usage.ts
4. Fix app/api/stripe/webhook/route.ts
5. Test all files compile
6. Commit once
