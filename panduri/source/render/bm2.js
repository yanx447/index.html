import { solver, unpack, toPose } from './solve.js';
const HS = window.HS, { V } = HS, S = 'L';
HS.hideArm('R');
const SV = solver(HS, S), N = SV.N;
const best = JSON.parse(localStorage.getItem('bm') || 'null');
