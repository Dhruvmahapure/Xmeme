import React, { useEffect, useState, useCallback } from 'react';
import MemeForm from './components/MemeForm';
import MemeList from './components/MemeList';
import MemeModal from './components/MemeModal';
import {
  fetchMemes,
  getMeme,
  createMeme,
  updateMeme,
  deleteMeme,
} from './services/memeService';
import './styles/App.css';

function App() {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedMeme, setSelectedMeme] = useState(null);
  const [error, setError] = useState('');

  const loadMemes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchMemes();
      setMemes(data);
    } catch (err) {
      setError(err.message || 'Unable to load memes right now. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMemes();
  }, [loadMemes]);

  const handleCreate = async (payload) => {
    setError('');
    try {
      await createMeme(payload);
      await loadMemes();
    } catch (err) {
      setError(err.message || 'Could not share your meme. Please retry.');
      throw err;
    }
  };

  const handleUpdate = async (id, payload) => {
    setError('');
    try {
      await updateMeme(id, payload);
      await loadMemes();
    } catch (err) {
      setError(err.message || 'Could not update this meme. Please try again.');
      throw err;
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await deleteMeme(id);
      await loadMemes();
      if (selectedMeme && (selectedMeme.id === id || selectedMeme._id === id)) {
        setSelectedMeme(null);
      }
    } catch (err) {
      setError(err.message || 'Could not delete this meme. Please try again.');
      throw err;
    }
  };

  const handleSelect = async (meme) => {
    if (!meme) return;
    setSelectedMeme(meme);
    setModalLoading(true);
    try {
      const fresh = await getMeme(meme.id || meme._id);
      setSelectedMeme(fresh);
    } catch (err) {
      setError(err.message || 'Could not load meme details.');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="App-shell">
        <header className="App-header">
          <div className="App-brand">
            <h1>XMeme Feed</h1>
            <p className="App-subtitle">Share and browse memes, Instagram-style.</p>
          </div>
        </header>

        <main className="App-content">
          <section className="App-panel">
            <div className="App-panel__header">
              <h2>Share a meme</h2>
            </div>
            <MemeForm onSubmit={handleCreate} />
          </section>

          <section className="App-panel">
            <div className="App-panel__header">
              <h2>Latest memes</h2>
              <button className="App-reload" onClick={loadMemes} disabled={loading}>
                {loading ? 'Refreshing…' : 'Refresh'}
              </button>
            </div>
            {error && <div className="App-error">{error}</div>}
            <MemeList
              memes={memes}
              loading={loading}
              onUpdate={handleUpdate}
              onSelect={handleSelect}
              onDelete={handleDelete}
            />
          </section>
        </main>
      </div>

      {selectedMeme && (
        <MemeModal
          meme={selectedMeme}
          loading={modalLoading}
          onClose={() => setSelectedMeme(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default App;
