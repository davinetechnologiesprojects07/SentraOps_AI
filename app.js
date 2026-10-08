const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const toast=(msg)=>{const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)};

const services=[
["Authentication Service","Production","Platform / Core","v2.4.1","Healthy","Successful","34 sec ago"],
["User Service","Production","Platform / Core","v3.1.0","Healthy","Successful","42 sec ago"],
["Order Service","Production","Commerce","v5.3.2","Healthy","Successful","51 sec ago"],
["Payment Service","Production","Payments","v4.2.2","Warning","Successful","18 sec ago"],
["Notification Service","Production","Messaging","v2.8.0","Healthy","Successful","1 min ago"],
["API Gateway","Production","Platform / Edge","v5.0.1","Critical","Running","12 sec ago"],
["Database Service","Production","Data Platform","PostgreSQL 16","Healthy","Healthy","22 sec ago"],
["Frontend Service","Production","Web Experience","v8.1.3","Healthy","Successful","1 min ago"]
];
const incidents=[
["INC-1048","API Gateway elevated error rate","API Gateway","SEV-1","Investigating","A. Trigune","12 min ago"],
["INC-1047","Payment service latency spike","Payment Service","SEV-2","Mitigating","S. Pawar","26 min ago"],
["INC-1044","Notification queue backlog","Notification Service","SEV-3","Assigned","P. Nale","48 min ago"],
["INC-1043","User service 5xx responses","User Service","SEV-3","Resolved","A. Trigune","1h 14m ago"],
["INC-1041","Checkout dependency timeout","Order Service","SEV-2","Resolved","R. Joshi","2h ago"],
["INC-1039","Authentication token refresh","Authentication Service","SEV-4","Closed","S. Khan","3h ago"]
];
const logs=[
["10:22:15.021Z","ERROR","api-gateway","upstream connection reset by peer","REQ-1048","TRC-7A91"],
["10:22:01.884Z","ERROR","checkout-service","timeout after 5000ms","REQ-1048","TRC-7A91"],
["10:21:44.203Z","ERROR","api-gateway","upstream connection reset by peer","REQ-1048","TRC-7A91"],
["10:21:31.445Z","WARN","api-gateway","retry budget exhausted","REQ-1047","TRC-7A91"],
["10:20:58.002Z","INFO","payment-service","deployment v4.2.2 completed","REQ-0000","TRC-7A80"],
["10:20:12.702Z","INFO","auth-service","health check passed","REQ-0000","TRC-7A72"],
["10:19:48.110Z","WARN","payment-service","connection pool at 82%","REQ-1046","TRC-7A68"],
["10:18:32.904Z","DEBUG","order-service","cache lookup completed","REQ-1045","TRC-7A55"],
["10:17:15.331Z","CRITICAL","api-gateway","5xx error rate exceeded 8%","REQ-1048","TRC-7A42"]
];

function renderTables(){
  $("#servicesTable").innerHTML=services.map((s,i)=>`<tr><td><b>${s[0]}</b></td><td>${s[1]}</td><td>${s[2]}</td><td>${s[3]}</td><td><span class="health ${s[4].toLowerCase()}">${s[4]}</span></td><td>${s[5]}</td><td>${s[6]}</td></tr>`).join("");
  renderIncidents();
}
function renderIncidents(data=incidents){
 $("#incidentsTable").innerHTML=data.map((x,i)=>`<tr><td><b>${x[0]}</b><br><span class="table-link">${x[1]}</span></td><td>${x[2]}</td><td><span class="severity ${x[3]==="SEV-1"?"sev1":x[3]==="SEV-2"?"sev2":"sev3"}">${x[3]}</span></td><td><span class="health ${x[4]==="Resolved"||x[4]==="Closed"?"healthy":x[4]==="Investigating"?"critical":x[4]==="Mitigating"?"warning":"neutral"}">${x[4]}</span></td><td>${x[5]}</td><td>${x[6]}</td><td><button class="link-btn" onclick="openIncident('${x[0]}')">Open →</button></td></tr>`).join("");
}
function openIncident(id){toast(`${id} opened — investigation workspace ready`);go("ai")}

