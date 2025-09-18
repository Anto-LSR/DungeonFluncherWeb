<template>
  <section class="items-view content">
    <header class="items-topbar">
      <h1 class="iv-title">Objets</h1>

      <div class="iv-actions">
        <input
            v-model="query"
            type="search"
            class="input-search"
            placeholder="Rechercher (nom, type)..."
            aria-label="Rechercher un objet"
        />
        <select v-model="typeFilter" class="select">
          <option value="">Tous les types</option>
          <option v-for="t in allowedTypes" :key="t" :value="t">{{ t }}</option>
        </select>
        <select v-model="sortBy" class="select">
          <option value="name">Nom (A→Z)</option>
          <option value="type">Type (A→Z)</option>
        </select>
        <router-link class="btn btn-accent" to="/items/new">+ Nouvel objet</router-link>
      </div>
    </header>

    <div class="items-grid">
      <div
          v-for="it in visibleItems"
          :key="it.id"
          class="item-card"
          :class="`item-${slug(it.type)}`"
          @click="openItem(it.id)"
      >
        <!-- Contenu cliquable -->
        <router-link
            class="link-reset item-card-inner"
            :to="`/items/${it.id}`"
        >
          <header class="item-head">
            <h4 class="item-name">{{ it.name }}</h4>

          </header>
          <p class="item-desc">{{ it.description }}</p>
          <div class="item-meta"></div>
          <span class="item-type">{{ it.type }}</span>
        </router-link>

        <!-- Bouton menu contextuel -->
        <button
            class="item-menu-btn"
            aria-label="Menu"
            @click.stop="toggleMenu(it.id)"
            :aria-expanded="openMenuId === it.id ? 'true' : 'false'"
            aria-haspopup="menu"
            :aria-controls="`ctx-${it.id}`"
        >
          🔧
        </button>

        <!-- Menu contextuel -->
        <div
            v-show="openMenuId === it.id"
            class="ctx-menu"
            role="menu"
            :id="`ctx-${it.id}`"
            @click.stop
        >
          <button class="ctx-item" role="menuitem" @click="editItem(it.id)">Modifier</button>
          <button class="ctx-item" role="menuitem" @click="sendToCharacter(it.id)">Envoyer à un personnage</button>
          <button class="ctx-item danger" role="menuitem" @click="removeItem(it.id)">Supprimer</button>
        </div>
      </div>

      <div v-if="!visibleItems.length" class="empty">
        Aucun objet ne correspond aux critères.
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter(); // Navigation programmatique fiable et accessible avec Vue Router. [web:81][web:57]

const query = ref(''); // Recherche gérée via computed pour ne pas muter la source. [web:129]
const sortBy = ref('name'); // Tri déterministe sur une copie du tableau. [web:206]
const typeFilter = ref(''); // Filtre strict sur les types autorisés. [web:136]

const allowedTypes = [
  'Objet',
  'Arme',
  'Equipement',
  'Cyberimplant',
  'Consommable',
  'Munition',
]; // Liste contrôlée pour le filtre type. [web:136]

const items = ref([]); // Source de données des items. [web:136]

const slug = s => String(s || '').toLowerCase().replace(/\s+/g, '-'); // Slug pour classes CSS par type. [web:136]

const visibleItems = computed(() => {
  const q = query.value.trim().toLowerCase();
  let arr = items.value;

  if (typeFilter.value) {
    arr = arr.filter(i => i.type === typeFilter.value);
  } // Filtrage par type conforme aux pratiques de rendu de liste. [web:136]

  if (q) {
    arr = arr.filter(i =>
        [i.name, i.type].some(v => String(v || '').toLowerCase().includes(q))
    );
  } // Recherche basique nom/type en lowercase via computed. [web:129]

  const copy = [...arr];
  if (sortBy.value === 'name') {
    copy.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy.value === 'type') {
    copy.sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name));
  } // Tri non mutatif sur copie pour éviter les effets de bord. [web:206]

  return copy;
}); // visibleItems regroupe filtre, recherche et tri de manière déclarative. [web:129]

