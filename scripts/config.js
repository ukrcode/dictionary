import path from 'path';

export const sourceFolderPath = path.join(process.cwd(), 'source');

export const allSourceFilePaths = [
    path.join(sourceFolderPath, 'javascript.yml'),
    path.join(sourceFolderPath, 'css.yml'),
    path.join(sourceFolderPath, 'html.yml'),
    path.join(sourceFolderPath, 'tools', 'git.yml'),
    path.join(sourceFolderPath, 'tools', 'build-tools.yml'),
];