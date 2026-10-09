import { createProjectGraphAsync } from '@nx/devkit';

import { requiredTagErrors, validateProjectBoundary } from './project-boundary-rules.mjs';

const graph = await createProjectGraphAsync();
const errors = [];

for (const node of Object.values(graph.nodes)) {
  if (!node.data.root.startsWith('apps/') && !node.data.root.startsWith('libs/')) continue;
  for (const error of requiredTagErrors({ name: node.name, tags: node.data.tags })) {
    errors.push(`${node.name}: ${error}`);
  }
}

for (const [sourceName, dependencies] of Object.entries(graph.dependencies)) {
  const sourceNode = graph.nodes[sourceName];
  if (!sourceNode) continue;

  for (const dependency of dependencies) {
    if (dependency.type !== 'static') continue;
    const targetNode = graph.nodes[dependency.target];
    if (!targetNode) continue;
    const error = validateProjectBoundary(
      { name: sourceName, tags: sourceNode.data.tags },
      { name: dependency.target, tags: targetNode.data.tags },
    );
    if (error) errors.push(error);
  }
}

if (errors.length > 0) {
  console.error('Project boundary violations:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Project boundary check passed for ${Object.keys(graph.nodes).length} projects.`);
