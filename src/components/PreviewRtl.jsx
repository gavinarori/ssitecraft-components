import ButtonStyle from '@component/ButtonStyle'

export default function PreviewInteractive({ isInteractive, handleSetIsInteractive }) {
  return (
    <button
      type="button"
      onClick={() => handleSetIsInteractive(!isInteractive)}
      aria-pressed={isInteractive}
      aria-label="Toggle Alpine JS interactivity"
      className="rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
    >
      <ButtonStyle
        buttonEmoji={isInteractive ? '🙋‍♀️' : '🙅‍♀️'}
        buttonText="Alpine JS"
        buttonActive={isInteractive}
      />
    </button>
  )
}