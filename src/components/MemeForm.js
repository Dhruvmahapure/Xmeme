import React, { useState } from 'react';
import '../styles/MemeForm.css';

const initialForm = {
  name: '',
  caption: '',
  url: '',
};

function MemeForm({ onSubmit }) {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError('');

    if (!form.name || !form.caption || !form.url) {
      setLocalError('All fields are required.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(form);
      setForm(initialForm);
    } catch (err) {
      // Parent will show an error banner; keep a small hint locally too.
      setLocalError('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="MemeForm" onSubmit={handleSubmit} data-testid="meme-form">
      <div className="MemeForm__row">
        <label htmlFor="name">Owner name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          disabled={submitting}
          required
        />
      </div>

      <div className="MemeForm__row">
        <label htmlFor="caption">Caption</label>
        <input
          id="caption"
          name="caption"
          type="text"
          placeholder="Say something witty"
          value={form.caption}
          onChange={handleChange}
          disabled={submitting}
          required
        />
      </div>

      <div className="MemeForm__row">
        <label htmlFor="url">Image URL</label>
        <input
          id="url"
          name="url"
          type="url"
          placeholder="https://example.com/meme.jpg"
          value={form.url}
          onChange={handleChange}
          disabled={submitting}
          required
        />
      </div>

      {localError && <div className="MemeForm__error">{localError}</div>}

      <button className="MemeForm__submit" type="submit" disabled={submitting}>
        {submitting ? 'Sharing…' : 'Share meme'}
      </button>
    </form>
  );
}

export default MemeForm;

