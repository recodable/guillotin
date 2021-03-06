const fss = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const svelte = require('svelte/compiler');
const autoPreprocess = require('svelte-preprocess');

main();

function fromDir(startPath, ext) {
  const result = [];
  if (!fss.existsSync(startPath)) {
    return result;
  }
  var files = fss.readdirSync(startPath);
  files.forEach((file) => {
    var filename = path.join(startPath, file);
    var stat = fss.lstatSync(filename);
    if (stat.isDirectory()) {
      result.push(...fromDir(filename, ext));
    } else if (path.extname(filename) == ext) {
      result.push(filename);
    }
  });
  return result;
}

async function main() {
  const cwd = process.cwd();
  const svelteFiles = await fromDir(cwd + '/src', '.svelte');
  const promises = svelteFiles.map((file) =>
    preprocessSvelte(
      //src
      file,
      //des
      file.replace('/src/', '/svelte/'),
    ),
  );

  await Promise.all(promises);
}

async function preprocessSvelte(src, dest) {
  const srcCode = await fsPromises.readFile(src, { encoding: 'utf-8' });
  const preprocess = autoPreprocess({
    sourceMap: false,
    typescript: {
      tsconfigFile: './tsconfig.json',
    },
    defaults: {
      script: 'typescript',
    },
  });
  let { code } = await svelte.preprocess(srcCode, preprocess, {
    filename: src,
  });
  // oups !
  code = code.replace('script lang="ts"', 'script');

  await fsPromises.writeFile(dest, code, { encoding: 'utf-8' });
}
