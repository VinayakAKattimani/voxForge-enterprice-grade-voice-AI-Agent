import React, { useCallback, useRef, useState } from "react";
import { Upload, Trash2, FileText, Search } from "lucide-react";
import Card, { SectionHeading } from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import SearchBar from "../../components/ui/SearchBar.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import AsyncView from "../../components/ui/AsyncView.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import ConfirmDialog from "../../components/ui/ConfirmDialog.jsx";
import { useAsync } from "../../hooks/useAsync.js";
import { useDebounce } from "../../hooks/useDebounce.js";
import { knowledgeApi } from "../../services/api/knowledgeApi.js";
import { useToast } from "../../store/ToastContext.jsx";

export default function Knowledge() {
  const { notify } = useToast();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 200);
  const fileInputRef = useRef(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [testQuery, setTestQuery] = useState("");
  const [testResults, setTestResults] = useState(null);
  const [testLoading, setTestLoading] = useState(false);

  const fetcher = useCallback(() => knowledgeApi.listDocuments({ search: debouncedSearch }), [debouncedSearch]);
  const state = useAsync(fetcher, [debouncedSearch]);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    await knowledgeApi.uploadDocument(file);
    notify("Document uploaded \u2014 processing started");
    state.reload();
    setTimeout(state.reload, 2700);
    e.target.value = "";
  }

  async function confirmDelete() {
    await knowledgeApi.deleteDocument(pendingDelete.id);
    notify("Document deleted");
    setPendingDelete(null);
    state.reload();
  }

  async function runTest() {
    if (!testQuery.trim()) return;
    setTestLoading(true);
    try {
      const res = await knowledgeApi.testRetrieval(testQuery);
      setTestResults(res.results);
    } finally {
      setTestLoading(false);
    }
  }

  const columns = [
    {
      key: "filename",
      header: "Filename",
      render: (d) => (
        <div className="flex items-center gap-2.5">
          <FileText size={14} className="text-ink3" />
          <span className="font-medium text-ink">{d.filename}</span>
        </div>
      ),
    },
    { key: "type", header: "Type", render: (d) => <span className="font-data text-ink2">{d.type}</span> },
    { key: "size", header: "Size", render: (d) => <span className="font-data text-ink2">{d.size}</span> },
    { key: "uploaded", header: "Uploaded", render: (d) => <span className="font-data text-ink2">{d.uploaded}</span> },
    { key: "chunks", header: "Chunks", render: (d) => <span className="font-data">{d.chunks || "\u2014"}</span> },
    { key: "status", header: "Status", render: (d) => <Badge status={d.status} /> },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (d) => (
        <button onClick={() => setPendingDelete(d)} className="text-ink3 hover:text-danger">
          <Trash2 size={15} />
        </button>
      ),
    },
  ];

  return (
    <div className="fade-in flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search documents" className="w-[280px]" />
        <input ref={fileInputRef} type="file" hidden onChange={handleFileChange} />
        <Button variant="primary" icon={Upload} onClick={() => fileInputRef.current?.click()}>
          Upload document
        </Button>
      </div>

      <Card padded={false}>
        <AsyncView
          state={state}
          empty={<EmptyState icon={FileText} title="No documents yet" body="Upload product documentation so ThenFLo's AI can answer questions accurately." />}
        >
          {(data) => <DataTable columns={columns} rows={data.items} rowKey={(r) => r.id} />}
        </AsyncView>
      </Card>

      <Card>
        <SectionHeading title="Test retrieval" subtitle="Ask a question to see what the RAG system would surface" />
        <div className="mb-4 flex gap-2.5">
          <input
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runTest()}
            placeholder="e.g. Does it support contractors?"
            className="flex-1 rounded-lg border border-line bg-surface2 px-3 py-2.5 text-[13px] text-ink outline-none focus:border-signal"
          />
          <Button variant="primary" onClick={runTest} disabled={testLoading}>
            {testLoading ? "Testing\u2026" : "Test"}
          </Button>
        </div>
        {testResults ? (
          <div className="flex flex-col gap-2.5">
            {testResults.map((r, i) => (
              <div key={i} className="rounded-lg border border-line p-3.5">
                <div className="mb-1.5 flex justify-between">
                  <div className="flex items-center gap-1.5 text-[12.5px] text-ink2">
                    <FileText size={13} /> {r.doc}
                  </div>
                  <span className="font-data text-[12px] font-bold text-signalText">{(r.score * 100).toFixed(0)}%</span>
                </div>
                <div className="text-[13.5px] leading-relaxed text-ink">{r.text}</div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={Search} title="No test run yet" body="Enter a question above to preview which knowledge chunks ThenFLo would retrieve." />
        )}
      </Card>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete document"
        body={`This will permanently remove "${pendingDelete?.filename}" and its indexed chunks.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
