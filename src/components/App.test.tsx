import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('App', () => {
  it('renders the header', () => {
    render(<App />);
    expect(screen.getByText(/Battleground Cheat Sheets/)).toBeInTheDocument();
  });

  it('renders the sidebar with BG categories', () => {
    render(<App />);
    expect(screen.getByText('Blitz 8v8')).toBeInTheDocument();
    expect(screen.getByText('Epic 40v40')).toBeInTheDocument();
  });

  it('starts with Warsong Gulch selected', () => {
    render(<App />);
    expect(screen.getByText('Warsong Gulch', { selector: '.bg-title' })).toBeInTheDocument();
    expect(screen.getByText(/Capture the Flag/, { selector: '.bg-badge' })).toBeInTheDocument();
  });

  it('switches BG when sidebar button is clicked', async () => {
    render(<App />);
    const abButton = screen.getByRole('button', { name: /Arathi Basin/ });
    await userEvent.click(abButton);
    expect(screen.getByText(/First to 1,600 resources/)).toBeInTheDocument();
  });

  it('renders layer toggle buttons', () => {
    render(<App />);
    expect(screen.getByText('Graveyards')).toBeInTheDocument();
    expect(screen.getByText('Power-ups')).toBeInTheDocument();
    expect(screen.getByText('Routes')).toBeInTheDocument();
    expect(screen.getByText('Objectives')).toBeInTheDocument();
    expect(screen.getByText('Edit Mode')).toBeInTheDocument();
    expect(screen.getByText('Squiggly')).toBeInTheDocument();
  });

  it('renders strategy tips', () => {
    render(<App />);
    expect(screen.getByText('Strategy Tips')).toBeInTheDocument();
    expect(screen.getByText(/Tunnel \(center\) is fastest/)).toBeInTheDocument();
  });

  it('renders the legend', () => {
    render(<App />);
    expect(screen.getByText('Legend')).toBeInTheDocument();
    expect(screen.getByText('Alliance Graveyard')).toBeInTheDocument();
    expect(screen.getByText('Horde Graveyard')).toBeInTheDocument();
  });

  it('renders zoom controls', () => {
    render(<App />);
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByTitle('Zoom in')).toBeInTheDocument();
    expect(screen.getByTitle('Zoom out')).toBeInTheDocument();
    expect(screen.getByTitle('Reset zoom')).toBeInTheDocument();
  });

  it('shows edit bar when edit mode is toggled', async () => {
    render(<App />);
    const editBtn = screen.getByText('Edit Mode');
    await userEvent.click(editBtn);
    expect(screen.getByText(/Editing:/)).toBeInTheDocument();
    expect(screen.getByText('Export JSON')).toBeInTheDocument();
    expect(screen.getByText('Import JSON')).toBeInTheDocument();
    expect(screen.getByText('Reset to Default')).toBeInTheDocument();
  });
});
