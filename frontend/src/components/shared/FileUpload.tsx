import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
interface FileUploadProps { onFile: (file: File) => void; onSample: () => void; label?: string }
export default function FileUpload({ onFile, onSample, label = 'PDF' }: FileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) { setFileName(acceptedFiles[0].name); onFile(acceptedFiles[0]) }
  }, [onFile])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1 })
  return (
    <div className="space-y-3">
      <div {...getRootProps()} className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all"
        style={{ borderColor: isDragActive ? '#F4442E' : '#EDD382', background: isDragActive ? 'rgba(244,68,46,0.05)' : 'rgba(237,211,130,0.08)' }}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <span className="text-3xl">📄</span>
          {fileName ? <p className="text-sm font-medium" style={{ color: '#16A34A' }}>✓ {fileName}</p>
            : isDragActive ? <p className="text-sm" style={{ color: '#F4442E' }}>Drop {label} here…</p>
            : <p className="text-sm" style={{ color: '#6B6C8A' }}>Drag & drop {label} here, or click to browse</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: 'rgba(237,211,130,0.5)' }} />
        <span className="text-xs" style={{ color: '#6B6C8A' }}>OR</span>
        <div className="flex-1 h-px" style={{ background: 'rgba(237,211,130,0.5)' }} />
      </div>
      <button type="button" onClick={onSample} className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
        style={{ border: '2px solid #FC9E4F', color: '#FC9E4F', background: 'transparent' }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(252,158,79,0.08)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}>
        📦 Use Sample Data (Demo)
      </button>
    </div>
  )
}
