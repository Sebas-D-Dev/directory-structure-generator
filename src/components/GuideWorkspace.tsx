import { useRef, useState } from 'react';
import { content } from '../content/foundation.ts';
import { projectSchema, type Capability, type Project, type StructureNode } from '../domain/contracts.ts';
import { compareVariants, exportProject, getVariant, initialProject, pathFor, supportsCapabilities } from '../domain/model.ts';

const capabilities: {id: Capability; name: string; definition: string; example: string; consequence: string; alternative: string}[] = [
  {id: 'website', name: 'Website', definition: 'Presents information for people to read.', example: 'A portfolio or public catalogue.', consequence: 'Pages, content, and assets often lead the structure.', alternative: 'A single page may be enough.'},
  {id: 'web-app', name: 'Web application', definition: 'Helps people complete tasks through a browser.', example: 'A staff editing interface.', consequence: 'Interaction and state introduce responsibilities beyond pages.', alternative: 'Do not add a separate API just because a page is interactive.'},
  {id: 'api', name: 'Backend API', definition: 'Offers operations or data to other software.', example: 'A service used by a mobile app.', consequence: 'Requests, validation, and behavior need clear responsibilities.', alternative: 'A single app may meet the need without an independent service.'},
  {id: 'library', name: 'Library', definition: 'Provides code another program can import.', example: 'Shared photo-naming functions.', consequence: 'Public APIs, packaging, and compatibility matter.', alternative: 'An internal function may be enough if no other program needs it.'},
  {id: 'cli', name: 'Command-line tool', definition: 'Runs a task through terminal commands.', example: 'A local photo-renaming tool.', consequence: 'Separate arguments from behavior when it makes testing or reuse easier.', alternative: 'A tiny command can begin with one source file.'},
  {id: 'pipeline', name: 'Data pipeline', definition: 'Moves or transforms data through a series of steps.', example: 'Clean CSV files and create a report.', consequence: 'Distinguish maintained transformations from generated outputs.', alternative: 'A small script may be enough; distributed orchestration is not assumed.'},
];
const labels: Record<string, string> = {
  'tool-rule': 'Tool rule', 'configured': 'Configured location', 'convention': 'Convention',
  'author-choice': 'Author choice', 'maintainer-advice': 'Maintainer guidance',
  'design-judgment': 'Design judgment', 'configured-behavior': 'Configured behavior',
};

