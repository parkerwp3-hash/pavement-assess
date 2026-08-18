import ChoiceList from './ChoiceList.jsx'
import { ChevronLeftIcon } from './Icons.jsx'

/**
 * A choice presented as its own screen, pushed over whatever opened it.
 *
 * Used where a picker cannot be a step of its own — per-section traffic class,
 * which is asked once per section rather than once per property. Picking an
 * option closes the sheet: the choice is the whole purpose of the screen, so
 * making the inspector confirm it would be a wasted tap.
 */
export default function ChoiceSheet({ title, options, value, onChange, onClose }) {
  return (
    <div className="flow" role="dialog" aria-modal="true" aria-label={title}>
      <header className="flow-header">
        <button
          type="button"
          className="icon-btn"
          onClick={onClose}
          aria-label="Back"
        >
          <ChevronLeftIcon />
        </button>
        <h2 className="flow-title">{title}</h2>
      </header>

      <div className="flow-body flow-body--flush">
        <ChoiceList
          name={title}
          options={options}
          value={value}
          onChange={(id) => {
            onChange(id)
            onClose()
          }}
        />
      </div>
    </div>
  )
}
