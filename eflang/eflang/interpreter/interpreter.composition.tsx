import React from 'react';
import { interpreter } from './interpreter';

export function ReturnsCorrectValue() {
  return <div>{interpreter()}</div>;
}
