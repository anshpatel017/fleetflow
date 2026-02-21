import React, { useMemo, useState, useEffect } from 'react';
import { ArrowDown, ArrowUp, Search } from 'lucide-react';
import EmptyState from './EmptyState';

function getByPath(obj, path) {
  if (!path) return undefined;
  if (typeof path === 'function') return path(obj);
  const parts = String(path).split('.');
  let cur = obj;
  for (const p of parts) { if (cur == null) return undefined; cur = cur[p]; }
  return cur;
}

function SkeletonRow({ cols }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: '13px 16px' }}>
          <div className="ff-skeleton" style={{ height: 14, width: `${50 + Math.random() * 40}%` }} />
        </td>
      ))}
    </tr>
  );
}

export default function DataTable({
  title, columns, rows, rowKey, searchable = true,
  emptyIcon, emptyTitle, emptyMessage, className = '',
}) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return (rows ?? []).filter((r) =>
      columns.some((c) => {
        if (c.searchable === false) return false;
        const raw = getByPath(r, c.accessor);
        return String(raw ?? '').toLowerCase().includes(q);
      })
    );
  }, [rows, query, columns]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const col = columns.find((c) => c.id === sort.id);
    if (!col) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = getByPath(a, col.sortAccessor ?? col.accessor);
      const bv = getByPath(b, col.sortAccessor ?? col.accessor);
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === 'number' && typeof bv === 'number') return sort.dir === 'asc' ? av - bv : bv - av;
      return sort.dir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
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
    <div className={`ff-card ${className}`} style={{ borderRadius: 12, overflow: 'hidden' }}>
      {(title || searchable) && (
        <div style={{
          padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 15, fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.02em' }}>{title}</div>
          {searchable && (
            <div style={{ position: 'relative', width: '100%', maxWidth: 280 }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="ff-input" style={{ paddingLeft: 32, height: 34, fontSize: 12.5 }} placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div style={{ overflow: 'hidden' }}>
          <table className="ff-table">
            <thead><tr>{columns.map(c => <th key={c.id}>{c.header}</th>)}</tr></thead>
            <tbody>
              {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={columns.length} />)}
            </tbody>
          </table>
        </div>
      ) : !hasRows ? (
        <div style={{ padding: 24 }}>
          <EmptyState icon={emptyIcon} title={emptyTitle ?? 'No records found'} message={emptyMessage ?? 'Try adjusting your filters or create the first record.'} />
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="ff-table">
            <thead>
              <tr>
                {columns.map((c) => {
                  const sortable = c.sortable !== false;
                  const isSorted = sort?.id === c.id;
                  const Icon = isSorted ? (sort.dir === 'asc' ? ArrowUp : ArrowDown) : null;
                  return (
                    <th key={c.id}>
                      <button type="button" disabled={!sortable} onClick={() => sortable && onSort(c.id)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, cursor: sortable ? 'pointer' : 'default', background: 'none', border: 'none', color: 'inherit', font: 'inherit', padding: 0, fontSize: 'inherit', fontWeight: 'inherit', textTransform: 'inherit', letterSpacing: 'inherit' }}>
                        <span>{c.header}</span>
                        {Icon && <Icon size={12} />}
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
                    return <td key={c.id}>{c.cell ? c.cell(raw, r) : (raw ?? '—')}</td>;
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
