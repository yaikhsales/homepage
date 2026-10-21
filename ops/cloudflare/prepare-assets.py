"""Run from yaikh-com AFTER the OpenNext build. Changes generated assets only."""
import json
import runpy
from pathlib import Path

root = Path('.open-next/assets/experience')
if not root.is_dir():
    raise SystemExit('Missing generated assets: run the OpenNext build first.')
manifest = json.loads((root / 'asset-manifest.json').read_text())
keep = {value.removeprefix('/experience/') for value in manifest['files'].values()}
keep.update({value + '.LICENSE.txt' for value in list(keep)})
for path in (root / 'static').rglob('*'):
    if path.is_file() and (path.suffix == '.map' or str(path.relative_to(root)) not in keep):
        path.unlink()
runpy.run_path(str(Path(__file__).with_name('optimize-media.py')), run_name='__main__')
print('Cloudflare generated assets prepared; repository originals unchanged.')
