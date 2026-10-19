#!/usr/bin/env python3
"""Pack the Demucs (htdemucs) ONNX model for the browser.
graph.onnx  – the network (weights kept outside, in htdemucs.data)
part-NNN.bin – the weights, float32 stored as float16 (half the download), split into <45 MB parts
manifest.json – where every tensor lives, so the browser can rebuild htdemucs.data exactly."""
import sys, os, json, numpy as np, onnx
src, out = sys.argv[1], sys.argv[2]
SUB = sys.argv[3] if len(sys.argv) > 3 else 'model'
NAME = sys.argv[4] if len(sys.argv) > 4 else 'htdemucs'
SOURCES = sys.argv[5].split(',') if len(sys.argv) > 5 else ['drums', 'bass', 'other', 'vocals']
os.makedirs(out + '/' + SUB, exist_ok=True)
m = onnx.load(src)
os.makedirs('/tmp/pk', exist_ok=True)
onnx.save_model(m, '/tmp/pk/graph.onnx', save_as_external_data=True, all_tensors_to_one_file=True, location='htdemucs.data', size_threshold=0)
data = open('/tmp/pk/htdemucs.data', 'rb').read()
g = onnx.load('/tmp/pk/graph.onnx', load_external_data=False)
ents, blob, pos = [], bytearray(), 0
for t in g.graph.initializer:
    if t.data_location != onnx.TensorProto.EXTERNAL: continue
    kv = {e.key: e.value for e in t.external_data}; off, ln = int(kv.get('offset', 0)), int(kv['length'])
    raw = data[off:off + ln]
    if t.data_type == onnx.TensorProto.FLOAT:
        h = np.frombuffer(raw, dtype=np.float32).astype(np.float16).tobytes(); ents.append([off, ln, len(blob), len(h), 1]); blob += h
    else:
        ents.append([off, ln, len(blob), ln, 0]); blob += raw
    while len(blob) % 8: blob += b'\0'
open(out + '/' + SUB + '/graph.onnx', 'wb').write(open('/tmp/pk/graph.onnx', 'rb').read())
PART = 45 * 1024 * 1024; parts = []
for i in range(0, len(blob), PART):
    n = 'part-%03d.bin' % len(parts); open(out + '/' + SUB + '/' + n, 'wb').write(blob[i:i + PART]); parts.append(n)
sess_in = [i.name for i in g.graph.input]; sess_out = [o.name for o in g.graph.output]
json.dump({'model': NAME, 'sources': SOURCES, 'sr': 44100, 'segment': 343980, 'dataSize': len(data), 'blobSize': len(blob), 'parts': parts, 'tensors': ents, 'inputs': sess_in, 'outputs': sess_out,
           'license': 'Demucs weights © Meta Platforms, MIT License; ONNX export via sevagh/demucs.onnx (MIT)'}, open(out + '/' + SUB + '/manifest.json', 'w'))
print('data', len(data), 'blob', len(blob), 'parts', parts, 'inputs', sess_in, 'outputs', sess_out)
