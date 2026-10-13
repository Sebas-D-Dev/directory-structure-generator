import type { ContentBundle, StructureNode } from '../domain/contracts.ts';

const checkedAt = '2026-10-13';
const reviewAfter = '2027-04-13';
const review = { checkedAt, reviewer: 'Initial source review; independent lesson approval pending' };
const root: StructureNode = {
  id: 'root', parentId: null, name: 'photo-renamer', kind: 'directory', origin: 'source',
  explanation: {
    summary: 'The working folder for a small command that plans photo filename changes.',
    nameKind: 'author-choice', locationKind: 'author-choice',
    nameRule: 'photo-renamer is the example’s name, not a Go keyword.',
    locationRule: 'Keep the files for this example together. Its checkout location is your choice.',
    contents: ['go.mod describes the module.', 'Go source and a short README explain the command.'],
    alternatives: 'Choose a name that describes your own tool; update any documented paths.',
    boundary: 'This folder groups maintained files. A folder name alone does not define a deployment boundary.',
    tradeoff: 'One repository is easy to navigate; it does not by itself control every dependency.',
    counterexample: 'A temporary one-file exercise may not need a dedicated repository yet.',
    evolution: 'Revisit the organization when a second consumer needs the behavior, not merely because the tree looks small.',
    claimIds: ['small-first'],
  },
};
const moduleFile: StructureNode = {
  id: 'module', parentId: 'root', name: 'go.mod', kind: 'file', origin: 'configuration',
  explanation: {
    summary: 'Declares this Go module’s identity and toolchain requirements.',
    nameKind: 'tool-rule', locationKind: 'tool-rule',
    nameRule: 'go.mod is the module file recognized by Go tooling.',
    locationRule: 'Place it at the root of the module in this module-aware example.',
    contents: ['module example.com/photo-renamer', 'A go directive for the selected Go toolchain.'],
    alternatives: 'Another module means another go.mod and a real dependency decision; it is not a cosmetic folder move.',
    boundary: 'Defines a module and its module path; it does not create a separate running service.',
    tradeoff: 'One module keeps dependency configuration together. Independent module releases introduce more coordination.',
    counterexample: 'A quick standalone source-file exercise can be simpler than a distributable module.',
    evolution: 'Change the module path only with corresponding import and distribution updates.',
    claimIds: ['module-file'],
  },
};
const main: StructureNode = {
  id: 'entry', parentId: 'root', name: 'main.go', kind: 'file', origin: 'source',
  explanation: {
    summary: 'Turns terminal arguments into a call to the photo-renaming behavior.',
    nameKind: 'convention', locationKind: 'author-choice',
    nameRule: 'main.go is a familiar filename. The executable uses package main and func main; the filename itself is not compulsory.',
    locationRule: 'The small option keeps the command in the module root.',
    contents: ['Parse the folder and naming pattern.', 'Report planned changes and handle command exit behavior.'],
    alternatives: 'cli.go could serve the same role. In the separated option the entry point moves into cmd/rename.',
    boundary: 'The terminal adapter is a responsibility. Separating it from logic is a design choice, not automatic isolation.',
    tradeoff: 'Keeping the entry point short can simplify focused tests; a tiny command may need no extra layer.',
    counterexample: 'A five-line terminal utility can reasonably live in a single source file.',
    evolution: 'When another program needs the logic, move that logic into an importable package and update calls.',
    claimIds: ['main-convention', 'small-first'],
  },
};
const logic: StructureNode = {
  id: 'logic', parentId: 'root', name: 'rename.go', kind: 'file', origin: 'source',
  explanation: {
    summary: 'Holds the naming rules so the command can explain and test them independently of argument parsing.',
    nameKind: 'author-choice', locationKind: 'author-choice',
    nameRule: 'rename.go describes the responsibility. Other ordinary .go filenames can work.',
    locationRule: 'Here it shares the root command package with main.go.',
    contents: ['Build a proposed old-name to new-name mapping.', 'Reject collisions before any real rename is attempted.'],
    alternatives: 'For a tiny command, keep this logic in main.go. For reuse inside this module, consider the internal package option.',
    boundary: 'A separate file is still the same package here. Moving a file alone does not make a public library.',
    tradeoff: 'A focused file can aid navigation; too many tiny files can hide a simple flow.',
    counterexample: 'One straightforward operation may be clearer in the entry-point file.',
    evolution: 'An importable package requires a package declaration and call-site changes as well as a new path.',
    claimIds: ['package-directory', 'small-first'],
  },
};
const test: StructureNode = {
  id: 'tests', parentId: 'root', name: 'rename_test.go', kind: 'file', origin: 'source',
  explanation: {
    summary: 'Records examples of the naming behavior that should continue to work.',
    nameKind: 'tool-rule', locationKind: 'author-choice',
    nameRule: 'The _test.go suffix marks a Go test file; rename is the chosen descriptive prefix.',
    locationRule: 'This example colocates the test with the code it exercises.',
    contents: ['A collision case with two photos proposing the same name.', 'A predictable date-prefix naming case.'],
    alternatives: 'Other descriptive prefixes work. Go also permits an external test package; that choice changes what tests can access.',
    boundary: 'Tests exercise behavior. Their presence does not prove all filesystem operations are safe.',
    tradeoff: 'Small examples are readable; real file operations also need temporary-directory and error-case coverage.',
    counterexample: 'Do not invent a tests folder solely because other languages use one.',
    evolution: 'Move these tests with the extracted package and update their package declaration when required.',
    claimIds: ['test-suffix', 'small-first'],
  },
};
const readme: StructureNode = {
  id: 'readme', parentId: 'root', name: 'README.md', kind: 'file', origin: 'documentation',
  explanation: {
    summary: 'Explains how a person should use the command and what it does not promise.',
    nameKind: 'convention', locationKind: 'author-choice',
    nameRule: 'README.md is this lesson’s documentation convention, not a Go build requirement.',
    locationRule: 'The root makes the introduction easy to find next to the module configuration.',
    contents: ['Usage and a dry-run example.', 'Limitations, backup advice, and contribution instructions.'],
    alternatives: 'A tiny private experiment may use a short text note. A longer guide can live in docs with a link here.',
    boundary: 'Documentation communicates a contract to readers; it does not enforce file-handling behavior.',
    tradeoff: 'Examples help people start, but they must stay aligned with the actual command.',
    counterexample: 'Several empty documentation folders are less useful than one accurate introduction.',
    evolution: 'Update usage paths if the command moves and document any new consumer-facing API.',
    claimIds: ['small-first'],
  },
};
const internal: StructureNode = {
  id: 'internal', parentId: 'root', name: 'internal', kind: 'directory', origin: 'source',
  explanation: {
    summary: 'Places supporting packages under Go’s internal-import restriction.',
    nameKind: 'tool-rule', locationKind: 'author-choice',
    nameRule: 'The spelling internal activates a Go import rule; private or helpers would not have the same effect.',
    locationRule: 'At this module root, its parent establishes the allowed import-path prefix. Nested internal directories narrow that scope.',
    contents: ['rename/ contains naming behavior used by this command.', 'Future supporting packages belong here only when there is a concrete need.'],
    alternatives: 'Keep the command flat, or expose an ordinary importable package if external consumers genuinely need a supported API.',
    boundary: 'For this module-aware example, Go limits imports to code sharing the import path above internal. This is not runtime isolation.',
    tradeoff: 'It avoids promising this package as an external API, at the cost of deliberately excluding outside consumers.',
    counterexample: 'An intended public library must place its public API somewhere external consumers may import.',
    evolution: 'External reuse needs a public package and an API compatibility decision, not just another command folder.',
    claimIds: ['internal-rule', 'small-first'],
  },
};
const shared: StructureNode = {
  id: 'rename-package', parentId: 'internal', name: 'rename', kind: 'directory', origin: 'source',
  explanation: {
    summary: 'A package for naming behavior that this module’s commands can import.',
    nameKind: 'author-choice', locationKind: 'author-choice',
    nameRule: 'rename describes this package. The directory contributes to its import path.',
    locationRule: 'This example chooses internal/rename so the package is intentionally not a public API.',
    contents: ['rename.go contains naming functions.', 'rename_test.go covers those functions.'],
    alternatives: 'Keep behavior in the command package until reuse or testing friction justifies extraction.',
    boundary: 'A different directory makes a separate package here; the internal ancestor constrains who can import it.',
    tradeoff: 'Explicit functions make the calling contract clearer but introduce imports and API decisions.',
    counterexample: 'One very short function may not repay the extra navigation.',
    evolution: 'A second command in this module can import the package; a consumer outside the allowed scope cannot.',
    claimIds: ['package-directory', 'internal-rule', 'small-first'],
  },
};
const commands: StructureNode = {
  id: 'commands', parentId: 'root', name: 'cmd', kind: 'directory', origin: 'source',
  explanation: {
    summary: 'Groups the command entry points in the separated option.',
    nameKind: 'convention', locationKind: 'author-choice',
    nameRule: 'cmd is a documented Go community convention, not a mandatory directory name.',
    locationRule: 'The lesson places it at the root to keep commands easy to find.',
    contents: ['rename/ contains the current executable entry point.', 'A second command directory could be added when a second executable is actually needed.'],
    alternatives: 'A root command or a top-level rename directory can work; update documented build and install paths.',
    boundary: 'The grouping does not create a service or independent deployment.',
    tradeoff: 'It leaves room for multiple commands, but adds needless depth for many single-command tools.',
    counterexample: 'The flat option is often enough when there is only one small executable.',
    evolution: 'Add another command only for an actual second interface, and decide how it shares behavior.',
    claimIds: ['cmd-convention', 'small-first'],
  },
};
const command: StructureNode = {
  id: 'rename-command', parentId: 'commands', name: 'rename', kind: 'directory', origin: 'source',
  explanation: {
    summary: 'Contains the separated executable’s main package.',
    nameKind: 'author-choice', locationKind: 'author-choice',
    nameRule: 'rename is the chosen command directory name; it contributes to the command’s package path.',
    locationRule: 'This option follows the cmd grouping convention.',
    contents: ['main.go adapts terminal arguments to package calls.', 'Command-specific tests can cover argument and output behavior.'],
    alternatives: 'Use a root command for the flat option. Moving it changes build and installation paths.',
    boundary: 'This is a command package importing internal/rename, within the same module.',
    tradeoff: 'The command shell is easy to distinguish, at the cost of another level of directories.',
    counterexample: 'A second directory does not help if it merely forwards one trivial function.',
    evolution: 'A second executable needs its own main package. Shared logic can remain in the internal package.',
    claimIds: ['cmd-convention', 'internal-rule'],
  },
};
const separatedMain: StructureNode = { ...main, parentId: 'rename-command', explanation: {
  ...main.explanation, locationRule: 'This option moves the entry point into cmd/rename, a chosen convention.',
  boundary: 'It declares package main and imports the example.com/photo-renamer/internal/rename package.',
  evolution: 'Update build/run paths to ./cmd/rename and keep command parsing out of reusable package functions.',
  claimIds: ['main-convention', 'cmd-convention', 'internal-rule'],
}};
const separatedLogic: StructureNode = { ...logic, parentId: 'rename-package', explanation: {
  ...logic.explanation, locationRule: 'This option places it in internal/rename with package rename.',
  boundary: 'It is now part of an importable supporting package within internal’s allowed scope.',
  alternatives: 'Return to the flat command when reuse is unnecessary; publish a separate public API only when justified.',
  evolution: 'Another command in the module can call exported functions; outside consumers need a different public API location.',
  claimIds: ['package-directory', 'internal-rule', 'small-first'],
}};
const separatedTest: StructureNode = { ...test, parentId: 'rename-package', explanation: {
  ...test.explanation, locationRule: 'The test moves beside the extracted package and must use an appropriate package declaration.',
}};

