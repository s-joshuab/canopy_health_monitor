export default function PageHeader({ title, description, actions, meta }) {
  return (
    <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-medium tracking-[-0.015em] text-ink">
            {title}
          </h1>
          {meta}
        </div>
        {description ? (
          <p className="mt-1 max-w-2xl text-[13px] leading-5 text-muted">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  )
}
