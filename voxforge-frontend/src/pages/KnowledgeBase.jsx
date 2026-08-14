import { useEffect, useMemo, useRef, useState } from 'react';

import {
  fetchKnowledgeDocuments,
  uploadKnowledgeDocument,
  deleteKnowledgeDocument,
} from '../api/knowledgeApi';

import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';

import { Input } from '../components/ui/Field';

import {
  IconSearch,
  IconUpload,
  IconFile,
  IconTrash,
  IconKnowledge,
} from '../components/ui/icons';

import './knowledge.css';


// --------------------------------------------------
// STATUS
// --------------------------------------------------

const STATUS_VARIANT = {
  COMPLETED: 'success',
  PROCESSING: 'info',
  FAILED: 'danger',

  // Keep these in case backend changes later
  Completed: 'success',
  Processing: 'info',
  Failed: 'danger',
};


// --------------------------------------------------
// ACCEPTED FILE TYPES
// --------------------------------------------------

const ACCEPTED = '.pdf,.docx,.txt';


// --------------------------------------------------
// FILE SIZE
// Backend returns bytes
// --------------------------------------------------

function formatSize(bytes) {

  if (!bytes && bytes !== 0) {
    return '—';
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}


// --------------------------------------------------
// FILE TYPE
// --------------------------------------------------

function formatFileType(contentType, filename) {

  if (contentType === 'application/pdf') {
    return 'PDF';
  }

  if (
    contentType ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return 'DOCX';
  }

  if (contentType === 'text/plain') {
    return 'TXT';
  }

  // Fallback to filename extension
  if (filename) {

    const extension =
      filename.split('.').pop()?.toUpperCase();

    if (extension) {
      return extension;
    }
  }

  return 'Unknown';
}


// --------------------------------------------------
// STATUS LABEL
// --------------------------------------------------

function formatStatus(status) {

  if (!status) {
    return 'Unknown';
  }

  switch (status.toUpperCase()) {

    case 'COMPLETED':
      return 'Completed';

    case 'PROCESSING':
      return 'Processing';

    case 'FAILED':
      return 'Failed';

    default:
      return status;
  }
}


// --------------------------------------------------
// DATE
// --------------------------------------------------

function formatDate(iso) {

  if (!iso) {
    return '—';
  }

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleDateString(
    [],
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  );
}


// --------------------------------------------------
// COMPONENT
// --------------------------------------------------

export default function KnowledgeBase() {

  const [docs, setDocs] = useState(null);

  const [query, setQuery] = useState('');

  const [dragging, setDragging] = useState(false);

  const [toDelete, setToDelete] = useState(null);

  const fileInputRef = useRef(null);


  // --------------------------------------------------
  // LOAD DOCUMENTS
  // --------------------------------------------------

  useEffect(() => {

    fetchKnowledgeDocuments()
      .then((documents) => {

        console.log(
          '🟢 KNOWLEDGE DOCUMENTS:',
          documents
        );

        setDocs(documents);

      })
      .catch((error) => {

        console.error(
          '🔴 FAILED TO LOAD DOCUMENTS:',
          error
        );

        setDocs([]);
      });

  }, []);


  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const filtered = useMemo(() => {

    if (!docs) {
      return [];
    }

    return docs.filter((document) => {

      const filename =
        document.filename || '';

      const title =
        document.title || '';

      const searchText =
        `${filename} ${title}`.toLowerCase();

      return searchText.includes(
        query.toLowerCase()
      );
    });

  }, [docs, query]);


  // --------------------------------------------------
  // UPLOAD
  // --------------------------------------------------

  const addFiles = async (fileList) => {

    const files =
      Array.from(fileList || []);

    if (!files.length) {
      return;
    }


    for (const file of files) {

      try {

        console.log(
          '🔵 UPLOADING:',
          file.name
        );

        await uploadKnowledgeDocument(
          file
        );

        console.log(
          '🟢 UPLOAD SUCCESS:',
          file.name
        );

      } catch (error) {

        console.error(
          `Failed to upload ${file.name}:`,
          error
        );
      }
    }


    // ------------------------------------------------
    // REFRESH DOCUMENT LIST
    // ------------------------------------------------

    try {

      const documents =
        await fetchKnowledgeDocuments();

      console.log(
        '🟢 DOCUMENTS REFRESHED:',
        documents
      );

      setDocs(documents);

    } catch (error) {

      console.error(
        '🔴 FAILED TO REFRESH DOCUMENTS:',
        error
      );
    }
  };


  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const confirmDelete = async () => {
  if (!toDelete) return;

  try {
    console.log('🔵 DELETING:', toDelete.id);

    await deleteKnowledgeDocument(toDelete.id);

    console.log('🟢 DOCUMENT DELETED');

    setDocs((prev) =>
      prev.filter((d) => d.id !== toDelete.id)
    );

    setToDelete(null);

  } catch (error) {
    console.error(
      '🔴 FAILED TO DELETE DOCUMENT:',
      error
    );
  }
};


  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (

    <div className="container-page">

      <h2
        style={{
          fontSize: 20,
          marginBottom: 4,
        }}
      >
        Knowledge base
      </h2>


      <p
        style={{
          color: 'var(--text-secondary)',
          fontSize: 13.5,
          marginBottom: 20,
        }}
      >
        Documents here are indexed and retrieved
        by the assistant during conversations.
      </p>


      {/* -------------------------------------------- */}
      {/* UPLOAD DROPZONE */}
      {/* -------------------------------------------- */}

      <div
        className={`kb-dropzone ${
          dragging ? 'dragging' : ''
        }`}

        onClick={() =>
          fileInputRef.current?.click()
        }

        onDragOver={(e) => {

          e.preventDefault();

          setDragging(true);
        }}

        onDragLeave={() =>
          setDragging(false)
        }

        onDrop={(e) => {

          e.preventDefault();

          setDragging(false);

          addFiles(
            e.dataTransfer.files
          );
        }}
      >

        <div className="kb-dropzone-icon">

          <IconUpload
            width={18}
            height={18}
          />

        </div>


        <div className="kb-dropzone-title">

          Drop files here, or click to browse

        </div>


        <div className="kb-dropzone-sub">

          Supports PDF, DOCX, and TXT
          — up to 25 MB per file

        </div>


        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED}
          multiple
          hidden

          onChange={(e) => {

            addFiles(
              e.target.files
            );

            e.target.value = '';
          }}
        />

      </div>


      {/* -------------------------------------------- */}
      {/* TOOLBAR */}
      {/* -------------------------------------------- */}

      <div className="kb-toolbar">

        <Input
          icon={
            <IconSearch
              width={15}
              height={15}
            />
          }

          placeholder="Search documents…"

          value={query}

          onChange={(e) =>
            setQuery(e.target.value)
          }
        />


        <Button
          variant="secondary"

          icon={
            <IconUpload
              width={15}
              height={15}
            />
          }

          onClick={() =>
            fileInputRef.current?.click()
          }
        >
          Upload
        </Button>

      </div>


      {/* -------------------------------------------- */}
      {/* DOCUMENT TABLE */}
      {/* -------------------------------------------- */}

      <Card padded={false}>

        {!docs ? (

          <div style={{ padding: 20 }}>

            {Array.from({ length: 4 }).map(
              (_, i) => (

                <div
                  key={i}
                  className="skeleton"

                  style={{
                    height: 52,
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
              <IconKnowledge
                width={20}
                height={20}
              />
            }

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
                (document) => (

                  <tr
                    key={document.id}
                  >

                    {/* DOCUMENT */}

                    <td>

                      <div className="kb-file-row">

                        <span className="kb-file-icon">

                          <IconFile
                            width={16}
                            height={16}
                          />

                        </span>


                        <div>

                          <div className="kb-file-name">

                            {document.filename ||
                              document.title ||
                              'Unnamed document'}

                          </div>


                          {document.status?.toUpperCase() ===
                            'COMPLETED' && (

                            <div className="kb-file-meta">

                              Document indexed

                            </div>

                          )}

                        </div>

                      </div>

                    </td>


                    {/* TYPE */}

                    <td>

                      {formatFileType(
                        document.content_type,
                        document.filename
                      )}

                    </td>


                    {/* SIZE */}

                    <td className="mono">

                      {formatSize(
                        document.file_size
                      )}

                    </td>


                    {/* STATUS */}

                    <td>

                      {document.status?.toUpperCase() ===
                      'PROCESSING' ? (

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >

                          <Badge
                            variant="info"
                            dot
                          >
                            Processing
                          </Badge>


                          <span className="kb-progress-track">

                            <span className="kb-progress-fill" />

                          </span>

                        </div>

                      ) : (

                        <Badge
                          variant={
                            STATUS_VARIANT[
                              document.status
                            ] || 'neutral'
                          }

                          dot
                        >
                          {formatStatus(
                            document.status
                          )}
                        </Badge>

                      )}

                    </td>


                    {/* UPLOADED */}

                    <td
                      style={{
                        color:
                          'var(--text-tertiary)',
                      }}
                    >

                      {formatDate(
                        document.created_at
                      )}

                    </td>


                    {/* ACTIONS */}

                    <td
                      style={{
                        textAlign: 'right',
                      }}
                    >

                      <button
                        className="conv-control-btn"

                        style={{
                          width: 32,
                          height: 32,
                          display: 'inline-flex',
                        }}

                        onClick={() =>
                          setToDelete(
                            document
                          )
                        }

                        aria-label="Delete document"
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


      {/* -------------------------------------------- */}
      {/* DELETE MODAL */}
      {/* -------------------------------------------- */}

      <Modal

        open={!!toDelete}

        onClose={() =>
          setToDelete(null)
        }

        title="Delete this document?"

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

        "{toDelete?.filename ||
          toDelete?.title}" will be removed
        from the knowledge base and the assistant
        will no longer reference it.

      </Modal>

    </div>
  );
}
