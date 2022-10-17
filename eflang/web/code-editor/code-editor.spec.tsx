import React from 'react';
import { render } from '@testing-library/react';
import { BasicCodeEditor } from './code-editor.composition';

it('should render with the correct text', () => {
  const { getByText } = render(<BasicCodeEditor />);
  const rendered = getByText('hello world!');
  expect(rendered).toBeTruthy();
});
