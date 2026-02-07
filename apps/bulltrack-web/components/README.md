# Components

This app follows **Atomic Design** and a clear separation of concerns:

- **UI components** (here): presentational building blocks.
- **Logic**: in `hooks/` (state, handlers, derived data).
- **Data fetching**: in `hooks/` using `lib/api-client.ts` and React Query.

## Structure

| Layer         | Path         | Role                                                                                          |
| ------------- | ------------ | --------------------------------------------------------------------------------------------- |
| **Atoms**     | `atoms/`     | Smallest UI units: Button, Input, Icon, Badge, Avatar, Checkbox, Dropdown. No business logic. |
| **Molecules** | `molecules/` | Composed from atoms: SearchInput, FilterChip, Toggle, CollapsibleSection, FavoriteButton.     |
| **Organisms** | `organisms/` | Sections of a screen: BullCard, BullTable, SearchAndViewBar, SidebarFilters, Pagination.      |
| **Hooks**     | `../hooks/`  | Page/screen logic and data: `use-bulls`, `use-favorites`, `use-classification-results-page`.  |
| **Data**      | `../lib/`    | `api-client.ts` for HTTP, `types.ts` for shared types.                                        |

Pages in `app/` compose organisms and hooks; they avoid inline data-fetch or complex state when a hook can encapsulate it.

## Responsiveness

Components use Tailwind breakpoints (`sm:`, `lg:`, `min-[...]`) so the dashboard works on **desktop and tablet**. The breakpoint is **1024px** (inclusive): viewport widths ≤1024px use the mobile layout (drawer sidebar, mobile header); ≥1025px use the desktop layout (fixed sidebar, desktop header with location + avatar). Grid view uses 1 column on small screens, 2 on tablet (`sm:`), 3 on large desktop (`min-[1440px]`).
