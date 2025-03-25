declare module 'markdown-it-katex-gpt' {
  import type MarkdownIt from 'markdown-it'

  interface KatexOptions {
    delimiters?: Array<{
      left: string
      right: string
      display: boolean
    }>
  }

  const plugin: (md: MarkdownIt, options?: KatexOptions) => void
  export default plugin
}
