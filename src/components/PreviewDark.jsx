import ButtonStyle from '@component/ButtonStyle'

export default function PreviewDark({ isDarkMode, handleSetIsDarkMode }) {
  return (
    <button
      type="button"
      onClick={() => handleSetIsDarkMode(!isDarkMode)}
      aria-pressed={isDarkMode}
      aria-label="Toggle dark preview"
      className="rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
    >
      <ButtonStyle
        buttonEmoji={isDarkMode ? '🌕' : '🌞'}
        buttonText={isDarkMode ? 'Dark' : 'Light'}
        buttonActive={isDarkMode}
      />
    </button>
  )
}