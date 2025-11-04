import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  joinPathFragments,
  names,
  offsetFromRoot,
  readJson,
  Tree,
} from '@nx/devkit';

interface Schema {
  name: string;
  port: number;
}

function ensurePortIsAvailable(tree: Tree, port: number): void {
  if (!Number.isFinite(port)) {
    throw new Error('Port must be a valid number.');
  }

  const appsDir = 'apps';
  if (!tree.exists(appsDir)) {
    return;
  }

  for (const project of tree.children(appsDir)) {
    const projectJsonPath = joinPathFragments(appsDir, project, 'project.json');
    if (!tree.exists(projectJsonPath)) {
      continue;
    }

    const config = readJson<{
      targets?: {
        serve?: {
          options?: {
            port?: number;
          };
        };
      };
    }>(tree, projectJsonPath);

    const existingPort = config?.targets?.serve?.options?.port;
    if (existingPort === port) {
      throw new Error(
        `Port ${port} is already used by the "${project}" application.`,
      );
    }
  }
}

export default async function (tree: Tree, schema: Schema) {
  const projectNames = names(schema.name);
  const projectName = projectNames.fileName;
  const appsDir = 'apps';
  const projectRoot = joinPathFragments(appsDir, projectName);
  const projectJsonPath = joinPathFragments(projectRoot, 'project.json');
  const projectAlreadyExists =
    tree.exists(projectJsonPath) ||
    (tree.exists(appsDir) && tree.children(appsDir).includes(projectName));

  if (projectAlreadyExists) {
    throw new Error(
      `An application with the name "${projectName}" already exists.`,
    );
  }

  ensurePortIsAvailable(tree, schema.port);

  const componentClassName = `${projectNames.className}App`;
  const templateOptions = {
    tmpl: '',
    name: projectName,
    className: projectNames.className,
    componentClassName,
    port: schema.port,
    remoteName: projectName,
    offsetFromRoot: offsetFromRoot(projectRoot),
  };

  generateFiles(
    tree,
    joinPathFragments(__dirname, './files'),
    projectRoot,
    templateOptions,
  );

  const sourceRoot = joinPathFragments(projectRoot, 'src');

  addProjectConfiguration(
    tree,
    projectName,
    {
      name: projectName,
      root: projectRoot,
      sourceRoot,
      projectType: 'application',
      tags: ['layer:feature'],
      targets: {
        build: {
          executor: '@nx/webpack:webpack',
          options: {
            target: 'web',
            compiler: 'babel',
            outputPath: joinPathFragments('dist', 'apps', projectName),
            main: joinPathFragments(sourceRoot, 'main.tsx'),
            webpackConfig: joinPathFragments(projectRoot, 'webpack.config.js'),
            tsConfig: joinPathFragments(projectRoot, 'tsconfig.app.json'),
            assets: [joinPathFragments(sourceRoot, 'assets')],
          },
        },
        serve: {
          executor: '@nx/webpack:dev-server',
          options: {
            buildTarget: `${projectName}:build`,
            hmr: true,
            port: schema.port,
          },
        },
        lint: {
          executor: '@nx/eslint:lint',
          options: {
            lintFilePatterns: [
              joinPathFragments(projectRoot, '**/*.{ts,tsx,js,jsx}'),
            ],
          },
        },
      },
    },
    true,
  );

  await formatFiles(tree);
}
