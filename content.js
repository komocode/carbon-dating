/**
 * Google Flights – Aircraft Production Year (content script)
 *
 * Logic:
 *  1. Parse carrier IATA code(s) from the TIM URL on each CO2 element.
 *  2. Walk up the DOM from that element to find the aircraft model text
 *     (e.g. "Airbus A321 (Sharklets)", "Boeing 737 MAX 9 Passenger").
 *  3. Map model text → ICAO typecode(s).
 *  4. Look up DB[carrier][typecode] → exact avg build year (no prefix).
 *  5. Fallback: FALLBACK[typecode] → estimated year (~prefix).
 *  6. If no data found, leave Google's CO2 display unchanged.
 */
"use strict";

// ---------------------------------------------------------------------------
// Lookup table: carrier IATA → ICAO typecode → avg build year
// Generated from aircraftDatabase.csv (n≥2 aircraft per combo)
// ---------------------------------------------------------------------------
const DB = {"ZT":{"B734":1992,"B752":2000,"A320":2008,"A321":2008},"ZL":{"SF34":1993},"Y4":{"A319":2007,"A320":2012,"A20N":2018,"A321":2016},"WN":{"B733":1992,"B737":2005,"B738":2017,"B38M":2022},"WL":{"MD83":1992},"WK":{"A320":2002,"A343":2003,"A333":2014},"WA":{"E295":2021},"W3":{"B738":2009},"VY":{"A320":2008},"VS":{"B789":2015},"VA":{"F100":1992,"A320":2004,"B738":2011},"UX":{"B738":2015,"B789":2019},"UP":{"AT76":2015,"AT46":2016},"UK":{"A20N":2021},"UA":{"B744":1994,"B752":1994,"B763":1997,"A320":1999,"B737":1999,"B738":2001,"CRJ7":2004,"B753":2002,"CRJ2":2002,"A319":2004,"E45X":2004,"E170":2005,"B788":2013,"B789":2019,"E75L":2018,"B77W":2018,"B78X":2021,"B39M":2020,"B38M":2022},"U7":{"FA20":1975,"B722":1981,"MD88":1991},"U2":{"A319":2008,"A320":2013,"A20N":2018},"TU":{"A320":2000,"A319":2002,"B736":2000,"A332":2015},"TR":{"B789":2017},"TP":{"A21N":2018},"SY":{"B738":2003},"SU":{"A321":2014,"SU95":2014},"SQ":{"A359":2018},"SN":{"A319":2004,"A320":2004,"A333":2008},"RW":{"E75L":2007},"QY":{"B752":1991},"QR":{"A320":2009,"A332":2006,"A333":2006,"A321":2008,"B77W":2011,"B77L":2010,"B788":2014,"A388":2014,"A359":2016,"A35K":2020},"QQ":{"F100":1991},"QF":{"B733":1987,"F100":1993,"B712":2003,"DH8C":2002,"B738":2008,"A333":2004,"A320":2005,"A332":2010,"B789":2018},"PW":{"AT8T":2020},"PO":{"B744":2001},"OY":{"B763":1998,"B762":2001,"B772":2005},"OO":{"E75L":2018},"NZ":{"B789":2016},"NN":{"B752":1993},"NK":{"A320":2016,"A321":2018,"A20N":2019},"NC":{"RJ1H":2000},"N8":{"B744":1992},"MX":{"A320":1992},"MS":{"A320":2000,"A321":1997,"A332":2005,"B738":2010,"B77W":2010,"A333":2011},"MQ":{"CRJ7":2003,"E170":2004,"E75L":2014},"MN":{"B734":1991},"MH":{"A333":2012},"MG":{"E145":2000},"M6":{"B763":1992},"LX":{"A321":2001,"A320":2001,"A319":1996,"A343":2003,"A333":2010,"BCS1":2016,"B77W":2016,"BCS3":2018},"LR":{"A320":2012},"L2":{"C130":1977},"KQ":{"B788":2014},"KO":{"B190":1989},"KL":{"B77W":2020},"K4":{"B744":1998,"B763":1992,"CL60":1994,"B77L":2020},"JQ":{"A320":2010,"A321":2012},"JO":{"B738":2008},"IB":{"A359":2019},"I2":{"A21N":2020},"HA":{"A332":2014,"A21N":2018},"G4":{"A320":2010,"A319":2005},"FX":{"DC10":1978,"A310":1987,"B752":1992,"C208":1991,"A306":1997,"MD11":1993,"B77L":2015,"B763":2018},"FR":{"B738":2012},"FN":{"A319":2005},"F9":{"A320":2013,"A321":2016,"A20N":2018},"EY":{"B789":2018},"ET":{"B752":1994,"B763":2002,"B737":2004,"B738":2012,"B77L":2012,"B788":2014,"B77W":2014,"A359":2016},"EK":{"B77W":2016},"DL":{"B752":1990,"B763":1991,"MD88":1992,"A320":1999,"CRJ2":2003,"B712":2001,"B738":2010,"E170":2005,"CRJ9":2011,"E75L":2009,"B77L":2008,"B739":2017,"A321":2019,"A359":2020,"BCS1":2020,"A339":2021,"BCS3":2021,"A21N":2022},"DE":{"A339":2023},"D0":{"B763":2009},"CZ":{"A333":2014},"CX":{"B77W":2011,"A359":2016},"CM":{"B737":2002,"B738":2012},"CI":{"A333":2007,"A359":2017},"BW":{"B738":2003},"BU":{"AT76":2016},"BJ":{"A320":2006},"BE":{"AT75":2000,"DH8D":2005},"BA":{"B772":2000,"A319":2000,"A320":2006,"B77W":2012,"B788":2014,"B789":2016},"B6":{"A320":2002,"E190":2006,"A321":2017,"A21N":2020,"BCS3":2021},"AZ":{"A332":2010,"B772":2003,"A320":2008},"AV":{"A320":2011,"A319":2012,"B788":2015,"A20N":2018},"AT":{"B738":2007,"B737":2001,"E190":2014,"B788":2015},"AS":{"B737":2001,"B738":2007,"B739":2018,"A21N":2018,"B39M":2022},"AM":{"B737":2005,"B738":2012,"B788":2014},"AH":{"AT76":2012,"B738":2014},"AF":{"B77W":2007,"A359":2021},"AA":{"B738":2012,"B752":1992,"A320":2000,"A319":2001,"B772":2001,"CRJ7":2006,"A321":2012,"E135":2002,"E170":2006,"E145":2004,"E75L":2017,"B77W":2014,"CRJ9":2016,"B788":2017,"B38M":2019,"A21N":2021,"B789":2019},"9S":{"B734":1994,"B77L":2011},"8I":{"B738":2007},"6E":{"A320":2014,"A20N":2017,"A21N":2020},"5Y":{"B762":1984,"B763":1994,"B744":2001,"B748":2012},"5X":{"B752":1993,"MD11":1994,"B744":2003,"B763":2007,"B748":2020},"5M":{"B763":1992},"5D":{"E145":2001,"E190":2010},"4Y":{"A337":2020},"4O":{"A320":2008},"4G":{"B737":2000,"SU95":2014},"3S":{"B77L":2021},"3O":{"A320":2014},"2L":{"F100":1993,"E190":2010,"E290":2021}};

