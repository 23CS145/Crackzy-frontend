import { useParams } from 'react-router-dom';
import { useGetNoteByIdQuery } from '../slices/notesApiSlice';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const NoteDetails = () => {
  const { id } = useParams();
  const { data: note, isLoading, error } = useGetNoteByIdQuery(id);
  const { userInfo } = useSelector((state) => state.auth);

  const canEditNote = note && userInfo && (userInfo.role === 'admin' || userInfo._id === note.uploadedBy._id);

  if (isLoading) return <div>Loading note...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container">
      <div className="note-detail-card">
        <div className="note-header">
          <h1>{note.title}</h1>
          <div className="note-meta">
            <span>Uploaded by: {note.uploadedBy.name}</span>
            <span>
              {new Date(note.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
        
        <div className="note-content">
          {note.content.split('\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {note.fileUrl && (
          <div className="note-file">
            <h3>Attached File:</h3>
            <a 
              href={note.fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn"
            >
              Download File
            </a>
          </div>
        )}

        <div className="note-actions">
          <Link to="/notes" className="btn btn-outline">
            Back to Notes
          </Link>
          {canEditNote && (
            <Link 
              to={`/notes/edit/${note._id}`} 
              className="btn"
            >
              Edit Note
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteDetails;