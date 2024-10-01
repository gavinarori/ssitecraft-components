export default function PreviewTitle({ componentTitle, componentHash }) {
  return (
    <h2 className="text-lg font-bold text-gray-900 sm:text-2xl">
      <a href={`#${componentHash}`} className="group relative inline-block">
        
        {componentTitle}
      </a>
    </h2>
  )
}