// ---------------------------------------------------------------------------
// Fallback estimates by ICAO typecode (generic – shown with ~ prefix)
// ---------------------------------------------------------------------------
const FALLBACK = {
  // Boeing narrowbody
  B733:1990, B734:1992, B735:1993, B736:2000, B737:2004, B738:2010, B739:2016,
  B38M:2021, B39M:2021, B3XM:2022,
  // Boeing widebody
  B752:1993, B753:1999, B762:1987, B763:2005, B764:2008,
  B772:2001, B773:2006, B77L:2012, B77W:2013,
  B788:2014, B789:2017, B78X:2021,
  B744:1999, B748:2019,
  // Airbus narrowbody
  A318:2005, A319:2004, A320:2006, A321:2012,
  A20N:2018, A21N:2020,
  // Airbus widebody
  A332:2007, A333:2009, A338:2021, A339:2021,
  A343:2003, A346:2006,
  A359:2018, A35K:2020, A388:2012,
  // Bombardier CS / Airbus A220
  BCS1:2018, BCS3:2019,
  // Embraer E-jet
  E135:2002, E145:2001, E170:2005, E75L:2015, E190:2009, E195:2010,
  // Embraer E2
  E290:2021, E295:2021,
  // Bombardier CRJ
  CRJ2:2002, CRJ7:2004, CRJ9:2012, CRJX:2015,
  // ATR
  AT43:1991, AT46:2016, AT75:2007, AT76:2014,
  // Dash 8 / Q-series
  DH8B:2000, DH8C:2002, DH8D:2009,
  // Legacy / other
  MD88:1991, MD11:1993, DC10:1983, F100:1993, B712:2002, SU95:2014,
};

