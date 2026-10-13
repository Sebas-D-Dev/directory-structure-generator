import { Fragment, useRef, useState } from 'react';
import { astroFlow } from '../content/astro-flow.ts';
import { getFlowStep, stepIndex, type PageMode } from '../domain/page-flow.ts';

function SourcePath({path}: {path: string}) {
  const segments = path.split('/');
  return segments.map((part, index) => <Fragment key={`${index}-${part}`}><span className="flow-path-part">{part}{index < segments.length - 1 ? '/' : ''}</span>{index < segments.length - 1 && <wbr />}</Fragment>);
}

export default function AstroPageFlow() {
  const [mode, setMode] = useState<PageMode>('static');
  const [index, setIndex] = useState(0);
  const [fileId, setFileId] = useState('page');
  const [status, setStatus] = useState('Start at the build. Nothing is running in this illustration.');
  const explanationHeading = useRef<HTMLHeadingElement>(null);
  const fileHeading = useRef<HTMLHeadingElement>(null);
  const firstStep = useRef<HTMLButtonElement>(null);
  const selected = getFlowStep(astroFlow, astroFlow.steps[index]!.id, mode);
  const file = astroFlow.files.find((item) => item.id === fileId)!;

  function chooseStep(next: number, read = false) {
    setIndex(next);
    setFileId(astroFlow.steps[next]!.fileIds[0]!);
    setStatus(`Step ${next + 1} of ${astroFlow.steps.length}: ${astroFlow.steps[next]!.label}. ${astroFlow.steps[next]!.phase}.`);
    if (read) explanationHeading.current?.focus();
  }
  function chooseFile(id: string) {
    const nextFile = astroFlow.files.find((item) => item.id === id)!;
    setFileId(id);
    const next = astroFlow.steps.findIndex((step) => step.id === nextFile.preferredStep);
    setIndex(next);
    setStatus(`${nextFile.path} selected. Connected to step ${next + 1}: ${astroFlow.steps[next]!.label}.`);
  }
  function compare(next: PageMode) {
    setMode(next);
    setStatus(`${next === 'static' ? 'Static markup' : 'Interactive island'} comparison selected. The current step and file are preserved.`);
  }
  function sources(ids: string[]) {
    return <ul className="flow-sources">{ids.map((id) => {
      const source = astroFlow.sources.find((item) => item.id === id)!;
      return <li key={id}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}<span className="sr-only"> (opens in a new tab)</span></a><small>{source.section} · Checked {source.checkedAt}</small></li>;
    })}</ul>;
  }

  return <section id="astro-flow" className="page-flow" aria-labelledby="flow-heading">
    <div className="section-heading"><span className="step">03 / FOLLOW A PAGE · ASTRO</span><h2 id="flow-heading">Before the request.<br /><em>After the build.</em></h2><p>A small topic guide needs a readable home page. Follow its files into the browser, then compare what changes when the topic picker needs to respond.</p></div>
    <div className="flow-scope"><span className="badge">Original teaching model</span><p>Static Astro output. Source composition happens at build time; the host later delivers generated files. This is a source-backed illustration, not a running build or network trace.</p></div>

    <fieldset className="flow-mode"><legend>Compare the picker’s rendering choice</legend>
      <label><input type="radio" name="flow-mode" checked={mode === 'static'} onChange={() => compare('static')} /><span><strong>Static markup</strong><small>Useful content without hydrating this picker</small><code>{'<TopicPicker />'}</code></span></label>
      <label><input type="radio" name="flow-mode" checked={mode === 'interactive'} onChange={() => compare('interactive')} /><span><strong>Interactive island</strong><small>Add React behavior on page load</small><code>{'<TopicPicker client:load />'}</code></span></label>
    </fieldset>
    <p className="flow-mode-note">These original one-line examples show a use in the Astro page. React is configured in both comparisons. Other page scripts are outside this model; the choice does not switch this guide’s own JavaScript off.</p>

    <div className="flow-timeline" aria-label="Five-step page journey">
      {(['Build time', 'Request / browser time'] as const).map((phase) => <section className="flow-phase" key={phase} aria-label={phase}>
        <h3><span aria-hidden="true">{phase === 'Build time' ? '01' : '02'}</span>{phase}</h3>
        <p>{phase === 'Build time' ? 'Compose once, then publish the result.' : 'Serve the result, then use it in the browser.'}</p>
        <ol start={phase === 'Build time' ? 1 : 4}>{astroFlow.steps.map((step, stepPosition) => step.phase !== phase ? null : <li key={step.id}>
          <button ref={stepPosition === 0 ? firstStep : undefined} aria-current={index === stepPosition ? 'step' : undefined} aria-controls="flow-explanation" onClick={() => chooseStep(stepPosition)}>
            <span className="flow-number" aria-hidden="true">{stepPosition + 1}</span><span>{step.label}{index === stepPosition && <small>Current step</small>}</span>
          </button>
        </li>)}</ol>
      </section>)}
    </div>
    <p className="flow-legend">Read the build phase first, then the request / browser phase. These are processing and delivery relationships, not folder nesting. No automatic playback.</p>

    <section id="flow-explanation" className="flow-explanation" aria-labelledby="flow-step-heading">
      <div className="flow-step-meta"><span className="badge">{selected.phase}</span><span>Step {index + 1} of {astroFlow.steps.length} · {mode === 'static' ? 'Static markup' : 'Interactive island'}</span></div>
      <h3 id="flow-step-heading" ref={explanationHeading} tabIndex={-1}>{selected.view.title}</h3>
      <div className="flow-transformation"><div><small>INPUT</small><strong>{selected.view.input}</strong></div><span aria-hidden="true">→</span><div><small>RESULT</small><strong>{selected.view.output}</strong></div></div>
      <p className="flow-main-explanation">{selected.view.explanation}</p>
      <p className="flow-caveat"><strong>Keep the boundary clear.</strong> {selected.view.caveat}</p>
      <div className="actions flow-navigation"><button className="secondary" disabled={index === 0} onClick={() => chooseStep(stepIndex(astroFlow, index, -1), true)}>Previous step</button><button className="primary" disabled={index === astroFlow.steps.length - 1} onClick={() => chooseStep(stepIndex(astroFlow, index, 1), true)}>Next step</button><button className="text-button" onClick={() => {chooseStep(0); firstStep.current?.focus();}}>Back to the start</button></div>
      <details className="depth"><summary>Evidence for this step</summary><p>{astroFlow.verification}. App tests check this guide’s behavior; they do not reproduce the illustrated Astro fixture.</p>{sources(selected.sourceIds)}</details>
    </section>

    <div className="flow-files-header"><h3>Where does each file fit?</h3><p>Select a file to connect its role to the journey above. Source imports and browser requests are different relationships.</p></div>
    <div className="flow-file-workspace">
      <section className="flow-file-list" aria-label="Files in the Astro illustration">
        <p className="eyebrow">LINEAR FILE OUTLINE</p><p className="small">Six explained files. Generated output is labeled separately.</p>
        <ul>{astroFlow.files.map((item) => <li key={item.id}><button aria-label={`${item.path}. ${item.kind}${selected.fileIds.includes(item.id) ? ". Connected to this step" : ""}`} aria-pressed={fileId === item.id} aria-controls="flow-file-inspector" onClick={() => chooseFile(item.id)}><code><SourcePath path={item.path} /></code><span>{item.kind}{selected.fileIds.includes(item.id) ? ' · Connected to this step' : ''}</span></button></li>)}</ul>
        <button className="text-button" onClick={() => fileHeading.current?.focus()}>Read file explanation →</button>
        <button className="text-button" onClick={() => explanationHeading.current?.focus()}>Read connected step →</button>
      </section>
      <section className="flow-file-inspector" id="flow-file-inspector" aria-labelledby="flow-file-heading">
        <span className="badge neutral">{file.kind}</span><h3 id="flow-file-heading" ref={fileHeading} tabIndex={-1}><SourcePath path={file.path} /></h3><p className="flow-file-role">{file.role}</p>
        <span className="badge">{file.nameKind}</span><h4>Why this name and location?</h4><p>{file.naming}</p>
        <h4>What belongs here</h4><ul>{file.contents.map((item) => <li key={item}>{item}</li>)}</ul>
        <details className="depth" open><summary>Alternatives and boundaries</summary><p><strong>Another viable choice:</strong> {file.alternatives}</p><p><strong>Mechanism:</strong> {file.boundary}</p><p><strong>Cost:</strong> {file.tradeoff}</p></details>
        <details className="depth"><summary>When would this change?</summary><p>{file.evolution}</p></details>
        <details className="depth"><summary>File sources and scope</summary>{sources(file.sourceIds)}<p>{astroFlow.verification}.</p></details>
      </section>
    </div>
    <details className="depth flow-assumptions"><summary>Lesson assumptions and provenance</summary><ul>{astroFlow.assumptions.map((item) => <li key={item}>{item}</li>)}</ul><p>{astroFlow.reuse}.</p><p>Revision {astroFlow.version}. Checked 2026-10-13; source review due 2027-04-13. These living documentation references are not immutable snapshots.</p><p>This comparison has no persistence or project export. It preserves no files and does not change the Go workspace below. Reload returns to the static comparison’s first step.</p></details>
    <p className="live-status" role="status" aria-live="polite">{status}</p>
  </section>;
}
