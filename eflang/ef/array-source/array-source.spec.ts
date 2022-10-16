import * as EF from "@eflang/ef.lang";
import { ArraySource } from './array-source';

it('returns values in order', () => {
  const src = new ArraySource([EF.LoopStart, EF.LoopEnd, EF.Rest])
  expect(src.hasNext()).toStrictEqual(true);
  expect(src.next()).toStrictEqual(EF.LoopStart);
  expect(src.hasNext()).toStrictEqual(true);
  expect(src.next()).toStrictEqual(EF.LoopEnd);
  expect(src.hasNext()).toStrictEqual(true);
  expect(src.next()).toStrictEqual(EF.Rest);
  expect(src.hasNext()).toStrictEqual(false);
});