// ---------------------------------------------------------------------------
// Map aircraft display text → ICAO typecode(s) to try (most-specific first)
// ---------------------------------------------------------------------------
function textToTypecodes(text) {
  const t = text.toUpperCase();
  // Airbus A220 / Bombardier CS
  if (/A220.{0,3}1|CS.{0,3}100/.test(t)) return ['BCS1'];
  if (/A220.{0,3}3|CS.{0,3}300/.test(t)) return ['BCS3'];
  if (/A220/.test(t)) return ['BCS1', 'BCS3'];
  // Airbus A320neo family (must check before ceo)
  if (/A321.{0,10}(XLR|NEO)/.test(t)) return ['A21N'];
  if (/A320.{0,10}NEO/.test(t)) return ['A20N'];
  if (/A319.{0,10}NEO/.test(t)) return ['A19N'];
  // Airbus A320ceo family
  if (/A321/.test(t)) return ['A321', 'A21N'];
  if (/A320/.test(t)) return ['A320', 'A20N'];
  if (/A319/.test(t)) return ['A319'];
  if (/A318/.test(t)) return ['A318'];
  // Airbus A330
  if (/A330.{0,4}(900|NEO)/.test(t)) return ['A339'];
  if (/A330.{0,4}800/.test(t)) return ['A338'];
  if (/A330.{0,4}300/.test(t)) return ['A333'];
  if (/A330.{0,4}200/.test(t)) return ['A332'];
  if (/A330/.test(t)) return ['A333', 'A332'];
  // Airbus A340
  if (/A340.{0,4}600/.test(t)) return ['A346'];
  if (/A340/.test(t)) return ['A343'];
  // Airbus A350
  if (/A350.{0,5}1000/.test(t)) return ['A35K'];
  if (/A350/.test(t)) return ['A359'];
  // Airbus A380
  if (/A380/.test(t)) return ['A388'];
  // Boeing 737 MAX (must check before NG)
  if (/737.{0,5}MAX.{0,5}10/.test(t)) return ['B3XM'];
  if (/737.{0,5}MAX.{0,5}9/.test(t)) return ['B39M'];
  if (/737.{0,5}MAX.{0,5}8/.test(t)) return ['B38M'];
  if (/737.{0,5}MAX/.test(t)) return ['B38M', 'B39M'];
  // Boeing 737 NG / Classic
  if (/737.{0,4}900/.test(t)) return ['B739'];
  if (/737.{0,4}800/.test(t)) return ['B738'];
  if (/737.{0,4}700/.test(t)) return ['B737'];
  if (/737.{0,4}600/.test(t)) return ['B736'];
  if (/737.{0,4}500/.test(t)) return ['B735'];
  if (/737.{0,4}400/.test(t)) return ['B734'];
  if (/737.{0,4}300/.test(t)) return ['B733'];
  if (/737/.test(t)) return ['B738', 'B737'];
  // Boeing 747
  if (/747.{0,4}8/.test(t)) return ['B748'];
  if (/747/.test(t)) return ['B744'];
  // Boeing 757
  if (/757.{0,4}300/.test(t)) return ['B753'];
  if (/757/.test(t)) return ['B752'];
  // Boeing 767
  if (/767.{0,4}400/.test(t)) return ['B764'];
  if (/767.{0,4}300/.test(t)) return ['B763'];
  if (/767.{0,4}200/.test(t)) return ['B762'];
  if (/767/.test(t)) return ['B763'];
  // Boeing 777
  if (/777.{0,4}300ER/.test(t)) return ['B77W'];
  if (/777.{0,4}200LR/.test(t)) return ['B77L'];
  if (/777.{0,4}300/.test(t)) return ['B773'];
  if (/777.{0,4}200/.test(t)) return ['B772'];
  if (/777/.test(t)) return ['B77W', 'B772'];
  // Boeing 787
  if (/787.{0,4}10/.test(t)) return ['B78X'];
  if (/787.{0,4}9/.test(t)) return ['B789'];
  if (/787.{0,4}8/.test(t)) return ['B788'];
  if (/787/.test(t)) return ['B788', 'B789'];
  // Embraer
  if (/ERJ.{0,4}145|E.{0,3}145/.test(t)) return ['E145'];
  if (/ERJ.{0,4}135|E.{0,3}135/.test(t)) return ['E135'];
  if (/E.{0,3}175.{0,5}E2/.test(t)) return ['E75S'];
  if (/E.{0,3}170/.test(t)) return ['E170'];
  if (/E.{0,3}175/.test(t)) return ['E75L'];
  if (/E.{0,3}190/.test(t)) return ['E190'];
  if (/E.{0,3}195/.test(t)) return ['E195'];
  if (/E.{0,3}290/.test(t)) return ['E290'];
  if (/E.{0,3}295/.test(t)) return ['E295'];
  // Bombardier CRJ
  if (/CRJ.{0,4}(1000|10)\b/.test(t)) return ['CRJX'];
  if (/CRJ.{0,4}900|CRJ.{0,4}9\b/.test(t)) return ['CRJ9'];
  if (/CRJ.{0,4}700|CRJ.{0,4}7\b/.test(t)) return ['CRJ7'];
  if (/CRJ.{0,4}200|CRJ.{0,4}2\b/.test(t)) return ['CRJ2'];
  // ATR
  if (/ATR.{0,4}72/.test(t)) return ['AT75', 'AT76'];
  if (/ATR.{0,4}42/.test(t)) return ['AT43', 'AT46'];
  // Dash 8 / Q-series
  if (/Q.?400|DASH.{0,4}8.{0,5}4|DHC.{0,4}8.{0,5}4/.test(t)) return ['DH8D'];
  if (/Q.?300|DASH.{0,4}8.{0,5}3|DHC.{0,4}8.{0,5}3/.test(t)) return ['DH8C'];
  if (/Q.?200|DASH.{0,4}8.{0,5}2|DHC.{0,4}8.{0,5}2/.test(t)) return ['DH8B'];
  // Legacy
  if (/MD.?88/.test(t)) return ['MD88'];
  if (/MD.?11/.test(t)) return ['MD11'];
  if (/\b717\b/.test(t)) return ['B712'];
  if (/\bDC.{0,3}10\b/.test(t)) return ['DC10'];
  return null;
}

