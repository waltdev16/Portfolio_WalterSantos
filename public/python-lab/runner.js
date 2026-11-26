// Ejecuta los ejercicios de Python Development Lab en un Web Worker con Pyodide.
// 01. Carga diferida de Python en un hilo independiente (solo al pulsar Run).
let runtime;
let pendingInput;
let busy = false;
const send = (type, text = '') => self.postMessage({ type, text });
const adapter = `
import ast, inspect, sys
from pathlib import Path
from js import terminal_input

# Adapta input() a la terminal web sin bloquear el navegador.
class BrowserInput(ast.NodeTransformer):
    def __init__(self, tree):
        self.functions = {n.name for n in ast.walk(tree) if isinstance(n, ast.FunctionDef)}
    def visit_FunctionDef(self, node):
        node = self.generic_visit(node)
        return ast.copy_location(ast.AsyncFunctionDef(**{f: getattr(node, f) for f in node._fields}), node)
    def visit_Call(self, node):
        node = self.generic_visit(node)
        if isinstance(node.func, ast.Name):
            if node.func.id == 'input':
                node.func.id = '_browser_input'
                return ast.copy_location(ast.Await(value=node), node)
            if node.func.id in self.functions:
                return ast.copy_location(ast.Await(value=node), node)
        return node

async def _browser_input(prompt=''):
    return str(await terminal_input(str(prompt)))

async def run_exercise(path):
    path = Path(path)
    sys.path.insert(0, str(path.parent))
    sys.modules.pop('questions', None)
    try:
        tree = ast.parse(path.read_text(encoding='utf-8'), filename=str(path))
        tree = ast.fix_missing_locations(BrowserInput(tree).visit(tree))
        code = compile(tree, str(path), 'exec', flags=ast.PyCF_ALLOW_TOP_LEVEL_AWAIT)
        result = eval(code, {'__name__': '__main__', '__file__': str(path), '_browser_input': _browser_input})
        if inspect.isawaitable(result):
            await result
    finally:
        sys.path.pop(0)
`;
self.terminal_input = (prompt) => new Promise(resolve => {
  pendingInput = resolve;
  send('input', prompt);
});
self.onmessage = async ({data}) => {
  if (data.type === 'input') {
    if (pendingInput) { const resolve = pendingInput; pendingInput = undefined; resolve(data.value); }
    return;
  }
  if (data.type !== 'run' || busy) return;
  busy = true;
  try {
    if (!runtime) {
      send('status', 'Loading Python runtime…');
      importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js');
      runtime = await self.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/' });
      runtime.setStdout({ batched: line => send('output', line + '\n') });
      runtime.setStderr({ batched: line => send('output', line + '\n') });
      await runtime.runPythonAsync(adapter);
    }
    // 02. Archivos reales en el sistema virtual del navegador.
    for (const [path, source] of Object.entries(data.sources)) {
      const full = '/lab/' + path;
      runtime.FS.mkdirTree(full.slice(0, full.lastIndexOf('/')));
      runtime.FS.writeFile(full, source);
    }
    send('status', 'Running');
    runtime.globals.set('exercise_path', '/lab/' + data.path);
    await runtime.runPythonAsync('await run_exercise(exercise_path)');
    send('done', '\nProcess finished.\n');
  } catch (error) {
    send('error', String(error) + '\n');
  } finally { busy = false; pendingInput = undefined; }
};
