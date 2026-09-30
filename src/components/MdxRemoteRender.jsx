'use client'

import { MDXRemote } from 'next-mdx-remote'

export default function MdxRemoteRender({ mdxSource, mdxComponents = {}, mdxScope = {} }) {
  if (!mdxSource) return null

  return <MDXRemote {...mdxSource} components={mdxComponents} scope={mdxScope} />
}