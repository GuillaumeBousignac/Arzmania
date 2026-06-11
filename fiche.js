const races = [
  "Humain(e)", "Elfe Lumineux", "Elfes Obscurs", "Fée", "Magmarien", "Ondin",
  "Golem de Glace", "Stryx", "Nazgul", "Démon", "Arasilien", "Hybride / Espèce ésotérique"
];

const classes = {
  avancee: {
    label: "🔥 Classes Avancées",
    badge: "badge-avancee",
    combat:  ["Chevalier Noir","Paladin","Chevalier de la Mort","Maître des Armes","Samurai","Chevalier à Dragon","Chevaucheur de Bête","Lancier","Templier","Chef de Guerre"],
    magie:   ["Mage de Combat","Démoniste","Nécromancien","Mage Rouge","Mage Bleu","Élémentaliste","Géomancien"],
    agilite: ["Assassin","Ninja","Maître des Pièges","Stalker","Navigateur"]
  },
  competence: {
    label: "🛠️ Classes à Compétence",
    badge: "badge-competence",
    combat:  ["Chevalier","Berserker","Armurier Draconique","Sentinelle","Soldat","Duelliste"],
    magie:   ["Magicien d'Arme","Prêtre Combattant","Sorcier","Arcaniste","Illusionniste","Alchimiste","Magicien des Ombres"],
    agilite: ["Archer","Scout","Balisticien","Mentaliste","Parieur","Bricoleur"]
  },
  basique: {
    label: "⚔️ Classes Basiques",
    badge: "badge-basique",
    combat:  ["Guerrier","Soldat","Cavalier","Porteur de Bouclier","Pugiliste"],
    magie:   ["Magicien","Prêtre","Druide"],
    agilite: ["Voleur","Bandit","Espion"]
  }
};

const tierLabel = { avancee: "Avancée", competence: "À compétence", basique: "Basique" };
const sousRule  = { avancee: "basique", competence: "competence", basique: "avancee" };
const sousMsg   = {
  avancee:    "Classe Avancée choisie → ta sous-classe doit être Basique.",
  competence: "Classe À compétence choisie → ta sous-classe doit être À compétence.",
  basique:    "Classe Basique choisie → ta sous-classe doit être Avancée."
};
const catLabel = { combat: "⚔️ Combat", magie: "🔮 Magie", agilite: "🏹 Agilité" };

let d = {};

function buildRaces() {
  const g = document.getElementById("raceGrid");
  g.innerHTML = "";
  races.forEach(r => {
    const el = document.createElement("div");
    el.className = "sel-card";
    el.textContent = r;
    el.onclick = () => {
      g.querySelectorAll(".sel-card").forEach(x => x.classList.remove("selected"));
      el.classList.add("selected");
      d.race = r;
      document.getElementById("next2").disabled = false;
    };
    g.appendChild(el);
  });
}

function buildClasses() {
  const g = document.getElementById("classeGrid");
  g.innerHTML = "";
  Object.entries(classes).forEach(([tier, data]) => {
    const th = document.createElement("div");
    th.className = "tier-header";
    th.innerHTML = `<span class="tier-badge ${data.badge}">${data.label}</span>`;
    g.appendChild(th);
    ["combat", "magie", "agilite"].forEach(cat => {
      const cl = document.createElement("div");
      cl.className = "cat-label";
      cl.textContent = catLabel[cat];
      g.appendChild(cl);
      const grid = document.createElement("div");
      grid.className = "grid-select";
      data[cat].forEach(cls => {
        const el = document.createElement("div");
        el.className = "sel-card";
        el.innerHTML = `${cls}<div class="sub">${catLabel[cat]}</div>`;
        el.onclick = () => {
          document.querySelectorAll("#classeGrid .sel-card").forEach(x => x.classList.remove("selected"));
          el.classList.add("selected");
          d.classePrinc = cls;
          d.classeTier  = tier;
          document.getElementById("next3").disabled = false;
        };
        grid.appendChild(el);
      });
      g.appendChild(grid);
    });
  });
}

