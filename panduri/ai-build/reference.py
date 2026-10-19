#!/usr/bin/env python3
"""Reference separation of test.wav with the original PyTorch path (no random shift), to check the browser engine against."""
import sys, numpy as np, soundfile as sf, torch
from demucs.pretrained import get_model
from demucs.apply import apply_model
x, sr = sf.read(sys.argv[1], dtype='float32'); assert sr == 44100
mix = torch.from_numpy(x.T.copy())[None]
NAME = sys.argv[3] if len(sys.argv) > 3 else 'htdemucs'
model = get_model(NAME); model.eval()
with torch.no_grad(): out = apply_model(model, mix, shifts=0, split=True, overlap=0.25)[0].numpy()
for k, name in enumerate(model.sources): sf.write(sys.argv[2] + '/ref-' + name + '.wav', out[k].T, 44100, subtype='FLOAT')
print('sources', model.sources, out.shape)
