import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("./app.js", import.meta.url), "utf8");
const section = (start, end) => source.slice(source.indexOf(start), source.indexOf(end));

test("generated lessons enter the library only after the teacher saves", () => {
  const generation = section("function ensureGenerationTimer", "function renderGenerate");
  const saveDraft = section("function saveGeneratedDraft", "function snapshotForWork");
  const home = section("function renderHome", "function renderWorks");
  const editor = section("function renderWorkDetail", "function resourceCard");

  assert.match(generation, /state\.generation\.draft = \{/);
  assert.doesNotMatch(generation, /state\.works\.unshift/);
  assert.match(saveDraft, /state\.works\.unshift\(draft\)/);
  assert.match(saveDraft, /state\.generation\.draft = null/);
  assert.match(editor, /save-generated-work/);
  assert.match(editor, /請先儲存課件/);
  assert.doesNotMatch(home, /有一份課件尚未儲存/);
  assert.match(source, /if \(!isSavedWork\(work\)\) \{\s*showToast\("請先儲存課件，再建立課堂。/);
});

test("teaching language and lesson plan are visibly optional", () => {
  assert.match(source, /教學語言 <span class="optional-label">可選<\/span>/);
  assert.match(source, /上傳教案（選填）/);
  assert.match(source, /上傳教案 <span class="optional-label">可選<\/span>/);
  assert.match(source, /!state\.prep\.requirements\.trim\(\) && !state\.prep\.file && !state\.prep\.reportContext/);
});

test("returned content revisions show an inline preview before being applied", () => {
  const overlay = section('if (ui.drawer?.type === "content-editor")', 'if (ui.modal?.type === "guide")');
  const actions = section('if (action === "submit-work-revision")', 'if (action === "open-question-editor") {');

  assert.match(overlay, /提交修改/);
  assert.match(overlay, /繼續修改/);
  assert.match(overlay, /套用新版本/);
  assert.match(actions, /status: "running"/);
  assert.match(actions, /status: "ready"/);
  assert.match(actions, /continue-work-revision/);
  assert.match(actions, /const baseCandidate/);
  assert.match(actions, /const baseWork = activeRevision\.candidate \|\| currentWork/);
  assert.match(overlay, /lessonCanvas\(previewPage, \{ work: previewWork \}\)/);
  assert.match(actions, /revision-page/);
  assert.match(actions, /confirm-work-revision/);
  assert.match(actions, /work\.versionId = revision\.candidate\.versionId/);
  assert.doesNotMatch(source, /preview-work-revision/);
  assert.doesNotMatch(source, /save-work-content/);
});

test("new generation replaces an unsaved draft without a blocking prompt", () => {
  assert.doesNotMatch(source, /replace-unsaved-draft/);
  assert.doesNotMatch(source, /discard-draft-and-generate/);
  assert.doesNotMatch(source, /先處理未儲存課件/);
  assert.match(source, /if \(action === "submit-prep"\)[\s\S]*?beginGeneration\(generationTask\)/);
  assert.match(source, /if \(action === "use-resource"\)[\s\S]*?beginGeneration\(generationTask\)/);
});

test("saved works require an explicit save after content or question changes", () => {
  const helpers = section("function isSavedWork", "function snapshotForWork");
  const editor = section("function renderWorkDetail", "function resourceCard");
  const actions = section('if (action === "save-generated-work")', 'if (action === "resource-tab")');
  const classroom = section("function initializeClassroom", "async function handleAction");

  assert.match(helpers, /work\.pendingSave = true/);
  assert.match(editor, /save-work-changes/);
  assert.match(editor, /儲存修改/);
  assert.match(editor, /有未儲存修改/);
  assert.match(actions, /delete work\.pendingSave/);
  assert.ok((actions.match(/markWorkChanged\(work\)/g) || []).length >= 5);
  assert.match(classroom, /if \(work\.pendingSave\)/);
  assert.match(classroom, /請先儲存作品修改/);
});

test("content and question editors use the existing large modal", () => {
  const questionEditor = section("function renderQuestionEditor", "function renderOverlay");
  const contentEditor = section('if (ui.drawer?.type === "content-editor")', 'if (ui.modal?.type === "guide")');

  assert.match(questionEditor, /return modalShell\(\{/);
  assert.match(questionEditor, /large: true/);
  assert.doesNotMatch(questionEditor, /return drawerShell\(\{/);
  assert.equal(contentEditor.match(/return modalShell\(\{/g)?.length, 3);
  assert.equal(contentEditor.match(/large: true/g)?.length, 3);
  assert.doesNotMatch(contentEditor, /return drawerShell\(\{/);
});

test("resource reuse shows copy-and-draft stages instead of zero-to-one generation", () => {
  const generation = section("const generationStages", "function ensureGenerationTimer");
  const renderer = section("function renderGenerate", "function workCard");

  assert.match(generation, /resourceGenerationStages = \["讀取平台資源", "複製作品內容", "建立未儲存草稿", "生成配套題", "準備進入編輯"\]/);
  assert.match(renderer, /task\.mode === "resource"/);
  assert.match(renderer, /resourceMode \? resourceGenerationStages : generationStages/);
  assert.match(renderer, /平台資源使用並修改/);
  assert.match(renderer, /返回資源詳情/);
  assert.doesNotMatch(generation.match(/resourceGenerationStages = \[[^;]+/)?.[0] || "", /生成互動作品/);
});
