const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright' : 'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1440,height:1000},geolocation:{latitude:11.8745,longitude:75.3704},permissions:['geolocation']});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));let requests=0;
 await page.route('https://overpass-api.de/**',route=>{requests++;return route.fulfill({json:{elements:[
 {type:'node',id:1,lat:11.875,lon:75.371,tags:{amenity:'hospital',name:'Test hospital',phone:'+91 497 123 4567','addr:street':'Test Road'}},
 {type:'node',id:2,lat:11.876,lon:75.372,tags:{amenity:'police',name:'Test police'}},
 {type:'node',id:3,lat:11.877,lon:75.373,tags:{amenity:'fire_station',name:'<img src=x onerror=alert(1)>',phone:'javascript:alert(1)'}}
 ]}})});
 await page.goto('http://localhost:3000');assert.equal(requests,0);
 await page.click('#emergency-now');await page.waitForSelector('.local-card');assert.equal(requests,1);assert.equal(await page.locator('.local-card').count(),3);
 assert.equal(await page.locator('.local-card img').count(),0);assert.equal(await page.locator('a[href^="tel:javascript"]').count(),0);
 assert.match(await page.locator('#nearby-status').innerText(),/3 mapped/);
 await page.selectOption('#nearby-type','police');assert.equal(await page.locator('.local-card').count(),1);assert.match(await page.locator('.local-card').innerText(),/Phone number not listed/);
 await page.fill('#helpline-search','1930');assert.equal(await page.locator('#helpline-results .contact-card').count(),1);
 await page.fill('#helpline-search','');await page.selectOption('#helpline-category','Disaster');assert.equal(await page.locator('#helpline-results .contact-card').count(),2);
 await page.selectOption('#helpline-category','All categories');await page.screenshot({path:require('node:os').tmpdir()+'/crisisconnect-desktop.png',fullPage:true});
 await page.setViewportSize({width:375,height:667});
 for(const route of ['home','emergency','shelters','report','safety','volunteer','sources']){await page.goto('http://localhost:3000/#'+route);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,route+' overflow')}
 await page.goto('http://localhost:3000/#emergency');await page.screenshot({path:require('node:os').tmpdir()+'/crisisconnect-mobile.png',fullPage:true});
 await page.unroute('https://overpass-api.de/**');await page.route('https://overpass-api.de/**',route=>route.abort());await page.click('#find-nearby');await page.waitForFunction(()=>document.querySelector('#nearby-status').textContent.includes('could not be completed'));assert.equal(await page.locator('#helpline-results .contact-card').count(),15);
 await page.unroute('https://overpass-api.de/**');await page.route('https://overpass-api.de/**',route=>route.fulfill({json:{elements:[]}}));await page.click('#find-nearby');await page.waitForFunction(()=>document.querySelector('#nearby-status').textContent.includes('No mapped services'));
 const denied=await browser.newContext();const deniedPage=await denied.newPage();await deniedPage.addInitScript(()=>{navigator.geolocation.getCurrentPosition=(success,error)=>error({code:1})});await deniedPage.goto('http://localhost:3000/#emergency');await deniedPage.click('#find-nearby');assert.match(await deniedPage.locator('#nearby-status').innerText(),/denied/);
 await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.quick-emergency').evaluate(e=>getComputedStyle(e).animationName),'none');
 assert.deepEqual(errors,[]);console.log('PASS: location success, denial, service failure, empty results, category filters, safe rendering, 7 mobile routes, reduced motion; no runtime errors. Nearby results used controlled fixtures.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