function buildSousclasse() {
  const req  = sousRule[d.classeTier];
  const data = classes[req];
  document.getElementById("sousHint").textContent = sousMsg[d.classeTier];
  const g = document.getElementById("sousGrid");
  g.innerHTML = "";
  ["combat", "magie", "agilite"].forEach(cat => {
    const cl = document.createElement("div");
    cl.className = "cat-label";
    cl.textContent = catLabel[cat];
    g.appendChild(cl);
    const grid = document.createElement("div");
    grid.className = "grid-select";
    data[cat].forEach(cls => {
      if (cls === d.classePrinc) return;
      const el = document.createElement("div");
      el.className = "sel-card";
      el.innerHTML = `${cls}<div class="sub">${catLabel[cat]}</div>`;
      el.onclick = () => {
        document.querySelectorAll("#sousGrid .sel-card").forEach(x => x.classList.remove("selected"));
        el.classList.add("selected");
        d.sousClasse = cls;
        document.getElementById("next4").disabled = false;
      };
      grid.appendChild(el);
    });
    g.appendChild(grid);
  });
  d.sousClasse = "";
  document.getElementById("next4").disabled = true;
}

function checkStep1() {
  d.nom   = document.getElementById("nom").value.trim();
  d.age   = document.getElementById("age").value.trim();
  d.genre = document.getElementById("genre").value;
  document.getElementById("next1").disabled = !(d.nom && d.age && d.genre);
}

function checkStep5() {
  d.backstory = document.getElementById("backstory").value.trim();
  d.objectif  = document.getElementById("objectif").value;
  document.getElementById("next5").disabled = !(d.backstory && d.objectif);
}

function goTo(n) {
  for (let i = 1; i <= 6; i++) {
    document.getElementById("panel" + i).classList.toggle("active", i === n);
    if (i <= 5) {
      const dot = document.getElementById("sd" + i);
      dot.classList.toggle("done",   i < n);
      dot.classList.toggle("active", i === n);
    }
    if (i <= 4) {
      document.getElementById("sl" + i).classList.toggle("done", i < n);
    }
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function genFiche() {
  d.backstory = document.getElementById("backstory").value.trim();
  d.objectif  = document.getElementById("objectif").value;
  const lines = [
    "╔══════════════════════════════════════╗",
    "         ✦  FICHE DE PERSONNAGE  ✦",
    "               ARZMANIA",
    "╚══════════════════════════════════════╝",
    "",
    "━━━━━━━━━━━  IDENTITÉ  ━━━━━━━━━━━",
    "",
    "  Nom    : " + d.nom,
    "  Âge    : " + d.age + " ans",
    "  Genre  : " + d.genre,
    "  Race   : " + d.race,
    "",
    "━━━━━━━━━━━  CLASSES  ━━━━━━━━━━━",
    "",
    "  Classe principale : " + d.classePrinc + "  [" + tierLabel[d.classeTier] + "]",
    "  Sous-classe       : " + d.sousClasse,
    "",
    "━━━━━━━━━━━  OBJECTIF  ━━━━━━━━━━━",
    "",
    "  " + d.objectif,
    "",
    "━━━━━━━━━━━  HISTOIRE  ━━━━━━━━━━━",
    "",
    d.backstory,
    "",
    "═══════════════════════════════════════"
  ];
  document.getElementById("ficheOut").textContent = lines.join("\n");
  goTo(6);
}

function copyFiche() {
  const text = document.getElementById("ficheOut").textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById("copyBtn");
    btn.textContent = "✓ Copié !";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.textContent = "📋 Copier pour Discord";
      btn.classList.remove("copied");
    }, 2500);
  });
}

function restart() {
  d = {};
  document.getElementById("nom").value       = "";
  document.getElementById("age").value       = "";
  document.getElementById("genre").value     = "";
  document.getElementById("backstory").value = "";
  document.getElementById("objectif").value  = "";
  document.getElementById("next1").disabled  = true;
  document.getElementById("next2").disabled  = true;
  document.getElementById("next3").disabled  = true;
  buildRaces();
  buildClasses();
  goTo(1);
}

buildRaces();
buildClasses();
