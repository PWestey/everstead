(() => {
  'use strict';
  const inlineJson = value => JSON.stringify(value).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');

  function installRuntime(config) {
    const slots = new Map(Object.entries(config.slots));
    const nativeSetTimeout = window.setTimeout.bind(window), nativeClearTimeout = window.clearTimeout.bind(window);
    const randomValues = config.randomSequence.slice();
    let randomIndex = 0, saveIndex = 0, transactionIndex = 0;
    window.__GATE_0C_CONFIG__ = config;
    window.__GATE_0C_SLOTS__ = slots;
    window.__GATE_0C_ERRORS__ = [];
    window.addEventListener('error', event => window.__GATE_0C_ERRORS__.push(String(event.error?.stack || event.message)));
    window.addEventListener('unhandledrejection', event => window.__GATE_0C_ERRORS__.push(String(event.reason?.stack || event.reason)));
    const runtime = {
      storage: {
        getItem(key) { return slots.get(String(key)) ?? null; },
        setItem(key,value) { slots.set(String(key),String(value)); },
        removeItem(key) { slots.delete(String(key)); }
      },
      clock: { now: () => config.now, setTimeout: nativeSetTimeout, clearTimeout: nativeClearTimeout },
      random() {
        if (randomIndex >= randomValues.length) throw new Error('browser runtime random exhausted');
        return randomValues[randomIndex++];
      },
      confirm: () => true,
      ids: { save: () => `save-browser-${++saveIndex}`, transaction: () => `tx-browser-${++transactionIndex}` },
      qa: { allowDestructive: true }
    };
    if (config.features) runtime.features = config.features;
    window.__EVERSTEAD_RUNTIME__ = runtime;
  }

  function runSuite() {
    const config = window.__GATE_0C_CONFIG__, slots = window.__GATE_0C_SLOTS__, results = [];
    const add = (id,pass,detail='') => results.push({ id, pass: Boolean(pass), detail: String(detail) });
    const wait = milliseconds => new Promise(resolve => setTimeout(resolve,milliseconds));
    const current = raw => { try { const value=JSON.parse(raw); return value?.schemaVersion===1 ? value : null; } catch { return null; } };
    const click = selector => { const node=document.querySelector(selector); if(node)node.click(); return node; };
    const send = () => parent.postMessage({ channel: 'everstead-gate-0c', nonce: config.nonce, results, errors: window.__GATE_0C_ERRORS__.slice() }, '*');
    (async () => {
      await wait(320);
      const bridge = window.__EVERSTEAD_QA__;
      if (!config.expectBridge) {
        add('bridge-absent-for-encoded-query', bridge === undefined);
        add('negative-realm-no-production-error', window.__GATE_0C_ERRORS__.length === 0, window.__GATE_0C_ERRORS__.join('\n'));
        send(); return;
      }
      add('bridge-present', Boolean(bridge));
      add('viewport-width', innerWidth === config.viewport.width, `${innerWidth}x${innerHeight}`);
      add('viewport-height', innerHeight === config.viewport.height, `${innerWidth}x${innerHeight}`);
      add('phone-no-horizontal-overflow', document.documentElement.scrollWidth <= innerWidth, `${document.documentElement.scrollWidth}/${innerWidth}`);
      add('branding-rendered', document.body.textContent.includes('NEW WORLD PROTOTYPE') && document.body.textContent.includes('OATHFORGE'));
      if (config.mode === 'disabled') {
        const flags = bridge.flags();
        add('all-disabled-flags', flags.ok && Object.values(flags.features).every(value => value === false));
        click('[data-nav="adventure"]');
        add('disabled-adventure-controls', document.querySelectorAll('[data-adventure][disabled]').length === 3);
        click('[data-nav="village"]');
        add('disabled-patrol-control', Boolean(document.querySelector('[data-act="patrol"][disabled]')));
        click('[data-nav="more"]');
        add('disabled-operations-render', Boolean(document.querySelector('[data-feature-unavailable="operations"]')));
        const before = slots.get(config.keys.active);
        const refused = ['story','tower','trade','optimize-trade','patrol-start','patrol-choice','operation-start','operation-claim','add-patrol'].map(name => bridge.act(name,name==='patrol-choice'?{patrol:0,choice:0}:undefined));
        add('disabled-bridge-actions-refused', refused.every(result => result.ok === false));
        add('disabled-bridge-actions-no-write', slots.get(config.keys.active) === before);
      } else {
        const flags = bridge.flags(), firstSnapshot = bridge.snapshot();
        add('default-flags-enabled', flags.ok && Object.values(flags.features).every(value => value === true));
        add('snapshot-current', firstSnapshot.ok && firstSnapshot.state.schemaVersion === 1);
        const offlineOpen = Boolean(document.querySelector('#overlay .offline-list'));
        add('offline-2h-modal', offlineOpen);
        if (offlineOpen) {
          const before = bridge.snapshot().state;
          click('[data-modal-act="collect-offline"]');
          const after = bridge.snapshot().state;
          add('offline-claim-persists', after.pendingGold === 0 && after.gold > before.gold);
        }
        const navigation = [];
        for (const view of ['village','oaths','fellows','adventure','more']) {
          click(`[data-nav="${view}"]`);
          navigation.push(Boolean(document.querySelector(`[data-nav="${view}"].on`)));
        }
        add('navigation-renders-all-views', navigation.every(Boolean));
        click('[data-nav="fellows"]');
        const rosterCounts = {};
        for (const tab of ['fellows','family','companions']) { click(`[data-roster="${tab}"]`); rosterCounts[tab]=document.querySelectorAll('.char-card').length; }
        add('roster-counts', rosterCounts.fellows === 6 && rosterCounts.family === 3 && rosterCounts.companions === 2, JSON.stringify(rosterCounts));
        click('[data-nav="village"]');
        const beforeUpgrade = bridge.snapshot().state;
        click('[data-building="training"]');
        const modalOpen = Boolean(document.querySelector('[data-modal-act="upgrade-building"]'));
        click('[data-modal-act="upgrade-building"]');
        const afterUpgrade = bridge.snapshot().state;
        add('building-modal-and-upgrade', modalOpen && afterUpgrade.buildings.training.level === beforeUpgrade.buildings.training.level + 1);
        const diagnosticsBefore = slots.get(config.keys.active), overlayBefore = document.querySelector('#overlay').innerHTML;
        const diagnostics = bridge.diagnostics({ at: config.now + 60_001 });
        add('diagnostics-live-accurate', diagnostics.ok && diagnostics.diagnostics.schema.current === 1 && Object.keys(diagnostics.diagnostics.buildingRateComponents).length === 4);
        add('diagnostics-live-no-mutation', slots.get(config.keys.active) === diagnosticsBefore && document.querySelector('#overlay').innerHTML === overlayBefore);
        const exportResult = bridge.recovery.export();
        add('safe-export-live-exact', exportResult.ok && exportResult.data.activeRaw === slots.get(config.keys.active));
        const clone = bridge.snapshot(); clone.state.buildings.training.level=999;
        add('snapshot-live-clone', bridge.snapshot().state.buildings.training.level !== 999);
      }
      add('realm-zero-errors', window.__GATE_0C_ERRORS__.length === 0, window.__GATE_0C_ERRORS__.join('\n'));
      send();
    })().catch(error => { add('realm-fatal',false,error.stack||error.message); send(); });
  }

  (async () => {
    const config = JSON.parse(window.name); window.name = '';
    const response = await fetch('../../index.html',{cache:'no-store'});
    if (!response.ok) throw new Error(`index.html: HTTP ${response.status}`);
    const source = await response.text();
    const firstScript = source.indexOf('<script>');
    if (firstScript < 0) throw new Error('Production script is missing');
    const bootstrap = `<script>(${installRuntime.toString()})(${inlineJson(config)})<\/script>`;
    const suite = `<script>(${runSuite.toString()})()<\/script>`;
    const instrumented = source.slice(0,firstScript) + bootstrap + source.slice(firstScript).replace('</body>',`${suite}</body>`);
    document.open(); document.write(instrumented); document.close();
  })().catch(error => parent.postMessage({ channel:'everstead-gate-0c', nonce:'unknown', results:[{id:'realm-loader-fatal',pass:false,detail:error.stack||error.message}], errors:[String(error.stack||error.message)] },'*'));
})();