function renderLogs(){
 const q=($("#logSearch")?.value||"").toLowerCase(), level=$("#logLevel")?.value||"All levels";
 const data=logs.filter(l=>(level==="All levels"||l[1]===level)&&l.join(" ").toLowerCase().includes(q));
 $("#logConsole").innerHTML=data.map(l=>`<div class="log-line"><span>${l[0]}</span><span class="log-level log-${l[1].toLowerCase()}">${l[1]}</span><span>${l[2]}</span><span>${l[3]} <span style="color:#66758d">[${l[4]} · ${l[5]}]</span></span></div>`).join("")||'<div style="padding:20px;color:#718096">No logs match your filters.</div>';
}
function renderAlerts(){
 const a=[["CPU Usage > 90%","API Gateway","95.4%","SEV-1","2 min ago","Critical"],["Memory Usage > 85%","Payment Service","88.1%","SEV-2","8 min ago","Warning"],["Error Rate > 5%","API Gateway","8.4%","SEV-1","12 min ago","Critical"],["Response Time > 2s","Payment Service","2.84s","SEV-2","19 min ago","Warning"],["Pod CrashLoopBackOff","checkout-service","3 restarts","SEV-2","28 min ago","Critical"],["Container Restarted","notification-service","2 restarts","SEV-3","41 min ago","Warning"]];
 $("#alertCards").innerHTML=a.map(x=>`<div class="alert-card"><div class="alert-line"><span class="severity ${x[3]==="SEV-1"?"sev1":x[3]==="SEV-2"?"sev2":"sev3"}">${x[3]}</span><span class="health ${x[5].toLowerCase()}">${x[5]}</span></div><h3>${x[0]}</h3><p>${x[1]}</p><strong class="alert-value">${x[2]}</strong><div class="alert-meta"><span>Triggered ${x[4]}</span><span>● Active</span></div></div>`).join("");
}
function renderDeployments(){
 const d=[["payment-service","v4.2.2","Production","Successful","a91f3c2","Canary","4 min ago"],["frontend-service","v8.1.3","Production","Successful","f29bd81","Rolling","21 min ago"],["api-gateway","v5.0.1","Production","Running","8bd7e21","Blue-Green","35 min ago"],["checkout-service","v3.7.0","Staging","Failed","7fa83bc","Rolling","1h ago"]];
 $("#deploymentsList").innerHTML=d.map(x=>`<div class="deploy-card"><div class="deploy-icon">⇧</div><div><b>${x[0]}</b><small>${x[1]} · commit ${x[4]}</small></div><div><small>Environment</small><b>${x[2]}</b></div><div><small>Strategy</small><b>${x[5]}</b></div><div class="deploy-status"><span class="health ${x[3]==="Successful"?"healthy":x[3]==="Failed"?"critical":"warning"}">${x[3]}</span><small>${x[6]}</small></div></div>`).join("");
}
function renderAudit(){
 const a=[["A. Trigune","AI Analysis Requested","INC-1048","10:27:14","source=incident"],["S. Pawar","Incident Updated","INC-1047","10:24:03","status=mitigating"],["A. Trigune","Deployment Triggered","payment-service","10:20:10","version=v4.2.2"],["P. Nale","Incident Assigned","INC-1044","10:13:47","team=messaging"],["Admin","Configuration Changed","workspace","09:52:11","ai_severity=true"],["S. Khan","User Login","authentication","09:41:02","ip=demo.local"]];
 $("#auditTable").innerHTML=a.map(x=>`<tr><td><b>${x[0]}</b></td><td>${x[1]}</td><td>${x[2]}</td><td>${x[3]}</td><td><code>${x[4]}</code></td></tr>`).join("");
}
function renderPeople(){
 const p=[["AT","Atharv Trigune","DevOps Engineer","Platform / Core"],["SP","Sahil Pawar","SRE / Operations Engineer","Reliability"],["PN","Prem Nale","Developer","Commerce"],["UJ","Ulhas Narawade","Admin","Platform"],["PP","Prathmesh Pawar","DevOps Engineer","Platform / Core"],["RK","Riya Kulkarni","Developer","Payments"]];
 $("#peopleGrid").innerHTML=p.map(x=>`<div class="person"><div class="avatar">${x[0]}</div><div><b>${x[1]}</b><small>${x[3]}</small><span class="role">${x[2]}</span></div></div>`).join("");
}
function renderHealth(){
 const h=[["API Service","Operational","99.99%"],["PostgreSQL Database","Operational","99.98%"],["Authentication","Operational","100%"],["AI Engine","Operational","99.94%"],["Prometheus Metrics","Operational","99.99%"],["Logging / ELK","Operational","99.97%"]];
 $("#healthGrid").innerHTML=h.map(x=>`<div class="health-card"><h3>${x[0]}</h3><div class="h-row"><span>Status</span><b class="ok">● ${x[1]}</b></div><div class="h-row" style="margin-top:9px"><span>Availability</span><b>${x[2]}</b></div></div>`).join("");
}

