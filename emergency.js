/* Official directory snapshot: 7 October 2026. Nearby records are OSM, not official contacts. */
const HELPLINE_SOURCE = 'https://www.india.gov.in/directory/helpline';
const HELPLINES = [
 ['112','All emergencies','Police, fire, rescue and medical help','Emergency'],
 ['100','Police','Police helpline','Emergency'],
 ['101','Fire & rescue','Fire helpline','Emergency'],
 ['102','Ambulance','National Ambulance Service','Emergency'],
 ['1073','Road accidents','Road accident helpline','Emergency'],
 ['1906','LPG gas leak','LPG leak helpline','Emergency'],
 ['1070','Natural disasters','Relief Commissioner for natural calamities','Disaster'],
 ['01124363260','NDRF','Earthquake, flood and disaster contact','Disaster'],
 ['1930','Cybercrime','Cybercrime helpline','Support'],
 ['181','Women’s support','Women and domestic violence helpline','Support'],
 ['1098','Child protection','Child helpline','Support'],
 ['14567','Senior citizens','Senior citizens helpline','Support'],
 ['14456','Disability support','Persons with disabilities helpline','Support'],
 ['139','Railway assistance','Railway security and medical assistance','Support'],
 ['1933','Narcotics helpline','MANAS helpline','Support']
];
let nearbyController;
let nearbyGeneration = 0;
function renderEmergency(container){
 container.innerHTML = head('The right help. Within reach.','Call an emergency helpline or look for nearby hospitals, police and fire stations.') + `
 <section class="emergency-hero"><div><span class="hero-label">INDIA · EMERGENCY RESPONSE</span><h2>One number.<br>Help when it matters.</h2><p>Police, fire, rescue and medical assistance.</p><a class="button hero-call" href="tel:112">☎ Call 112 <span>↗</span></a><p class="hero-note">Opens your dialler. No automatic call or dispatch.</p></div><div class="number-art" aria-hidden="true">112<span>EMERGENCY HELPLINE</span></div></section>
 <section class="panel nearby-panel" aria-labelledby="nearby-title"><div class="section-heading"><div><div class="eyebrow">Find local services</div><h2 id="nearby-title">Emergency help near you</h2></div><span class="pill">WITH YOUR PERMISSION</span></div>
 <p>Find mapped hospitals, police stations, fire stations and ambulance stations within 10 km. Published phone numbers appear when available.</p>
 <p class="hint">Your browser asks for location permission. A rounded position is shared with the public Overpass service; this app does not save it. Listings are community-maintained, may be incomplete, and are not verified emergency providers.</p>
 <div class="nearby-controls"><button id="find-nearby" class="button primary">⌖ Use my location & find help</button><label for="nearby-type" class="sr-only">Service type</label><select id="nearby-type"><option value="all">All nearby services</option><option value="hospital">Hospitals</option><option value="police">Police stations</option><option value="fire_station">Fire stations</option><option value="ambulance_station">Ambulance stations</option></select></div>
 <p id="nearby-status" role="status" aria-live="polite">Location has not been requested. India helplines below are available now.</p><div id="nearby-location"></div><div id="nearby-results" class="contacts-grid"></div>
 <details class="manual-search"><summary>No location access? Search by town</summary><form id="town-search"><label for="town">Town, district or postcode in India</label><div class="nearby-controls"><input id="town" required maxlength="120" placeholder="e.g. Kannur, Kerala"><button class="button" type="submit">Search maps ↗</button></div><p class="hint">Opens Google Maps in a new tab. Results and phone numbers are provided by Google.</p></form></details>
 <p class="hint">Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a> (ODbL). Distances are approximate straight-line distances, not travel distances. Call to confirm service availability. For immediate danger in India, call 112.</p></section>
 <section aria-labelledby="directory-title"><div class="section-heading directory-heading"><div><div class="eyebrow">Keep these close</div><h2 id="directory-title">India helpline directory</h2><p>Government-listed numbers. No location needed.</p></div><a class="text-link" href="${HELPLINE_SOURCE}" target="_blank" rel="noopener noreferrer">Official source ↗</a></div><div class="directory-tools"><label class="sr-only" for="helpline-search">Search helplines</label><input id="helpline-search" type="search" placeholder="Search police, ambulance, women…"><label class="sr-only" for="helpline-category">Helpline category</label><select id="helpline-category"><option>All categories</option><option>Emergency</option><option>Disaster</option><option>Support</option></select></div><p id="helpline-count" class="hint" role="status"></p><div id="helpline-results" class="contacts-grid"></div><p class="source-note">Selected emergency and support numbers checked against the <a href="${HELPLINE_SOURCE}" target="_blank" rel="noopener noreferrer">National Portal of India</a> on 7 October 2026. Coverage and routing of specialist numbers can vary by area. These are helplines, not nearby facility phone numbers.</p></section>`;
 const filter=()=>{
  const query=document.querySelector('#helpline-search').value.toLowerCase().trim();
  const category=document.querySelector('#helpline-category').value;
  const rows=HELPLINES.filter(row=>row.join(' ').toLowerCase().includes(query)&&(category==='All categories'||row[3]===category));
  document.querySelector('#helpline-count').textContent=`${rows.length} helplines`;
  document.querySelector('#helpline-results').innerHTML=rows.length?rows.map(([number,title,description,category])=>`<article class="contact-card category-${category.toLowerCase()}"><span class="pill">${category}</span><h3>${title}</h3><p>${description}</p><a class="contact-number" href="tel:${number}" aria-label="Call ${title}, ${number}">${number==='01124363260'?'011-24363260':number}<span>☎ Tap to call</span></a></article>`).join(''):'<p>No matching helplines. Try another word or category. For an emergency, call 112.</p>';
 };
 document.querySelector('#helpline-search').oninput=filter;document.querySelector('#helpline-category').onchange=filter;filter();
 document.querySelector('#find-nearby').onclick=startNearbySearch;
 document.querySelector('#town-search').onsubmit=e=>{e.preventDefault();const town=document.querySelector('#town');if(!town.value.trim()){town.setCustomValidity('Enter a town or district.');town.reportValidity();return}const type=document.querySelector('#nearby-type').value;const term=type==='all'?'hospitals police fire stations':type.replaceAll('_',' ');window.open('https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(`${term} near ${town.value.trim()}, India`),'_blank','noopener,noreferrer')};
 document.querySelector('#town').oninput=e=>e.target.setCustomValidity('');
}
function distanceKm(a,b,c,d){const r=Math.PI/180;const h=Math.sin((c-a)*r/2)**2+Math.cos(a*r)*Math.cos(c*r)*Math.sin((d-b)*r/2)**2;return 6371*2*Math.asin(Math.sqrt(Math.min(1,h)))}
function normalizeFacilities(elements,lat,lon){
 const seen=new Set();return elements.flatMap(e=>{
  const t=e.tags||{},x=Number(e.lat??e.center?.lat),y=Number(e.lon??e.center?.lon);
  const type=t.amenity==='hospital'||t.healthcare==='hospital'?'hospital':t.amenity==='police'?'police':t.amenity==='fire_station'?'fire_station':t.emergency==='ambulance_station'?'ambulance_station':null;
  if(!type||!Number.isFinite(x)||!Number.isFinite(y)||Math.abs(x)>90||Math.abs(y)>180||!['node','way','relation'].includes(e.type)||!Number.isSafeInteger(e.id))return [];
  const name=t.name||t['name:en']||({hospital:'Hospital',police:'Police station',fire_station:'Fire station',ambulance_station:'Ambulance station'}[type]);
  const key=`${name.toLowerCase()}-${x.toFixed(3)}-${y.toFixed(3)}`;if(seen.has(key))return [];seen.add(key);
  const phones=String(t['contact:phone']||t.phone||'').split(/[;,]/).map(p=>p.trim()).filter(p=>/^\+?[\d ()-]{5,25}$/.test(p)&&p.replace(/\D/g,'').length>=5);
  return [{name,type,lat:x,lon:y,phones,address:[t['addr:housenumber'],t['addr:street'],t['addr:suburb'],t['addr:city'],t['addr:postcode']].filter(Boolean).join(', '),distance:distanceKm(lat,lon,x,y),source:`https://www.openstreetmap.org/${e.type}/${e.id}`}];
 }).filter(x=>x.distance<=10.2).sort((a,b)=>a.distance-b.distance);
}
function startNearbySearch(){
 const status=document.querySelector('#nearby-status');if(!status)return;
 const generation=++nearbyGeneration;if(nearbyController)nearbyController.abort();
 const button=document.querySelector('#find-nearby'),results=document.querySelector('#nearby-results'),locationBox=document.querySelector('#nearby-location'),select=document.querySelector('#nearby-type');
 results.innerHTML='';locationBox.innerHTML='';select.onchange=null;
 const current=()=>generation===nearbyGeneration&&status.isConnected;
 const fail=message=>{if(!current())return;status.textContent=message;button.disabled=false;button.textContent='⌖ Try location search again'};
 if(!navigator.geolocation){fail('Location is unavailable in this browser. Use the town search or India helplines below.');return}
 if(!window.isSecureContext){fail('Location needs HTTPS or localhost. Use the town search or India helplines below.');return}
 button.disabled=true;status.textContent='Waiting for location permission… You can call 112 without waiting.';
 navigator.geolocation.getCurrentPosition(async position=>{
  if(!current())return;
  const lat=position.coords.latitude,lon=position.coords.longitude;
  if(!Number.isFinite(lat)||!Number.isFinite(lon)){fail('The browser returned an invalid location. Search by town or use the helplines.');return}
  locationBox.innerHTML=`<div class="location-chip">⌖ ${lat.toFixed(4)}, ${lon.toFixed(4)} · accuracy ±${Math.round(position.coords.accuracy)} m</div><p class="hint">Tell responders your address and a nearby landmark too. ${position.coords.accuracy>1000?'Location accuracy is low; nearby results may not match your actual position.':''}</p>`;
  status.textContent='Searching mapped services within 10 km… National helplines are ready below.';
  const query=`[out:json][timeout:20];(nwr[amenity~"^(hospital|police|fire_station)$"](around:10000,${lat.toFixed(3)},${lon.toFixed(3)});nwr[emergency=ambulance_station](around:10000,${lat.toFixed(3)},${lon.toFixed(3)});nwr[healthcare=hospital](around:10000,${lat.toFixed(3)},${lon.toFixed(3)}););out center tags;`;
  nearbyController=new AbortController();const timer=setTimeout(()=>nearbyController?.abort(),25000);
  try{
   const response=await fetch('https://overpass-api.de/api/interpreter',{method:'POST',body:new URLSearchParams({data:query}),signal:nearbyController.signal});
   if(!response.ok)throw new Error('lookup');const data=await response.json();if(!Array.isArray(data.elements)||data.remark)throw new Error('incomplete');
   if(!current())return;const facilities=normalizeFacilities(data.elements,lat,lon);
   const render=()=>{const items=facilities.filter(x=>select.value==='all'||x.type===select.value);
    status.textContent=items.length?`${items.length} mapped services found within 10 km. Phone numbers are shown only when published; listings are not independently verified.`:'No mapped services found for this selection. This does not mean there are no services nearby. Use town search or call an appropriate helpline.';
    results.innerHTML=items.map(x=>`<article class="contact-card local-card"><span class="pill">${escapeHTML(x.type.replaceAll('_',' '))}</span><h3>${escapeHTML(x.name)}</h3><p>${x.distance.toFixed(1)} km · approximate straight-line distance</p><p>${escapeHTML(x.address||'Street address not listed')}</p>${x.phones.length?x.phones.map(phone=>`<a class="button" href="tel:${phone.replace(/[^+\d]/g,'')}">☎ Call ${escapeHTML(phone)}</a>`).join(' '):'<p class="missing-phone">Phone number not listed</p>'}<div class="facility-links"><a href="https://www.google.com/maps/dir/?api=1&destination=${x.lat},${x.lon}" target="_blank" rel="noopener noreferrer">Directions ↗</a><a href="${x.source}" target="_blank" rel="noopener noreferrer">Map listing ↗</a></div><p class="hint">Community listing · Confirm before travelling. Emergency care and opening hours are not confirmed.</p></article>`).join('');
   };select.onchange=render;render();button.disabled=false;button.textContent='⌖ Refresh nearby search';
  }catch(error){fail('Nearby search could not be completed. The map service may be unavailable. Try again, search by town, or use the India helplines below.')}finally{clearTimeout(timer)}
 },error=>fail(error.code===1?'Location permission was denied. You can search by town or use the India helplines below.':'Your location could not be determined. Try again or search by town; India helplines are available below.'),{enableHighAccuracy:true,timeout:12000,maximumAge:60000});
}
window.addEventListener('hashchange',()=>{nearbyGeneration++;nearbyController?.abort()});
