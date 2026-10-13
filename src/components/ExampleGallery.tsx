import { useRef, useState } from 'react';
import { catalog } from '../content/examples.ts';
import { filterExamples, languages, projectTypes } from '../domain/learning.ts';

export default function ExampleGallery() {
  const [language, setLanguage] = useState('All');
  const [projectType, setProjectType] = useState('All');
  const languageControl = useRef<HTMLSelectElement>(null);
  const matches = filterExamples(catalog.examples, language, projectType);
  // Show the broader collection before the already available deep Go lesson.
  const ordered = [...matches].sort((a, b) => Number(a.language === 'Go') - Number(b.language === 'Go'));
  const reset = () => {setLanguage('All'); setProjectType('All'); languageControl.current?.focus();};
  return <section id="examples" className="example-gallery" aria-labelledby="examples-heading">
    <div className="section-heading"><span className="step">02 / LOOK ACROSS PROJECTS</span><h2 id="examples-heading">Different jobs.<br /><em>Different reasons.</em></h2><p>Five small, original teaching illustrations. Three languages, five project types. Start with the purpose, then follow one naming decision.</p></div>
    <div className="catalog-legend"><span className="badge">Original illustrations</span><span>Not copied template trees or production repositories. Framework names identify the tools, not an endorsement.</span></div>
    <div className="filter-bar">
      <label><span id="language-filter-label">Language</span><select aria-labelledby="language-filter-label" ref={languageControl} value={language} onChange={(event) => setLanguage(event.target.value)}><option value="All">All languages ({filterExamples(catalog.examples, 'All', projectType).length})</option>{languages.map((item) => <option key={item} value={item}>{item} ({filterExamples(catalog.examples, item, projectType).length})</option>)}</select></label>
      <label><span id="type-filter-label">Project type</span><select aria-labelledby="type-filter-label" value={projectType} onChange={(event) => setProjectType(event.target.value)}><option value="All">All project types ({filterExamples(catalog.examples, language, 'All').length})</option>{projectTypes.map((item) => <option key={item} value={item}>{item} ({filterExamples(catalog.examples, language, item).length})</option>)}</select></label>
      <button className="secondary" onClick={reset} disabled={language === 'All' && projectType === 'All'}>Clear filters</button>
    </div>
    <p className="filter-count" role="status" aria-live="polite">{matches.length} of {catalog.examples.length} examples · {language === 'All' ? 'All languages' : language} · {projectType === 'All' ? 'All project types' : projectType}</p>
    {matches.length === 0 ? <div className="empty-results"><h3>No example matches both filters</h3><p>{language} + {projectType} isn’t in this small collection yet. Change either filter, or clear both to explore all five.</p><button className="primary" onClick={reset}>Show all examples</button></div> : <div className="example-grid">{ordered.map((example) => <article className="example-card" key={example.id}>
      <div className="example-meta"><span>{example.language}</span><span>{example.projectType}</span></div><h3>{example.title}</h3><p>{example.purpose}</p>
      <pre className="mini-tree" tabIndex={0} role="region" aria-label={`${example.title} illustrative structure`}>{example.tree.join('\n')}</pre><p className="tree-scroll-hint">Scroll sideways if needed. Focus the tree to scroll with arrow keys.</p>
      {example.id === 'astro-web' && <a className="text-button" href="#astro-flow">Follow this page into the browser →</a>}
      <div className="naming-note"><span className="badge neutral">{example.nameKind}</span><h4>{example.name}</h4><p>{example.reason}</p></div>
      <details className="depth"><summary>Consequences and sources</summary><h4>If this changes</h4><p>{example.consequence}</p><h4>When to grow the structure</h4><p>{example.tradeoff}</p><p className="small"><strong>{example.origin}.</strong> {example.status}. The card is a starting sketch, not a complete lesson.</p>
        <ul className="card-sources">{example.sourceIds.map((id) => {const source = catalog.sources.find((item) => item.id === id)!; return <li key={id}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}<span className="sr-only"> (opens in a new tab)</span></a><small>{source.publisher} · Checked {source.checkedAt}</small></li>;})}</ul>
        <div className="related-source"><span className="eyebrow">RELATED {example.reference.kind.toUpperCase()} · LINK ONLY</span><a href={example.reference.url} target="_blank" rel="noopener noreferrer">{example.reference.title}<span className="sr-only"> (opens in a new tab)</span></a><p>This external example/template is separate from our illustration. It is not presented as a production application.</p></div>
        <details className="reuse-record"><summary>Specific-use provenance record</summary><dl><dt>What we used</dt><dd>{example.reference.reuse.material}. Documentation was referenced for factual behavior; tree and explanations were independently written.</dd><dt>Reference location</dt><dd>{example.reference.reuse.sourcePath}</dd><dt>Revision</dt><dd>{example.reference.reuse.revision}</dd><dt>Reuse decision</dt><dd>{example.reference.reuse.licenseDecision}</dd><dt>Notices</dt><dd>{example.reference.reuse.notices}. Original teaching content is covered by this repository’s MIT license.</dd><dt>Review</dt><dd>{example.reference.reuse.reviewer} · {example.reference.reuse.checkedAt}. Review again if material or intended use changes.</dd></dl></details>
      </details>
    </article>)}</div>}
    <p className="small muted">A template is a starting scaffold. A real-world repository is a maintained project in its own context. Neither is evidence of one universally correct layout. This collection currently includes original illustrations and links to examples/templates; no production-repository case study is claimed.</p>
  </section>;
}
