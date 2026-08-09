'use client'

import dynamic from 'next/dynamic'
import type { RichTextEditorProps } from './RichTextEditor'

const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div
      aria-label="Loading rich text editor"
      className="min-h-[200px] animate-pulse rounded-lg border border-gray-300 bg-gray-50"
    />
  ),
})

export default function LazyRichTextEditor(props: RichTextEditorProps) {
  return <RichTextEditor {...props} />
}
