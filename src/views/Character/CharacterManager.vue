<template>
  <section class="character-manager content">
    <header class="cm-header">
      <h1 class="cm-title">{{ $t("SHEET.SHEETS_EDIT") }}</h1>
      <router-link to="/campaigns/1" class="btn btn-accent">{{ $t("SHEET.BACK_TO_SHEETS") }}</router-link>
    </header>

    <form class="cm-form" @submit.prevent="save">
      <!-- Identité -->
      <fieldset class="cm-section">
        <legend>Identité</legend>
        <div class="grid-3">
          <div class="field">
            <label>Pseudo</label>
            <input v-model="form.handle" type="text" placeholder="Handle"/>
          </div>
          <div class="field">
            <label>Rôle</label>
            <input v-model="form.role" type="text" placeholder="Ex: Solo, Netrunner"/>
          </div>
          <div class="field">
            <label>Niveau</label>
            <input v-model.number="form.level" type="number" min="1"/>
          </div>
        </div>
      </fieldset>

      <!-- Santé -->
      <fieldset class="cm-section">
        <legend>Santé</legend>
        <div class="grid-2">
          <div class="field">
            <label>Points de vie (actuel / max)</label>
            <div class="inline-2 slashed">
              <input v-model.number="form.hp.current" type="number" min="0"/>
              <input v-model.number="form.hp.max" type="number" min="0"/>
            </div>
          </div>
          <div class="field">
            <label>Armure totale (actuelle / max)</label>
            <div class="inline-2 slashed">
              <input v-model.number="form.armor.current" type="number" min="0"/>
              <input v-model.number="form.armor.max" type="number" min="0"/>
            </div>
          </div>
        </div>

        <div class="grid-2">
          <div class="field">
            <label>Humanité (min / max)</label>
            <div class="inline-2 slashed">
              <input v-model.number="form.humanity.min" type="number" min="0"/>
              <input v-model.number="form.humanity.max" type="number" min="0"/>
            </div>
          </div>
        </div>
      </fieldset>

      <!-- Stats -->
      <fieldset class="cm-section">
        <legend>Stats</legend>
        <div class="stats-grid">
          <div class="stat">
            <label>INT</label>
            <input v-model.number="form.stats.INT" type="number" min="1" max="10"/>
          </div>
          <div class="stat">
            <label>REF</label>
            <input v-model.number="form.stats.REF" type="number" min="1" max="10"/>
          </div>
          <div class="stat">
            <label>DEX</label>
            <input v-model.number="form.stats.DEX" type="number" min="1" max="10"/>
          </div>
          <div class="stat">
            <label>TECH</label>
            <input v-model.number="form.stats.TECH" type="number" min="1" max="10"/>
          </div>
          <div class="stat">
            <label>COOL</label>
            <input v-model.number="form.stats.COOL" type="number" min="1" max="10"/>
          </div>
          <div class="stat">
            <label>WILL</label>
            <input v-model.number="form.stats.WILL" type="number" min="1" max="10"/>
          </div>
          <div class="stat">
            <label>LUCK</label>
            <input v-model.number="form.stats.LUCK" type="number" min="0" max="10"/>
          </div>
          <div class="stat">
            <label>MOVE</label>
            <input v-model.number="form.stats.MOVE" type="number" min="1" max="10"/>
          </div>
          <div class="stat">
            <label>BODY</label>
            <input v-model.number="form.stats.BODY" type="number" min="1" max="10"/>
          </div>
          <div class="stat">
            <label>EMP (min / max)</label>
            <div class="inline-2 slashed">
              <input v-model.number="form.stats.EMP.min" type="number" min="0" max="10"/>
              <input v-model.number="form.stats.EMP.max" type="number" min="0" max="10"/>
            </div>
          </div>
          <div class="stat">
            <label>CHA (min / max)</label>
            <div class="inline-2 slashed">
              <input v-model.number="form.stats.CHA.min" type="number" min="0" max="10"/>
              <input v-model.number="form.stats.CHA.max" type="number" min="0" max="10"/>
            </div>
          </div>
          <div class="stat">
            <label>VOL</label>
            <input v-model.number="form.stats.VOL" type="number" min="0" max="10"/>
          </div>
          <div class="stat">
            <label>MOUV</label>
            <input v-model.number="form.stats.MOUV" type="number" min="1" max="10"/>
          </div>
          <div class="stat">
            <label>COR</label>
            <input v-model.number="form.stats.COR" type="number" min="1" max="10"/>
          </div>
        </div>
      </fieldset>

      <!-- Compétences -->
      <fieldset class="cm-section">
        <legend>Compétences</legend>

        <div class="skill-block">
          <div class="skill-block-title">Compétences de contrôle</div>
          <div class="skill-header">
            <div>Nom</div>
            <div>NIV</div>
            <div>CARAC</div>
            <div>BASE</div>
          </div>
          <div class="skill-row striped">
            <div>Contrôle véhicule terrestre (REF)</div>
            <input v-model.number="form.skills.control.driveLand" type="number" min="0"/>
            <input :value="form.stats.REF" disabled/>
            <input :value="computedBase(form.skills.control.driveLand, form.stats.REF)" disabled/>
          </div>
          <div class="skill-row striped">
            <div>Equitation (REF)</div>
            <input v-model.number="form.skills.control.driveLand" type="number" min="0"/>
            <input :value="form.stats.REF" disabled/>
            <input :value="computedBase(form.skills.control.driveLand, form.stats.REF)" disabled/>
          </div>
          <div class="skill-row striped">
            <div>Pilotage de véhicule aérien (x2) (REF)</div>
            <input v-model.number="form.skills.control.driveLand" type="number" min="0"/>
            <input :value="form.stats.REF" disabled/>
            <input :value="computedBase(form.skills.control.driveLand, form.stats.REF)" disabled/>
          </div>
        </div>

        <div class="skill-block">
          <div class="skill-block-title">Compétences de combat</div>
          <div class="skill-header">
            <div>Nom</div>
            <div>NIV</div>
            <div>CARAC</div>
            <div>BASE</div>
          </div>
          <div class="skill-row striped">
            <div>Mêlée (DEX)</div>
            <input v-model.number="form.skills.fighting.melee" type="number" min="0"/>
            <input :value="form.stats.DEX" disabled/>
            <input :value="computedBase(form.skills.fighting.melee, form.stats.DEX)" disabled/>
          </div>
        </div>

        <div class="skill-block">
          <div class="skill-block-title">Compétences de corps</div>
          <div class="skill-header">
            <div>Nom</div>
            <div>NIV</div>
            <div>CARAC</div>
            <div>BASE</div>
          </div>
          <div class="skill-row striped">
            <div>Athlétisme (DEX)</div>
            <input v-model.number="form.skills.body.athletics" type="number" min="0"/>
            <input :value="form.stats.DEX" disabled/>
            <input :value="computedBase(form.skills.body.athletics, form.stats.DEX)" disabled/>
          </div>
        </div>

        <div class="skill-block">
          <div class="skill-block-title">Compétences d'éducation</div>
          <div class="skill-header">
            <div>Nom</div>
            <div>NIV</div>
            <div>CARAC</div>
            <div>BASE</div>
          </div>
          <div class="skill-row striped">
            <div>Éducation (INT)</div>
            <input v-model.number="form.skills.education.education" type="number" min="0"/>
            <input :value="form.stats.INT" disabled/>
            <input :value="computedBase(form.skills.education.education, form.stats.INT)" disabled/>
          </div>
        </div>

        <div class="skill-block">
          <div class="skill-block-title">Compétences de représentation</div>
          <div class="skill-header">
            <div>Nom</div>
            <div>NIV</div>
            <div>CARAC</div>
            <div>BASE</div>
          </div>
          <div class="skill-row striped">
            <div>Jeu d'acteur (COOL)</div>
            <input v-model.number="form.skills.performance.acting" type="number" min="0"/>
            <input :value="form.stats.COOL" disabled/>
            <input :value="computedBase(form.skills.performance.acting, form.stats.COOL)" disabled/>
          </div>
        </div>

        <div class="skill-block">
          <div class="skill-block-title">Compétences de sociabilité</div>
          <div class="skill-header">
            <div>Nom</div>
            <div>NIV</div>
            <div>CARAC</div>
            <div>BASE</div>
          </div>
          <div class="skill-row striped">
            <div>Persuasion (COOL)</div>
            <input v-model.number="form.skills.social.persuasion" type="number" min="0"/>
            <input :value="form.stats.COOL" disabled/>
            <input :value="computedBase(form.skills.social.persuasion, form.stats.COOL)" disabled/>
          </div>
        </div>

        <div class="skill-block">
          <div class="skill-block-title">Compétences de technique</div>
          <div class="skill-header">
            <div>Nom</div>
            <div>NIV</div>
            <div>CARAC</div>
            <div>BASE</div>
          </div>
          <div class="skill-row striped">
            <div>Premiers soins (TECH)</div>
            <input v-model.number="form.skills.tech.firstAid" type="number" min="0"/>
            <input :value="form.stats.TECH" disabled/>
            <input :value="computedBase(form.skills.tech.firstAid, form.stats.TECH)" disabled/>
          </div>
        </div>

        <div class="skill-block">
          <div class="skill-block-title">Compétences de tir</div>
          <div class="skill-header">
            <div>Nom</div>
            <div>NIV</div>
            <div>CARAC</div>
            <div>BASE</div>
          </div>
          <div class="skill-row striped">
            <div>Arme de poing (REF)</div>
            <input v-model.number="form.skills.ranged.handgun" type="number" min="0"/>
            <input :value="form.stats.REF" disabled/>
            <input :value="computedBase(form.skills.ranged.handgun, form.stats.REF)" disabled/>
          </div>
        </div>

        <div class="skill-block">
          <div class="skill-block-title">Compétences de vigilance</div>
          <div class="skill-header">
            <div>Nom</div>
            <div>NIV</div>
            <div>CARAC</div>
            <div>BASE</div>
          </div>
          <div class="skill-row striped">
            <div>Perception (INT)</div>
            <input v-model.number="form.skills.awareness.perception" type="number" min="0"/>
            <input :value="form.stats.INT" disabled/>
            <input :value="computedBase(form.skills.awareness.perception, form.stats.INT)" disabled/>
          </div>
        </div>
      </fieldset>

      <footer class="cm-actions">
        <button type="submit" class="btn btn-accent">Enregistrer</button>
      </footer>
    </form>
  </section>
