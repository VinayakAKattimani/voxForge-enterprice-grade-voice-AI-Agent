import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Workflow, Download, Search } from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import SearchBar from "../../components/ui/SearchBar.jsx";
import FilterBar, { Select } from "../../components/ui/FilterBar.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import AsyncView from "../../components/ui/AsyncView.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { useAsync } from "../../hooks/useAsync.js";
import { useDebounce } from "../../hooks/useDebounce.js";
import { conversationApi } from "../../services/api/conversationApi.js";
import { SESSION_STATUSES } from "../../utils/constants.js";
import { FLOW_NAMES } from "../../services/mock/mockData.js";
import { formatDuration } from "../../utils/format.js";

export default function SessionsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [flow, setFlow] = useState("All");
  const debouncedSearch = useDebounce(search, 200);

  const fetcher = useCallback(
    () => conversationApi.listSessions({ search: debouncedSearch, status, flow }),
    [debouncedSearch, status, flow]
  );
  const state = useAsync(fetcher, [debouncedSearch, status, flow]);

  const columns = [
    { key: "id", header: "Session ID", render: (r) => <span className="font-data">{r.id}</span> },
    { key: "date", header: "Date & time", render: (r) => <span className="font-data text-ink2">{r.date}</span> },
    {
      key: "visitor",
      header: "Visitor",
      render: (r) => (
        <div>
          <div className="font-medium text-ink">{r.visitor}</div>
          <div className="text-[12px] text-ink3">{r.company}</div>
        </div>
      ),
    },
    { key: "flow", header: "Demo flow", render: (r) => <span className="text-ink2">{r.flow}</span> },
    { key: "duration", header: "Duration", render: (r) => <span className="font-data">{formatDuration(r.duration)}</span> },
    { key: "status", header: "Status", render: (r) => <Badge status={r.status} /> },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (r) => (
        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/sessions/${r.id}`); }}>
          Open
        </Button>
      ),
    },
  ];

  return (
    <div className="fade-in flex flex-col gap-4">
      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by visitor or session ID" className="min-w-[220px] flex-1" />
        <Select value={status} onChange={setStatus} options={["All", ...SESSION_STATUSES]} icon={Filter} />
        <Select value={flow} onChange={setFlow} options={["All", ...FLOW_NAMES]} icon={Workflow} />
        <Button variant="secondary" size="sm" icon={Download}>Export</Button>
      </FilterBar>

      <Card padded={false}>
        <AsyncView
          state={state}
          empty={<EmptyState icon={Search} title="No sessions found" body="Try adjusting your filters or search terms." />}
        >
          {(data) => <DataTable columns={columns} rows={data.items} rowKey={(r) => r.id} onRowClick={(r) => navigate(`/dashboard/sessions/${r.id}`)} />}
        </AsyncView>
      </Card>
    </div>
  );
}
