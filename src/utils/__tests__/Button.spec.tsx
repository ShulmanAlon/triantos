import { expect, test } from 'vitest';
import { Button } from '../../components/ui/Button';
import { render, screen } from '@testing-library/react';

test('renders button with label', () => {
  render(<Button onClick={() => {}}>Click Me</Button>);
  expect(screen.getByText('Click Me')).toBeInTheDocument();
});
