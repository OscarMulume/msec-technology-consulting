const v="5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8";async function g(e){const a=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(e));return Array.from(new Uint8Array(a)).map(t=>t.toString(16).padStart(2,"0")).join("")}function h(){return sessionStorage.getItem("msec_admin")==="true"}function o(e){e?sessionStorage.setItem("msec_admin","true"):sessionStorage.removeItem("msec_admin")}document.getElementById("login-form")?.addEventListener("submit",async e=>{e.preventDefault();const a=document.getElementById("login-user").value,t=document.getElementById("login-pass").value,n=await g(t);a==="admin"&&n===v?(o(!0),r()):document.getElementById("login-error").style.display="block"});document.getElementById("logout-btn")?.addEventListener("click",()=>{o(!1),document.getElementById("login-page").style.display="flex",document.getElementById("admin-layout").style.display="none"});function r(){document.getElementById("login-page").style.display="none",document.getElementById("admin-layout").style.display="block",c("dashboard")}h()&&r();const l=document.getElementById("sidebar");document.getElementById("menu-btn")?.addEventListener("click",()=>l.classList.toggle("open"));document.querySelectorAll(".sidebar-nav a").forEach(e=>{e.addEventListener("click",a=>{a.preventDefault(),document.querySelectorAll(".sidebar-nav a").forEach(t=>t.classList.remove("active")),e.classList.add("active"),c(e.dataset.page),l.classList.remove("open")})});function i(e){try{return JSON.parse(localStorage.getItem("msec_"+e)||"[]")}catch{return[]}}function d(e,a){localStorage.setItem("msec_"+e,JSON.stringify(a))}localStorage.getItem("msec_messages")||d("messages",[{id:"1",name:"Jean Kabongo",email:"jean@example.com",phone:"+243 999 123 456",service_requested:"security",message:"Nous avons besoin d'un audit de sécurité pour notre infrastructure.",is_read:!1,created_at:new Date().toISOString()},{id:"2",name:"Marie Tshisekedi",email:"marie@example.com",phone:null,service_requested:"connectivity",message:"Demande de devis pour installation fibre optique.",is_read:!0,created_at:new Date(Date.now()-864e5).toISOString()}]);localStorage.getItem("msec_audits")||d("audits",[{id:"1",company_name:"Banque Centrale",contact_name:"Pierre Mbuyi",email:"pierre@banque.cd",phone:"+243 811 987 654",infrastructure_type:"full",current_issues:"Lenteurs réseau récurrentes",status:"pending",created_at:new Date().toISOString()},{id:"2",company_name:"Hôpital Général",contact_name:"Dr. Sophie",email:"sophie@hopital.cd",phone:null,infrastructure_type:"security",current_issues:"Pas de firewall, réseau ouvert",status:"scheduled",created_at:new Date(Date.now()-1728e5).toISOString()}]);localStorage.getItem("msec_clients")||d("clients",[{id:"1",company_name:"Malaïka Group",contact_name:"Oscar Mulume",email:"oscarmulume1612@gmail.com",phone:"+243 975 585 150",country:"RDC",city:"Kinshasa",status:"active",source:"website",created_at:new Date().toISOString()}]);function c(e){const a=document.getElementById("main-content");switch(e){case"dashboard":b(a);break;case"messages":y(a);break;case"audits":f(a);break;case"clients":w(a);break;case"services":$(a);break;case"settings":_(a);break}}function b(e){const a=i("messages"),t=i("audits"),n=i("clients"),u=a.filter(s=>!s.is_read).length,p=t.filter(s=>s.status==="pending").length,m=n.filter(s=>s.status==="active").length;e.innerHTML=`
    <div class="page-header"><div><h1>Dashboard</h1><p>Vue d'ensemble de votre activité</p></div></div>
    <div class="stats-grid">
      <div class="stat-card"><div class="label">Messages</div><div class="value">${a.length}</div><div class="trend up">${u} non lus</div></div>
      <div class="stat-card"><div class="label">Audits</div><div class="value">${t.length}</div><div class="trend up">${p} en attente</div></div>
      <div class="stat-card"><div class="label">Clients</div><div class="value">${n.length}</div><div class="trend up">${m} actifs</div></div>
      <div class="stat-card"><div class="label">Taux de réponse</div><div class="value">98%</div><div class="trend up">↑ 2% ce mois</div></div>
    </div>
    <h2 style="font-size:1.125rem;font-weight:700;margin-bottom:1rem">Messages récents</h2>
    <div class="table-wrap"><table>
      <thead><tr><th>Nom</th><th>Service</th><th>Message</th><th>Date</th><th>Statut</th></tr></thead>
      <tbody>${a.slice(0,5).map(s=>`
        <tr>
          <td style="color:var(--text);font-weight:500">${s.name}</td>
          <td><span class="badge badge-cyan">${s.service_requested||"-"}</span></td>
          <td style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${s.message}</td>
          <td style="white-space:nowrap">${new Date(s.created_at).toLocaleDateString("fr-FR")}</td>
          <td><span class="badge ${s.is_read?"badge-green":"badge-orange"}">${s.is_read?"Lu":"Nouveau"}</span></td>
        </tr>
      `).join("")}</tbody>
    </table></div>
  `}function y(e){const a=i("messages");e.innerHTML=`
    <div class="page-header"><div><h1>Messages</h1><p>${a.length} message(s) au total</p></div></div>
    <div class="table-wrap"><table>
      <thead><tr><th>Nom</th><th>Email</th><th>Téléphone</th><th>Service</th><th>Message</th><th>Date</th><th>Statut</th><th>Actions</th></tr></thead>
      <tbody>${a.map(t=>`
        <tr>
          <td style="color:var(--text);font-weight:500">${t.name}</td>
          <td>${t.email||"-"}</td>
          <td>${t.phone||"-"}</td>
          <td><span class="badge badge-cyan">${t.service_requested||"-"}</span></td>
          <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${t.message}</td>
          <td style="white-space:nowrap">${new Date(t.created_at).toLocaleDateString("fr-FR")}</td>
          <td><span class="badge ${t.is_read?"badge-green":"badge-orange"}">${t.is_read?"Lu":"Nouveau"}</span></td>
          <td><div class="actions">
            <button class="action-btn view" onclick="viewMessage('${t.id}')">Voir</button>
            ${t.email?`<button class="action-btn edit" onclick="replyMessage('${t.email}', '${t.name.replace(/'/g,"\\'")}')">Répondre</button>`:""}
            <button class="action-btn ${t.is_read?"":"edit"}" onclick="toggleRead('${t.id}')">${t.is_read?"Non lu":"Lu"}</button>
            <button class="action-btn delete" onclick="deleteMessage('${t.id}')">Suppr</button>
          </div></td>
        </tr>
      `).join("")}</tbody>
    </table></div>
  `}function f(e){const a=i("audits");e.innerHTML=`
    <div class="page-header"><div><h1>Demandes d'Audit</h1><p>${a.length} demande(s) au total</p></div></div>
    <div class="table-wrap"><table>
      <thead><tr><th>Entreprise</th><th>Contact</th><th>Type</th><th>Problématique</th><th>Date</th><th>Statut</th><th>Actions</th></tr></thead>
      <tbody>${a.map(t=>`
        <tr>
          <td style="color:var(--text);font-weight:500">${t.company_name||"-"}</td>
          <td>${t.contact_name}</td>
          <td><span class="badge badge-cyan">${t.infrastructure_type||"-"}</span></td>
          <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${t.current_issues||"-"}</td>
          <td style="white-space:nowrap">${new Date(t.created_at).toLocaleDateString("fr-FR")}</td>
          <td><span class="badge ${t.status==="pending"?"badge-orange":t.status==="scheduled"?"badge-cyan":t.status==="completed"?"badge-green":"badge-red"}">${t.status==="pending"?"En attente":t.status==="scheduled"?"Planifié":t.status==="completed"?"Terminé":"Annulé"}</span></td>
          <td><div class="actions">
            <button class="action-btn view" onclick="viewAudit('${t.id}')">Voir</button>
            <button class="action-btn edit" onclick="updateAuditStatus('${t.id}')">Statut</button>
          </div></td>
        </tr>
      `).join("")}</tbody>
    </table></div>
  `}function w(e){const a=i("clients");e.innerHTML=`
    <div class="page-header"><div><h1>Clients</h1><p>${a.length} client(s) au total</p></div><button class="btn btn-primary btn-sm" onclick="addClient()">+ Ajouter</button></div>
    <div class="table-wrap"><table>
      <thead><tr><th>Entreprise</th><th>Contact</th><th>Email</th><th>Téléphone</th><th>Ville</th><th>Statut</th><th>Source</th><th>Actions</th></tr></thead>
      <tbody>${a.map(t=>`
        <tr>
          <td style="color:var(--text);font-weight:500">${t.company_name||"-"}</td>
          <td>${t.contact_name}</td>
          <td>${t.email||"-"}</td>
          <td>${t.phone||"-"}</td>
          <td>${t.city||"-"}</td>
          <td><span class="badge ${t.status==="active"?"badge-green":t.status==="prospect"?"badge-orange":"badge-red"}">${t.status==="active"?"Actif":t.status==="prospect"?"Prospect":"Inactif"}</span></td>
          <td>${t.source||"-"}</td>
          <td><div class="actions">
            <button class="action-btn edit" onclick="editClient('${t.id}')">Éditer</button>
            <button class="action-btn delete" onclick="deleteClient('${t.id}')">Suppr</button>
          </div></td>
        </tr>
      `).join("")}</tbody>
    </table></div>
  `}function $(e){const a=i("services")||[{id:"1",slug:"connectivity",title:"Connectivité & Infrastructure",icon:"🌐",summary:"Starlink, UniFi, FortiGate, VoIP Yeastar — haute disponibilité.",is_active:!0,display_order:1},{id:"2",slug:"security",title:"Cybersécurité & Vidéosurveillance",icon:"🛡️",summary:"FortiGate, CCTV Hikvision/Dahua, pentest.",is_active:!0,display_order:2},{id:"3",slug:"iot-tracking",title:"IoT, Traçage & MDM",icon:"📡",summary:"Géolocalisation de flottes, gestion des terminaux.",is_active:!0,display_order:3},{id:"4",slug:"ai-automation",title:"Innovation IA & Systèmes Autonomes",icon:"🤖",summary:"Agents IA open-source déployés en local.",is_active:!0,display_order:4}];i("services")||d("services",a),e.innerHTML=`
    <div class="page-header"><div><h1>Services</h1><p>Gérer les services affichés sur le site</p></div><button class="btn btn-primary btn-sm" onclick="addService()">+ Ajouter</button></div>
    <div class="table-wrap"><table>
      <thead><tr><th>#</th><th>Icône</th><th>Titre</th><th>Résumé</th><th>Statut</th><th>Actions</th></tr></thead>
      <tbody>${a.map(t=>`
        <tr>
          <td class="mono" style="color:var(--text2)">${t.display_order}</td>
          <td style="font-size:1.5rem">${t.icon}</td>
          <td style="color:var(--text);font-weight:500;white-space:nowrap">${t.title}</td>
          <td style="max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${t.summary||"-"}</td>
          <td><span class="badge ${t.is_active?"badge-green":"badge-red"}">${t.is_active?"Actif":"Inactif"}</span></td>
          <td><div class="actions">
            <button class="action-btn edit" onclick="editService('${t.id}')">Éditer</button>
            <button class="action-btn ${t.is_active?"delete":"view"}" onclick="toggleService('${t.id}')">${t.is_active?"Désactiver":"Activer"}</button>
          </div></td>
        </tr>
      `).join("")}</tbody>
    </table></div>
  `}function _(e){e.innerHTML=`
    <div class="page-header"><div><h1>Paramètres</h1><p>Configuration du site</p></div></div>
    <div class="card" style="margin-bottom:1.5rem">
      <h3 style="margin-bottom:1rem">🔐 Changer le mot de passe admin</h3>
      <div class="form-group"><label>Nouveau mot de passe</label><input type="password" id="new-pass" placeholder="Nouveau mot de passe" /></div>
      <div class="form-group"><label>Confirmer</label><input type="password" id="confirm-pass" placeholder="Confirmer" /></div>
      <button class="btn btn-primary btn-sm" onclick="changePassword()">Changer le mot de passe</button>
    </div>
    <div class="card" style="margin-bottom:1.5rem">
      <h3 style="margin-bottom:1rem">🗑️ Données</h3>
      <p style="color:var(--text2);font-size:.875rem;margin-bottom:1rem">Exporter ou réinitialiser les données locales.</p>
      <div style="display:flex;gap:.5rem;flex-wrap:wrap">
        <button class="btn btn-secondary btn-sm" onclick="exportData()">📥 Exporter JSON</button>
        <button class="btn btn-danger btn-sm" onclick="resetData()">🗑️ Tout réinitialiser</button>
      </div>
    </div>
    <div class="card">
      <h3 style="margin-bottom:1rem">ℹ️ Informations</h3>
      <p style="color:var(--text2);font-size:.875rem">Version: 1.0.0 — M-Sec Technology Consulting<br/>Les données sont actuellement stockées en localStorage (démo). Connectez Supabase pour la production.</p>
    </div>
  `}function S(){document.getElementById("modal").classList.remove("open")}document.getElementById("modal")?.addEventListener("click",e=>{e.target===e.currentTarget&&S()});