// ---------------------------------------------------------------------------
// Carrier-level average year (fallback when aircraft model not yet in DOM)
// Computed once from DB: average of all typecode averages per carrier
// ---------------------------------------------------------------------------
const CARRIER_AVG = (() => {
  const out = {};
  for (const [iata, tcs] of Object.entries(DB)) {
    const years = Object.values(tcs);
    if (years.length) out[iata] = Math.round(years.reduce((a, b) => a + b) / years.length);
  }
  return out;
})();

// ---------------------------------------------------------------------------
// Parse carrier IATA code(s) + first flight code + date from TIM URL
// Format: SEG0.SEG1… where SEG = ORIG(3)-DEST(3)-CARRIER(2)-FLNUM-DATE(8)
// ---------------------------------------------------------------------------
function parseFlightInfo(timUrl) {
  try {
    const itin = new URL(timUrl).searchParams.get('itinerary');
    if (!itin) return { carriers: [], flightCode: null, flightDate: null, allSegments: [] };
    const carriers = [];
    let flightCode = null;
    let flightDate = null;
    const allSegments = [];
    for (const seg of itin.split(',')) {
      const parts = seg.split('-');
      if (parts.length >= 4) {
        const carrier = parts[2];
        const flnum = parts[3];
        const rawDate = parts[4]; // YYYYMMDD
        if (!carriers.includes(carrier)) carriers.push(carrier);
        const fc = carrier && flnum ? (carrier + flnum).toLowerCase() : null;
        if (fc) allSegments.push({ carrier, flnum, flightCode: fc });
        if (!flightCode && fc) flightCode = fc;
        if (!flightDate && rawDate && rawDate.length === 8) {
          flightDate = `${rawDate.slice(0,4)}-${rawDate.slice(4,6)}-${rawDate.slice(6,8)}`;
        }
      }
    }
    return { carriers, flightCode, flightDate, allSegments };
  } catch {
    return { carriers: [], flightCode: null, flightDate: null, allSegments: [] };
  }
}