export const content = {
  schemaVersion: 1, contentVersion: '2026.10-foundation.1', status: 'source-reviewed-draft', createdAt: checkedAt,
  sources: [
    { id: 'go-layout', title: 'Organizing a Go module', publisher: 'The Go Authors', url: 'https://go.dev/doc/modules/layout', section: 'Basic command; multiple commands; packages and commands', version: 'Living documentation reviewed 2026-10-13', checkedAt, reviewAfter },
    { id: 'go-internal', title: 'Go command: internal packages', publisher: 'The Go Authors', url: 'https://pkg.go.dev/cmd/go@go1.27.2#hdr-Internal_packages', section: 'Internal packages', version: 'Go 1.27.2 command documentation; runtime experiment unrun', checkedAt, reviewAfter },
    { id: 'go-module', title: 'Go modules reference', publisher: 'The Go Authors', url: 'https://go.dev/ref/mod#go-mod-file', section: 'go.mod files', version: 'Living documentation reviewed 2026-10-13', checkedAt, reviewAfter },
    { id: 'go-tests', title: 'Add a test', publisher: 'The Go Authors', url: 'https://go.dev/doc/tutorial/add-a-test', section: 'Test filename, function and package conventions', version: 'Living documentation reviewed 2026-10-13', checkedAt, reviewAfter },
  ],
  claims: [
    {id: 'main-convention', statement: 'A command uses package main with func main. Naming its source file main.go is a convention.', provenance: 'maintainer-advice', scope: 'The basic Go command example; no build-tag variations taught here.', sourceIds: ['go-layout'], ...review, verification: 'source-reviewed'},
    {id: 'cmd-convention', statement: 'Grouping executable packages under cmd is a common organization choice, not a required name.', provenance: 'maintainer-advice', scope: 'Go module organization with one or more commands.', sourceIds: ['go-layout'], ...review, verification: 'source-reviewed'},
    {id: 'package-directory', statement: 'The examples place each Go package in its own directory; splitting a package into files does not create separate packages.', provenance: 'maintainer-advice', scope: 'The ordinary Go module layouts shown in the official guide.', sourceIds: ['go-layout'], ...review, verification: 'source-reviewed'},
    {id: 'internal-rule', statement: 'In module-aware mode, an internal package can be imported only by code sharing the import-path prefix above internal.', provenance: 'tool-rule', scope: 'Go 1.27.2 command documentation; this example has internal at the module root. No claim of runtime isolation.', sourceIds: ['go-internal'], ...review, verification: 'source-reviewed'},
    {id: 'module-file', statement: 'A module is defined by go.mod at its root; its module directive declares the module path.', provenance: 'tool-rule', scope: 'Module-aware Go; a single-module example without a workspace.', sourceIds: ['go-module'], ...review, verification: 'source-reviewed'},
    {id: 'test-suffix', statement: 'Go recognizes test source files with the _test.go suffix; example tests use the testing package.', provenance: 'tool-rule', scope: 'Standard Go testing conventions in the official tutorial.', sourceIds: ['go-tests'], ...review, verification: 'source-reviewed'},
    {id: 'small-first', statement: 'For this single-command example, begin flat and add a package only when a concrete reuse or testing need repays the extra paths.', provenance: 'design-judgment', scope: 'A proposed teaching choice for a small local photo-renaming tool, not a universal ranking.', sourceIds: [], ...review, verification: 'reasoned-proposal'},
  ],
  lesson: {
    id: 'go-photo-cli', title: 'A small command, with room to change',
    purpose: 'Plan a local tool that proposes clearer photo filenames before making changes.',
    audience: 'A learner who knows what files and folders are and is starting to read small codebases.',
    prerequisites: 'No Go experience is needed to explore the tree. This is an explanatory plan, not executable code.',
    assumptions: ['One person runs one local terminal command.', 'One Go module; no server or database.', 'The command should preview intended changes before touching photos.'],
    unknowns: ['Actual photo formats, collision handling, and platform behavior still need design and tests.', 'Whether another command or an external program will need this behavior.'],
    applicability: 'This lesson covers a small CLI and optional reuse inside the same Go module. It does not yet design a public library, website, API, or pipeline.',
    counterexample: 'If another project must import a supported public API, internal/rename is not the public API location.',
    experiment: {id: 'exp-go-boundaries', status: 'planned-unrun', hypothesis: 'The documented internal import restriction differs from the optional cmd directory convention.', protocol: ['Pin a Go toolchain and record its checksum and environment.', 'Build paired flat and separated fixtures; rename cmd and update command paths.', 'Check both an allowed internal importer and an outside importer, recording exits and logs.', 'Have an independent reviewer reproduce the result before marking it observed.']},
    variantIds: ['flat-command', 'internal-package'],
  },
  variants: [
    {id: 'flat-command', revision: 1, title: 'Keep the command together', summary: 'A small, flat starting point.', fit: 'One command with a few focused responsibilities.', cost: 'Reusable behavior still belongs to the command package.', rootNodeId: 'root', nodes: [root, moduleFile, main, logic, test, readme]},
    {id: 'internal-package', revision: 1, title: 'Separate the reusable behavior', summary: 'A command plus a supporting package.', fit: 'A concrete need to reuse or test behavior apart from the terminal adapter.', cost: 'More paths, imports, package declarations, and command-location updates.', rootNodeId: 'root', nodes: [root, moduleFile, commands, command, separatedMain, internal, shared, separatedLogic, separatedTest, readme]},
  ],
} satisfies ContentBundle;
