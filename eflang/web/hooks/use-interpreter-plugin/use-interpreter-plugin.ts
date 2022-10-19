import { InterpreterPlugin } from '@eflang/ef.interpreter-api';
import React from 'react';
import { EfContext } from '../../ef-context/ef-context';

export function useInterpreterPlugin(plugin: InterpreterPlugin) {
  const { interpreter } = React.useContext(EfContext);
  React.useEffect(() => {
    interpreter?.register(plugin);
    return () => interpreter?.unregister(plugin);
  }, [interpreter]);
}
