import { useEffect, useMemo, useState } from 'react';

import {
  fetchConversations,
  fetchConversationMessages,
  updateConversation,
} from '../api/conversationApi';

import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { Input, Select } from '../components/ui/Field';
import TranscriptPanel from '../components/voice/TranscriptPanel';

import {
  IconSearch,
  IconHistory,
  IconTrash,
} from '../components/ui/icons';

import './history.css';

const DATE_FILTERS = [
  'All time',
  'Today',
  'Last 7 days',
  'Last 30 days',
];

function formatDate(iso) {
  if (!iso) return 'Unknown';

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown';
  }

  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function withinFilter(iso, filter) {
  if (!iso) return false;

  const date = new Date(iso).getTime();

  if (Number.isNaN(date)) return false;

  const now = Date.now();
  const day = 86400000;

  if (filter === 'Today') {
    return now - date < day;
  }

  if (filter === 'Last 7 days') {
    return now - date < day * 7;
  }

  if (filter === 'Last 30 days') {
    return now - date < day * 30;
  }

  return true;
}

export default function ConversationHistory() {

  // --------------------------------------------------
  // STATE
  // --------------------------------------------------

  const [items, setItems] = useState(null);

  const [query, setQuery] = useState('');

  const [dateFilter, setDateFilter] =
    useState('All time');

  const [selected, setSelected] =
    useState(null);

  const [transcript, setTranscript] =
    useState([]);

  const [toDelete, setToDelete] =
    useState(null);

  const [editing, setEditing] =
    useState(null);

  const [editTitle, setEditTitle] =
    useState('');


  // --------------------------------------------------
  // LOAD CONVERSATIONS
  // --------------------------------------------------

  useEffect(() => {

    fetchConversations()
      .then(setItems)
      .catch((error) => {

        console.error(
          'Failed to fetch conversations:',
          error
        );

        setItems([]);
      });

  }, []);


  // --------------------------------------------------
  // FILTER
  // --------------------------------------------------

  const filtered = useMemo(() => {

    if (!items) {
      return [];
    }

    return items.filter((conversation) => {

      const matchesQuery =
        conversation.title
          .toLowerCase()
          .includes(query.toLowerCase());

      return (
        matchesQuery &&
        withinFilter(
          conversation.updated_at,
          dateFilter
        )
      );

    });

  }, [items, query, dateFilter]);


  // --------------------------------------------------
  // OPEN CONVERSATION
  // --------------------------------------------------

  const openConversation = async (conversation) => {

    setSelected(conversation);

    try {

      const messages =
        await fetchConversationMessages(
          conversation.id
        );

      const transcriptMessages =
        messages.map((message) => ({
          speaker: message.role,
          text: message.content,
          ts: '',
        }));

      setTranscript(transcriptMessages);

    } catch (error) {

      console.error(
        'Failed to fetch conversation messages:',
        error
      );

      setTranscript([]);
    }
  };


  // --------------------------------------------------
  // RENAME CONVERSATION
  // --------------------------------------------------

  const handleRename = async () => {

    const title = editTitle.trim();

    if (!title || !editing) {
      return;
    }

    try {

      const updated =
        await updateConversation(
          editing.id,
          {
            title,
          }
        );

      setItems((previous) =>
        previous.map((conversation) =>
          conversation.id === updated.id
            ? updated
            : conversation
        )
      );

      if (
        selected &&
        selected.id === updated.id
      ) {
        setSelected(updated);
      }

      setEditing(null);
      setEditTitle('');

    } catch (error) {

      console.error(
        'Failed to rename conversation:',
        error
      );
    }
  };


  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------
  // NOTE:
  // Backend DELETE endpoint does not exist yet.
  // This currently only removes it from frontend state.

  const confirmDelete = () => {

    setItems((previous) =>
      previous.filter(
        (conversation) =>
          conversation.id !== toDelete.id
      )
    );

    setToDelete(null);
  };


  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="container-page">

      <h2
        style={{
          fontSize: 20,
          marginBottom: 4,
        }}
      >
        Conversation history
      </h2>

      <p
        style={{
          color: 'var(--text-secondary)',
          fontSize: 13.5,
          marginBottom: 20,
        }}
      >
        Browse, search, and review past voice and chat sessions.
      </p>


      {/* --------------------------------------------- */}
      {/* TOOLBAR */}
      {/* --------------------------------------------- */}

      <div className="history-toolbar">

        <Input
          icon={
            <IconSearch
              width={15}
              height={15}
            />
          }
          placeholder="Search conversations…"
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
        />

        <Select
          value={dateFilter}
          onChange={(e) =>
            setDateFilter(e.target.value)
          }
          style={{
            maxWidth: 180,
          }}
        >
          {DATE_FILTERS.map((filter) => (
            <option
              key={filter}
              value={filter}
            >
              {filter}
            </option>
          ))}
        </Select>

      </div>


      {/* --------------------------------------------- */}
      {/* CONVERSATION TABLE */}
      {/* --------------------------------------------- */}

      <Card padded={false}>

        {!items ? (

          <div style={{ padding: 20 }}>

            {Array.from({ length: 5 }).map(
              (_, index) => (

                <div
                  key={index}
                  className="skeleton"
                  style={{
                    height: 48,
                    marginBottom: 10,
                    borderRadius: 8,
                  }}
                />

              )
            )}

          </div>

        ) : filtered.length === 0 ? (

          <EmptyState
            icon={
              <IconHistory
                width={20}
                height={20}
              />
            }
            title="No conversations found"
            description="Try a different search term or widen the date range."
          />

        ) : (

          <table className="table">

            <thead>

              <tr>

                <th>
                  Conversation
                </th>

                <th>
                  Created
                </th>

                <th>
                  Updated
                </th>

                <th
                  style={{
                    textAlign: 'right',
                  }}
                >
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filtered.map(
                (conversation) => (

                  <tr
                    key={conversation.id}
                    className="table-row-hover"
                    onClick={() =>
                      openConversation(
                        conversation
                      )
                    }
                  >

                    <td
                      style={{
                        fontWeight: 500,
                      }}
                    >
                      {conversation.title}
                    </td>

                    <td
                      style={{
                        color:
                          'var(--text-tertiary)',
                      }}
                    >
                      {formatDate(
                        conversation.created_at
                      )}
                    </td>

                    <td
                      style={{
                        color:
                          'var(--text-tertiary)',
                      }}
                    >
                      {formatDate(
                        conversation.updated_at
                      )}
                    </td>

                    <td
                      style={{
                        textAlign: 'right',
                      }}
                    >

                      {/* RENAME */}

                      <button
                        className="conv-control-btn"
                        style={{
                          width: 32,
                          height: 32,
                          display:
                            'inline-flex',
                          marginRight: 6,
                        }}
                        onClick={(event) => {

                          event.stopPropagation();

                          setEditing(
                            conversation
                          );

                          setEditTitle(
                            conversation.title
                          );

                        }}
                        aria-label="Rename conversation"
                        title="Rename conversation"
                      >
                        ✎
                      </button>


                      {/* DELETE */}

                      <button
                        className="conv-control-btn"
                        style={{
                          width: 32,
                          height: 32,
                          display:
                            'inline-flex',
                        }}
                        onClick={(event) => {

                          event.stopPropagation();

                          setToDelete(
                            conversation
                          );

                        }}
                        aria-label="Delete conversation"
                        title="Delete conversation"
                      >

                        <IconTrash
                          width={14}
                          height={14}
                        />

                      </button>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        )}

      </Card>


      {/* --------------------------------------------- */}
      {/* CONVERSATION DETAILS */}
      {/* --------------------------------------------- */}

      <Modal
        open={!!selected}
        onClose={() =>
          setSelected(null)
        }
        title={selected?.title}
        actions={
          <Button
            variant="secondary"
            onClick={() =>
              setSelected(null)
            }
          >
            Close
          </Button>
        }
      >

        {selected && (

          <>

            <div className="history-detail-meta">

              Updated{' '}

              {formatDate(
                selected.updated_at
              )}

            </div>


            <div className="history-summary-box">

              Conversation transcript

            </div>


            <div
              style={{
                height: 220,
              }}
            >

              <TranscriptPanel
                messages={transcript}
                liveCaption=""
              />

            </div>

          </>

        )}

      </Modal>


      {/* --------------------------------------------- */}
      {/* RENAME MODAL */}
      {/* --------------------------------------------- */}

      <Modal
        open={!!editing}
        onClose={() => {

          setEditing(null);
          setEditTitle('');

        }}
        title="Rename conversation"
        actions={

          <>

            <Button
              variant="secondary"
              onClick={() => {

                setEditing(null);
                setEditTitle('');

              }}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              onClick={handleRename}
              disabled={!editTitle.trim()}
            >
              Save
            </Button>

          </>

        }
      >

        <Input
          value={editTitle}
          onChange={(e) =>
            setEditTitle(
              e.target.value
            )
          }
          placeholder="Conversation title"
          autoFocus
        />

      </Modal>


      {/* --------------------------------------------- */}
      {/* DELETE MODAL */}
      {/* --------------------------------------------- */}

      <Modal
        open={!!toDelete}
        onClose={() =>
          setToDelete(null)
        }
        title="Delete this conversation?"
        actions={

          <>

            <Button
              variant="secondary"
              onClick={() =>
                setToDelete(null)
              }
            >
              Cancel
            </Button>

            <Button
              variant="danger"
              onClick={confirmDelete}
            >
              Delete
            </Button>

          </>

        }
      >

        This will permanently remove
        {' "'}
        {toDelete?.title}
        {' "'}
        from this list.

        <br />

        <br />

        <strong>
          Note:
        </strong>{' '}
        The backend delete endpoint is
        not implemented yet.

      </Modal>

    </div>
  );
}