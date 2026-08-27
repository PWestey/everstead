(() => {
  'use strict';

  const CHANNEL = 'everstead-gate-0a';
  const runButton = document.querySelector('#run');
  const resultsNode = document.querySelector('#results');
  const fatalNode = document.querySelector('#fatal');
  const totalNode = document.querySelector('#total');
  const passedNode = document.querySelector('#passed');
  const failedNode = document.querySelector('#failed');
  const durationNode = document.querySelector('#duration');

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  function inlineJson(value) {
    return JSON.stringify(value)
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(/&/g, '\\u0026')
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029');
  }

  function bytesToHex(bytes) {
    return [...new Uint8Array(bytes)].map(value => value.toString(16).padStart(2, '0')).join('');
  }

  async function sha256(bytes) {
    return bytesToHex(await crypto.subtle.digest('SHA-256', bytes));
  }

  async function fetchBytes(path) {
    const response = await fetch(path, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Unable to fetch ${path}: HTTP ${response.status}`);
    return new Uint8Array(await response.arrayBuffer());
  }

  function decode(bytes) {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  }

  function result(id, name, classification, pass, detail) {
    return { id, name, classification, pass: Boolean(pass), detail: String(detail ?? '') };
  }

  function realmAgent() {
    const harness = window.__gate0a;
    const config = harness.config;
    const expected = config.expected;
    const activeKey = config.storageKeys.active;
    const results = [];

    const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
    const add = (id, name, classification, pass, detail = '') => {
      results.push({ id, name, classification, pass: Boolean(pass), detail: String(detail) });
    };
    const query = selector => document.querySelector(selector);
    const click = selector => {
      const node = query(selector);
      if (!node) throw new Error(`Missing element: ${selector}`);
      node.click();
      return node;
    };
    const closeModal = () => {
      const node = query('[data-modal-close]');
      if (node) node.click();
    };
    const state = () => JSON.parse(localStorage.getItem(activeKey));
    const rawState = () => localStorage.getItem(activeKey);
    const near = (actual, wanted, tolerance = 1e-7) => Number.isFinite(actual) && Math.abs(actual - wanted) <= tolerance;
    const deepEqual = (left, right) => JSON.stringify(left) === JSON.stringify(right);
    const clone = value => JSON.parse(JSON.stringify(value));
    const setPath = (target, path, value) => {
      const parts = path.split('.');
      let cursor = target;
      for (const part of parts.slice(0, -1)) {
        if (cursor == null || typeof cursor !== 'object' || !(part in cursor)) throw new Error(`Unknown expected mutation path: ${path}`);
        cursor = cursor[part];
      }
      const leaf = parts.at(-1);
      if (cursor == null || typeof cursor !== 'object' || !(leaf in cursor)) throw new Error(`Unknown expected mutation path: ${path}`);
      cursor[leaf] = value;
    };
    const stateDifferences = (actual, wanted, path = '$', differences = []) => {
      if (Object.is(actual, wanted)) return differences;
      const actualArray = Array.isArray(actual);
      const wantedArray = Array.isArray(wanted);
      if (actualArray !== wantedArray || actual == null || wanted == null || typeof actual !== 'object' || typeof wanted !== 'object') {
        differences.push(`${path}: expected ${JSON.stringify(wanted)}, got ${JSON.stringify(actual)}`);
        return differences;
      }
      const actualKeys = Object.keys(actual).sort();
      const wantedKeys = Object.keys(wanted).sort();
      if (!deepEqual(actualKeys, wantedKeys)) {
        differences.push(`${path}: expected keys ${JSON.stringify(wantedKeys)}, got ${JSON.stringify(actualKeys)}`);
      }
      for (const key of [...new Set([...actualKeys, ...wantedKeys])]) {
        if (!(key in actual) || !(key in wanted)) continue;
        stateDifferences(actual[key], wanted[key], actualArray ? `${path}[${key}]` : `${path}.${key}`, differences);
      }
      return differences;
    };
    const compareCompleteState = mutations => {
      const wanted = clone(JSON.parse(harness.initialActiveRaw));
      for (const [path, value] of Object.entries(mutations)) setPath(wanted, path, value);
      const actual = state();
      const wantedTopLevel = [...expected.completeState.requiredTopLevelKeys].sort();
      const actualTopLevel = Object.keys(actual).sort();
      const topLevelPass = deepEqual(actualTopLevel, wantedTopLevel);
      const differences = stateDifferences(actual, wanted);
      if (!topLevelPass) differences.unshift(`$: contract top-level keys ${JSON.stringify(wantedTopLevel)}, got ${JSON.stringify(actualTopLevel)}`);
      return { pass: topLevelPass && differences.length === 0, detail: differences.slice(0, 20).join(' | ') || 'all persisted fields match' };
    };

    async function runFresh() {
      await wait(20);
      const saved = state();
      add('fresh-console', 'Fresh boot has no uncaught or console errors', 'required', harness.errors.length === 0, harness.errors.join(' | '));
      add('fresh-save-created', 'Fresh boot creates an active v0.1 save in memory', 'required', Boolean(rawState()), `bytes=${rawState()?.length ?? 0}`);
      add(
        'fresh-defaults',
        'Fresh defaults retain the baseline resources and roster sizes',
        'required',
        saved.gold === expected.gold && saved.prosperity === expected.prosperity && saved.oaths.length === expected.oathCount &&
          Object.keys(saved.buildings).length === expected.buildingCount && Object.keys(saved.fellows).length === expected.fellowCount &&
          Object.keys(saved.family).length === expected.familyCount && Object.keys(saved.companions).length === expected.companionCount,
        `gold=${saved.gold}, prosperity=${saved.prosperity}`
      );
      add('fresh-shell', 'Fresh boot renders the Village and five navigation targets', 'required', Boolean(query('.village-screen')) && document.querySelectorAll('[data-nav]').length === 5);
    }

    async function runRepresentative() {
      await wait(20);
      let saved = state();
      add('representative-console', 'Representative save boots without uncaught or console errors', 'required', harness.errors.length === 0, harness.errors.join(' | '));
      const initialStateComparison = compareCompleteState(expected.completeState.initialBootMutations);
      add(
        'representative-complete-initial-state',
        'Initial boot exactly preserves every persisted field except the named lastSeen mutation',
        'required',
        initialStateComparison.pass,
        initialStateComparison.detail
      );

      click('[data-nav="more"]');
      try {
        window.eval(harness.productionScript);
      } catch (error) {
        harness.errors.push(`reload eval: ${error.message}`);
      }
      await wait(20);
      saved = state();
      const rebootStateComparison = compareCompleteState(expected.completeState.deterministicRebootMutations);
      add(
        'representative-complete-reboot-state',
        'Deterministic re-boot exactly preserves every persisted field except named lastSeen and ui.view mutations',
        'required',
        rebootStateComparison.pass && harness.errors.length === 0,
        [rebootStateComparison.detail, ...harness.errors].join(' | ')
      );

      const navigationChecks = [
        ['village', '.village-screen'],
        ['oaths', 'main h1'],
        ['fellows', 'main h1'],
        ['adventure', 'main h1'],
        ['more', 'main h1']
      ];
      let navigationPass = true;
      for (const [view, selector] of navigationChecks) {
        click(`[data-nav="${view}"]`);
        navigationPass &&= Boolean(query(selector)) && Boolean(query(`[data-nav="${view}"].on`));
      }
      add('navigation', 'All five top-level navigation targets render and select', 'required', navigationPass, `count=${document.querySelectorAll('[data-nav]').length}`);

      click('[data-nav="fellows"]');
      const rosterCounts = {};
      for (const tab of ['fellows', 'family', 'companions']) {
        click(`[data-roster="${tab}"]`);
        rosterCounts[tab] = document.querySelectorAll('.char-card').length;
      }
      add(
        'roster-counts',
        'Fellow, Family, and Companion roster counts match the baseline',
        'required',
        rosterCounts.fellows === expected.rosterCounts.fellows && rosterCounts.family === expected.rosterCounts.family && rosterCounts.companions === expected.rosterCounts.companions,
        JSON.stringify(rosterCounts)
      );

      let modalPass = true;
      click('[data-roster="fellows"]');
      click('[data-fellow]'); modalPass &&= Boolean(query('#overlay .profile')); closeModal();
      click('[data-roster="family"]');
      click('[data-family]'); modalPass &&= Boolean(query('#overlay .profile')); closeModal();
      click('[data-roster="companions"]');
      click('[data-companion]'); modalPass &&= Boolean(query('#overlay .profile')); closeModal();
      click('[data-nav="village"]');
      click('[data-building="training"]'); modalPass &&= Boolean(query('[data-modal-act="upgrade-building"]')); closeModal();
      click('[data-nav="oaths"]');
      click('[data-edit-oath="o1"]'); modalPass &&= Boolean(query('#oath-form')); closeModal();
      add('representative-modals', 'Representative Building, roster, and Oath modals open and close', 'required', modalPass);

      click('[data-nav="village"]');
      const topRect = query('.topbar').getBoundingClientRect();
      const bottomRect = query('.bottom-nav').getBoundingClientRect();
      const noHorizontalOverflow = document.documentElement.scrollWidth <= window.innerWidth + 1;
      const barsInViewport = topRect.left >= -1 && topRect.right <= window.innerWidth + 1 && bottomRect.left >= -1 &&
        bottomRect.right <= window.innerWidth + 1 && bottomRect.bottom <= window.innerHeight + 1;
      add(
        'phone-structure-320',
        'The 320 by 568 disposable viewport keeps fixed bars and navigation structurally reachable',
        'required',
        window.innerWidth === 320 && noHorizontalOverflow && barsInViewport && document.querySelectorAll('.bottom-nav button').length === 5,
        `viewport=${window.innerWidth}x${window.innerHeight}, scrollWidth=${document.documentElement.scrollWidth}`
      );

      const upgradeBefore = state();
      click('[data-building="training"]');
      click('[data-modal-act="upgrade-building"]');
      const upgradeAfter = state();
      add(
        'building-upgrade',
        'Training Grounds upgrade spends the fixed legacy cost and raises one level',
        'required',
        upgradeBefore.buildings.training.level === expected.buildingUpgrade.initialLevel &&
          upgradeAfter.buildings.training.level === expected.buildingUpgrade.resultingLevel &&
          upgradeAfter.gold === expected.buildingUpgrade.resultingGold,
        `gold=${upgradeAfter.gold}, level=${upgradeAfter.buildings.training.level}`
      );
      closeModal();

      click('[data-nav="oaths"]');
      const beforeOath = state();
      click('[data-oath="o1"]');
      const completed = state();
      add(
        'oath-completion',
        'Easy Oath completion applies its fixed rewards and final Building boost',
        'required',
        completed.oaths.find(item => item.id === 'o1').doneKey === 'D2030-6-17' &&
          completed.oaths.find(item => item.id === 'o1').streak === 6 && completed.prosperity === beforeOath.prosperity + 2 &&
          near(completed.buildings.archives.boost, expected.oathBoosts.easyArchives)
      );
      click('[data-modal-act="undo-oath"]');
      const immediatelyUndone = state();
      add('oath-immediate-undo', 'Immediate Oath undo restores the pre-completion state', 'required', deepEqual(immediatelyUndone, beforeOath));

      click('[data-oath="o1"]');
      const appCollect = query('#app [data-act="collect"]');
      appCollect.click();
      const afterUnrelatedCollect = state();
      click('[data-modal-act="undo-oath"]');
      const afterWholeStateUndo = state();
      add(
        'whole-state-oath-undo',
        'Oath undo also rolls back an unrelated Gold collection made after completion',
        'legacy-defect',
        afterUnrelatedCollect.gold > beforeOath.gold && afterUnrelatedCollect.pendingGold === 0 &&
          afterWholeStateUndo.gold === beforeOath.gold && near(afterWholeStateUndo.pendingGold, beforeOath.pendingGold),
        `collectedGold=${afterUnrelatedCollect.gold}, restoredGold=${afterWholeStateUndo.gold}`
      );

      click('[data-oath="o1"]'); closeModal();
      click('[data-oath="o3"]'); closeModal();
      click('[data-oath="o2"]'); closeModal();
      saved = state();
      add(
        'oath-multipliers',
        'Easy, Medium, and Hard Oaths add the fixed 3, 5, and 8 percentage-point boosts',
        'required',
        near(saved.buildings.archives.boost, expected.oathBoosts.easyArchives) &&
          near(saved.buildings.command.boost, expected.oathBoosts.mediumCommand) &&
          near(saved.buildings.training.boost, expected.oathBoosts.hardTraining)
      );

      for (let index = 0; index < 7; index += 1) {
        click('[data-oath="o4"]');
        closeModal();
      }
      saved = state();
      add('oath-cap', 'Repeated Oath boosts stop at the fixed 30 percent daily Building cap', 'required', near(saved.buildings.hearth.boost, expected.oathBoosts.hearthCap));
    }

    async function runSparseOrWrongType() {
      await wait(20);
      add(
        `${config.id}-boot-error`,
        config.id === 'sparse' ? 'Sparse nested state causes a boot-time failure' : 'Wrong-type state causes a boot-time failure',
        'legacy-defect',
        harness.errors.length > 0,
        harness.errors.join(' | ')
      );
    }

    async function runCorrupt() {
      await wait(20);
      const raw = rawState();
      const saved = JSON.parse(raw);
      add(
        'corrupt-overwrite',
        'Corrupt active JSON is silently overwritten by a fresh default save',
        'legacy-defect',
        raw !== harness.initialActiveRaw && saved.gold === expected.gold && saved.oaths.length === expected.oathCount,
        `initialBytes=${harness.initialActiveRaw.length}, resultingBytes=${raw.length}`
      );
    }

    async function runClockRollback() {
      await wait(20);
      const saved = state();
      add('rollback-no-negative-gold', 'Clock rollback earns no negative or positive offline Gold', 'required', near(saved.pendingGold, expected.pendingGold));
      add(
        'rollback-moves-last-gold-at',
        'Clock rollback moves a future lastGoldAt backward to the current clock',
        'legacy-defect',
        saved.lastGoldAt === expected.resultingLastGoldAt,
        `lastGoldAt=${saved.lastGoldAt}`
      );
    }

    async function runCrossMidnight() {
      await wait(320);
      const saved = state();
      const rolloverPass = saved.day === expected.day && saved.patrolBank === expected.patrolBank &&
        saved.oaths.find(item => item.id === 'o4').count === expected.habitCount &&
        Object.values(saved.buildings).every(building => building.boost === expected.boost && building.boostDay === expected.day);
      add('cross-midnight-rollover', 'Cross-midnight load performs the baseline daily rollover', 'required', rolloverPass);
      add(
        'cross-midnight-unsegmented',
        'Cross-midnight accrual pays the whole interval at the post-rollover unboosted rate',
        'legacy-defect',
        near(saved.pendingGold, expected.pendingGoldAtUnsegmentedRate, 1e-6) &&
          !near(saved.pendingGold, expected.pendingGoldIfSegmentedCorrectly, 1e-6),
        `actual=${saved.pendingGold}, segmented=${expected.pendingGoldIfSegmentedCorrectly}`
      );
    }

    async function runOfflineCap() {
      await wait(320);
      const saved = state();
      add(
        'offline-24-hour-cap',
        'Thirty elapsed hours award the fixed twenty-four-hour capped amount',
        'required',
        near(saved.pendingGold, expected.pendingGold, 1e-6) && saved.lastGoldAt === expected.lastGoldAt,
        `pendingGold=${saved.pendingGold}`
      );
      add('offline-summary-modal', 'Capped offline accrual opens the claim summary modal', 'required', Boolean(query('#overlay .offline-list')));
    }

    async function runLastGoldAtZero() {
      await wait(20);
      const saved = state();
      add(
        'last-gold-at-zero-fallback',
        'A zero lastGoldAt is treated as now, earns nothing, and is replaced',
        'legacy-defect',
        near(saved.pendingGold, expected.pendingGold) && saved.lastGoldAt === expected.resultingLastGoldAt,
        `pendingGold=${saved.pendingGold}, lastGoldAt=${saved.lastGoldAt}`
      );
    }

    async function runFractionalPendingGold() {
      await wait(20);
      const before = state();
      click('#app [data-act="collect"]');
      const after = state();
      const lost = before.pendingGold - (after.gold - before.gold) - after.pendingGold;
      add(
        'fractional-pending-loss',
        'Collect floors pending Gold and discards the fractional remainder',
        'legacy-defect',
        before.gold === expected.initialGold && near(before.pendingGold, expected.initialPendingGold) &&
          after.gold === expected.resultingGold && after.pendingGold === expected.resultingPendingGold && near(lost, expected.lostFraction),
        `lost=${lost}`
      );
    }

    function applyBoundaryStatePatch(saved, statePatch = {}) {
      if ('day' in statePatch) saved.day = statePatch.day;
      if ('patrolBank' in statePatch) saved.patrolBank = statePatch.patrolBank;
      if ('habitCount' in statePatch) saved.oaths.find(item => item.id === 'o4').count = statePatch.habitCount;
      if ('buildingBoost' in statePatch || 'boostDay' in statePatch) {
        for (const building of Object.values(saved.buildings)) {
          if ('buildingBoost' in statePatch) building.boost = statePatch.buildingBoost;
          if ('boostDay' in statePatch) building.boostDay = statePatch.boostDay;
        }
      }
    }

    async function bootBoundaryCase(boundaryCase) {
      const saved = clone(JSON.parse(harness.initialActiveRaw));
      saved.gold = expected.initialGold;
      saved.pendingGold = 0;
      saved.lastSeen = config.now;
      if (boundaryCase.removeLastGoldAt) delete saved.lastGoldAt;
      else saved.lastGoldAt = config.now - boundaryCase.elapsedMs;
      applyBoundaryStatePatch(saved, boundaryCase.statePatch);
      localStorage.setItem(activeKey, JSON.stringify(saved));
      query('#app').innerHTML = '';
      query('#overlay').innerHTML = '';
      query('#toast').innerHTML = '';
      const errorsBefore = harness.errors.length;
      try {
        window.eval(harness.productionScript);
      } catch (error) {
        harness.errors.push(`${boundaryCase.id} eval: ${error.message}`);
      }
      await wait(320);
      return { saved: state(), newErrors: harness.errors.slice(errorsBefore) };
    }

    async function runOfflineBoundaries() {
      for (const boundaryCase of expected.cases) {
        const booted = await bootBoundaryCase(boundaryCase);
        const saved = booted.saved;
        const modalOpen = Boolean(query('#overlay .offline-list'));
        let pass = booted.newErrors.length === 0 && near(saved.pendingGold, boundaryCase.expectedPendingGold ?? 0, 1e-6) &&
          modalOpen === boundaryCase.expectModal;
        if ('expectedLastGoldAt' in boundaryCase) pass &&= saved.lastGoldAt === boundaryCase.expectedLastGoldAt;
        if (boundaryCase.expectedState) {
          const habit = saved.oaths.find(item => item.id === 'o4');
          pass &&= saved.day === boundaryCase.expectedState.day && saved.patrolBank === boundaryCase.expectedState.patrolBank &&
            habit.count === boundaryCase.expectedState.habitCount &&
            Object.values(saved.buildings).every(building => building.boost === boundaryCase.expectedState.buildingBoost && building.boostDay === boundaryCase.expectedState.day);
        }
        let actionDetail = '';
        if (boundaryCase.action === 'claim-twice') {
          click('[data-modal-act="collect-offline"]');
          const afterFirstClaim = state();
          click('#app [data-act="collect"]');
          const afterSecondClaim = state();
          pass &&= afterFirstClaim.gold === boundaryCase.expectedAfterClaim.gold && afterFirstClaim.pendingGold === 0 &&
            afterSecondClaim.gold === afterFirstClaim.gold && afterSecondClaim.pendingGold === 0;
          actionDetail = `, firstGold=${afterFirstClaim.gold}, secondGold=${afterSecondClaim.gold}`;
        }
        add(
          `offline-boundary-${boundaryCase.id}`,
          `Offline boundary: ${boundaryCase.id}`,
          boundaryCase.classification,
          pass,
          `pendingGold=${saved.pendingGold}, modal=${modalOpen}${actionDetail}${booted.newErrors.length ? `, errors=${booted.newErrors.join(' | ')}` : ''}`
        );
      }
    }

    async function runOfflineClaim() {
      await wait(320);
      const before = state();
      const modalBefore = Boolean(query('#overlay .offline-list'));
      click('[data-modal-act="collect-offline"]');
      const after = state();
      const persistedAfter = JSON.parse(rawState());
      const modalClosed = query('#overlay').innerHTML === '';
      add(
        'offline-special-claim',
        'The offline summary claim transfers whole Gold, resets pending Gold, persists, and closes its modal',
        'required',
        harness.errors.length === 0 && modalBefore && near(before.pendingGold, expected.pendingGoldBeforeClaim, 1e-6) && after.gold === expected.resultingGold &&
          after.gold - before.gold === expected.claimedWholeGold && after.pendingGold === expected.resultingPendingGold &&
          after.lastGoldAt === expected.lastGoldAt && deepEqual(persistedAfter, after) && modalClosed,
        `beforeGold=${before.gold}, pending=${before.pendingGold}, afterGold=${after.gold}, modalClosed=${modalClosed}`
      );

      const errorsBeforeReboot = harness.errors.length;
      try {
        window.eval(harness.productionScript);
      } catch (error) {
        harness.errors.push(`offline claim reboot eval: ${error.message}`);
      }
      await wait(320);
      const rebooted = state();
      const modalAfterReboot = Boolean(query('#overlay .offline-list'));
      const rebootErrors = harness.errors.slice(errorsBeforeReboot);
      click('#app [data-act="collect"]');
      const secondClaim = state();
      add(
        'offline-immediate-second-claim',
        'A deterministic re-boot and immediate second claim do not award the same offline interval twice',
        'required',
        rebootErrors.length === 0 && !modalAfterReboot && rebooted.gold === expected.resultingGold && rebooted.pendingGold === 0 &&
          secondClaim.gold === rebooted.gold && secondClaim.pendingGold === 0,
        `rebootGold=${rebooted.gold}, secondGold=${secondClaim.gold}, modal=${modalAfterReboot}${rebootErrors.length ? `, errors=${rebootErrors.join(' | ')}` : ''}`
      );
    }

    async function execute() {
      try {
        if (config.id === 'fresh') await runFresh();
        else if (config.id === 'representative') await runRepresentative();
        else if (config.id === 'sparse' || config.id === 'wrong-type') await runSparseOrWrongType();
        else if (config.id === 'corrupt') await runCorrupt();
        else if (config.id === 'clock-rollback') await runClockRollback();
        else if (config.id === 'cross-midnight') await runCrossMidnight();
        else if (config.id === 'offline-24-hour-cap') await runOfflineCap();
        else if (config.id === 'last-gold-at-zero') await runLastGoldAtZero();
        else if (config.id === 'fractional-pending-gold') await runFractionalPendingGold();
        else if (config.id === 'offline-boundaries') await runOfflineBoundaries();
        else if (config.id === 'offline-claim') await runOfflineClaim();
        else throw new Error(`Unknown scenario: ${config.id}`);
      } catch (error) {
        add(`${config.id}-harness`, `Scenario ${config.id} completed`, config.contractClassification, false, error.stack || error.message);
      }
      parent.postMessage({ channel: 'everstead-gate-0a', nonce: config.nonce, scenarioId: config.id, results }, '*');
    }

    execute();
  }

  function prelude(config) {
    const NativeDate = Date;
    const offsetMilliseconds = config.timezoneOffsetMinutes * 60_000;
    const errors = [];
    const warnings = [];
    const slots = new Map(config.storageEntries);
    const memoryStorage = {
      get length() { return slots.size; },
      clear() { slots.clear(); },
      getItem(key) { const value = slots.get(String(key)); return value == null ? null : value; },
      key(index) { return [...slots.keys()][index] ?? null; },
      removeItem(key) { slots.delete(String(key)); },
      setItem(key, value) { slots.set(String(key), String(value)); }
    };

    Object.defineProperty(window, 'localStorage', { configurable: false, enumerable: true, value: memoryStorage });
    if (window.localStorage !== memoryStorage) throw new Error('Memory-storage isolation failed before production boot.');

    class FixedDate extends NativeDate {
      constructor(...args) {
        if (args.length === 0) super(config.now);
        else if (args.length === 1) super(args[0]);
        else {
          const [year, month, date = 1, hours = 0, minutes = 0, seconds = 0, milliseconds = 0] = args;
          super(NativeDate.UTC(year, month, date, hours, minutes, seconds, milliseconds) + offsetMilliseconds);
        }
      }
      static now() { return config.now; }
      static parse(value) { return NativeDate.parse(value); }
      static UTC(...args) { return NativeDate.UTC(...args); }
      _shifted() { return new NativeDate(this.getTime() - offsetMilliseconds); }
      getFullYear() { return this._shifted().getUTCFullYear(); }
      getMonth() { return this._shifted().getUTCMonth(); }
      getDate() { return this._shifted().getUTCDate(); }
      getDay() { return this._shifted().getUTCDay(); }
      getHours() { return this._shifted().getUTCHours(); }
      getMinutes() { return this._shifted().getUTCMinutes(); }
      getTimezoneOffset() { return config.timezoneOffsetMinutes; }
      setDate(value) {
        const shifted = this._shifted();
        const next = NativeDate.UTC(
          shifted.getUTCFullYear(), shifted.getUTCMonth(), value, shifted.getUTCHours(), shifted.getUTCMinutes(),
          shifted.getUTCSeconds(), shifted.getUTCMilliseconds()
        ) + offsetMilliseconds;
        return this.setTime(next);
      }
    }

    window.Date = FixedDate;
    let randomIndex = 0;
    Math.random = () => config.randomSequence[randomIndex++ % config.randomSequence.length];
    window.confirm = () => false;
    window.addEventListener('error', event => errors.push(event.error?.stack || event.message || 'window error'));
    window.addEventListener('unhandledrejection', event => errors.push(event.reason?.stack || String(event.reason)));
    const originalError = console.error.bind(console);
    const originalWarn = console.warn.bind(console);
    console.error = (...args) => { errors.push(args.map(String).join(' ')); originalError(...args); };
    console.warn = (...args) => { warnings.push(args.map(String).join(' ')); originalWarn(...args); };

    window.__gate0a = {
      config,
      errors,
      warnings,
      initialActiveRaw: memoryStorage.getItem(config.storageKeys.active),
      productionScript: config.productionScript
    };
  }

  async function loadContract() {
    const manifestBytes = await fetchBytes('./baseline-manifest.json');
    const manifest = JSON.parse(decode(manifestBytes));
    const scenariosBytes = await fetchBytes('../' + manifest.scenarioData.path);
    const scenarioHash = await sha256(scenariosBytes);
    if (scenarioHash !== manifest.scenarioData.sha256 || scenariosBytes.byteLength !== manifest.scenarioData.byteLength) {
      throw new Error('Scenario data does not match the baseline manifest.');
    }
    const scenarioData = JSON.parse(decode(scenariosBytes));

    const fixtureRaw = new Map();
    const fixtureResults = [];
    for (const fixture of manifest.fixtures) {
      const bytes = await fetchBytes('../' + fixture.path);
      const raw = decode(bytes);
      const hash = await sha256(bytes);
      const pass = hash === fixture.sha256 && bytes.byteLength === fixture.byteLength && raw.length === fixture.codeUnitLength &&
        raw.endsWith('\n') === fixture.trailingNewline;
      fixtureResults.push(result(`fixture-${fixture.id}`, `Fixture ${fixture.id} bytes and metadata match`, 'required', pass,
        `sha256=${hash}, bytes=${bytes.byteLength}, codeUnits=${raw.length}, trailingNewline=${raw.endsWith('\n')}`));
      fixtureRaw.set(fixture.id, raw);
    }
    const fixtureFailures = fixtureResults.filter(item => !item.pass);
    if (fixtureFailures.length > 0) {
      throw new Error(`Fixture integrity failure; refusing to execute any scenario: ${fixtureFailures.map(item => item.id).join(', ')}`);
    }

    const indexBytes = await fetchBytes('../' + manifest.artifact.path);
    const indexHash = await sha256(indexBytes);
    const artifactPass = indexHash === manifest.artifact.sha256 && indexBytes.byteLength === manifest.artifact.byteLength;
    const artifactResult = result('baseline-artifact', 'index.html opaque bytes match the locked baseline', 'required', artifactPass,
      `sha256=${indexHash}, bytes=${indexBytes.byteLength}`);
    if (!artifactPass) throw new Error('Refusing to execute index.html because its opaque bytes do not match the locked manifest.');

    const source = decode(indexBytes);
    const scriptMatch = source.match(/<script>([\s\S]*?)<\/script>/);
    if (!scriptMatch) throw new Error('Verified baseline does not contain the expected inline production script.');

    return { manifest, scenarioData, fixtureRaw, source, productionScript: scriptMatch[1], staticResults: [artifactResult, ...fixtureResults] };
  }

  function scenarioStorageEntries(scenario, fixtureRaw, storageKeys) {
    const slots = [
      ['active', 'activeRawFixtureId'],
      ['backup', 'backupRawFixtureId'],
      ['staging', 'stagingRawFixtureId']
    ];
    return slots.flatMap(([slot, field]) => {
      const fixtureId = scenario.storage[field];
      if (fixtureId == null) return [];
      if (!fixtureRaw.has(fixtureId)) throw new Error(`Scenario ${scenario.id} references missing fixture ${fixtureId}.`);
      return [[storageKeys[slot], fixtureRaw.get(fixtureId)]];
    });
  }

  function runScenario(contract, scenario) {
    return new Promise((resolve, reject) => {
      const nonce = `${scenario.id}-${crypto.randomUUID()}`;
      const frame = document.createElement('iframe');
      frame.setAttribute('sandbox', 'allow-scripts');
      frame.setAttribute('aria-hidden', 'true');
      frame.style.cssText = `position:absolute;left:-10000px;top:0;border:0;width:${scenario.id === 'representative' ? 320 : 390}px;height:${scenario.id === 'representative' ? 568 : 844}px`;

      const timeout = setTimeout(() => finish(new Error(`Scenario ${scenario.id} timed out.`)), 45_000);
      const onMessage = event => {
        if (event.source !== frame.contentWindow || event.data?.channel !== CHANNEL || event.data?.nonce !== nonce) return;
        finish(null, event.data.results);
      };
      const finish = (error, scenarioResults) => {
        clearTimeout(timeout);
        window.removeEventListener('message', onMessage);
        frame.remove();
        if (error) reject(error);
        else resolve(scenarioResults);
      };
      window.addEventListener('message', onMessage);

      const config = {
        id: scenario.id,
        nonce,
        contractClassification: scenario.contractClassification,
        now: Date.parse(scenario.frozenNow),
        timezoneOffsetMinutes: scenario.timezoneOffsetMinutes,
        randomSequence: scenario.randomSequence,
        storageKeys: contract.scenarioData.storageKeys,
        storageEntries: scenarioStorageEntries(scenario, contract.fixtureRaw, contract.scenarioData.storageKeys),
        expected: scenario.expected,
        productionScript: contract.productionScript
      };
      const preludeScript = `<script>(${prelude.toString()})(${inlineJson(config)})</script>`;
      const agentScript = `<script>(${realmAgent.toString()})()</script>`;
      const sourceWithPrelude = contract.source.replace('<head>', `<head>${preludeScript}`);
      frame.srcdoc = sourceWithPrelude.replace('</body>', `${agentScript}</body>`);
      document.body.appendChild(frame);
    });
  }

  function renderResults(results, elapsed) {
    const passed = results.filter(item => item.pass).length;
    const failed = results.length - passed;
    totalNode.textContent = String(results.length);
    passedNode.textContent = String(passed);
    failedNode.textContent = String(failed);
    durationNode.textContent = `${Math.round(elapsed)} ms`;
    resultsNode.innerHTML = results.map(item => {
      const status = item.pass ? (item.classification === 'legacy-defect' ? 'OBSERVED' : 'PASS') : 'FAIL';
      return `<article class="result ${item.pass ? 'pass' : 'fail'}"><div><b class="${escapeHtml(item.classification)}">${escapeHtml(item.classification)}</b><br><code>${escapeHtml(item.id)}</code></div><div>${escapeHtml(item.name)}${item.detail ? `<br><code>${escapeHtml(item.detail)}</code>` : ''}</div><span class="status-${item.pass ? 'pass' : 'fail'}">${status}</span></article>`;
    }).join('');
    window.__EVERSTEAD_GATE_0A_RESULT__ = { passed, failed, total: results.length, elapsedMilliseconds: elapsed, results };
  }

  async function runAll() {
    runButton.disabled = true;
    fatalNode.textContent = '';
    resultsNode.innerHTML = '';
    const started = performance.now();
    const results = [];
    try {
      const contract = await loadContract();
      results.push(...contract.staticResults);
      for (const scenario of contract.scenarioData.scenarios) {
        results.push(...await runScenario(contract, scenario));
      }
    } catch (error) {
      fatalNode.textContent = error.stack || error.message;
      results.push(result('runner-fatal', 'Gate 0A runner completed', 'required', false, error.stack || error.message));
    } finally {
      renderResults(results, performance.now() - started);
      runButton.disabled = false;
    }
  }

  runButton.addEventListener('click', runAll);
  runAll();
})();
