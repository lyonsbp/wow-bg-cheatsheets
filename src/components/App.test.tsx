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
    // BG title + badge both present (multiple elements match the name, so use getAllBy)
    const wsgElements = screen.getAllByText('Warsong Gulch');
    expect(wsgElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Capture the Flag · 10v10/)).toBeInTheDocument();
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

  it('renders the legend with all BG items', () => {
    render(<App />);
    expect(screen.getByText('Legend')).toBeInTheDocument();
    // WSG-specific items should appear in legend
    expect(screen.getAllByText('Alliance GY').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Horde GY').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Tunnel (Center)').length).toBeGreaterThanOrEqual(2); // SVG title + legend
    expect(screen.getAllByText('Alliance Flag Room').length).toBeGreaterThanOrEqual(2);
  });

  it('renders stroke width slider', () => {
    render(<App />);
    expect(screen.getByText('Thickness')).toBeInTheDocument();
    expect(screen.getByTitle('Route thickness')).toBeInTheDocument();
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

  it('renders theme toggle and switches modes', async () => {
    render(<App />);
    const toggle = screen.getByTitle('Toggle theme');
    expect(toggle).toBeInTheDocument();
    expect(screen.getByText('Light')).toBeInTheDocument();
    await userEvent.click(toggle);
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
});
