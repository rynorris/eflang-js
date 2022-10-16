import { SparseTape } from './sparse-tape';

it('can set and retrieve a value', () => {
  const tape = new SparseTape();
  tape.set(7);
  expect(tape.get()).toStrictEqual(7);
});

it('can move the tape head to set multiple cells', () => {
  const tape = new SparseTape();
  tape.set(3);
  tape.right();
  tape.set(7);
  expect(tape.get()).toStrictEqual(7);
  tape.left();
  expect(tape.get()).toStrictEqual(3);
});
