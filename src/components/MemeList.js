import React from 'react';
import MemeCard from './MemeCard';
import '../styles/MemeList.css';

function MemeList({ memes = [], loading = false, onUpdate, onSelect, onDelete }) {
  if (!loading && memes.length === 0) {
    return <p className="MemeList__empty">No memes shared yet. Be the first!</p>;
  }

  return (
    <div className="MemeList">
      {loading && <p className="MemeList__loading">Loading memes…</p>}
      {memes.map((meme) => (
        <MemeCard
          key={meme.id || meme._id || meme.url}
          meme={meme}
          onUpdate={onUpdate}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default MemeList;

