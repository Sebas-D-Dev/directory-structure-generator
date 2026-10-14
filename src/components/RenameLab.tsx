import { useRef, useState } from 'react';
import { catalog } from '../content/examples.ts';
import { explainRename, renameCases, type RenameCase } from '../domain/learning.ts';

export default function RenameLab() {
  const [kind, setKind] = useState<RenameCase>('entry');
  const [current, setCurrent] = useState('main.go');
  const [candidate, setCandidate] = useState('cli.go');
  const [preview, setPreview] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const [message, setMessage] = useState('Choose a filename. Predict what changes, then reveal the explanation.');
  const input = useRef<HTMLInputElement>(null);
  const reveal = useRef<HTMLButtonElement>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const scenario = renameCases[kind];
  const result = explainRename(kind, preview ?? current);
  const validation = explainRename(kind, candidate);
  function choose(next: RenameCase) {
    setKind(next); setCurrent(renameCases[next].original); setCandidate(renameCases[next].suggested); setPreview(null); setPrevious(null);
    setMessage(`Selected ${renameCases[next].label.toLowerCase()}. The lab has reset for this case.`);
  }
  function apply() {
    if (preview === null || !result.valid) return;
    setPrevious(current); setCurrent(preview); setPreview(null); setMessage('Applied to this teaching model only. No files were renamed.');
    resultHeading.current?.focus();
  }
  function undo() {
    if (!previous) return;
    setCurrent(previous); setCandidate(previous); setPrevious(null); setPreview(null); setMessage('Restored the previous filename in the model.'); resultHeading.current?.focus();
  }
  return <section className="rename-lab" id="rename-lab" aria-labelledby="rename-heading">
    <div className="section-heading"><span className="step">GO / NAMING LAB</span><h2 id="rename-heading">A new name.<br /><em>The same behavior?</em></h2><p>Two Go filenames, two different rules. Change one label and trace what the tool will still recognize.</p></div>
    <div className="lab-shell">
      <div className="lab-controls"><span className="eyebrow">RENAME & EXPLAIN · GO</span><fieldset><legend>Choose a case</legend>{(Object.keys(renameCases) as RenameCase[]).map((id) => <label className="case-option" key={id}><input type="radio" name="rename-case" checked={kind === id} onChange={() => choose(id)} /><span><strong>{renameCases[id].label}</strong><small>{renameCases[id].original} · {renameCases[id].kind}</small></span></label>)}</fieldset>
        <label className="filename-label" htmlFor="rename-filename">Try a new filename</label><input id="rename-filename" ref={input} value={candidate} maxLength={64} spellCheck={false} autoComplete="off" aria-describedby="rename-help rename-validation" aria-invalid={!validation.valid} onChange={(event) => {setCandidate(event.target.value); setPreview(null);}} />
        <p id="rename-help" className="small">A simple, platform-neutral .go filename. This is a simulation, not a file editor.</p><p id="rename-validation" className="validation-message">{!validation.valid ? validation.effect : 'What do you predict: ordinary label, or tooling behavior change?'}</p>
        <button className="primary" ref={reveal} disabled={!validation.valid} onClick={() => {setPreview(candidate);setMessage(explainRename(kind, candidate).title);resultHeading.current?.focus();}}>Reveal naming consequence</button>
        <div className="preset-actions"><button className="text-button" onClick={() => {setCandidate(scenario.suggested);setPreview(null);input.current?.focus();}}>Use suggested name</button><button className="text-button" disabled={!previous} onClick={undo}>Undo rename</button></div>
      </div>
      <div className="lab-stage"><div className="lab-status"><span className="badge">{scenario.kind}</span><span>{preview ? 'Previewing a change' : 'Current learning model'}</span></div>
        <div className="rename-diagram" aria-label="Filename to tool behavior diagram"><div className="diagram-node"><span className="eyebrow">FILE IN THIS PACKAGE</span><code>{current}</code>{preview && <span className="rename-delta">proposed → <strong>{preview}</strong></span>}<small>{kind === 'entry' ? 'package main · func main' : 'package main · TestRename'}</small></div><span className="flow-arrow" aria-hidden="true">→</span><div className="diagram-node tool-node"><span className="eyebrow">PACKAGE-BASED COMMAND</span><code>{scenario.command}</code><small>{kind === 'entry' ? 'Builds and runs the command' : 'Discovers and runs package tests'}</small></div></div>
        <p className="diagram-key">Arrow means “evaluated by the tool,” not “nested inside a folder.”</p>
        <div className={`rename-result ${result.tone}`}><span className="eyebrow">{preview ? 'PREDICTED CONSEQUENCE' : 'WHY THIS NAME WORKS THIS WAY'}</span><h3 ref={resultHeading} tabIndex={-1}>{result.title}</h3><div key={`${kind}-${preview ?? current}`} className={`result-copy${preview ? ' revealed' : ''}`}><p>{result.effect}</p><p className="small">{result.followup}</p></div></div>
        {preview && <div className="actions rename-actions"><button className="primary" onClick={apply} disabled={preview === current}>Apply in model</button><button className="secondary" onClick={() => {setPreview(null);setMessage('Cancelled the rename preview.');reveal.current?.focus();}}>Cancel rename preview</button></div>}
        <details className="lab-evidence"><summary>Assumptions, sources and limits</summary><p>This original teaching model changes one filename in the same package. It assumes no build tags, platform-specific filenames, cgo, conflicting names, or other entry point. The test case assumes a valid TestRename function in package main. No Go process is executed; predictions are based on documentation, not a completed runtime experiment.</p><ul>{scenario.sourceIds.map((id) => {const source = catalog.sources.find((s) => s.id === id)!;return <li key={id}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}<span className="sr-only"> (opens in a new tab)</span></a> · checked {source.checkedAt}</li>;})}</ul><p>The lab is separate from the Go layout guide. It resets on reload and is not included in that workspace’s exports.</p></details>
      </div>
    </div><p className="live-status" role="status" aria-live="polite">{message}</p>
  </section>;
}
