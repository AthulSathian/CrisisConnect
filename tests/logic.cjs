const vm=require('node:vm');const fs=require('node:fs');const assert=require('node:assert/strict');const path=require('node:path');
const elements={};const el=id=>elements[id]??=( {innerHTML:'',textContent:'',value:id==='#nearby-type'?'all':'',disabled:false,isConnected:true} );
let positionCallback,denied=false,responseData={elements:[]},networkFail=false;
const ctx=vm.createContext({console,Math,Number,String,Set,Array,URLSearchParams,AbortController,setTimeout,clearTimeout,
 document:{querySelector:el},window:{isSecureContext:true,addEventListener(){}},navigator:{geolocation:{getCurrentPosition(success,error){if(denied)error({code:1});else positionCallback=success}}},
 fetch:async()=>{if(networkFail)throw Error('network');return {ok:true,json:async()=>responseData}},escapeHTML:s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))});
vm.runInContext(fs.readFileSync(path.join(__dirname,'../emergency.js'),'utf8'),ctx);
(async()=>{
 assert.equal(vm.runInContext('HELPLINES.length',ctx),15);
 assert.equal(vm.runInContext('distanceKm(0,0,0,0)',ctx),0);
 denied=true;ctx.startNearbySearch();assert.match(el('#nearby-status').textContent,/denied/);assert.equal(el('#find-nearby').disabled,false);
 denied=false;networkFail=true;ctx.startNearbySearch();await positionCallback({coords:{latitude:11,longitude:75,accuracy:20}});assert.match(el('#nearby-status').textContent,/could not be completed/);
 networkFail=false;ctx.startNearbySearch();await positionCallback({coords:{latitude:11,longitude:75,accuracy:20}});assert.match(el('#nearby-status').textContent,/No mapped services/);
 responseData={elements:[{type:'node',id:1,lat:11.001,lon:75.001,tags:{amenity:'hospital',name:'<script>bad</script>',phone:'+91 12345 67890'}},{type:'way',id:2,center:{lat:11.002,lon:75.002},tags:{amenity:'police',name:'Station',phone:'javascript:alert(1)'}},{type:'node',id:3,lat:40,lon:75,tags:{amenity:'hospital'}}]};
 ctx.startNearbySearch();await positionCallback({coords:{latitude:11,longitude:75,accuracy:20}});assert.match(el('#nearby-status').textContent,/2 mapped services/);assert.match(el('#nearby-results').innerHTML,/&lt;script&gt;/);assert.ok(!el('#nearby-results').innerHTML.includes('javascript:'));assert.match(el('#nearby-results').innerHTML,/tel:\+911234567890/);
 el('#nearby-type').value='police';el('#nearby-type').onchange();assert.match(el('#nearby-status').textContent,/1 mapped/);assert.match(el('#nearby-results').innerHTML,/Phone number not listed/);
 ctx.startNearbySearch();const old=positionCallback;ctx.startNearbySearch();await old({coords:{latitude:11,longitude:75,accuracy:20}});assert.match(el('#nearby-status').textContent,/Waiting for location/);
 console.log('PASS: 15 helplines, distance, permission denial, network failure, empty results, valid/missing phone numbers, safe external text, filters and stale-location cancellation. Controlled Node fixtures; not a browser or live-provider test.');
})().catch(e=>{console.error(e);process.exitCode=1});
