import * as EF from "@eflang/ef.lang";

import { Interpreter } from './interpreter';
import { SparseTape } from './sparse-tape';
import { ArraySource } from './array-source';
import { IO, } from './api';

function note(note: EF.Note["note"], octave: EF.Note["octave"]): EF.Note {
  return { note, octave };
}

function setupTest(program: EF.Instruction[]) {
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
      EF.Rest,
    ]);

  await interpreter.perform();

  expect(sendOutput).toHaveBeenCalledTimes(1);
  expect(sendOutput).toHaveBeenCalledWith(3);
});

it('can take input', async () => {
  const { interpreter, sendOutput, getInput } = setupTest([
      note("C", 4),
      note("B", 4),
      EF.Rest,
      note("A", 4),
      note("B", 4),
      EF.Rest,
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
      EF.LoopStart,
      note("E", 4),
      note("D", 4),
      note("D", 4),
      note("C", 4),
      note("D", 4),
      EF.Rest,
      EF.LoopEnd,
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
      EF.LoopStart,
      note("E", 4),
      note("D", 4),
      note("D", 4),
      note("C", 4),
      note("D", 4),
      EF.Rest,
      EF.LoopEnd,
    ]);

  await interpreter.perform();

  expect(sendOutput).toHaveBeenCalledTimes(0);
});

it('skips nested loops when value is 0', async () => {
  const { interpreter, sendOutput } = setupTest([
      note("C", 4),
      note("D", 4),
      EF.LoopStart,
      note("E", 4),
      note("D", 4),
      EF.LoopStart,
      note("D", 4),
      EF.LoopStart,
      EF.LoopEnd,
      note("C", 4),
      EF.LoopEnd,
      note("D", 4),
      EF.Rest,
      EF.LoopEnd,
    ]);

  await interpreter.perform();

  expect(sendOutput).toHaveBeenCalledTimes(0);
});