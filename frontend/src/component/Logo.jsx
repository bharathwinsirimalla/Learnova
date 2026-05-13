function Logo({
  showText = false,
  framed = false,
  className = '',
  imageClassName = 'h-12 w-auto',
  textClassName = 'text-2xl font-bold tracking-wide text-slate-950',
}) {
  const image = (
    <img
      src="/logo.png"
      alt="Learnova"
      className={`object-contain ${imageClassName}`}
    />
  )

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      {framed ? (
        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/95 shadow-sm">
          {image}
        </span>
      ) : (
        image
      )}
      {showText && <span className={textClassName}>Learnova</span>}
    </span>
  )
}

export default Logo
