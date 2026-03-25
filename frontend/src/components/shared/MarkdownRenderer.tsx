import ReactMarkdown from 'react-markdown'

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-invert prose-sm max-w-none text-et-text leading-relaxed">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
