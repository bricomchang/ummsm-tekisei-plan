//散らかり放題なので見ないでくださいね！

document.addEventListener('DOMContentLoaded', async function() {
    // 定数定義
    const inputPedigreePositions = [
        {gen: 1, pos: 31, label: '本人', row: 1, displayFactor: false}, {gen: 2, pos: 15, label: '父', row: 1, displayFactor: true}, {gen: 2, pos: 30, label: '母', row: 9, displayFactor: true},
        {gen: 3, pos: 7, label: '父方祖父', row: 1, displayFactor: true}, {gen: 3, pos: 14, label: '父方祖母', row: 5, displayFactor: true}, {gen: 3, pos: 22, label: '母方祖父', row: 9, displayFactor: true}, {gen: 3, pos: 29, label: '母方祖母', row: 13, displayFactor: true},
        {gen: 4, pos: 3, label: '父方祖父の父', row: 1, displayFactor: true}, {gen: 4, pos: 6, label: '父方祖父の母', row: 3, displayFactor: true}, {gen: 4, pos: 10, label: '父方祖母の父', row: 5, displayFactor: true}, {gen: 4, pos: 13, label: '父方祖母の母', row: 7, displayFactor: true}, {gen: 4, pos: 18, label: '母方祖父の父', row: 9, displayFactor: true}, {gen: 4, pos: 21, label: '母方祖父の母', row: 11, displayFactor: true}, {gen: 4, pos: 25, label: '母方祖母の父', row: 13, displayFactor: true}, {gen: 4, pos: 28, label: '母方祖母の母', row: 15, displayFactor: true},
        {gen: 5, pos: 1, label: '父方祖父の父の父', row: 1, displayFactor: true}, {gen: 5, pos: 2, label: '父方祖父の父の母', row: 2, displayFactor: true}, {gen: 5, pos: 4, label: '父方祖父の母の父', row: 3, displayFactor: true}, {gen: 5, pos: 5, label: '父方祖父の母の母', row: 4, displayFactor: true}, {gen: 5, pos: 8, label: '父方祖母の父の父', row: 5, displayFactor: true}, {gen: 5, pos: 9, label: '父方祖母の父の母', row: 6, displayFactor: true}, {gen: 5, pos: 11, label: '父方祖母の母の父', row: 7, displayFactor: true}, {gen: 5, pos: 12, label: '父方祖母の母の母', row: 8, displayFactor: true}, {gen: 5, pos: 16, label: '母方祖父の父の父', row: 9, displayFactor: true}, {gen: 5, pos: 17, label: '母方祖父の父の母', row: 10, displayFactor: true}, {gen: 5, pos: 19, label: '母方祖父の母の父', row: 11, displayFactor: true}, {gen: 5, pos: 20, label: '母方祖父の母の母', row: 12, displayFactor: true}, {gen: 5, pos: 23, label: '母方祖母の父の父', row: 13, displayFactor: true}, {gen: 5, pos: 24, label: '母方祖母の父の母', row: 14, displayFactor: true}, {gen: 5, pos: 26, label: '母方祖母の母の父', row: 15, displayFactor: true}, {gen: 5, pos: 27, label: '母方祖母の母の母', row: 16, displayFactor: true}
    ];
    const sirePositions = new Set([15, 7, 22, 3, 10, 18, 25, 1, 4, 8, 11, 16, 19, 23, 26]);
    const damPositions = new Set([30, 14, 29, 6, 13, 21, 28, 2, 5, 9, 12, 17, 20, 24, 27]);    const factorTypes = ['芝', 'ダート', '短距離', 'マイル', '中距離', '長距離', '逃げ', '先行', '差し', '追込'];
    const aptitudeRanks = ['G', 'F', 'E', 'D', 'C', 'B', 'A'];
    const APTITUDE_TABLE_LAYOUT = [
        { labels: ['芝', 'ダ'], keys: ['芝', 'ダート'] },
        { labels: ['短', 'マ', '中', '長'], keys: ['短距離', 'マイル', '中距離', '長距離'] },
        { labels: ['逃', '先', '差', '追'], keys: ['逃げ', '先行', '差し', '追込'] }
    ];
    let horseData = [];
    const LOCAL_STORAGE_KEY = 'umamusumePedigreeData';

    // ------- 共有用ユーティリティ（URLだけで完全再現） -------
    const SHARE_PARAM = 's';

    // LZString（URL向けエンコード版の最小実装）
    const LZString = (function(){
    const f = String.fromCharCode;
    const keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
    const baseReverseDic = {};
    function getBaseValue(alphabet, character) {
        if (!baseReverseDic[alphabet]) {
        baseReverseDic[alphabet] = {};
        for (let i = 0; i < alphabet.length; i++) baseReverseDic[alphabet][alphabet.charAt(i)] = i;
        }
        return baseReverseDic[alphabet][character];
    }
    function compress(uncompressed) {
        if (uncompressed == null) return "";
        let i, value,
        context_dictionary = Object.create(null),
        context_dictionaryToCreate = Object.create(null),
        context_c = "",
        context_wc = "",
        context_w = "",
        context_enlargeIn = 2,
        context_dictSize = 3,
        context_numBits = 2,
        context_data = [],
        context_data_val = 0,
        context_data_position = 0;

        for (i = 0; i < uncompressed.length; i += 1) {
        context_c = uncompressed.charAt(i);
        if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
            context_dictionary[context_c] = context_dictSize++;
            context_dictionaryToCreate[context_c] = true;
        }
        context_wc = context_w + context_c;
        if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
            context_w = context_wc;
        } else {
            if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
            value = context_w.charCodeAt(0);
            if (value < 256) {
                for (let j=0; j<context_numBits; j++) {
                context_data_val = (context_data_val << 1);
                if (context_data_position == 5) { context_data_position = 0; context_data.push(keyStrUriSafe.charAt(context_data_val)); context_data_val = 0; } else context_data_position++;
                }
                for (let j=0; j<8; j++) {
                context_data_val = (context_data_val << 1) | (value & 1);
                if (context_data_position == 5) { context_data_position = 0; context_data.push(keyStrUriSafe.charAt(context_data_val)); context_data_val = 0; } else context_data_position++;
                value = value >> 1;
                }
            } else {
                value = 1;
                for (let j=0; j<context_numBits; j++) {
                context_data_val = (context_data_val << 1) | value;
                if (context_data_position == 5) { context_data_position = 0; context_data.push(keyStrUriSafe.charAt(context_data_val)); context_data_val = 0; } else context_data_position++;
                value = 0;
                }
                for (let j=0; j<16; j++) {
                context_data_val = (context_data_val << 1) | (context_w.charCodeAt(0) & 1);
                if (context_data_position == 5) { context_data_position = 0; context_data.push(keyStrUriSafe.charAt(context_data_val)); context_data_val = 0; } else context_data_position++;
                value = context_w.charCodeAt(0) >> 1;
                }
            }
            context_enlargeIn--;
            if (context_enlargeIn == 0) { context_enlargeIn = Math.pow(2, context_numBits); context_numBits++; }
            delete context_dictionaryToCreate[context_w];
            } else {
            value = context_dictionary[context_w];
            for (let j=0; j<context_numBits; j++) {
                context_data_val = (context_data_val << 1) | (value & 1);
                if (context_data_position == 5) { context_data_position = 0; context_data.push(keyStrUriSafe.charAt(context_data_val)); context_data_val = 0; } else context_data_position++;
                value = value >> 1;
            }
            }
            context_enlargeIn--;
            if (context_enlargeIn == 0) { context_enlargeIn = Math.pow(2, context_numBits); context_numBits++; }
            context_dictionary[context_wc] = context_dictSize++;
            context_w = String(context_c);
        }
        }
        if (context_w !== "") {
        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
            value = context_w.charCodeAt(0);
            if (value < 256) {
            for (let j=0; j<context_numBits; j++) {
                context_data_val = (context_data_val << 1);
                if (context_data_position == 5) { context_data_position = 0; context_data.push(keyStrUriSafe.charAt(context_data_val)); context_data_val = 0; } else context_data_position++;
            }
            for (let j=0; j<8; j++) {
                context_data_val = (context_data_val << 1) | (value & 1);
                if (context_data_position == 5) { context_data_position = 0; context_data.push(keyStrUriSafe.charAt(context_data_val)); context_data_val = 0; } else context_data_position++;
                value = value >> 1;
            }
            } else {
            value = 1;
            for (let j=0; j<context_numBits; j++) {
                context_data_val = (context_data_val << 1) | value;
                if (context_data_position == 5) { context_data_position = 0; context_data.push(keyStrUriSafe.charAt(context_data_val)); context_data_val = 0; } else context_data_position++;
                value = 0;
            }
            for (let j=0; j<16; j++) {
                context_data_val = (context_data_val << 1) | (context_w.charCodeAt(0) & 1);
                if (context_data_position == 5) { context_data_position = 0; context_data.push(keyStrUriSafe.charAt(context_data_val)); context_data_val = 0; } else context_data_position++;
                value = context_w.charCodeAt(0) >> 1;
            }
            }
            context_enlargeIn--;
            if (context_enlargeIn == 0) { context_enlargeIn = Math.pow(2, context_numBits); context_numBits++; }
            delete context_dictionaryToCreate[context_w];
        } else {
            value = context_dictionary[context_w];
            for (let j=0; j<context_numBits; j++) {
            context_data_val = (context_data_val << 1) | (value & 1);
            if (context_data_position == 5) { context_data_position = 0; context_data.push(keyStrUriSafe.charAt(context_data_val)); context_data_val = 0; } else context_data_position++;
            value = value >> 1;
            }
        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) { context_enlargeIn = Math.pow(2, context_numBits); context_numBits++; }
        }
        for (;;) {
        context_data_val = (context_data_val << 1);
        if (context_data_position == 5) { context_data.push(keyStrUriSafe.charAt(context_data_val)); break; }
        else context_data_position++;
        }
        return context_data.join("");
    }
    function decompress(length, resetValue, getNextValue) {
        const dictionary = [];
        let next, enlargeIn = 4, dictSize = 4, numBits = 3, entry = "", result = [],
        i, w, bits, resb, maxpower, power, c, data = { val:getNextValue(0), position:32, index:1 };

        for (i = 0; i < 3; i += 1) dictionary[i] = i;
        bits = 0; maxpower = Math.pow(2,2); power = 1;
        while (power != maxpower) { resb = data.val & data.position; data.position >>= 1; if (data.position==0){data.position=32; data.val=getNextValue(data.index++);} bits |= (resb>0?1:0) * power; power <<= 1; }
        switch (next = bits) {
        case 0:
            bits=0; maxpower=Math.pow(2,8); power=1; while (power!=maxpower){resb=data.val & data.position; data.position>>=1; if (data.position==0){data.position=32; data.val=getNextValue(data.index++);} bits |= (resb>0?1:0) * power; power <<= 1;}
            c = f(bits); break;
        case 1:
            bits=0; maxpower=Math.pow(2,16); power=1; while (power!=maxpower){resb=data.val & data.position; data.position>>=1; if (data.position==0){data.position=32; data.val=getNextValue(data.index++);} bits |= (resb>0?1:0) * power; power <<= 1;}
            c = f(bits); break;
        case 2:
            return "";
        }
        dictionary[3] = c; w = c; result.push(c);
        for (;;) {
        if (data.index > length) return "";
        bits = 0; maxpower = Math.pow(2, numBits); power = 1;
        while (power != maxpower) { resb = data.val & data.position; data.position >>= 1; if (data.position==0){data.position=32; data.val=getNextValue(data.index++);} bits |= (resb>0?1:0) * power; power <<= 1; }
        switch (c = bits) {
            case 0:
            bits=0; maxpower=Math.pow(2,8); power=1; while (power!=maxpower){resb=data.val & data.position; data.position>>=1; if (data.position==0){data.position=32; data.val=getNextValue(data.index++);} bits |= (resb>0?1:0) * power; power <<= 1;}
            dictionary[dictSize++] = f(bits); c = dictSize-1; enlargeIn--; break;
            case 1:
            bits=0; maxpower=Math.pow(2,16); power=1; while (power!=maxpower){resb=data.val & data.position; data.position>>=1; if (data.position==0){data.position=32; data.val=getNextValue(data.index++);} bits |= (resb>0?1:0) * power; power <<= 1;}
            dictionary[dictSize++] = f(bits); c = dictSize-1; enlargeIn--; break;
            case 2:
            return result.join("");
        }
        if (enlargeIn == 0) { enlargeIn = Math.pow(2, numBits); numBits++; }
        if (dictionary[c]) { entry = dictionary[c]; }
        else {
            if (c === dictSize) entry = w + w.charAt(0);
            else return null;
        }
        result.push(entry);
        dictionary[dictSize++] = w + entry.charAt(0);
        enlargeIn--; w = entry;
        if (enlargeIn == 0) { enlargeIn = Math.pow(2, numBits); numBits++; }
        }
    }
    return {
        compressToEncodedURIComponent: function (input) {
        if (input == null) return "";
        return compress(input);
        },
        decompressFromEncodedURIComponent: function (input) {
        if (input == null) return "";
        return decompress(input.length, 32, function(index){ return keyStrUriSafe.indexOf(input.charAt(index)); });
        }
    };
    })();

    // 入力を完全スナップショット化（全posを含める）
    function serializeAllInputs() {
    const allPos = inputPedigreePositions.map(p => p.pos);
    const horses = {};
    const factors = {};
    allPos.forEach(pos => {
        const sel = document.querySelector(`.individual-select[data-position="${pos}"]`);
        horses[pos] = sel && sel.value ? sel.value : null;

        const fsel = document.querySelector(`.factor-select[data-position="${pos}"]`);
        const star = document.querySelector(`input[name="stars${pos}"]:checked`);
        factors[pos] = {
        type: fsel && fsel.value ? fsel.value : null,
        star: star ? parseInt(star.value, 10) : null
        };
    });
    return { v: 1, horses, factors };
    }

    // URL→UIへ復元（localStorageは使わない）
    function applyAllInputsFromObj(obj) {
    if (!obj || obj.v !== 1) return false;

    // 馬
    Object.entries(obj.horses || {}).forEach(([pos, name]) => {
        const sel = document.querySelector(`.individual-select[data-position="${pos}"]`);
        if (sel) sel.value = name ?? "";
    });

    // 因子
    Object.entries(obj.factors || {}).forEach(([pos, spec]) => {
        const fsel = document.querySelector(`.factor-select[data-position="${pos}"]`);
        if (fsel) fsel.value = spec?.type ?? "";
        const sv = spec?.star;
        if (sv != null) {
        const radio = document.querySelector(`input[name="stars${pos}"][value="${sv}"]`);
        if (radio) radio.checked = true;
        } else {
        const checked = document.querySelector(`input[name="stars${pos}"]:checked`);
        if (checked) checked.checked = false;
        }
    });

    // 必要な派生UI更新
    inputPedigreePositions.forEach(p => {
        if ([7, 14, 22, 29].includes(p.pos)) updateAptitudeDisplay(p.pos);
    });

    return true;
    }

    // 共有URL生成
    function makeShareURL() {
    const payload = serializeAllInputs();
    const json = JSON.stringify(payload);
    const compressed = LZString.compressToEncodedURIComponent(json);
    const url = new URL(location.href);
    url.searchParams.set(SHARE_PARAM, compressed);
    url.hash = '';
    return url.toString();
    }

    // 結果の下に表示＋コピー
    function renderShareBlock(url) {
    const container = document.getElementById('resultsContainer');
    if (!container) return;
    let block = document.getElementById('shareBlock');
    if (!block) {
        block = document.createElement('div');
        block.id = 'shareBlock';
        block.className = 'share-block';

        const label = document.createElement('div');
        label.textContent = '共有用URL';

        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'shareUrl';
        input.readOnly = true;

        const btn = document.createElement('button');
        btn.id = 'copyShare';
        btn.textContent = 'コピー';
        btn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(input.value);
            btn.textContent = 'コピー済み';
            setTimeout(() => (btn.textContent = 'コピー'), 1200);
        } catch {
            input.select();
            document.execCommand('copy');
        }
        });

        block.appendChild(label);
        block.appendChild(input);
        block.appendChild(btn);
        container.appendChild(block);
    }
    const input = document.getElementById('shareUrl');
    if (input) input.value = url;
    }

    // 起動時にURLがあればそれのみで復元し、なければ従来処理
    function tryRestoreFromURL() {
    const params = new URL(location.href).searchParams;
    const s = params.get(SHARE_PARAM);
    if (!s) return false;
    try {
        const json = LZString.decompressFromEncodedURIComponent(s);
        if (!json) return false;
        const obj = JSON.parse(json);
        const ok = applyAllInputsFromObj(obj);
        if (ok && typeof calculate === 'function') calculate();
        return ok;
    } catch (e) {
        console.error('共有URLの読み込みに失敗:', e);
        return false;
    }
    }

    async function loadCSV() {
        const response = await fetch('umadata.csv');
        if (!response.ok) throw new Error('CSVの読み込みに失敗しました。');
        const csvText = await response.text();
        const headerMapping = {'名前': '名前', '芝': '芝', 'ダ': 'ダート', '短': '短距離', 'マ': 'マイル', '中': '中距離', '長': '長距離', '逃': '逃げ', '先': '先行', '差': '差し', '追': '追込'};
        const lines = csvText.trim().split(/\r\n|\n/);
        const csvHeaders = lines[0].split(',');
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            const obj = {};
            const currentline = lines[i].split(',');
            for (let j = 0; j < csvHeaders.length; j++) {
                const internalKey = headerMapping[csvHeaders[j].trim()];
                if (internalKey) obj[internalKey] = currentline[j] ? currentline[j].trim() : '';
            }
            if (obj['名前']) data.push(obj);
        }
        return data;
    }

    function createPedigreeGrid() {
        const container = document.getElementById('pedigreeGrid');
        container.innerHTML = '';
        inputPedigreePositions.forEach(p => {
            const cell = document.createElement('div');
            cell.className = `pedigree-cell gen${p.gen}`;
            cell.setAttribute('data-position', p.pos);
            if (sirePositions.has(p.pos)) {
                cell.classList.add('sire-line');
            } else if (damPositions.has(p.pos)) {
                cell.classList.add('dam-line');
            }
            let span = 1;
            if (p.gen === 1) span = 16; else if (p.gen === 2) span = 8; else if (p.gen === 3) span = 4; else if (p.gen === 4) span = 2;
            cell.style.gridRow = `${p.row} / span ${span}`;
            cell.style.gridColumn = p.gen;
            
            let content = `<div class="pedigree-cell-title"></div>`;
            content += `<select class="individual-select" data-position="${p.pos}"><option value="">選択してください</option></select>`;
            if (p.displayFactor) {
                content += `<select class="factor-select" data-position="${p.pos}"><option value="">因子なし</option>`;
                factorTypes.forEach(type => { content += `<option value="${type}">${type}</option>`; });
                content += `</select>`;
                content += `<div class="stars-group" data-position="${p.pos}">`;
                for (let i = 1; i <= 3; i++) { content += `<label><input type="radio" name="stars_${p.pos}" value="${i}"> ☆${i}</label>`; }
                content += `</div>`;
            }
            if (p.gen <= 3) {
                content += `<div class="aptitude-display" data-position="${p.pos}"></div>`;
            }
            cell.innerHTML = content;
            container.appendChild(cell);
        });
    }

    function initializeDropdowns() {
        const selects = document.querySelectorAll('.individual-select');
        selects.forEach(select => {
            horseData.forEach(horse => {
                const option = document.createElement('option');
                option.value = horse['名前'];
                option.textContent = horse['名前'];
                select.appendChild(option);
            });
        });
    }

    function createAptitudeTableHTML(horseName, calculatedRanks = {}) {
        const horse = horseData.find(h => h['名前'] === horseName);
        if (!horse) return '<div class="aptitude-table-placeholder"></div>';
        
        let html = '<table class="aptitude-table">';
        const [ground, distance, strategy] = APTITUDE_TABLE_LAYOUT;
        html += '<tr>';
        ground.labels.forEach(label => html += `<td class="apt-label">${label}</td>`);
        html += '<td class="apt-label empty" colspan="2"></td></tr>';
        html += '<tr>';
        ground.keys.forEach(key => {
            const rank = calculatedRanks[key]?.final || horse[key] || 'G';
            const changed = calculatedRanks[key]?.changed ? ' changed' : '';
            html += `<td class="apt-value rank-${rank}${changed}">${rank}</td>`;
        });
        html += '<td class="apt-value empty" colspan="2"></td></tr>';
        html += '<tr>';
        distance.labels.forEach(label => html += `<td class="apt-label">${label}</td>`);
        html += '</tr>';
        html += '<tr>';
        distance.keys.forEach(key => {
            const rank = calculatedRanks[key]?.final || horse[key] || 'G';
            const changed = calculatedRanks[key]?.changed ? ' changed' : '';
            html += `<td class="apt-value rank-${rank}${changed}">${rank}</td>`;
        });
        html += '</tr>';
        html += '<tr>';
        strategy.labels.forEach(label => html += `<td class="apt-label">${label}</td>`);
        html += '</tr>';
        html += '<tr>';
        strategy.keys.forEach(key => {
            const rank = calculatedRanks[key]?.final || horse[key] || 'G';
            const changed = calculatedRanks[key]?.changed ? ' changed' : '';
            html += `<td class="apt-value rank-${rank}${changed}">${rank}</td>`;
        });
        html += '</tr></table>';
        return html;
    }
    
    function updateAptitudeDisplay(position) {
        const select = document.querySelector(`.individual-select[data-position="${position}"]`);
        const aptitudeDiv = document.querySelector(`.aptitude-display[data-position="${position}"]`);
        if (select && aptitudeDiv) {
            aptitudeDiv.innerHTML = createAptitudeTableHTML(select.value);
        }
    }

    function saveState() {
        const state = {};
        inputPedigreePositions.forEach(p => {
            const pos = p.pos;
            const select = document.querySelector(`.individual-select[data-position="${pos}"]`);
            if (select) state[`horse_${pos}`] = select.value;
            if (p.displayFactor) {
                const factor = document.querySelector(`.factor-select[data-position="${pos}"]`);
                if (factor) state[`factor_${pos}`] = factor.value;
                const star = document.querySelector(`input[name="stars_${pos}"]:checked`);
                if (star) state[`star_${pos}`] = star.value;
            }
        });
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    }

    function loadState() {
        const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!savedState) return;
        const state = JSON.parse(savedState);
        inputPedigreePositions.forEach(p => {
            const pos = p.pos;
            const select = document.querySelector(`.individual-select[data-position="${pos}"]`);
            if (select && state[`horse_${pos}`]) {
                select.value = state[`horse_${pos}`];
                if (p.gen <= 3) updateAptitudeDisplay(pos);
            }
            if (p.displayFactor) {
                const factor = document.querySelector(`.factor-select[data-position="${pos}"]`);
                if (factor && state[`factor_${pos}`]) factor.value = state[`factor_${pos}`];
                const star = document.querySelector(`input[name="stars_${pos}"][value="${state[`star_${pos}`]}"]`);
                if (star) star.checked = true;
            }
        });
    }

    function getFactorSourcePositions(pos) {
        if (pos === 31) { return [15, 30, 7, 14, 22, 29]; }
        else if (pos === 15 || pos === 30) { return getAncestorsForGenePotential(pos); }
        else if (pos === 7 || pos === 14 || pos === 22 || pos === 29) { return getAncestorsForGenePotential(pos); }
        return [];
    }

    function getAncestorsForGenePotential(pos) {
        let ancestors = [];
        if (pos === 31) { ancestors = [15, 30, 7, 14, 22, 29]; }
        else if (pos === 15) { ancestors = [7, 14, 3, 6, 10, 13]; }
        else if (pos === 30) { ancestors = [22, 29, 18, 21, 25, 28]; }
        else if (pos === 7) { ancestors = [3, 6, 1, 2, 4, 5]; }
        else if (pos === 14) { ancestors = [10, 13, 8, 9, 11, 12]; }
        else if (pos === 22) { ancestors = [18, 21, 16, 17, 19, 20]; }
        else if (pos === 29) { ancestors = [25, 28, 23, 24, 26, 27]; }
        return ancestors;
    }

    function calculateGenePotential(pos, formData) {
        const ancestors = getAncestorsForGenePotential(pos);
        const factorCounts = {};
        factorTypes.forEach(type => { factorCounts[type] = 0; });
        ancestors.forEach(ancestorPos => {
            const factor = formData['factor_' + ancestorPos];
            const stars = parseInt(formData['star_' + ancestorPos] || '0');
            if (factor && stars > 0) { factorCounts[factor] += stars; }
        });
        const genePotentials = [];
        factorTypes.forEach(type => {
            const stars = factorCounts[type];
            if (stars >= 12) { genePotentials.push({type: type, status: 'confirmed', stars: stars}); }
            else if (stars >= 6) { genePotentials.push({type: type, status: 'potential', stars: stars}); }
        });
        genePotentials.sort((a, b) => b.stars - a.stars);
        return genePotentials.slice(0, 3);
    }

    function generateGenePotentialHTML(genePotentials) {
        if (genePotentials.length === 0) return '<div class="gene-potentials-placeholder"></div>';
        let html = '<div class="gene-potentials">';
        genePotentials.forEach(gene => {
            if (gene.status === 'confirmed') {
                html += `<div class="gene-confirmed">${gene.type}遺伝子確定</div>`;
            } else {
                html += `<div class="gene-potential">${gene.type}遺伝子獲得</div>`;
            }
        });
        html += '</div>';
        return html;
    }

    function calculate() {
        const resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.style.display = 'block';
        resultsContainer.innerHTML = '<h2>計算結果</h2>';
        const resultsGrid = document.createElement('div');
        resultsGrid.className = 'results-pedigree-container';
        resultsContainer.appendChild(resultsGrid);
        
        const formData = {};
        inputPedigreePositions.forEach(p => {
            const pos = p.pos;
            formData['horse_' + pos] = document.querySelector(`.individual-select[data-position="${pos}"]`)?.value;
            if (p.displayFactor) {
                formData['factor_' + pos] = document.querySelector(`.factor-select[data-position="${pos}"]`)?.value;
                formData['star_' + pos] = document.querySelector(`input[name="stars_${pos}"]:checked`)?.value;
            }
        });

        inputPedigreePositions.forEach(p => {
            const cell = document.createElement('div');
            cell.className = `result-cell gen${p.gen}`;
            if (sirePositions.has(p.pos)) {
            cell.classList.add('sire-line');
            } else if (damPositions.has(p.pos)) {
                cell.classList.add('dam-line');
            }
            let span = 1;
            if (p.gen === 1) span = 16; else if (p.gen === 2) span = 8; else if (p.gen === 3) span = 4; else if (p.gen === 4) span = 2;
            cell.style.gridRow = `${p.row} / span ${span}`;
            cell.style.gridColumn = p.gen;
            const horseName = formData['horse_' + p.pos];
            let nameHTML = `<div class="individual-name">${horseName || (p.pos === 31 ? '未指定' : '')}</div>`;
            const factor = formData['factor_' + p.pos];
            const star = formData['star_' + p.pos];
            let factorHTML = (p.displayFactor && factor && star) ? `<div class="factor-info">${factor} ☆${star}</div>` : '';
            let tableHTML = '';
            let geneHTML = '';
            
            if (p.gen <= 3) {
                const horseDataEntry = horseData.find(h => h['名前'] === horseName);
                let calculatedRanks = {};
                if (horseDataEntry) {
                    const factorSourcePositions = getFactorSourcePositions(p.pos);
                    const factorCounts = {};
                    factorTypes.forEach(type => factorCounts[type] = 0);
                    factorSourcePositions.forEach(ancPos => {
                        const ancFactor = formData['factor_' + ancPos];
                        const ancStar = formData['star_' + ancPos];
                        if (ancFactor && ancStar) {
                            factorCounts[ancFactor] += parseInt(ancStar, 10);
                        }
                    });
                    factorTypes.forEach(type => {
                        const baseRankIndex = aptitudeRanks.indexOf(horseDataEntry[type] || 'G');
                        let increase = 0;
                        const stars = factorCounts[type] || 0;
                        if (stars >= 10) increase = 4; else if (stars >= 7) increase = 3; else if (stars >= 4) increase = 2; else if (stars >= 1) increase = 1;
                        const newRankIndex = Math.min(baseRankIndex + increase, aptitudeRanks.length - 1);
                        calculatedRanks[type] = {
                            final: aptitudeRanks[newRankIndex],
                            changed: newRankIndex > baseRankIndex
                        };
                    });
                }
                tableHTML = createAptitudeTableHTML(horseName, calculatedRanks);
                if (p.gen >= 2) {
                const genePotentials = calculateGenePotential(p.pos, formData);
                geneHTML = generateGenePotentialHTML(genePotentials);
                }
            }
            
            cell.innerHTML = nameHTML + factorHTML + tableHTML + geneHTML;
            resultsGrid.appendChild(cell);
//            renderShareBlock(makeShareURL());
        });
    }
    
    function setupEventListeners() {
        document.getElementById('calculate').addEventListener('click', calculate);
        document.getElementById('reset').addEventListener('click', () => {
            if (confirm('全ての入力をリセットしますか？')) {
                localStorage.removeItem(LOCAL_STORAGE_KEY);
                createPedigreeGrid();
                initializeDropdowns();
                document.getElementById('resultsContainer').style.display = 'none';
            }
        });
        document.getElementById('pedigreeGrid').addEventListener('change', (e) => {
            if (e.target.matches('.individual-select, .factor-select, input[type="radio"]')) {
                if (e.target.matches('.individual-select')) {
                    const pos = e.target.getAttribute('data-position');
                    updateAptitudeDisplay(pos);
                }
                saveState();
            }
        });
    }

    try {
        horseData = await loadCSV();
        createPedigreeGrid();
        initializeDropdowns();
        loadState();
        setupEventListeners();
    } catch (error) {
        console.error('アプリケーションの初期化に失敗しました:', error);
        alert('アプリケーションの初期化に失敗しました。ページを再読み込みしてください。');
    }


});
