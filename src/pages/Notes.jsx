import { useState, useEffect } from 'react';
import { useGetNotesQuery, useCreateNoteMutation, useDeleteNoteMutation } from '../slices/notesApiSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Notes = () => {
  const { data: notes, isLoading, error, refetch } = useGetNotesQuery();
  const [createNote, { isLoading: isCreating }] = useCreateNoteMutation();
  const [deleteNote, { isLoading: isDeleting }] = useDeleteNoteMutation();
  
  const { userInfo } = useSelector((state) => state.auth);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createNote({ title, content, fileUrl }).unwrap();
      toast.success('Note created successfully');
      setTitle('');
      setContent('');
      setFileUrl('');
      setShowForm(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(id).unwrap();
        toast.success('Note deleted successfully');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Study Notes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn"
        >
          {showForm ? 'Cancel' : 'Add New Note'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>Create New Note</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="5"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="fileUrl">File URL (optional)</label>
              <input
                type="url"
                id="fileUrl"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://example.com/file.pdf"
              />
            </div>
            <button
              type="submit"
              disabled={isCreating}
              className="btn btn-success"
            >
              {isCreating ? 'Creating...' : 'Create Note'}
            </button>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="loading-message">Loading notes...</div>
      ) : error ? (
        <div className="error-message">Error: {error.message}</div>
      ) : (
        <div className="notes-grid">
          {notes?.map((note) => (
            <div key={note._id} className="note-card">
              <div className="note-content">
                <h2>{note.title}</h2>
                <p className="note-text">
                  {note.content.length > 150
                    ? `${note.content.substring(0, 150)}...`
                    : note.content}
                </p>
                {note.fileUrl && (
                  <a
                    href={note.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="file-link"
                  >
                    View attached file
                  </a>
                )}
                <div className="note-meta">
                  Uploaded by: {note.uploadedBy.name}
                </div>
              </div>
              <div className="note-actions">
                <button
                  onClick={() => {
                    setTitle(note.title);
                    setContent(note.content);
                    setFileUrl(note.fileUrl || '');
                    setShowForm(true);
                  }}
                  className="btn btn-outline"
                  disabled={note.uploadedBy._id !== userInfo?._id}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(note._id)}
                  className="btn btn-danger"
                  disabled={note.uploadedBy._id !== userInfo?._id && userInfo?.role !== 'admin'}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;