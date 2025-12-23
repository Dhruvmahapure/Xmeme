import React, { useState } from 'react';
import '../styles/MemeCard.css';

function MemeCard({ meme, onUpdate, onSelect, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [caption, setCaption] = useState(meme.caption || '');
  const [url, setUrl] = useState(meme.url || '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const avatarLetter = (meme.name || 'A').trim().charAt(0).toUpperCase();
  const owner = meme.name || 'Anonymous';
  const memeId = meme.id || meme._id || 'n/a';

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
    } finally {
      setDeleting(false);
    }
  };

  const stop = (e) => e.stopPropagation();

  return (
    <article className="MemeCard" onClick={() => onSelect && onSelect(meme)}>
      <header className="MemeCard__header">
        <div className="MemeCard__avatar" aria-hidden>
          {avatarLetter}
        </div>
        <div className="MemeCard__user">
          <span className="MemeCard__owner">{owner}</span>
          <span className="MemeCard__meta">#{memeId}</span>
        </div>
      </header>

      <div className="MemeCard__imageWrapper">
        <img
          src={url}
          alt={caption || 'meme'}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/600?text=Image+not+available';
          }}
        />
      </div>

      <div className="MemeCard__body">
        {editing ? (
          <div className="MemeCard__editFields" onClick={stop}>
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
          <p className="MemeCard__caption">
            <span className="MemeCard__owner MemeCard__owner--inline">{owner}</span>{' '}
            <span className="MemeCard__captionText">{meme.caption}</span>
          </p>
        )}

        <div className="MemeCard__actions" onClick={stop}>
          <button className="MemeCard__link" onClick={() => onSelect && onSelect(meme)}>
            View
          </button>
          <button
            className="MemeCard__link"
            onClick={() => setEditing((prev) => !prev)}
            disabled={saving || deleting}
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
          {editing && (
            <button
              className="MemeCard__link MemeCard__link--bold"
              onClick={handleSave}
              disabled={saving || deleting}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          )}
          <button
            className="MemeCard__link MemeCard__link--danger"
            onClick={handleDelete}
            disabled={saving || deleting}
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </article>
  );
}

export default MemeCard;

