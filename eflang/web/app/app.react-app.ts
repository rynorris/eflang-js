import type { ReactAppOptions } from '@teambit/react';

export const EFApp: ReactAppOptions = {
  name: 'EFApp',
  entry: [require.resolve('./app.app-root')],
};

export default EFApp;