import { codeToHtml } from 'shiki'

interface CodeProps {
  children: string
  lang?: string
  className?: string
}

export async function Code({ children, lang = 'bash', className = '' }: CodeProps) {
  const html = await codeToHtml(children.trim(), {
    lang,
    theme: 'min-light',
  })

  return (
    <div
      className={`w-fit max-w-full bg-neutral-50 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-[12px] sm:text-[14px] overflow-x-auto [&_pre]:!bg-transparent [&_pre]:!p-0 [&_code]:!bg-transparent ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
