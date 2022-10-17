import React from 'react';
import { rawIo } from './raw-io';

export function ReturnsCorrectValue() {
  return <div>{rawIo()}</div>;
}
