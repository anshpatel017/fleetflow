import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Search } from 'lucide-react';
import EmptyState from './EmptyState';

function getByPath(obj, path) {
  if (!path) return undefined;
  if (typeof path === 'function') return path(obj);
  const parts = String(path).split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

export default function DataTable({
  title,
  columns,
  rows,
  rowKey,
  searchable = true,
  emptyIcon,
  emptyTitle,
  emptyMessage,
  className = '',
}) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return (rows ?? []).filter((r) => {
      return columns.some((c) => {
        if (c.searchable === false) return false;
        const raw = getByPath(r, c.accessor);
        return String(raw ?? '').toLowerCase().includes(q);
      });
    });
  }, [rows, query, columns]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const col = columns.find((c) => c.id === sort.id);
    if (!col) return filtered;
    const dir = sort.dir;

    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = getByPath(a, col.sortAccessor ?? col.accessor);
      const bv = getByPath(b, col.sortAccessor ?? col.accessor);
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;

      if (typeof av === 'number' && typeof bv === 'number') {
        return dir === 'asc' ? av - bv : bv - av;
      }
      return dir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return copy;
  }, [filtered, sort, columns]);

  const onSort = (colId) => {
    setSort((prev) => {
      if (!prev || prev.id !== colId) return { id: colId, dir: 'asc' };
      if (prev.dir === 'asc') return { id: colId, dir: 'desc' };
      return null;
    });
  };

  const hasRows = (sorted ?? []).length > 0;

  return (
    <div className={`ff-card ${className}`}>
      {(title || searchable) && (
        <div className="px-5 py-4 border-b flex items-center justify-between gap-3" style={{ borderColor: 'var(--ff-border)' }}>
          <div className="text-[14px] font-bold text-slate-100">{title}</div>
          {searchable && (
            <div className="relative w-full max-w-[320px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                className="ff-input pl-9 h-9"
                placeholder="Search…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          )}
        </div>
      )}

      {!hasRows ? (
        <div className="p-5">
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle ?? 'No records found'}
            message={emptyMessage ?? 'Try adjusting your filters or create the first record.'}
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="ff-table">
            <thead>
              <tr>
                {columns.map((c) => {
                  const sortable = c.sortable !== false;
                  const isSorted = sort?.id === c.id;
                  const Icon = isSorted ? (sort.dir === 'asc' ? ArrowUp : ArrowDown) : null;
                  return (
                    <th key={c.id} className={c.className ?? ''}>
                      <button
                        type="button"
                        disabled={!sortable}
                        onClick={() => sortable && onSort(c.id)}
                        className={`inline-flex items-center gap-2 ${sortable ? 'cursor-pointer hover:text-slate-200' : 'cursor-default'} transition-colors`}
                      >
                        <span>{c.header}</span>
                        {Icon && <Icon size={14} />}
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {sorted.map((r, idx) => (
                <tr key={rowKey ? rowKey(r) : (r.id ?? idx)} className="ff-row-hover">
                  {columns.map((c) => {
                    const raw = getByPath(r, c.accessor);
                    return (
                      <td key={c.id} className={c.cellClassName ?? ''}>
                        {c.cell ? c.cell(raw, r) : (raw ?? '—')}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