onMounted(() => {
  items.value = [
    { id: 1, name: 'Arasaka Sidearm', type: 'Arme', description: 'Pistolet compact calibre 10mm.' },
    { id: 2, name: 'SynthSkin Mk.II', type: 'Cyberimplant', description: 'Peau synthétique renforcée.' },
    { id: 3, name: 'Medkit Pro', type: 'Consommable', description: 'Trousse de soins avancée.' },
    { id: 4, name: 'Kiroshi Optics', type: 'Cyberimplant', description: 'Implant optique avec zoom x4.' },
    { id: 5, name: 'Traqueur RF', type: 'Equipement', description: 'Émetteur localisable à longue portée.' },
    { id: 6, name: 'Cartouches 10mm', type: 'Munition', description: 'Boîte de 50 munitions 10mm.' },
    { id: 7, name: 'Puce de données', type: 'Objet', description: 'Stockage de données cryptées.' },
  ]; // Données d’exemple; remplacer par un fetch vers l’API si besoin. [web:136]
}); // Chargement initial en mounted comme pattern simple de démo. [web:136]

function openItem(id) {
  router.push(`/items/${id}`); // Navigation par clic sur carte, alternative programmatique à router-link. [web:81][web:214]
} // Maintient l’UX carte cliquable avec gestion centralisée. [web:214]

const openMenuId = ref(null); // ID du menu ouvert pour un seul menu à la fois. [web:129]
function toggleMenu(id) {
  openMenuId.value = openMenuId.value === id ? null : id;
} // Toggle contrôlé par ID pour gérer les menus au sein d’une liste. [web:129]

function closeMenus() {
  openMenuId.value = null;
} // Fermeture centralisée pour actions de menu et clic extérieur. [web:129]

function onClickOutside(e) {
  if (openMenuId.value !== null) {
    const menus = document.querySelectorAll('.ctx-menu, .item-menu-btn');
    let inside = false;
    menus.forEach(el => { if (el.contains(e.target)) inside = true; });
    if (!inside) closeMenus();
  } // Ferme au clic extérieur, bonne pratique d’UX pour dropdowns/menus. [web:214]
} // Évite les états persistants indésirables hors focus. [web:214]

onMounted(() => document.addEventListener('click', onClickOutside)); // Attache le listener global après montage. [web:214]
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside)); // Nettoyage pour éviter fuites mémoire. [web:214]

function editItem(id) {
  closeMenus();
  router.push(`/items/${id}/edit`);
} // Navigation vers la vue d’édition via router.push. [web:81]

function sendToCharacter(id) {
  closeMenus();
  // TODO: ouvrir un sélecteur de personnage ou router vers une vue dédiée
  console.log('send item to character', id);
} // Point d’extension pour workflow d’affectation d’objet. [web:129]

function removeItem(id) {
  closeMenus();
  items.value = items.value.filter(i => i.id !== id);
} // Suppression locale; à remplacer par appel API puis maj de la source. [web:129]
</script>

<style scoped>
.items-topbar {
  display: flex; align-items: center; justify-content: space-between;
  gap: 1rem; margin-bottom: 1rem;
} /* Barre supérieure avec actions, pattern commun. [web:214] */

.iv-title { margin: 0; text-transform: uppercase; letter-spacing: .06em; } /* Titre stylisé discret et lisible. [web:214] */

.iv-actions { display: flex; gap: .6rem; align-items: center; flex-wrap: wrap; } /* Actions flexibles sur petites largeurs. [web:214] */

.select,
.input-search {
  background-color: #3a3736; color: var(--text-light, #E0DED7);
  border: 1.5px solid var(--border-light, #550000);
  border-radius: 4px; padding: .4rem .6rem;
} /* Entrées cohérentes avec thème global, accessible et clair. [web:214] */

.input-search { min-width: 220px; } /* Largeur minimale pour confort de saisie. [web:214] */

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: .9rem;
} /* Grid responsive avec auto-fit/minmax pour cartes adaptatives. [web:206] */

