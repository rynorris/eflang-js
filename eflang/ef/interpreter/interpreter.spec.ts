import * as EF from "@eflang/ef.lang";
import { ArraySource } from '@eflang/ef.array-source';
import { SparseTape } from '@eflang/ef.sparse-tape';

import { Interpreter } from './interpreter';
import { InterpreterEvent, InterpreterPlugin } from "@eflang/ef.interpreter-api";

class OutputCaptor implements InterpreterPlugin {
  outputs: number[] = [];
  private handler: InterpreterEvent.Listener<"output"> = ({ value }) => this.outputs.push(value);

  register({ subscribe }) {
    subscribe("output", this.handler);
  }

  unregister({ subscribe }) {
    subscribe("output", this.handler);
  }
}

function setupTest(program: EF.Instruction[]) {
  const getInput = jest.fn();
  const outputCaptor = new OutputCaptor();

  const interpreter = new Interpreter(
    new SparseTape(),
    { next: jest.fn().mockReturnValue(Promise.resolve()), reset: jest.fn() },
    new ArraySource(program),
    { getInput },
  );

  interpreter.register(outputCaptor);

  return {
    interpreter,
    getInput,
    outputCaptor,
  };
}

it('can increment and send output', async () => {
  const { interpreter, outputCaptor } = setupTest([
      EF.note("C", 4),
      EF.note("D", 4),
      EF.note("D", 4),
      EF.note("D", 4),
      EF.note("D", 4),
      EF.Rest,
    ]);

  await interpreter.perform();
  expect(outputCaptor.outputs).toStrictEqual([3]);
});

it('can take input', async () => {
  const { interpreter, outputCaptor, getInput } = setupTest([
      EF.note("C", 4),
      EF.note("B", 4),
      EF.Rest,
      EF.note("A", 4),
      EF.note("B", 4),
      EF.Rest,
    ]);

  getInput.mockReturnValueOnce(Promise.resolve(5));
  await interpreter.perform();
  expect(getInput).toHaveBeenCalledTimes(1);
  expect(outputCaptor.outputs).toStrictEqual([5]);
});

it('can loop', async () => {
  const { interpreter, outputCaptor } = setupTest([
      EF.note("C", 4),
      EF.note("D", 4),
      EF.note("D", 4),
      EF.note("D", 4),
      EF.note("D", 4),
      EF.LoopStart,
      EF.note("E", 4),
      EF.note("D", 4),
      EF.note("D", 4),
      EF.note("C", 4),
      EF.note("D", 4),
      EF.Rest,
      EF.LoopEnd,
    ]);

  await interpreter.perform();
  expect(outputCaptor.outputs).toStrictEqual([2, 1, 0]);
});

it('skips loop when value is 0', async () => {
  const { interpreter, outputCaptor } = setupTest([
      EF.note("C", 4),
      EF.note("D", 4),
      EF.LoopStart,
      EF.note("E", 4),
      EF.note("D", 4),
      EF.note("D", 4),
      EF.note("C", 4),
      EF.note("D", 4),
      EF.Rest,
      EF.LoopEnd,
    ]);

  await interpreter.perform();
  expect(outputCaptor.outputs).toStrictEqual([]);
});

it('skips nested loops when value is 0', async () => {
  const { interpreter, outputCaptor } = setupTest([
      EF.note("C", 4),
      EF.note("D", 4),
      EF.LoopStart,
      EF.note("E", 4),
      EF.note("D", 4),
      EF.LoopStart,
      EF.note("D", 4),
      EF.LoopStart,
      EF.LoopEnd,
      EF.note("C", 4),
      EF.LoopEnd,
      EF.note("D", 4),
      EF.Rest,
      EF.LoopEnd,
    ]);

  await interpreter.perform();
  expect(outputCaptor.outputs).toStrictEqual([]);
});