function go(page){
 $$(".page").forEach(p=>p.classList.remove("active")); $(`#page-${page}`).classList.add("active");
 $$(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.page===page));
 const labels={dashboard:"Dashboard",services:"Services",incidents:"Incidents",alerts:"Alerts",logs:"Logs",monitoring:"Monitoring",ai:"AI Operations",analytics:"Analytics",deployments:"Deployments",audit:"Audit Logs",users:"Users & Teams",health:"System Health",settings:"Settings"};
 $("#pageTitle").textContent=labels[page]||page;
 if(page==="monitoring") drawPerformance();
 if(page==="dashboard") drawIncident();
 window.scrollTo({top:0,behavior:"smooth"});
}
$$("[data-page]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.page)));
$("#logSearch").addEventListener("input",renderLogs);$("#logLevel").addEventListener("change",renderLogs);

function drawChart(canvasId, vals, stroke){
 const c=document.getElementById(canvasId);if(!c)return;const ctx=c.getContext("2d"),w=c.clientWidth||600,h=c.clientHeight||220,dpr=devicePixelRatio||1;c.width=w*dpr;c.height=h*dpr;ctx.scale(dpr,dpr);ctx.clearRect(0,0,w,h);
 ctx.strokeStyle="#edf0f5";ctx.lineWidth=1;for(let y=25;y<h-20;y+=42){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}
 const max=Math.max(...vals),min=Math.min(...vals),step=w/(vals.length-1);ctx.beginPath();vals.forEach((v,i)=>{const x=i*step,y=20+(h-45)*(1-(v-min)/(max-min||1));i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.strokeStyle=stroke;ctx.lineWidth=2.5;ctx.stroke();
 ctx.lineTo(w,h-20);ctx.lineTo(0,h-20);ctx.closePath();ctx.fillStyle=stroke+"15";ctx.fill();
}
function drawIncident(){drawChart("incidentChart",[12,18,15,24,20,29,23,31,26,34,28,36,30,27,24,29,25,22,26,21,19,23,18,21,17,20,16,19,14,16],"#655bdd")}
function drawPerformance(){drawChart("performanceChart",[30,44,37,52,49,61,55,68,64,72,66,81,76,73,84,78,88,83,91,86,94],"#4e88dc")}

$("#analyzeBtn").addEventListener("click",()=>{
 const result=$("#aiResult");result.innerHTML=`<div class="ai-result-content"><div class="result-header"><div class="ai-orb" style="width:40px;height:40px;font-size:16px;margin:0">✦</div><div><h3 style="margin:0">Analysis complete</h3><span class="panel-sub">INC-1048 · API Gateway · Production</span></div><span class="result-badge">AI ASSISTED</span></div>
 <div class="result-section"><h4>INCIDENT CLASSIFICATION</h4><p><b>Infrastructure / Dependency Failure</b> — upstream checkout dependency is returning timeouts and connection resets.</p></div>
 <div class="result-section"><h4>SEVERITY SUGGESTION</h4><p><b>SEV-1</b> based on elevated 5xx rate and customer-facing checkout impact.</p><div class="confidence"><i></i></div><small style="font-size:8px;color:#8792a3">86% confidence · Engineer confirmation required</small></div>
 <div class="result-section"><h4>LIKELY ROOT CAUSE</h4><p>Recent payment/checkout dependency activity appears correlated with upstream connection resets. The retry budget is exhausted, amplifying gateway failures.</p></div>
 <div class="result-section"><h4>SUPPORTING EVIDENCE</h4><ul><li>8.4% API Gateway error rate</li><li>502 responses on /checkout</li><li>5-second checkout-service timeout</li><li>Retry budget exhausted</li></ul></div>
 <div class="result-section"><h4>RECOMMENDED INVESTIGATION</h4><ul><li>Inspect checkout-service health and connection pool saturation.</li><li>Compare deployment timestamp with first error spike.</li><li>Check database and dependency latency.</li><li>Review gateway upstream timeout and retry configuration.</li></ul></div>
 <div class="result-section"><h4>SUGGESTED REMEDIATION</h4><p>Stabilize the failing dependency, validate connection capacity, and consider rollback/canary control if the deployment is confirmed as the trigger.</p></div></div>`;
 toast("AI incident analysis completed");
});
$("#incidentSearch").addEventListener("input",e=>{const q=e.target.value.toLowerCase();renderIncidents(incidents.filter(x=>x.join(" ").toLowerCase().includes(q)))});
$$(".pill").forEach(p=>p.addEventListener("click",()=>{$$(".pill").forEach(x=>x.classList.remove("active"));p.classList.add("active");const f=p.textContent;renderIncidents(f==="All"?incidents:incidents.filter(x=>x.includes(f)||x[3]===f||x[4]===f))}));
$("#refreshBtn").addEventListener("click",()=>{toast("Dashboard refreshed just now");drawIncident()});
$("#ackAll").addEventListener("click",()=>toast("12 alerts acknowledged"));
$("#exportLogs").addEventListener("click",()=>toast("Demo log export prepared"));
$("#saveSettings").addEventListener("click",()=>toast("Settings saved successfully"));
$("#copyHealth").addEventListener("click",()=>{navigator.clipboard?.writeText('GET /api/health');toast("Health endpoint copied")});
$("#notifBtn").addEventListener("click",()=>toast("4 notifications need attention"));
$("#searchBtn").addEventListener("click",()=>toast("Global search ready — try Incidents, Services, or trace IDs"));
$("#logoutBtn").addEventListener("click",()=>toast("Demo logout action triggered"));

const modal=$("#modal");$("#newIncident").addEventListener("click",()=>modal.classList.add("open"));$("#closeModal").addEventListener("click",()=>modal.classList.remove("open"));modal.addEventListener("click",e=>{if(e.target===modal)modal.classList.remove("open")});
$("#createIncident").addEventListener("click",()=>{const title=$("#newTitle").value.trim()||"Untitled operational incident";incidents.unshift(["INC-"+(1049+Math.floor(Math.random()*30)),title,"API Gateway",$("#newSeverity").value,"Open","A. Trigune","just now"]);renderIncidents();modal.classList.remove("open");$("#newTitle").value="";toast("Incident created successfully")});
$("#addService").addEventListener("click",()=>toast("Service creation form ready"));
$$(".toggle").forEach(t=>t.addEventListener("click",()=>t.classList.toggle("on")));

renderTables();renderAlerts();renderLogs();renderDeployments();renderAudit();renderPeople();renderHealth();
setTimeout(()=>drawIncident(),100);
window.addEventListener("resize",()=>{drawIncident();if($("#page-monitoring").classList.contains("active"))drawPerformance()});
