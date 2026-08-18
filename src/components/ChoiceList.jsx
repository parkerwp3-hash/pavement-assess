import { CheckIcon } from './Icons.jsx'

/**
 * A list of mutually exclusive options, one full-width row each.
 *
 * This is the "dropdown" for this app. A native <select> collapses to a system
 * wheel on a phone — small targets, low contrast, and it hides the options
 * until tapped. Laying the choices out flat costs a scroll and buys targets an
 * inspector can hit without looking closely at the screen.
 */
export default function ChoiceList({ options, value, onChange, name }) {
  return (
    <div className="choices" role="radiogroup" aria-label={name}>
      {options.map((option) => {
        const selected = option.id === value
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            className={selected ? 'choice choice--on' : 'choice'}
            onClick={() => onChange(option.id)}
          >
            <span className="choice-text">
              <span className="choice-label">{option.label}</span>
              {option.hint ? (
                <span className="choice-hint">{option.hint}</span>
              ) : null}
            </span>
            {selected ? <CheckIcon className="choice-check" /> : null}
          </button>
        )
      })}
    </div>
  )
}
