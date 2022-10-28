import { useInterpreterControls } from './use-interpreter-controls';

it('should return the correct value', () => {
  expect(useInterpreterControls()).toBe('Hello world!');
});
