import { useEffect, useMemo, useRef, useState } from 'react';
import { fetchKnowledgeDocuments } from '../data/mockData';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { Input } from '../components/ui/Field';
import { IconSearch, IconUpload, IconFile, IconTrash, IconKnowledge } from '../components/ui/icons';
import './knowledge.css';

const STATUS_VARIANT = { Indexed: 'success', Processing: 'info', Failed: 'danger' };
const ACCEPTED = '.pdf,.docx,.txt';

function formatSize(kb) {
  if (kb > 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${kb} KB`;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function KnowledgeBase() {
  const [docs, setDocs] = useState(null);
  const [query, setQuery] = useState('');
  const [dragging, setDragging] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchKnowledgeDocuments().then(setDocs);
  }, []);

  const filtered = useMemo(() => {
    if (!docs) return [];
    return docs.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()));
  }, [docs, query]);

  const addFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    const newDocs = files.map((f, i) => ({
      id: `d_new_${Date.now()}_${i}`,
      name: f.name,
      type: (f.name.split('.').pop() || 'file').toUpperCase(),
      sizeKb: Math.round(f.size / 1024) || 12,
      status: 'Processing',
      uploadedAt: new Date().toISOString(),
      chunks: 0,
    }));
    setDocs((prev) => [...newDocs, ...(prev || [])]);

    // Simulate processing completing after a short delay.
    newDocs.forEach((d) => {
      setTimeout(() => {
        setDocs((prev) => prev.map((p) => (p.id === d.id ? { ...p, status: 'Indexed', chunks: Math.floor(Math.random() * 120) + 8 } : p)));
      }, 2200 + Math.random() * 1200);
    });
  };

  const confirmDelete = () => {
    setDocs((prev) => prev.filter((d) => d.id !== toDelete.id));
    setToDelete(null);
  };

  return (
    <div className="container-page">
      <h2 style={{ fontSize: 20, marginBottom: 4 }}>Knowledge base</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginBottom: 20 }}>
        Documents here are indexed and retrieved by the assistant during conversations.
      </p>

      <div
        className={`kb-dropzone ${dragging ? 'dragging' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
      >
        <div className="kb-dropzone-icon"><IconUpload width={18} height={18} /></div>
        <div className="kb-dropzone-title">Drop files here, or click to browse</div>
        <div className="kb-dropzone-sub">Supports PDF, DOCX, and TXT — up to 25 MB per file</div>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED}
          multiple
          hidden
          onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }}
        />
      </div>

      <div className="kb-toolbar">
        <Input icon={<IconSearch width={15} height={15} />} placeholder="Search documents…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <Button variant="secondary" icon={<IconUpload width={15} height={15} />} onClick={() => fileInputRef.current?.click()}>Upload</Button>
      </div>

      <Card padded={false}>
        {!docs ? (
          <div style={{ padding: 20 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 52, marginBottom: 10, borderRadius: 8 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<IconKnowledge width={20} height={20} />}
            title="No documents yet"
            description="Upload a PDF, Word document, or text file to give your assistant something to reference."
          />
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Type</th>
                <th>Size</th>
                <th>Status</th>
                <th>Uploaded</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id}>
                  <td>
                    <div className="kb-file-row">
                      <span className="kb-file-icon"><IconFile width={16} height={16} /></span>
                      <div>
                        <div className="kb-file-name">{d.name}</div>
                        {d.status === 'Indexed' && <div className="kb-file-meta">{d.chunks} chunks indexed</div>}
                      </div>
                    </div>
                  </td>
                  <td>{d.type}</td>
                  <td className="mono">{formatSize(d.sizeKb)}</td>
                  <td>
                    {d.status === 'Processing' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Badge variant="info" dot>Processing</Badge>
                        <span className="kb-progress-track"><span className="kb-progress-fill" /></span>
                      </div>
                    ) : (
                      <Badge variant={STATUS_VARIANT[d.status] || 'neutral'} dot>{d.status}</Badge>
                    )}
                  </td>
                  <td style={{ color: 'var(--text-tertiary)' }}>{formatDate(d.uploadedAt)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="conv-control-btn"
                      style={{ width: 32, height: 32, display: 'inline-flex' }}
                      onClick={() => setToDelete(d)}
                      aria-label="Delete document"
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
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Delete this document?"
        actions={
          <>
            <Button variant="secondary" onClick={() => setToDelete(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        "{toDelete?.name}" will be removed from the knowledge base and the assistant will no longer reference it.
      </Modal>
    </div>
  );
}
