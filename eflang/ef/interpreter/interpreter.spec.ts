import { Interpreter } from './interpreter';
import { SparseTape } from './sparse-tape';
import { ArraySource } from './array-source';
import { Instruction, IO, LoopEnd, LoopStart, Note, Rest } from './api';

function note(note: Note["note"], octave: Note["octave"]): Note {
  return { note, octave };
}

function setupTest(program: Instruction[]) {
  const getInput = jest.fn();
  const sendOutput = jest.fn();
  const io: IO = { sendOutput, getInput };

  const interpreter = new Interpreter(
    new SparseTape(),
    { play: jest.fn(), reset: jest.fn() },
    { next: jest.fn().mockReturnValue(Promise.resolve()), reset: jest.fn() },
    new ArraySource(program),
    io,
  );

  return {
    interpreter,
    sendOutput,
    getInput,
  };
}

it('can increment and send output', async () => {
  const { interpreter, sendOutput } = setupTest([
      note("C", 4),
      note("D", 4),
      note("D", 4),
      note("D", 4),
      note("D", 4),
      Rest,
    ]);

  await interpreter.perform();

  expect(sendOutput).toHaveBeenCalledTimes(1);
  expect(sendOutput).toHaveBeenCalledWith(3);
});

it('can take input', async () => {
  const { interpreter, sendOutput, getInput } = setupTest([
      note("C", 4),
      note("B", 4),
      Rest,
      note("A", 4),
      note("B", 4),
      Rest,
    ]);

  getInput.mockReturnValueOnce(Promise.resolve(5));

  await interpreter.perform();

  expect(getInput).toHaveBeenCalledTimes(1);
  expect(sendOutput).toHaveBeenCalledTimes(1);
  expect(sendOutput).toHaveBeenCalledWith(5);
});

it('can loop', async () => {
  const { interpreter, sendOutput } = setupTest([
      note("C", 4),
      note("D", 4),
      note("D", 4),
      note("D", 4),
      note("D", 4),
      LoopStart,
      note("E", 4),
      note("D", 4),
      note("D", 4),
      note("C", 4),
      note("D", 4),
      Rest,
      LoopEnd,
    ]);

  await interpreter.perform();

  expect(sendOutput).toHaveBeenCalledTimes(3);
  expect(sendOutput).nthCalledWith(1, 2);
  expect(sendOutput).nthCalledWith(2, 1);
  expect(sendOutput).nthCalledWith(3, 0);
});

it('skips loop when value is 0', async () => {
  const { interpreter, sendOutput } = setupTest([
      note("C", 4),
      note("D", 4),
      LoopStart,
      note("E", 4),
      note("D", 4),
      note("D", 4),
      note("C", 4),
      note("D", 4),
      Rest,
      LoopEnd,
    ]);

  await interpreter.perform();

  expect(sendOutput).toHaveBeenCalledTimes(0);
});

it('skips nested loops when value is 0', async () => {
  const { interpreter, sendOutput } = setupTest([
      note("C", 4),
      note("D", 4),
      LoopStart,
      note("E", 4),
      note("D", 4),
      LoopStart,
      note("D", 4),
      LoopStart,
      LoopEnd,
      note("C", 4),
      LoopEnd,
      note("D", 4),
      Rest,
      LoopEnd,
    ]);

  await interpreter.perform();

  expect(sendOutput).toHaveBeenCalledTimes(0);
});