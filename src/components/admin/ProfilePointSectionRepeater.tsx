'use client'

import { ArrowDown, ArrowUp, ExternalLink, PlusCircle, Trash2 } from 'lucide-react'

export interface ProfilePoint {
  text: string
  link?: string
}

export interface ProfilePointSectionEntry {
  title: string
  points: ProfilePoint[]
  duration?: string
  year?: number
  date?: string
}

interface MetaField {
  key: 'duration' | 'year' | 'date'
  label: string
  type?: 'text' | 'number'
  placeholder?: string
  min?: number
  max?: number
}

interface ProfilePointSectionRepeaterProps<T extends ProfilePointSectionEntry> {
  title: string
  addLabel: string
  emptyText: string
  items: T[]
  createItem: () => T
  metaField?: MetaField
  onChange: (items: T[]) => void
}

const createPoint = (): ProfilePoint => ({
  text: '',
  link: '',
})

export default function ProfilePointSectionRepeater<T extends ProfilePointSectionEntry>({
  title,
  addLabel,
  emptyText,
  items,
  createItem,
  metaField,
  onChange,
}: ProfilePointSectionRepeaterProps<T>) {
  const updateItem = (index: number, patch: Partial<T>) => {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)))
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, itemIndex) => itemIndex !== index))
  }

  const moveItem = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= items.length) return

    const nextItems = [...items]
    const [item] = nextItems.splice(index, 1)
    nextItems.splice(targetIndex, 0, item)
    onChange(nextItems)
  }

  const updatePoint = (entryIndex: number, pointIndex: number, patch: Partial<ProfilePoint>) => {
    const entry = items[entryIndex]
    const points = entry.points.map((point, currentPointIndex) =>
      currentPointIndex === pointIndex ? { ...point, ...patch } : point
    )
    updateItem(entryIndex, { points } as Partial<T>)
  }

  const addPoint = (entryIndex: number) => {
    const entry = items[entryIndex]
    updateItem(entryIndex, { points: [...entry.points, createPoint()] } as Partial<T>)
  }

  const removePoint = (entryIndex: number, pointIndex: number) => {
    const entry = items[entryIndex]
    updateItem(entryIndex, { points: entry.points.filter((_, index) => index !== pointIndex) } as Partial<T>)
  }

  const movePoint = (entryIndex: number, pointIndex: number, direction: -1 | 1) => {
    const entry = items[entryIndex]
    const targetIndex = pointIndex + direction
    if (targetIndex < 0 || targetIndex >= entry.points.length) return

    const points = [...entry.points]
    const [point] = points.splice(pointIndex, 1)
    points.splice(targetIndex, 0, point)
    updateItem(entryIndex, { points } as Partial<T>)
  }

  return (
    <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <h2 className="text-md font-bold text-gray-900">{title}</h2>
        <button
          type="button"
          onClick={() => onChange([...items, createItem()])}
          className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-semibold text-xs"
        >
          <PlusCircle className="h-4 w-4" />
          {addLabel}
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500 italic">{emptyText}</p>
      ) : (
        <div className="space-y-4">
          {items.map((item, entryIndex) => (
            <div key={entryIndex} className="p-4 border border-gray-200 rounded-lg bg-gray-50/50 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Entry {entryIndex + 1}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => moveItem(entryIndex, -1)}
                    disabled={entryIndex === 0}
                    className="p-1.5 border border-gray-300 bg-white text-gray-500 rounded-md hover:text-blue-600 disabled:opacity-40"
                    title="Move entry up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(entryIndex, 1)}
                    disabled={entryIndex === items.length - 1}
                    className="p-1.5 border border-gray-300 bg-white text-gray-500 rounded-md hover:text-blue-600 disabled:opacity-40"
                    title="Move entry down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(entryIndex)}
                    className="p-1.5 border border-gray-300 bg-white hover:bg-rose-50 text-rose-500 rounded-md hover:border-rose-300"
                    title="Remove entry"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label>
                  <span className="block text-xs font-semibold text-gray-600 mb-1">
                    Entry Title <span className="text-rose-500">*</span>
                  </span>
                  <input
                    type="text"
                    required
                    value={item.title}
                    onChange={(event) => updateItem(entryIndex, { title: event.target.value } as Partial<T>)}
                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs bg-white"
                    placeholder="Entry title"
                  />
                </label>

                {metaField && (
                  <label>
                    <span className="block text-xs font-semibold text-gray-600 mb-1">{metaField.label}</span>
                    <input
                      type={metaField.type || 'text'}
                      min={metaField.min}
                      max={metaField.max}
                      value={(item[metaField.key] as string | number | undefined) ?? ''}
                      onChange={(event) =>
                        updateItem(entryIndex, {
                          [metaField.key]:
                            metaField.type === 'number'
                              ? event.target.value
                                ? Number(event.target.value)
                                : undefined
                              : event.target.value,
                        } as Partial<T>)
                      }
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs bg-white"
                      placeholder={metaField.placeholder}
                    />
                  </label>
                )}
              </div>

              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xs font-bold text-gray-800">Numbered Description Points</h3>
                  <button
                    type="button"
                    onClick={() => addPoint(entryIndex)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    Add Point
                  </button>
                </div>

                {item.points.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No points yet. Add at least one point before saving.</p>
                ) : (
                  <div className="space-y-3">
                    {item.points.map((point, pointIndex) => (
                      <div key={pointIndex} className="rounded-lg border border-gray-200 bg-white p-3 space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-bold text-gray-700">Point {pointIndex + 1}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => movePoint(entryIndex, pointIndex, -1)}
                              disabled={pointIndex === 0}
                              className="p-1 border border-gray-300 bg-white text-gray-500 rounded hover:text-blue-600 disabled:opacity-40"
                              title="Move point up"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => movePoint(entryIndex, pointIndex, 1)}
                              disabled={pointIndex === item.points.length - 1}
                              className="p-1 border border-gray-300 bg-white text-gray-500 rounded hover:text-blue-600 disabled:opacity-40"
                              title="Move point down"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removePoint(entryIndex, pointIndex)}
                              className="p-1 border border-gray-300 bg-white hover:bg-rose-50 text-rose-500 rounded hover:border-rose-300"
                              title="Remove point"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        <label className="block">
                          <span className="block text-xs font-semibold text-gray-600 mb-1">
                            Description Text <span className="text-rose-500">*</span>
                          </span>
                          <textarea
                            required
                            value={point.text}
                            onChange={(event) => updatePoint(entryIndex, pointIndex, { text: event.target.value })}
                            rows={2}
                            className="w-full px-2.5 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs resize-none"
                            placeholder="Describe this point"
                          />
                        </label>

                        <label className="block">
                          <span className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1">
                            <ExternalLink className="h-3 w-3" />
                            Optional Link
                          </span>
                          <input
                            type="url"
                            value={point.link || ''}
                            onChange={(event) => updatePoint(entryIndex, pointIndex, { link: event.target.value })}
                            className="w-full px-2.5 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs"
                            placeholder="https://example.com"
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