</template>

<script setup>
import {reactive} from 'vue';

const form = reactive({
  handle: 'Razor',
  role: 'Solo',
  level: 5,
  hp: {current: 15, max: 35},
  armor: {current: 8, max: 14},
  humanity: {min: 40, max: 60},
  stats: {
    INT: 6, REF: 8, DEX: 7, TECH: 5, COOL: 6, WILL: 6, LUCK: 4, MOVE: 6, BODY: 7,
    EMP: {min: 4, max: 8},
    CHA: {min: 4, max: 8},
    VOL: 5,
    MOUV: 6,
    COR: 7,
  },
  skills: {
    control: {driveLand: 2},
    fighting: {melee: 3},
    body: {athletics: 4},
    education: {education: 3},
    performance: {acting: 2},
    social: {persuasion: 4},
    tech: {firstAid: 3},
    ranged: {handgun: 5},
    awareness: {perception: 6},
  },
});

const computedBase = (lvl, stat) => Number(lvl || 0) + Number(stat || 0);

const save = async () => {
  console.log('save character', JSON.parse(JSON.stringify(form)));
};
</script>

<style scoped>
.cm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.cm-title {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.cm-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.cm-section {
  border: 1px solid var(--border-light, #550000);
  border-left: 4px solid var(--color-accent, #f31212);
  border-radius: 4px;
  padding: 1rem;
  background: var(--bg-panel, #2C2A29);
}

legend {
  padding: 0 0.35rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-light, #E0DED7);
}

.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.8rem;
}

.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
}

.inline-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.slashed {
  position: relative;
}

.slashed::before {
  content: "/";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  color: #c9c6c1;
  opacity: 0.6;
  font-weight: 700;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.6rem;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.hint {
  margin-top: 0.6rem;
  opacity: .75;
  font-size: .85rem;
}

.skill-block {
  margin-top: 1rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(85, 0, 0, 0.45);
  border-radius: 4px;
  overflow: hidden;
  background: #262422;
}

.skill-block + .skill-block {
  margin-top: 0.8rem;
}

.skill-block-title {
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .06em;
  background: #332f2d;
  padding: .5rem .6rem;
  border-left: 4px solid var(--color-accent, #f31212);
}

.skill-header, .skill-row {
  display: grid;
  grid-template-columns: 1.6fr .5fr .5fr .5fr;
  align-items: center;
  gap: .5rem;
  padding: .5rem .6rem;
}

.skill-header {
  font-weight: 700;
  background: #2e2b29;
  border-bottom: 1px solid rgba(85, 0, 0, .6);
}

.skill-row {
  border-bottom: 1px solid rgba(85, 0, 0, .35);
}

.skill-row.striped:nth-child(odd) {
  background: #2a2725;
}

.skill-row.striped:nth-child(even) {
  background: #242220;
}

.skill-row input[disabled] {
  background: #3a3736;
  color: #cfcac2;
  /*border-color: #4a2a2a;*/
  min-height: 36px;
}

.cm-actions {
  display: flex;
  justify-content: flex-end;
  gap: .5rem;
}

@media (max-width: 960px) {
  .grid-3, .grid-2 {
    grid-template-columns: 1fr;
  }

  .skill-header, .skill-row {
    grid-template-columns: 1fr .6fr .6fr .6fr;
  }
}
</style>
