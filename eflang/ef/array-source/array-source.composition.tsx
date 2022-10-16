import React from 'react';
import { arraySource } from './array-source';

export function ReturnsCorrectValue() {
  return <div>{arraySource()}</div>;
}
