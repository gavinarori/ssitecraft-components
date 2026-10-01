export default function Container({ children, id, classNames = '' }) {
  return (
    <div id={id} className={`mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 ${classNames}`.trim()}>
      {children}
    </div>
  )
}