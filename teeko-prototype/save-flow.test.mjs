import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("./app.js", import.meta.url), "utf8");
const section = (start, end) => source.slice(source.indexOf(start), source.indexOf(end));

test("generated lessons enter the library only after the teacher saves", () => {
  const generation = section("function ensureGenerationTimer", "function renderGenerate");
  const saveDraft = section("function saveGeneratedDraft", "function snapshotForWork");
  const editor = section("function renderWorkDetail", "function resourceCard");

  assert.match(generation, /state\.generation\.draft = \{/);
  assert.doesNotMatch(generation, /state\.works\.unshift/);
  assert.match(saveDraft, /state\.works\.unshift\(draft\)/);
  assert.match(saveDraft, /state\.generation\.draft = null/);
  assert.match(editor, /save-generated-work/);
  assert.match(editor, /disabled title="請先儲存到我的作品"/);
  assert.match(source, /if \(!isSavedWork\(work\)\) \{\s*showToast\("請先把課件儲存到我的作品，再建立課堂。/);
});
