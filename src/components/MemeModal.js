import React, { useState, useEffect } from 'react';
import '../styles/MemeModal.css';

function MemeModal({ meme, loading = false, onClose, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [caption, setCaption] = useState(meme.caption || '');
  const [url, setUrl] = useState(meme.url || '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setCaption(meme.caption || '');
    setUrl(meme.url || '');
  }, [meme]);

  const handleSave = async () => {
    if (!onUpdate) return;
    setSaving(true);
    try {
      await onUpdate(meme.id || meme._id, { caption, url });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    const confirmed = window.confirm('Delete this meme? This cannot be undone.');
    if (!confirmed) return;
    setDeleting(true);
    try {
      await onDelete(meme.id || meme._id);
      if (onClose) onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="MemeModal__backdrop" role="dialog" aria-modal="true">
      <div className="MemeModal">
        <header className="MemeModal__header">
          <div>
            <p className="MemeModal__owner">{meme.name || 'Anonymous'}</p>
            <p className="MemeModal__id">#{meme.id || meme._id || 'n/a'}</p>
          </div>
          <button className="MemeModal__close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </header>

        <div className="MemeModal__body">
          <div className="MemeModal__imageWrapper">
            <img
              src={url}
              alt={caption || 'meme'}
              loading="lazy"
              onError={(e) => {
                e.target.src =
                  'https://via.placeholder.com/800x600?text=Image+not+available';
              }}
            />
            {loading && <div className="MemeModal__loading">Loading meme…</div>}
          </div>

          {editing ? (
            <div className="MemeModal__edit">
              <label>
                Caption
                <input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  disabled={saving}
                />
              </label>
              <label>
                Image URL
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={saving}
                />
              </label>
            </div>
          ) : (
            <p className="MemeModal__caption">{meme.caption}</p>
          )}
        </div>

        <footer className="MemeModal__actions">
          <button className="MemeModal__button" onClick={() => setEditing((p) => !p)} disabled={saving || deleting}>
            {editing ? 'Cancel' : 'Edit'}
          </button>
          {editing && (
            <button
              className="MemeModal__button MemeModal__button--primary"
              onClick={handleSave}
              disabled={saving || deleting}
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          )}
          <button
            className="MemeModal__button MemeModal__button--danger"
            onClick={handleDelete}
            disabled={saving || deleting}
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </footer>
      </div>
    </div>
  );
}

export default MemeModal;

