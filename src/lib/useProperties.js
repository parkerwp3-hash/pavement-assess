import { useCallback, useEffect, useState } from 'react'
import { createId, loadProperties, saveProperties } from './storage.js'

export function useProperties() {
  const [properties, setProperties] = useState(loadProperties)

  useEffect(() => {
    saveProperties(properties)
  }, [properties])

  const addProperty = useCallback(({ name, address, sections }) => {
    const property = {
      id: createId(),
      name: name.trim(),
      address: address.trim(),
      createdAt: new Date().toISOString(),
      sections: sections.map((section) => ({
        id: createId(),
        name: section.name.trim(),
        sqft: section.sqft === '' ? null : Number(section.sqft),
      })),
    }
    setProperties((current) => [property, ...current])
    return property
  }, [])

  return { properties, addProperty }
}

export function totalSqft(property) {
  return property.sections.reduce(
    (sum, section) => sum + (Number.isFinite(section.sqft) ? section.sqft : 0),
    0,
  )
}
