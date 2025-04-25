import { expect, test, vi } from 'vitest';
import { Button } from './Button';
import { fireEvent, render, screen } from '@testing-library/react';

test('renders Button with correct text and fires click', () => {
  const onClickMock = vi.fn();

  render(<Button onClick={onClickMock}>Click Me</Button>);

  const button = screen.getByTestId('button');
  expect(button).toHaveTextContent('Click Me');

  fireEvent.click(button);
  expect(onClickMock).toHaveBeenCalled();
});
