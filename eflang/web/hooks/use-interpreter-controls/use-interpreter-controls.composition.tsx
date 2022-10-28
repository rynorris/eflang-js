import React from 'react';
import { useInterpreterControls } from './use-interpreter-controls';

export function ReturnsCorrectValue() {
  return <div>{useInterpreterControls()}</div>;
}
