import { FilterIcon, GridIcon, ListIcon, SearchIcon } from './Icons.jsx'

/** Search, density toggle and filter affordance shared by the list screens. */
export default function Toolbar({ view, onView, query, onQuery, placeholder }) {
  return (
    <>
      <div className="viewtoggle">
        <button
          type="button"
          aria-label="List view"
          aria-pressed={view === 'list'}
          onClick={() => onView('list')}
        >
          <ListIcon />
        </button>
        <button
          type="button"
          aria-label="Card view"
          aria-pressed={view === 'card'}
          onClick={() => onView('card')}
        >
          <GridIcon />
        </button>
      </div>

      <label className="search">
        <SearchIcon />
        <input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
        />
      </label>

      <button type="button" className="chip chip--on">
        All
      </button>

      <button type="button" className="select">
        <FilterIcon />
        Filter/Sort
      </button>
    </>
  )
}
