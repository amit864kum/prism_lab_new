'use client'

import { ArrowDown, ArrowUp, PlusCircle, Trash2 } from 'lucide-react'

export interface RepeaterField<T> {
  key: keyof T
  label: string
  type?: 'text' | 'number' | 'textarea'
  required?: boolean
  placeholder?: string
  min?: number
  max?: number
  className?: string
}

interface DynamicProfileRepeaterProps<T extends Record<string, any>> {
  title: string
  addLabel: string
  emptyText: string
  items: T[]
  createItem: () => T
  fields: RepeaterField<T>[]
  onChange: (items: T[]) => void
}

export default function DynamicProfileRepeater<T extends Record<string, any>>({
  title,
  addLabel,
  emptyText,
  items,
  createItem,
  fields,
  onChange,
}: DynamicProfileRepeaterProps<T>) {
  const updateItem = (index: number, key: keyof T, value: string | number) => {
    onChange(
      items.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [key]: value,
            }
          : item
      )
    )
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
          {items.map((item, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50/50 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Entry {index + 1}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => moveItem(index, -1)}
                    disabled={index === 0}
                    className="p-1.5 border border-gray-300 bg-white text-gray-500 rounded-md hover:text-blue-600 disabled:opacity-40 disabled:hover:text-gray-500"
                    title="Move up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, 1)}
                    disabled={index === items.length - 1}
                    className="p-1.5 border border-gray-300 bg-white text-gray-500 rounded-md hover:text-blue-600 disabled:opacity-40 disabled:hover:text-gray-500"
                    title="Move down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-1.5 border border-gray-300 bg-white hover:bg-rose-50 text-rose-500 rounded-md hover:border-rose-300"
                    title="Remove entry"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {fields.map((field) => (
                  <label key={String(field.key)} className={field.className || ''}>
                    <span className="block text-xs font-semibold text-gray-600 mb-1">
                      {field.label}
                      {field.required && <span className="text-rose-500"> *</span>}
                    </span>
                    {field.type === 'textarea' ? (
                      <textarea
                        required={field.required}
                        value={item[field.key] || ''}
                        onChange={(event) => updateItem(index, field.key, event.target.value)}
                        rows={3}
                        className="w-full px-2.5 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs resize-none bg-white"
                        placeholder={field.placeholder}
                      />
                    ) : (
                      <input
                        type={field.type || 'text'}
                        required={field.required}
                        min={field.min}
                        max={field.max}
                        value={item[field.key] ?? ''}
                        onChange={(event) =>
                          updateItem(
                            index,
                            field.key,
                            field.type === 'number' ? Number(event.target.value) : event.target.value
                          )
                        }
                        className="w-full px-2.5 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs bg-white"
                        placeholder={field.placeholder}
                      />
                    )}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
