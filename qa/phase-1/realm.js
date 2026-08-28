(() => {
  'use strict';
  const inlineJson = value => JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

  function installRuntime(config) {
    const slots = new Map(Object.entries(config.slots));
    const nativeSetTimeout = window.setTimeout.bind(window);
    const nativeClearTimeout = window.clearTimeout.bind(window);
    const randomValues = config.randomSequence.slice();
    let randomIndex = 0;
    let saveIndex = 0;
    let transactionIndex = 0;
    window.__PHASE_1_CONFIG__ = config;
    window.__PHASE_1_SLOTS__ = slots;
    window.__PHASE_1_ERRORS__ = [];
    window.addEventListener('error', event => window.__PHASE_1_ERRORS__.push(String(event.error?.stack || event.message)));
    window.addEventListener('unhandledrejection', event => window.__PHASE_1_ERRORS__.push(String(event.reason?.stack || event.reason)));
    const runtime = {
      storage: {
        getItem(key) { return slots.get(String(key)) ?? null; },
        setItem(key, value) { slots.set(String(key), String(value)); },
        removeItem(key) { slots.delete(String(key)); }
      },
      clock: { now:() => config.now, setTimeout:nativeSetTimeout, clearTimeout:nativeClearTimeout },
      random() {
        if (randomIndex >= randomValues.length) throw new Error('browser runtime random exhausted');
        return randomValues[randomIndex++];
      },
      confirm:() => true,
      ids: {
        save:() => 'save-phase-1-browser-' + (++saveIndex),
        transaction:() => 'tx-phase-1-browser-' + (++transactionIndex)
      },
      qa:{ allowDestructive:true, isolatedStorage:true }
    };
    if (config.features) runtime.features = config.features;
    window.__EVERSTEAD_RUNTIME__ = runtime;
  }

  function runSuite() {
    const config = window.__PHASE_1_CONFIG__;
    const slots = window.__PHASE_1_SLOTS__;
    const results = [];
    const add = (id, pass, detail = '') => results.push({ id, pass:Boolean(pass), detail:String(detail) });
    const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
    const current = raw => {
      try {
        const value = JSON.parse(raw);
        return value?.schemaVersion === 2 ? value : null;
      } catch {
        return null;
      }
    };
    const click = selector => {
      const node = document.querySelector(selector);
      if (node) node.click();
      return node;
    };
    const send = () => parent.postMessage({ channel:'everstead-phase-1', nonce:config.nonce, results, errors:window.__PHASE_1_ERRORS__.slice() }, '*');
    (async () => {
      await wait(380);
      const bridge = window.__EVERSTEAD_QA__;
      if (!config.expectBridge) {
        add('bridge-absent-for-encoded-query', bridge === undefined);
        add('negative-realm-zero-errors', window.__PHASE_1_ERRORS__.length === 0, window.__PHASE_1_ERRORS__.join('\n'));
        send();
        return;
      }
      add('bridge-present', Boolean(bridge));
      add('viewport-width', innerWidth === config.viewport.width, innerWidth + 'x' + innerHeight);
      add('viewport-height', innerHeight === config.viewport.height, innerWidth + 'x' + innerHeight);
      add('phone-no-horizontal-overflow', document.documentElement.scrollWidth <= innerWidth, document.documentElement.scrollWidth + '/' + innerWidth);
      const visibleBody = document.body.cloneNode(true);
      visibleBody.querySelectorAll('script,style,template,noscript').forEach(node => node.remove());
      const bodyText = visibleBody.textContent;
      add('everstead-brand-rendered', bodyText.includes('EVERSTEAD'));
      add('legacy-visible-brand-absent', !/OATHFORGE|NEW WORLD PROTOTYPE|Reset Prototype/i.test(bodyText));
      add('ordinary-debug-controls-absent', !/SIMULATE 2H|\+1 PATROL|RESET PROTOTYPE/i.test(bodyText));
      const first = bridge.snapshot();
      add('schema-2-snapshot', first.ok && first.state.schemaVersion === 2);
      add('active-operators-absent', first.ok && Object.values(first.state.buildings).every(building => !Object.hasOwn(building, 'operators')));
      add('offline-2h-modal', Boolean(document.querySelector('#overlay .offline-list')));

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
        const refused = ['story','tower','trade','optimize-trade','patrol-start','operation-start','operation-claim'].map(name => bridge.act(name));
        add('disabled-actions-refused', refused.every(value => value.ok === false));
        add('disabled-actions-no-write', slots.get(config.keys.active) === before);
      } else {
        if (config.mode === 'legacy') {
          const schemaOne = JSON.parse(slots.get(config.keys.backupV1));
          add('legacy-v0-backup-exact', slots.get(config.keys.backupV0) === config.originalActiveRaw);
          add('legacy-schema-1-backup', schemaOne.schemaVersion === 1 && Object.values(schemaOne.buildings).every(building => Array.isArray(building.operators)));
          add('legacy-unicode-preserved', first.state.oaths.some(oath => oath.title === 'Fixture café review 🌵'));
        } else {
          add('current-v1-backup-exact', slots.get(config.keys.backupV1) === config.originalActiveRaw);
          add('current-v1-undo-preserved', first.state.undo?.kind === 'oath-completion');
        }
        const beforeCollect = bridge.snapshot().state;
        click('[data-modal-act="collect-offline"]');
        const afterCollect = bridge.snapshot().state;
        add('offline-claim-persists', afterCollect.gold > beforeCollect.gold && afterCollect.pendingGold >= 0 && afterCollect.pendingGold < 1);
        const goldAfterClaim = afterCollect.gold;
        bridge.act('collect');
        add('offline-double-claim-prevented', bridge.snapshot().state.gold === goldAfterClaim);
        const navigation = [];
        for (const view of ['village','oaths','fellows','adventure','more']) {
          click('[data-nav="' + view + '"]');
          navigation.push(Boolean(document.querySelector('[data-nav="' + view + '"].on')));
        }
        add('navigation-renders-all-views', navigation.every(Boolean));
        click('[data-nav="more"]');
        const moreText = document.querySelector('main.screen')?.textContent || '';
        add('more-debug-controls-absent', !/SIMULATE|\+1 PATROL|RESET PROTOTYPE/i.test(moreText));
        click('[data-nav="fellows"]');
        const counts = {};
        for (const tab of ['fellows','family','companions']) {
          click('[data-roster="' + tab + '"]');
          counts[tab] = document.querySelectorAll('.char-card').length;
        }
        add('roster-counts', counts.fellows === 6 && counts.family === 3 && counts.companions === 2, JSON.stringify(counts));
        click('[data-nav="village"]');
        const beforeUpgrade = bridge.snapshot().state;
        click('[data-building="training"]');
        const modalText = document.querySelector('#overlay')?.textContent || '';
        add('building-phase-3-copy', modalText.includes('Family assignment unlocks in Phase 3'));
        add('building-operator-ui-absent', !document.querySelector('[data-operator]') && !modalText.includes('Operators'));
        click('[data-modal-act="upgrade-building"]');
        const afterUpgrade = bridge.snapshot().state;
        add('building-upgrade-persists', afterUpgrade.buildings.training.level === beforeUpgrade.buildings.training.level + 1);
        const beforeDiagnostic = slots.get(config.keys.active);
        const diagnostic = bridge.diagnostics({ at:config.now });
        add('diagnostics-schema-and-rates', diagnostic.ok && diagnostic.diagnostics.schema.current === 2 && diagnostic.diagnostics.totalVillageGoldPerHour > 0 && Object.keys(diagnostic.diagnostics.buildingRateComponents).length === 4);
        add('diagnostics-neutral-hooks', diagnostic.ok && Object.values(diagnostic.diagnostics.buildingRateComponents).every(item => item.characterEconomyMultiplier === 1));
        add('diagnostics-no-write', slots.get(config.keys.active) === beforeDiagnostic);
        const exported = bridge.recovery.export();
        add('safe-export-exact', exported.ok && exported.data.activeRaw === slots.get(config.keys.active) && exported.data.preV2BackupRaw === slots.get(config.keys.backupV1));
        const cloned = bridge.snapshot();
        cloned.state.buildings.training.level = 999;
        add('snapshot-deep-clone', bridge.snapshot().state.buildings.training.level !== 999);
      }
      add('realm-zero-errors', window.__PHASE_1_ERRORS__.length === 0, window.__PHASE_1_ERRORS__.join('\n'));
      send();
    })().catch(error => {
      add('realm-fatal', false, error.stack || error.message);
      send();
    });
  }

  (async () => {
    const config = JSON.parse(window.name);
    window.name = '';
    const response = await fetch('../../index.html', { cache:'no-store' });
    if (!response.ok) throw new Error('index.html: HTTP ' + response.status);
    const source = await response.text();
    const firstScript = source.indexOf('<script>');
    if (firstScript < 0) throw new Error('Production script is missing');
    const bootstrap = '<script>(' + installRuntime.toString() + ')(' + inlineJson(config) + ')<\/script>';
    const suite = '<script>(' + runSuite.toString() + ')()<\/script>';
    const instrumented = source.slice(0, firstScript) + bootstrap + source.slice(firstScript).replace('</body>', suite + '</body>');
    document.open();
    document.write(instrumented);
    document.close();
  })().catch(error => parent.postMessage({ channel:'everstead-phase-1', nonce:'unknown', results:[{ id:'realm-loader-fatal', pass:false, detail:error.stack || error.message }], errors:[String(error.stack || error.message)] }, '*'));
})();
