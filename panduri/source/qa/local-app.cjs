// Fulfil the build locally so a dev server cannot drop concurrent scripts.
const fs=require('node:fs'),path=require('node:path');
module.exports=async function localApp(page,dir){
  const root=path.resolve(dir);
  await page.route('http://panduri.test/**',async route=>{
    const pathname=decodeURIComponent(new URL(route.request().url()).pathname);
    const file=path.resolve(root,'.'+pathname+(pathname.endsWith('/')?'index.html':''));
    if(!file.startsWith(root+path.sep)||!fs.existsSync(file))return route.fulfill({status:404,body:'Not found'});
    await route.fulfill({path:file});
  });
};
