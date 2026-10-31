"""Pack the 3D hand for the app: dist/app/hand3d.js (+ h3-three.js). Data: arm mesh (binary, base64),
left-hand rig, skin textures (1024 px JPEG), and the solved pose of every chord position."""
import json, base64, io, os, struct, sys
from PIL import Image
import array
R = 'render'; OUT = sys.argv[1] if len(sys.argv) > 1 else 'dist/app'
b64 = lambda b: base64.b64encode(b).decode()
A = json.load(open(f'{R}/OBArms_Obj.002.json'))
arm = {'groups': A['groups'],
  'pos': b64(array.array('f', A['pos']).tobytes()), 'uv': b64(array.array('f', A['uv']).tobytes()),
  'idx': b64(array.array('H', A['idx']).tobytes()), 'si': b64(bytes(A['si'])),
  'sw': b64(bytes(max(0, min(255, round(w * 255))) for w in A['sw']))}
RIG = json.load(open(f'{R}/rig.json')); rig = {'L': RIG['L']}
def jpg(path, size, q):
    im = Image.open(path).convert('RGB'); im = im.resize((size, size), Image.LANCZOS); bio = io.BytesIO(); im.save(bio, 'JPEG', quality=q, optimize=True); return 'data:image/jpeg;base64,' + b64(bio.getvalue())
P = json.load(open(os.environ.get('POSES', f'{R}/out/poses_final.json')))
keys = sorted(P.keys()); vals = array.array('f'); ys = []; qs = []
keys = [k for k in keys if P[k]['worst'] <= 3.6]
for k in keys:
    vals.extend(P[k]['v']); ys.append(P[k]['yK']); qs.append(P[k]['worst'])
# the angle each pose is best seen from: computed by render/camfix.js, so a free finger never stands in the way
CAM = {}
_camf = f'{R}/out/cams.json'
if os.path.exists(_camf):
    _c = json.load(open(_camf))
    CAM = [[int(_c[k]['front']['yaw']), int(_c[k]['front']['pitch']), int(_c[k]['player']['yaw']), int(_c[k]['player']['pitch'])] if k in _c else [0, 0, 0, 0] for k in keys]
data = {'arm': arm, 'rig': rig, 'skin': jpg(f'{R}/skin.jpg', 1024, 82), 'skinN': jpg(f'{R}/skin_n.png', 1024, 88),
        'poseKeys': keys, 'poseVals': b64(vals.tobytes()), 'poseY': ys, 'poseQ': qs, 'poseCam': CAM}
src = open('src3d/hand3d.src.js').read().replace('/*@DATA@*/null', json.dumps(data, separators=(',', ':')))
os.makedirs(OUT, exist_ok=True)
open(f'{OUT}/hand3d.js', 'w').write(src)
open(f'{OUT}/h3-three.js', 'w').write(open('src3d/h3-three.js').read())
open(f'{OUT}/intro3d.js', 'w').write(open('src3d/intro3d.js').read())
print('hand3d', len(src) // 1024, 'KB ·', len(keys), 'poses')
