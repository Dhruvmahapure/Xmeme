import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./services/memeService', () => ({
  fetchMemes: jest.fn().mockResolvedValue([]),
  createMeme: jest.fn().mockResolvedValue({}),
  updateMeme: jest.fn().mockResolvedValue({}),
}));

test('renders XMeme board header and form', async () => {
  render(<App />);
  expect(screen.getByText(/XMeme Board/i)).toBeInTheDocument();
  expect(screen.getByTestId('meme-form')).toBeInTheDocument();
});
