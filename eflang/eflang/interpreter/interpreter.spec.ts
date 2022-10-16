import { Interpreter } from './interpreter';
import { SparseTape } from './sparse-tape';
import sinon from "sinon";
import { ArraySource } from './array-source';
import { IO, LoopEnd, LoopStart, Rest } from './api';

it('should return the correct value', async () => {
  const sendOutput = sinon.spy();
  const io: IO = {
    sendOutput: sendOutput,
    getInput: sinon.spy(),
  };

  const interpreter = new Interpreter(
    new SparseTape(),
    { play: sinon.spy(), reset: sinon.spy() },
    { next: sinon.stub().returns(Promise.resolve()), reset: sinon.spy() },
    // c4 b3 c4 c4 c4 ( d4 c4 c4 )
    new ArraySource([
      { note: "C", octave: 4 },
      { note: "D", octave: 4 },
      { note: "D", octave: 4 },
      { note: "D", octave: 4 },
      { note: "D", octave: 4 },
      Rest,
    ]),
    io,
  );

  await interpreter.perform();

  expect(sendOutput.calledWith(3)).toEqual(true);
});
