// the self-contained lamejs bundle (the npm entry point of 1.2.1 is broken under Node: "MPEGMode is not defined")
const vm = require('vm'), fs = require('fs'), path = require('path');
const ctx = { console, Math, Int8Array, Int16Array, Int32Array, Float32Array, Float64Array, Uint8Array, Array, Object };
vm.createContext(ctx); vm.runInContext(fs.readFileSync(require.resolve('lamejs/lame.all.js'), 'utf8'), ctx);
module.exports = ctx.lamejs;
