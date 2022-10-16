import React from 'react';
import { interpreterApi } from './interpreter-api';

export function ReturnsCorrectValue() {
  return <div>{interpreterApi()}</div>;
}
