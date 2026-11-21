import { cn } from '../../lib/utils'

export default function DataTable({
  columns,
  rows,
  rowKey = 'id',
  onRowClick,
  emptyState,
  className,
  tableClassName,
}) {
  return (
    <div className={cn('w-full overflow-auto', className)}>
      <table className={cn('w-full border-collapse text-left', tableClassName)}>
        <thead className="sticky top-0 z-10 bg-panel">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn('table-th whitespace-nowrap', column.headerClassName)}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.length ? (
            rows.map((row) => (
              <tr
                key={row[rowKey]}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                onKeyDown={
                  onRowClick
                    ? (event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          onRowClick(row)
                        }
                      }
                    : undefined
                }
                tabIndex={onRowClick ? 0 : undefined}
                className={cn(
                  'group transition hover:bg-elevated/70',
                  onRowClick && 'cursor-pointer',
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn('table-td', column.className)}
                  >
                    {column.render
                      ? column.render(row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-4 py-14">
                {emptyState || (
                  <p className="text-center text-[12px] text-subtle">
                    No results found.
                  </p>
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
