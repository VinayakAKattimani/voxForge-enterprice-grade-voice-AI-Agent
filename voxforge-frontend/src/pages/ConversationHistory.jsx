import { useEffect, useMemo, useState } from 'react';
import { fetchConversationHistory, fetchTranscript, conversationSummaries } from '../data/mockData';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { Input, Select } from '../components/ui/Field';
import TranscriptPanel from '../components/voice/TranscriptPanel';
import { IconSearch, IconHistory, IconTrash } from '../components/ui/icons';
import './history.css';

const STATUS_VARIANT = { Resolved: 'success', Escalated: 'warning', Abandoned: 'danger' };
const DATE_FILTERS = ['All time', 'Today', 'Last 7 days', 'Last 30 days'];

function formatDate(iso) {
  return new Date(iso).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function withinFilter(iso, filter) {
  const date = new Date(iso).getTime();
  const now = Date.now();
  const day = 86400000;
  if (filter === 'Today') return now - date < day;
  if (filter === 'Last 7 days') return now - date < day * 7;
  if (filter === 'Last 30 days') return now - date < day * 30;
  return true;
}

export default function ConversationHistory() {
  const [items, setItems] = useState(null);
  const [query, setQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('All time');
  const [selected, setSelected] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => {
    fetchConversationHistory().then(setItems);
  }, []);

  const filtered = useMemo(() => {
    if (!items) return [];
    return items.filter((c) => {
      const matchesQuery = c.title.toLowerCase().includes(query.toLowerCase());
      return matchesQuery && withinFilter(c.updatedAt, dateFilter);
    });
  }, [items, query, dateFilter]);

  const openConversation = async (c) => {
    setSelected(c);
    const t = await fetchTranscript(c.id);
    setTranscript(t);
  };

  const confirmDelete = () => {
    setItems((prev) => prev.filter((c) => c.id !== toDelete.id));
    setToDelete(null);
  };

  return (
    <div className="container-page">
      <h2 style={{ fontSize: 20, marginBottom: 4 }}>Conversation history</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginBottom: 20 }}>
        Browse, search, and review past voice and chat sessions.
      </p>

      <div className="history-toolbar">
        <Input icon={<IconSearch width={15} height={15} />} placeholder="Search conversations…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <Select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} style={{ maxWidth: 180 }}>
          {DATE_FILTERS.map((f) => <option key={f} value={f}>{f}</option>)}
        </Select>
      </div>

      <Card padded={false}>
        {!items ? (
          <div style={{ padding: 20 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 48, marginBottom: 10, borderRadius: 8 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<IconHistory width={20} height={20} />}
            title="No conversations found"
            description="Try a different search term or widen the date range."
          />
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Conversation</th>
                <th>Channel</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Updated</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="table-row-hover" onClick={() => openConversation(c)}>
                  <td style={{ fontWeight: 500 }}>{c.title}</td>
                  <td>{c.channel}</td>
                  <td className="mono">{c.duration}</td>
                  <td><Badge variant={STATUS_VARIANT[c.status] || 'neutral'} dot>{c.status}</Badge></td>
                  <td style={{ color: 'var(--text-tertiary)' }}>{formatDate(c.updatedAt)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="conv-control-btn"
                      style={{ width: 32, height: 32, display: 'inline-flex' }}
                      onClick={(e) => { e.stopPropagation(); setToDelete(c); }}
                      aria-label="Delete conversation"
                    >
                      <IconTrash width={14} height={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title}
        actions={<Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>}
      >
        {selected && (
          <>
            <div className="history-detail-meta">
              {selected.channel} · {selected.duration} · {formatDate(selected.updatedAt)}
            </div>
            <div className="history-summary-box">
              {conversationSummaries[selected.id] || 'This conversation didn\u2019t generate a summary.'}
            </div>
            <div style={{ height: 220 }}>
              <TranscriptPanel messages={transcript} liveCaption="" />
            </div>
          </>
        )}
      </Modal>

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Delete this conversation?"
        actions={
          <>
            <Button variant="secondary" onClick={() => setToDelete(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        This will permanently remove "{toDelete?.title}" and its transcript. This can\u2019t be undone.
      </Modal>
    </div>
  );
}
