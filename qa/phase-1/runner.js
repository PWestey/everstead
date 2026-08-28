(() => {
  'use strict';
  const CHANNEL = 'everstead-phase-1';
  const byId = id => document.getElementById(id);
  const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[character]));
  const bytesToHex = bytes => [...new Uint8Array(bytes)].map(value => value.toString(16).padStart(2, '0')).join('');
  const sha256 = async bytes => bytesToHex(await crypto.subtle.digest('SHA-256', bytes));
  async function fetchBytes(path) {
    const response = await fetch(path, { cache:'no-store' });
    if (!response.ok) throw new Error(path + ': HTTP ' + response.status);
    return new Uint8Array(await response.arrayBuffer());
  }
  const decode = bytes => new TextDecoder('utf-8', { fatal:true }).decode(bytes);
  const result = (id, pass, detail = '') => ({ id, pass:Boolean(pass), detail:String(detail) });

  async function loadContract() {
    const manifest = JSON.parse(decode(await fetchBytes('./current-manifest.json')));
    const scenarioBytes = await fetchBytes('../../' + manifest.scenarios.path);
    const scenarioHash = await sha256(scenarioBytes);
    if (scenarioHash !== manifest.scenarios.sha256) throw new Error('Scenario checksum mismatch; execution aborted');
    const staticResults = [result('scenario-checksum-before-execution', true, scenarioHash)];
    for (const [path, expected] of Object.entries(manifest.frozenHistoricalFiles || {})) {
      const bytes = await fetchBytes('../../' + path);
      const hash = await sha256(bytes);
      staticResults.push(result('frozen-' + path.replaceAll('/', '-'), hash === expected, hash));
    }
    if (staticResults.some(item => !item.pass)) throw new Error('Frozen historical checksum mismatch; execution aborted');
    const artifactBytes = await fetchBytes('../../' + manifest.artifact.path);
    const artifactHash = await sha256(artifactBytes);
    if (artifactHash !== manifest.artifact.sha256 || artifactBytes.byteLength !== manifest.artifact.byteLength) throw new Error('Current artifact checksum mismatch; execution aborted');
    staticResults.push(result('current-artifact-checksum-before-execution', true, artifactHash));
    const currentRaw = decode(await fetchBytes('../gate-0b/fixtures/current-v1.txt'));
    const legacyRaw = decode(await fetchBytes('../fixtures/representative-v0.1.txt'));
    return { manifest, scenarios:JSON.parse(decode(scenarioBytes)), currentRaw, legacyRaw, staticResults };
  }

  function executeRealm(contract, viewport, mode, search = '?qa=1') {
    return new Promise((resolve, reject) => {
      const nonce = crypto.randomUUID();
      const frame = document.createElement('iframe');
      const now = Date.parse(contract.scenarios.frozenNow);
      let activeRaw = mode === 'fresh' ? null : mode === 'legacy' ? contract.legacyRaw : contract.currentRaw;
      if (mode !== 'encoded-negative' && activeRaw !== null) {
        const value = JSON.parse(activeRaw);
        value.pendingGold = 0.75;
        value.lastGoldAt = now - 7_200_000;
        value.lastSeen = value.lastGoldAt;
        if (mode === 'disabled') {
          value.currentWall = 'story-1';
          value.resolve['story-1'] = 0.07;
          value.operation = { ids:['cael','lyra','orin'], startedAt:now - 700_000, endAt:now - 1 };
        }
        activeRaw = JSON.stringify(value);
      }
      const features = mode === 'disabled' ? { story:false, tower:false, trading:false, patrol:false, operations:false } : undefined;
      const config = {
        nonce, mode, expectBridge:search === '?qa=1', viewport, now, features,
        keys:contract.scenarios.storageKeys,
        randomSequence:Array.from({ length:96 }, (_, index) => contract.scenarios.randomSequence[index % contract.scenarios.randomSequence.length]),
        originalActiveRaw:activeRaw,
        slots:activeRaw === null ? {} : { [contract.scenarios.storageKeys.active]:activeRaw }
      };
      frame.name = JSON.stringify(config);
      frame.setAttribute('sandbox', 'allow-scripts allow-same-origin');
      frame.style.cssText = 'position:absolute;left:-20000px;top:0;width:' + viewport.width + 'px;height:' + viewport.height + 'px;border:0';
      const finish = (error, value) => {
        clearTimeout(timeout);
        window.removeEventListener('message', onMessage);
        frame.remove();
        error ? reject(error) : resolve(value);
      };
      const onMessage = event => {
        if (event.source !== frame.contentWindow || event.data?.channel !== CHANNEL || event.data?.nonce !== nonce) return;
        const prefixed = event.data.results.map(item => ({ ...item, id:viewport.id + '-' + mode + '-' + item.id }));
        if (event.data.errors?.length) prefixed.push(result(viewport.id + '-' + mode + '-captured-errors', false, event.data.errors.join('\n')));
        finish(null, prefixed);
      };
      const timeout = setTimeout(() => finish(new Error(viewport.id + '/' + mode + ' realm timed out')), 30_000);
      window.addEventListener('message', onMessage);
      frame.src = './realm.html' + search + '&nonce=' + encodeURIComponent(nonce);
      document.body.appendChild(frame);
    });
  }

  function render(results) {
    const passed = results.filter(item => item.pass).length;
    const failed = results.length - passed;
    byId('total').textContent = results.length;
    byId('passed').textContent = passed;
    byId('failed').textContent = failed;
    byId('results').innerHTML = results.map(item => '<article class="result"><code>' + escapeHtml(item.id) + '</code><span>' + escapeHtml(item.detail) + '</span><b class="status ' + (item.pass ? 'pass' : 'fail') + '">' + (item.pass ? 'PASS' : 'FAIL') + '</b></article>').join('');
    window.__EVERSTEAD_PHASE_1_RESULT__ = { passed, failed, total:results.length, results };
  }

  async function run() {
    byId('run').disabled = true;
    byId('fatal').textContent = '';
    try {
      const contract = await loadContract();
      const results = [...contract.staticResults];
      for (const viewport of contract.scenarios.viewports) {
        results.push(...await executeRealm(contract, viewport, 'fresh'));
        results.push(...await executeRealm(contract, viewport, 'current-v1'));
        results.push(...await executeRealm(contract, viewport, 'legacy'));
        results.push(...await executeRealm(contract, viewport, 'disabled'));
      }
      results.push(...await executeRealm(contract, contract.scenarios.viewports[0], 'encoded-negative', '?qa=%31'));
      render(results);
    } catch (error) {
      byId('fatal').textContent = error.stack || error.message;
      render([result('runner-fatal', false, error.stack || error.message)]);
    } finally {
      byId('run').disabled = false;
    }
  }
  byId('run').onclick = run;
  run();
})();