.item-card {
  position: relative;
  background: var(--bg-panel, #2C2A29);
  border: 1px solid var(--border-light, #550000);
  border-left: 4px solid var(--color-accent, #f31212);
  border-radius: 4px;
  padding: .8rem .9rem;
  display: flex; flex-direction: column; gap: .5rem;
  box-shadow: 0 0 10px var(--shadow-color, rgba(102,0,0,0.27));
  cursor: pointer;
} /* Carte avec accent latéral pour typage visuel sobre. [web:214] */

.link-reset { text-decoration: none; color: inherit; display: block; } /* Router-link sans style de lien. [web:214] */

.item-card-inner { display: flex; flex-direction: column; gap: .5rem; } /* Contenu vertical fluide. [web:214] */

.item-card:hover { filter: brightness(1.03); box-shadow: 0 0 12px rgba(243,18,18,0.25); } /* Subtil hover pour affordance. [web:214] */

.item-head { display: flex; justify-content: space-between; align-items: baseline; gap: .6rem; } /* En-tête nom/type. [web:214] */

.item-name { margin: 0; font-weight: 800; text-transform: uppercase; letter-spacing: .04em; } /* Titre concise et fort. [web:214] */

.item-type {
  padding: 0.05rem .4rem; border-radius: 3px; font-size: .72rem; font-weight: 800;
  border: 1px solid #7a0b0b; background: #332f2d; color: #E0DED7; letter-spacing: .04em; text-transform: uppercase;
} /* Badge type discret dans le thème. [web:214] */

.item-desc { margin: 0; opacity: .95; } /* Description courte lisible. [web:214] */

.item-meta { display: flex; gap: .8rem; font-size: .9rem; opacity: .9; } /* Métadonnées à enrichir au besoin. [web:214] */

.empty { grid-column: 1 / -1; opacity: .8; padding: 1rem; text-align: center; } /* État vide clair. [web:214] */

/* Bouton menu (3 points) */
.item-menu-btn {
  position: absolute; top: .4rem; right: .4rem;
  width: 30px; height: 26px;
  border-radius: 4px; border: 1px solid #7a0b0b;
  background: #332f2d; color: #E0DED7;
  font-weight: 900; line-height: 1; cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
} /* Bouton contextuel discret en coin. [web:214] */

.item-menu-btn:hover, .item-menu-btn:focus {
  background: #3a3736; outline: none;
} /* Hover/focus du bouton menu pour accessibilité. [web:214] */

/* Menu contextuel */
.ctx-menu {
  position: absolute; top: 2.3rem; right: .4rem;
  min-width: 200px;
  background: var(--bg-panel, #2C2A29);
  border: 1px solid var(--border-light, #550000);
  border-radius: 4px;
  box-shadow: 0 6px 18px var(--shadow-color, rgba(102,0,0,0.27));
  padding: .3rem; z-index: 10;
} /* Dropdown contextuel positionné près du bouton. [web:214] */

.ctx-item {
  width: 100%; text-align: left;
  background: transparent; color: var(--text-light, #E0DED7);
  border: none; padding: .5rem .6rem; border-radius: 3px;
  font-weight: 700; letter-spacing: .02em; text-transform: uppercase;
  cursor: pointer;
} /* Entrées du menu avec alignement gauche lisible. [web:214] */

.ctx-item:hover, .ctx-item:focus {
  background: #3a3736; color: var(--color-accent, #f31212); outline: none;
} /* États survol/focus cohérents avec le thème. [web:214] */

.ctx-item.danger:hover, .ctx-item.danger:focus {
  background: #3a2020; color: #ff6b6b;
} /* Variante dangereuse pour supprimer. [web:214] */

/* Variantes par type (classe via slug(type)) */
.item-objet { border-left-color: #9e9e9e; } /* Objet générique. [web:214] */
.item-arme { border-left-color: #e98f00; } /* Arme. [web:214] */
.item-equipement { border-left-color: #607d8b; } /* Equipement. [web:214] */
.item-cyberimplant { border-left-color: #00bcd4; } /* Cyberimplant. [web:214] */
.item-consommable { border-left-color: #8bc34a; } /* Consommable. [web:214] */
.item-munition { border-left-color: #ff5252; } /* Munition. [web:214] */

@media (max-width: 720px) {
  .iv-actions { justify-content: flex-end; }
} /* Actions wrap sur petits écrans. [web:214] */
</style>
