// Renders icon art from the real headstock SVG. Serve the repo root on :8768, then: node sami-simi/scripts/render-icons.cjs
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1024,height:1024}});
const shot=async(q,out,clear)=>{await p.goto('http://localhost:8768/sami-simi/scripts/icon-page.html?'+q);await p.waitForFunction(()=>window.done);await p.waitForTimeout(200);await p.locator('#wrap').screenshot({path:out,omitBackground:!!clear});};
await shot('vb=0%2014%20300%20300&h=900','/tmp/icon-full.png');
await shot('vb=0%2014%20300%20300&h=640&clear=1','/tmp/icon-fg.png',true);
await shot('vb=0%2014%20300%20300&h=560&clear=1','/tmp/icon-splash.png',true);
await b.close();})();