export default function GuideWorkspace() {
  const [project, setProject] = useState<Project>(initialProject);
  const [selection, setSelection] = useState('entry');
  const [linear, setLinear] = useState(false);
  const [preview, setPreview] = useState<Project['variantId'] | null>(null);
  const [previous, setPrevious] = useState<Project['variantId'] | null>(null);
  const [status, setStatus] = useState('Explore the default CLI example, or change the capabilities above.');
  const optionHeading = useRef<HTMLHeadingElement>(null);
  const previewTrigger = useRef<HTMLButtonElement>(null);
  const inspectorHeading = useRef<HTMLHeadingElement>(null);
  const variant = getVariant(content, project.variantId);
  const selected = variant.nodes.find((node) => node.id === selection) ?? variant.nodes[0]!;
  const fits = supportsCapabilities(project.capabilities, project.uncertain);
  const target = preview ? getVariant(content, preview) : null;
  const changes = target ? compareVariants(variant, target) : [];

  function toggleCapability(id: Capability) {
    setProject((current) => ({...current, capabilityOrigin: 'learner-selection', capabilities: current.capabilities.includes(id)
      ? current.capabilities.filter((item) => item !== id) : [...current.capabilities, id]}));
    setStatus('Capabilities updated. The authored example stays intact.');
  }
  function chooseNode(node: StructureNode) {
    setSelection(node.id);
    setStatus(`Selected ${node.name}. Its explanation follows the outline.`);
  }
  function applyOption(id: Project['variantId']) {
    const next = getVariant(content, id);
    setPrevious(project.variantId);
    setProject((current) => ({...current, variantId: id}));
    if (!next.nodes.some((node) => node.id === selection)) setSelection('entry');
    setPreview(null);
    setStatus(`Now showing: ${next.title}. You can undo this option change.`);
    optionHeading.current?.focus();
  }
  function undo() {
    if (!previous) return;
    const prior = getVariant(content, previous);
    setProject((current) => ({...current, variantId: previous}));
    if (!prior.nodes.some((node) => node.id === selection)) setSelection('entry');
    setPrevious(null);
    setPreview(null);
    setStatus('Restored the previous layout option.');
    optionHeading.current?.focus();
  }
  function download(format: 'text' | 'json') {
    try {
      const output = exportProject(project, content);
      const blob = new Blob([output[format]], {type: format === 'json' ? 'application/json;charset=utf-8' : 'text/plain;charset=utf-8'});
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `repository-guide-${project.variantId}.${format === 'json' ? 'json' : 'txt'}`;
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus('Export prepared. This is an explanatory record; restore is not available in this foundation.');
    } catch {
      setStatus('Export could not be prepared. Your current selection is still here; try again.');
    }
  }
  function nodeButton(node: StructureNode) {
    return <button className="node-button" aria-pressed={selected.id === node.id} aria-controls="inspector" onClick={() => chooseNode(node)}>
      <span aria-hidden="true" className="node-symbol">{node.kind === 'directory' ? '▱' : '·'}</span>
      <span>{linear ? pathFor(variant, node.id) : node.name + (node.kind === 'directory' ? '/' : '')}</span>
      {selected.id === node.id && <span className="selected-word">selected</span>}
    </button>;
  }
  function nested(id: string) {
    return <ul className="outline-list">{variant.nodes.filter((node) => node.parentId === id).map((node) =>
      <li key={node.id}>{node.kind === 'directory'
        ? <details open><summary>{node.name}/ <span className="muted">folder</span></summary>{nodeButton(node)}{nested(node.id)}</details>
        : nodeButton(node)}</li>)}</ul>;
  }

  return <>
    <section className="discovery" id="project-types" aria-labelledby="types-heading">
      <div className="section-heading"><span className="step">01 / PURPOSE</span><h2 id="types-heading">What are you trying to make?</h2><p>Start with what the project does. Capabilities can overlap; checking two boxes doesn’t mean you need two packages.</p></div>
      <fieldset className="capability-fieldset"><legend>Explore project capabilities</legend>
        <div className="capabilities">{capabilities.map((type) => <label className="capability" key={type.id}>
          <span className="capability-title"><input type="checkbox" checked={project.capabilities.includes(type.id)} onChange={() => toggleCapability(type.id)} /><strong>{type.name}</strong></span>
          <span>{type.definition}</span><small>For example: {type.example}</small>
        </label>)}</div>
        <label className="uncertain"><input type="checkbox" checked={project.uncertain} onChange={(event) => setProject((current) => ({...current, capabilityOrigin: 'learner-selection', uncertain: event.target.checked}))} />I’m not sure yet</label>
      </fieldset>
      {project.capabilities.length > 0 && <div className="capability-notes">{capabilities.filter((type) => project.capabilities.includes(type.id)).map((type) => <p key={type.id}><strong>{type.name}:</strong> {type.consequence} <span className="muted">{type.alternative}</span></p>)}</div>}
      {!fits && <div className="notice" role="status"><strong>This combination doesn’t have an authored lesson yet.</strong> You can still explore the CLI example below. It is a nearby learning example, not a generated design for your project.</div>}
    </section>

    <section className="lesson" id="lesson" aria-labelledby="lesson-heading">
      <div className="section-heading"><span className="step">02 / EXPLORE A REASON</span><h2 id="lesson-heading">{content.lesson.title}</h2><p>{content.lesson.purpose}</p></div>
      <div className="scenario-card">
        <div><span className="eyebrow">AUTHORED EXAMPLE · GO CLI</span><h3>Photo renamer</h3><p>{content.lesson.prerequisites}</p><p className="scope-note">{content.lesson.applicability}</p></div>
        <div><h4>Example assumptions</h4><ul>{content.lesson.assumptions.map((item) => <li key={item}>{item}</li>)}</ul><details><summary>What’s still unknown?</summary><ul>{content.lesson.unknowns.map((item) => <li key={item}>{item}</li>)}</ul></details></div>
      </div>
      <div className="workspace-toolbar"><div><span className="eyebrow">CURRENT OPTION</span><h3 ref={optionHeading} tabIndex={-1}>{variant.title}</h3></div><button className="secondary" onClick={() => setLinear(!linear)}>{linear ? 'Use nested outline' : 'Use linear outline'}</button></div>
      <div className="workspace">
        <section className="tree-panel" aria-labelledby="outline-heading">
          <div className="panel-heading"><h3 id="outline-heading">The structure</h3><span>{variant.nodes.length} explained nodes</span></div>
          <p className="small muted">Use Tab to reach any node. Folder disclosures work with Enter or Space.</p>
          {linear ? <ul className="outline-list linear">{variant.nodes.map((node) => <li key={node.id}>{nodeButton(node)}</li>)}</ul> : <>{nodeButton(variant.nodes[0]!)}{nested(variant.rootNodeId)}</>}
          <button className="text-button" onClick={() => inspectorHeading.current?.focus()}>Read selected explanation →</button>
        </section>
        <section id="inspector" className="inspector" aria-labelledby="inspector-heading">
          <span className="eyebrow">WHY THIS EXISTS</span><h3 id="inspector-heading" ref={inspectorHeading} tabIndex={-1}>{selected.name}</h3>
          <p className="path">{pathFor(variant, selected.id)}</p><p className="inspector-summary">{selected.explanation.summary}</p>
          <div className="rules"><div><span className="badge">{labels[selected.explanation.nameKind]}</span><h4>Why this name?</h4><p>{selected.explanation.nameRule}</p></div><div><span className="badge neutral">{labels[selected.explanation.locationKind]}</span><h4>Why this location?</h4><p>{selected.explanation.locationRule}</p></div></div>
          <h4>What belongs here</h4><ul>{selected.explanation.contents.map((item) => <li key={item}>{item}</li>)}</ul>
          <details className="depth" open><summary>Alternatives and tradeoffs</summary><p>{selected.explanation.alternatives}</p><p><strong>Boundary:</strong> {selected.explanation.boundary}</p><p><strong>Cost:</strong> {selected.explanation.tradeoff}</p><p><strong>When simpler is enough:</strong> {selected.explanation.counterexample}</p></details>
          <details className="depth"><summary>What would make this change?</summary><p>{selected.explanation.evolution}</p></details>
          <details className="depth evidence"><summary>Evidence and source scope</summary><p className="small">Source-reviewed draft. The Go experiment is planned and unrun; app tests do not verify Go behavior.</p>
            {selected.explanation.claimIds.map((id) => {
              const claim = content.claims.find((item) => item.id === id)!;
              return <div className="claim" key={id}><span className="eyebrow">{labels[claim.provenance]}</span><p>{claim.statement}</p><p className="small muted">{claim.scope}</p><ul>{claim.sourceIds.map((sourceId) => {
                const source = content.sources.find((item) => item.id === sourceId)!;
                return <li key={sourceId}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title} ↗<span className="sr-only"> (opens in a new tab)</span></a></li>;
              })}</ul><small>Checked {claim.checkedAt} · {claim.verification.replaceAll('-', ' ')}</small></div>;
            })}
          </details>
        </section>
      </div>
    </section>

    <section className="comparison" id="compare" aria-labelledby="compare-heading">
      <div className="section-heading"><span className="step">03 / COMPARE THE COST</span><h2 id="compare-heading">Two options. The same small command.</h2><p>Extra folders are a choice with consequences. Preview the difference before changing your learning model.</p></div>
      <div className="option-grid">{content.variants.map((option, index) => <article className="option-card" key={option.id}>
        <span className="option-number">0{index + 1}</span><h3>{option.title}</h3><p>{option.summary}</p><p><strong>Useful when:</strong> {option.fit}</p><p><strong>The cost:</strong> {option.cost}</p>
        <button className="secondary" disabled={project.variantId === option.id} onClick={(event) => {previewTrigger.current = event.currentTarget; setPreview(projectSchema.shape.variantId.parse(option.id));}}>{project.variantId === option.id ? 'Current option' : 'Preview this option'}</button>
      </article>)}</div>
      {target && <section className="change-preview" aria-labelledby="preview-heading"><h3 id="preview-heading">Preview: {target.title}</h3><ul className="diff-list">{changes.map((change) => <li key={change.id}><strong>{change.kind === 'moved' ? 'Move' : change.kind === 'added' ? 'Add' : 'Remove'}</strong> {change.from && <span>{change.from}</span>}{change.from && change.to && ' → '}{change.to && <span>{change.to}</span>}</li>)}</ul><p>This switches an explanatory tree only. Real code changes also require package declarations, imports, call sites, and build/run paths to be updated. It does not create a second service.</p><div className="actions"><button className="primary" onClick={() => preview && applyOption(preview)}>Use this option</button><button className="secondary" onClick={() => {setPreview(null); previewTrigger.current?.focus();}}>Cancel preview</button></div></section>}
      <button className="text-button" disabled={!previous} onClick={undo}>Undo last option change</button>
      <div className="thought"><span className="eyebrow">A REQUIREMENT WORTH ASKING ABOUT</span><h3>What if another program needs the naming logic?</h3><p>A second command inside this module can use an internal package. An outside program needs a public API decision. The folder move alone does not answer that question.</p><p className="small">This checkpoint provides option comparison and undo. A full requirement-change workflow is still planned.</p></div>
    </section>

    <section className="export-section" aria-labelledby="export-heading"><div><span className="step">04 / TAKE THE REASONING WITH YOU</span><h2 id="export-heading">Keep a readable record</h2><p>Export the tree, explanations, assumptions, and sources. These are plans for learning, not runnable scaffolds.</p><p className="small">Memory-only foundation: selections are lost on reload. JSON export is a versioned record; restoring it and saving automatically are not available yet.</p></div><div className="actions"><button className="primary" onClick={() => download('text')}>Export tree + rationale</button><button className="secondary" onClick={() => download('json')}>Export JSON record</button></div></section>
    <p className="live-status" role="status" aria-live="polite">{status}</p>
  </>;
}