// ---------------------------------------------------------------------------
// Walk up the DOM from el to find the nearest ancestor whose innerText
// contains an aircraft model keyword, bounded by the flight row root
// (the [data-id] div) to avoid cross-row contamination.
// ---------------------------------------------------------------------------
function detectAircraftText(el) {
  // Find the row root so we don't bleed into adjacent rows
  let rowRoot = null;
  let scan = el.parentElement;
  while (scan && scan !== document.body) {
    if (scan.dataset && scan.dataset.id) { rowRoot = scan; break; }
    scan = scan.parentElement;
  }

  let node = el.parentElement;
  while (node && node !== document.body) {
    const text = node.innerText || '';
    if (text.length > 10000) break;
    if (/(?:airbus|boeing|embraer|bombardier|\bATR\b|\bCRJ\b|dash\s*8|\bERJ\b|Q[234]\d{2})/i.test(text)) {
      return text;
    }
    if (node === rowRoot) break; // stop at the row boundary
    node = node.parentElement;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Attempt to find the flight date from the DOM when the TIM URL lacks it.
// Tries (in order):
//   1. ancestor element with data-value="YYYY-MM-DD"
//   2. page-level date-picker elements (.GYgkab[data-value])
//   3. aria-label on an ancestor containing a month name + day number
// ---------------------------------------------------------------------------
const _MONTH_MAP = {
  january:1, february:2, march:3, april:4, may:5, june:6,
  july:7, august:8, september:9, october:10, november:11, december:12
};

function _monthDayToDate(monthName, day) {
  const month = _MONTH_MAP[monthName.toLowerCase()];
  if (!month) return null;
  const now = new Date();
  let year = now.getFullYear();
  // If this month/day already passed this calendar year, assume next year
  if (new Date(year, month - 1, day) < new Date(now.getFullYear(), now.getMonth(), now.getDate()))
    year++;
  return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}

function detectFlightDate(el) {
  // 1. Walk up ancestors for data-value="YYYY-MM-DD"
  let node = el.parentElement;
  for (let i = 0; i < 15; i++) {
    if (!node || node === document.body) break;
    const v = node.dataset && node.dataset.value;
    if (v && /^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
    node = node.parentElement;
  }

  // 2. Walk up ancestors for a date-pattern in aria-label
  // (e.g. "Departing flight on Wednesday, May 6. Leaves...")
  node = el.parentElement;
  for (let i = 0; i < 15; i++) {
    if (!node || node === document.body) break;
    const label = node.getAttribute('aria-label') || '';
    const m = label.match(
      /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})/i
    );
    if (m) return _monthDayToDate(m[1], parseInt(m[2], 10));
    node = node.parentElement;
  }

  // 3. Page-level date pickers — use Return date when on return-leg selection,
  //    otherwise Departure. Detect leg by scanning headings for "return".
  //    Uses input[aria-label] which is stable (required for accessibility).
  const isReturnLeg = Array.from(document.querySelectorAll('h1,h2,h3,h4'))
    .some(h => /returning flights/i.test(h.textContent));

  function _dateFromInput(ariaLabel) {
    const input = document.querySelector(`input[aria-label="${ariaLabel}"]`);
    if (!input) return null;
    let n = input.parentElement;
    for (let i = 0; i < 6; i++) {
      if (!n) break;
      if (/^\d{4}-\d{2}-\d{2}$/.test(n.dataset.value || '')) return n.dataset.value;
      n = n.parentElement;
    }
    return null;
  }

  return (isReturnLeg ? _dateFromInput('Return') : null)
      || _dateFromInput('Departure')
      || _dateFromInput('Return')
      || null;
}

// ---------------------------------------------------------------------------
// For multi-leg flights: split expanded text at each segment's flight number
// and detect aircraft per chunk. Returns array of { year, flightCode, level }
// or null if no flight numbers are found in the text.
// ---------------------------------------------------------------------------
function _getLegsFromText(text, segments, carriers) {
  const bounds = [];
  for (const seg of segments) {
    const re = new RegExp(
      seg.carrier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*' + seg.flnum + '\\b', 'i'
    );
    const m = re.exec(text);
    bounds.push({ pos: m ? m.index : -1, seg });
  }
  if (bounds.every(b => b.pos === -1)) return null;
  bounds.sort((a, b) => a.pos - b.pos);

  const results = [];
  for (let i = 0; i < bounds.length; i++) {
    const { pos, seg } = bounds[i];
    let year = null, level = 'carrier';
    if (pos !== -1) {
      const nextPos = (bounds[i + 1] && bounds[i + 1].pos > pos) ? bounds[i + 1].pos : text.length;
      const chunk = text.slice(pos, nextPos);
      const typecodes = textToTypecodes(chunk);
      if (typecodes) {
        const cdata = DB[seg.carrier];
        if (cdata) for (const tc of typecodes) {
          if (cdata[tc] != null) { year = cdata[tc]; break; }
        }
        if (!year) for (const tc of typecodes) {
          if (FALLBACK[tc] != null) { year = FALLBACK[tc]; break; }
        }
        if (year) level = 'model';
      }
    }
    if (year == null) year = CARRIER_AVG[seg.carrier] ?? null;
    if (year != null) results.push({ year, flightCode: seg.flightCode, level });
  }
  return results.length ? results : null;
}

// ---------------------------------------------------------------------------
// Core: determine year(s) for a CO2 element.
// Returns array of { year, flightCode, level } — one entry per leg.
//   level 'model'   – derived from aircraft type (shown after row expand)
//   level 'carrier' – carrier-wide average (shown immediately on load)
// ---------------------------------------------------------------------------
function getYearForFlight(el) {
  const timUrl = el.dataset.travelimpactmodelwebsiteurl;
  if (!timUrl) return null;

  const { carriers, allSegments } = parseFlightInfo(timUrl);
  if (!allSegments.length) return null;

  const aircraftText = detectAircraftText(el);

  // Multi-leg with expanded text: try per-leg aircraft detection
  if (allSegments.length > 1 && aircraftText) {
    const legs = _getLegsFromText(aircraftText, allSegments, carriers);
    if (legs) return legs;
  }

  // Single-leg (or multi-leg when per-leg detection fails)
  if (aircraftText) {
    const typecodes = textToTypecodes(aircraftText);
    if (typecodes) {
      let year = null;
      for (const carrier of carriers) {
        const cdata = DB[carrier];
        if (!cdata) continue;
        for (const tc of typecodes) {
          if (cdata[tc] != null) { year = cdata[tc]; break; }
        }
        if (year) break;
      }
      if (!year) for (const tc of typecodes) {
        if (FALLBACK[tc] != null) { year = FALLBACK[tc]; break; }
      }
      if (year) return [{ year, flightCode: allSegments[0].flightCode, level: 'model' }];
    }
  }

  // Carrier-level fallback — one entry per segment (deduplicated by flightCode)
  const seen = new Set();
  const results = [];
  for (const seg of allSegments) {
    const year = CARRIER_AVG[seg.carrier] ?? null;
    if (year == null || seen.has(seg.flightCode)) continue;
    seen.add(seg.flightCode);
    results.push({ year, flightCode: seg.flightCode, level: 'carrier' });
  }
  return results.length ? results : null;
}

// ---------------------------------------------------------------------------
// DOM: replace CO2 display with year badge
// ---------------------------------------------------------------------------
const _FONT = "'Google Sans',Roboto,'Helvetica Neue',Arial,sans-serif";

const _PROVIDERS = {
  flightera:    id => `https://www.flightera.net/en/flight/${id}`,
  flightradar24:id => `https://www.flightradar24.com/data/flights/${id}`,
  radarbox:     id => `https://www.radarbox.com/data/flights/${id}`,
  trip:         id => `https://www.trip.com/flights/status-${id}/`,
};

// Provider chosen in popup; populated before the observer starts
let _providerKey = 'flightera';

function _buildUrl(flightCode) {
  if (!flightCode) return null;
  const fn = _PROVIDERS[_providerKey] || _PROVIDERS.flightera;
  return fn(flightCode.toLowerCase());
}

function replaceEmissions(el) {
  const existing = el.querySelector('[data-cd]');

  const results = getYearForFlight(el);
  if (!results || !results.length) return;

  const level = results.every(r => r.level === 'model') ? 'model' : 'carrier';

  // Don't downgrade from model-level to carrier-level
  if (existing && existing.dataset.cd === 'model' && level === 'carrier') return;
  // Nothing changed
  if (existing && existing.dataset.cd === level) return;

  // Remove stale badge before re-injecting with better data
  if (existing) existing.remove();

  // Hide Google's CO2 number and its unit/label spans
  el.querySelectorAll('.O7CXue,.RioxB').forEach(e => { e.style.display = 'none'; });

  const div = document.createElement('div');
  div.dataset.cd = level;
  div.style.cssText =
    `font-family:${_FONT};font-size:16px;font-weight:400;` +
    `letter-spacing:0.1px;line-height:20px;color:var(--te8f1ea4d4928be48);` +
    `display:flex;flex-wrap:wrap;align-items:center;`;

  const _SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 20 20" style="vertical-align:middle;margin-left:4px">'
    + '<polyline points="17 8 17 3 12 3" fill="none" stroke="#F9C024" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>'
    + '<line x1="17" y1="3" x2="10" y2="10" fill="none" stroke="#F9C024" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>'
    + '<path d="m8,3h-2c-1.657,0-3,1.343-3,3v8c0,1.657,1.343,3,3,3h8c1.657,0,3-1.343,3-3v-2" fill="none" stroke="#F9C024" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>'
    + '</svg>';

  results.forEach((r, i) => {
    if (i > 0) div.appendChild(document.createTextNode(', '));
    const url = _buildUrl(r.flightCode);
    if (url) {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.style.cssText = 'color:inherit;text-decoration:none;display:inline-flex;align-items:center;';
      a.innerHTML = `~${r.year}` + _SVG;
      div.appendChild(a);
    } else {
      div.appendChild(document.createTextNode(`~${r.year}`));
    }
  });

  el.appendChild(div);
}

// ---------------------------------------------------------------------------
// Observe DOM mutations and process new CO2 elements.
// Read provider preference first so links are correct from the first render.
// ---------------------------------------------------------------------------
let _raf = null;
function schedule() {
  if (_raf) return;
  _raf = requestAnimationFrame(() => {
    _raf = null;
    document.querySelectorAll('.NZRfve[data-travelimpactmodelwebsiteurl]')
      .forEach(replaceEmissions);
  });
}

function _startObserver() {
  new MutationObserver(schedule).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-travelimpactmodelwebsiteurl'],
  });
  schedule();
}

// Also re-render all badges when the user switches provider in the popup
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.provider) {
    _providerKey = changes.provider.newValue || 'flightera';
    // Remove all existing badges so they get re-rendered with the new URLs
    document.querySelectorAll('[data-cd]').forEach(el => el.remove());
    schedule();
  }
});

// ---------------------------------------------------------------------------
// Alt-key peek: hold Alt to temporarily reveal original CO2 emissions info
// ---------------------------------------------------------------------------
function _setAltPeek(active) {
  document.querySelectorAll('.NZRfve[data-travelimpactmodelwebsiteurl]').forEach(el => {
    el.querySelectorAll('.O7CXue,.RioxB').forEach(e => {
      e.style.display = active ? '' : 'none';
    });
    const badge = el.querySelector('[data-cd]');
    if (badge) badge.style.display = active ? 'none' : '';
  });
}

document.addEventListener('keydown', e => { if (e.key === 'Alt') _setAltPeek(true); });
document.addEventListener('keyup',   e => { if (e.key === 'Alt') _setAltPeek(false); });

chrome.storage.sync.get({ provider: 'flightera' }, ({ provider }) => {
  _providerKey = provider;
  _startObserver();
});
