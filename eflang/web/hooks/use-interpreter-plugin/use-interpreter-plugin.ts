import { InterpreterPlugin } from '@eflang/ef.interpreter-api';
import React from 'react';
import { EfContext } from '@eflang/web.ef-context';

export function useInterpreterPlugin(plugin: InterpreterPlugin) {
  const { interpreter } = React.useContext(EfContext);
  React.useEffect(() => {
    interpreter?.register(plugin);
    return () => interpreter?.unregister(plugin);
  }, [interpreter]);
}
