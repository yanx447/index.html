"""analysis.json (analyze.py) → the app's song lessons.

  ../../lessons/songs.json   what every learner gets (schema panduri-song): beat map, tempo map, sections, chord
                             changes in seconds, rhythm per section, melody notes, lyrics with syllable times
  ../../lessons/review.json  what only the owner's editor reads: method agreement, per-chord confidence, passages to
                             review, the owner's own example chart — never shown on a learner's page

Nothing is typed in here: chords, times and notes come from the analysis; the only hand-given inputs are the
owner's (songs.json `hint`, lyrics below), and they are kept apart and marked as his.
Usage: python build-data.py
"""
import json, os, pathlib, collections, math
import numpy as np
from analyze import parse_chord, NAMES, tempo_map

HERE = pathlib.Path(__file__).resolve().parent
CACHE = pathlib.Path(os.environ.get('LESSON_CACHE', HERE / 'cache'))
OUT = HERE.parents[1] / 'lessons'

# The owner's example for Diaco (his message, 2026-11-25): words and where he puts the chords. The words are used as
# the lyrics of the first sung stanza; his chords are kept for the review only — the recording is checked on its own.
OWNER_LYRICS = {
    'ml-shenam-vin-gkitkhavs-diatso': {
        'lines': ['შენამ ვინ გკითხავს დიაცო,', 'თოფისასა და ხმლისასა,', 'შენ უნდა ეჯდე აკავანს,', 'ან უნდა ქსოვდე წინდასა,'],
        'example': '[Am] შენამ ვინ გკითხავს დიაცო, / თოფისასა და [E] ხმლი[F]სასა, / [G] შენ უნდა ეჯდე აკავანს, / [F] ან უნდა [G] ქსოვდე [A] წინდასა, (×2)',
        'stanza': 0
    }
}
V = set('აეიოუaeiouAEIOU')


def syllables(text):
    """the same split the app uses (musiclib.syllables): a vowel closes a syllable"""
    out, cur, start = [], '', 0
    for i, c in enumerate(text):
        if not cur: start = i
        cur += c
        nx = text[i + 1] if i + 1 < len(text) else ''
        n2 = text[i + 2] if i + 2 < len(text) else ''
        if c in V and nx and not nx.isspace() and nx not in V and n2 and n2 not in '.,!?;:–—- ' and n2 not in V and not n2.isspace():
            out.append((start, cur)); cur = ''; continue
        if c in V and nx and not nx.isspace() and nx not in '.,!?;:':
            out.append((start, cur)); cur = ''; continue
        if c.isspace(): out.append((start, cur)); cur = ''
    if cur: out.append((start, cur))
    return out


def phrases(mel, gap=.45, min_len=1.0):
    ns = sorted(mel, key=lambda n: n['t']); out, cur = [], [ns[0]] if ns else []
    for n in ns[1:]:
        if n['t'] - (cur[-1]['t'] + cur[-1]['d']) > gap: out.append(cur); cur = [n]
        else: cur.append(n)
    if cur: out.append(cur)
    return [p for p in out if p[-1]['t'] + p[-1]['d'] - p[0]['t'] >= min_len]


def stanzas(ph):
    """groups of four phrases whose lengths follow the same long · short · long · long shape (Diaco)"""
    out, i = [], 0
    L = [p[-1]['t'] + p[-1]['d'] - p[0]['t'] for p in ph]
    while i + 3 < len(ph):
        a = L[i:i + 4]
        if a[1] < min(a[0], a[2], a[3]) and ph[i + 3][-1]['t'] - ph[i][0]['t'] < 18: out.append(ph[i:i + 4]); i += 4
        else: i += 1
    return out


def lyrics_for(sid, r):
    L = OWNER_LYRICS.get(sid)
    if not L: return [], None
    st = stanzas(phrases(r['melody']))
    if len(st) <= L['stanza']: return [], {'what': 'lyrics', 'note': 'no stanza of four phrases found for the owner\'s lines'}
    out = []
    for line, p in zip(L['lines'], st[L['stanza']]):
        onsets = [n['t'] for n in p]
        syl = syllables(line)
        sy = [{'i': i, 't': round(onsets[min(len(onsets) - 1, round(k * len(onsets) / len(syl)))], 3)} for k, (i, s) in enumerate(syl) if s.strip()]
        out.append({'t': round(p[0]['t'], 3), 'e': round(p[-1]['t'] + p[-1]['d'], 3), 'text': line, 'syl': sy, 'src': 'owner'})
    rev = {'what': 'lyrics', 'from': out[0]['t'], 'to': out[-1]['e'],
           'note': 'the owner\'s lines placed on the first sung stanza (4 phrases, %d stanzas of the same shape heard); syllable times follow the sung note onsets; later stanzas have no words yet' % len(st)}
    return out, rev


def repair_beats(beats, bpm):
    """stretches where the tracker took another level of the pulse (3 beats in the time of 2, or a beat skipped) are
    spaced again at the song's own beat, between the good beats on either side. Returns the new map and what changed."""
    b = list(map(float, beats)); P = 60 / bpm; out, fixed = [b[0]], []
    bad = lambda r: .55 < r < .82 or 1.3 < r < 1.75 or 1.8 < r < 2.25
    i = 0
    while i < len(b) - 1:
        r = (b[i + 1] - b[i]) / P
        if not bad(r): out.append(b[i + 1]); i += 1; continue
        j = i
        while j < len(b) - 1 and bad((b[j + 1] - b[j]) / P): j += 1
        T = b[j] - b[i] if j > i else b[i + 1] - b[i]
        end = j if j > i else i + 1
        n = max(1, round((b[end] - b[i]) / P))
        for k in range(1, n): out.append(round(b[i] + (b[end] - b[i]) * k / n, 3))
        out.append(b[end]); fixed.append([round(b[i], 3), round(b[end], 3), end - i, n]); i = end
    return out, fixed


def level_of(names, bpm, dur):
    used = len(set(n for n in names if n))
    changes = sum(1 for a, b in zip(names, names[1:]) if a != b) / max(1, dur / 60)
    if used <= 3 and changes < 14: return 1
    if used >= 6 or changes > 28 or bpm > 140: return 3
    return 2


def rhythm_for(item, r):
    """the rhythm per song: the owner's word (Tushuri), the teacher's rhythm the title names, or the stroke places measured"""
    hint = (item.get('hint') or {}).get('rhythm')
    grid = [g for g in r['strokes']['whole'] if g['strength'] >= .25]
    note = None
    if hint == 'tushuri':
        # ↓ at the strongest place, ↑ at the next one, the pause from the third place to the next beat
        g = sorted(grid, key=lambda x: x['pos'])
        d0 = g[0]['pos'] if g else 0
        rel = sorted(((x['pos'] - d0) % 1, x['strength']) for x in g)
        up = next((p for p, s in rel if .25 <= p <= .5), 1 / 3)
        rest = next((p for p, s in rel if .55 <= p <= .8), 2 / 3)
        return [{'from': 0, 'id': 'tushuri', 'span': 1, 'pos': [0, round(up, 3)], 'restPos': round(rest, 3)}], {
            'what': 'rhythm', 'note': 'Tushuri (owner): ↓ at 0, ↑ at %.3f of the beat, pause from %.3f (%d ms at %.1f BPM). Stroke directions are the owner\'s; the places are measured.' % (up, rest, round((1 - rest) * 60000 / r['bpm']), r['bpm']),
            'measured': rel}
    title = (item['title']['en'] or '').lower()
    if 'acharuli' in title and r['subdivision'] == 3:
        g = sorted(grid, key=lambda x: x['pos'])
        if len(g) >= 3: return [{'from': 0, 'id': 'acharuli', 'span': 1, 'pos': [round(x['pos'] - g[0]['pos'], 3) for x in g[:3]]}], {'what': 'rhythm', 'note': 'the teacher\'s Acharuli (↓ ↓> ↑>) on the three stroke places measured: ' + ', '.join(str(x['pos']) for x in g[:3])}
    # otherwise: the places where strokes were heard; down on the beat, up between (the pendulum rule) — directions are not audible
    g = sorted(grid, key=lambda x: x['pos'])[:4] or [{'pos': 0, 'strength': 1}]
    d0 = g[0]['pos']
    st = []
    for k, x in enumerate(g):
        p = round((x['pos'] - d0) % 1, 3)
        st.append({'pos': p, 'acc': False})
    st.sort(key=lambda s: s['pos'])
    for k, x in enumerate(st): x['dir'] = 'down' if k % 2 == 0 else 'up'
    return [{'from': 0, 'id': 'custom', 'span': 1, 'strokes': st}], {'what': 'rhythm', 'note': 'stroke places measured %s; directions follow the pendulum rule (down on the beat), not heard — choose the song\'s rhythm' % [s['pos'] for s in st]}


def triad_name(n):
    """the chord a panduri player holds for it: major or minor (sus/7/aug read from drones are not trusted for a lesson)"""
    rq = parse_chord(n) if n else None
    if not rq: return n
    r, q = rq
    return NAMES[r] + ('m' if (q.startswith('m') and not q.startswith('maj')) or q.startswith('dim') else '')


def simplified(r):
    """per beat: triads, and a one-beat chord the methods do not agree on joins the chord before it"""
    names = [triad_name(n) for n in r['chartPerBeat']]
    conf, how = r['chordConfidence'], r['chartHow']
    for _ in range(2):
        for i in range(1, len(names) - 1):
            if names[i] != names[i - 1] and names[i] != names[i + 1] and how[i] != 'cycle' and conf[i] < .6:
                names[i] = names[i - 1]
    return names


def chord_events(r):
    beats, chart, how = r['beats'], simplified(r), r['chartHow']
    ev_by_beat = {e['beat']: e for e in r['chordEvents']}
    out = []
    for i, n in enumerate(chart):
        if i and n == chart[i - 1]: continue
        e = ev_by_beat.get(i - .5) if i else None
        if e and triad_name(e['chord']) == n: t = e['t']
        else:
            e = ev_by_beat.get(float(i))
            t = e['t'] if e and triad_name(e['chord']) == n else beats[i]
        out.append({'t': round(float(t), 3), 'chord': n})
    # times must increase
    for k in range(1, len(out)):
        if out[k]['t'] <= out[k - 1]['t']: out[k]['t'] = round(out[k - 1]['t'] + .01, 3)
    return out


def main():
    man = json.load(open(HERE / 'songs.json'))
    songs, review = [], {}
    for item in man['songs']:
        p = CACHE / item['id'] / 'analysis.json'
        if not p.exists(): print('no analysis for', item['id']); continue
        r = json.load(open(p))
        beats, fixed = repair_beats(r['beats'], r['bpm'])
        old = np.array(r['beats'], float)
        to_new = lambda i: int(np.argmin(np.abs(np.array(beats) - old[min(i, len(old) - 1)])))
        sub, bpb = r['subdivision'], r['meter']['beatsPerBar']
        rhythm, rnote = rhythm_for(item, r)
        if rhythm[0]['id'] == 'tushuri': sub = 3
        label = ('%d/8' % (bpb * 3)) if sub == 3 else ('%d/4' % bpb)
        chords = chord_events(r)
        lyr, lnote = lyrics_for(item['id'], r)
        notes = [[n['t'], n['d'], n['m']] for n in r['melody'] if n['conf'] >= .45]
        dropped = sum(1 for n in r['melody'] if n['conf'] < .45)
        secs = [{'kind': s['kind'], 'from': to_new(s['from']), 'to': to_new(s['to']), **({'letter': s['letter']} if s.get('letter') else {})} for s in r['sections']]
        tempo = [{'from': s['fromBeat'], 'to': s['toBeat'], 'bpm': s['bpm']} for s in tempo_map(np.array(beats))[0]]
        D = {'schema': 'panduri-song', 'v': 1, 'id': item['id'], 'title': item['title'], 'artist': item.get('artist'), 'kind': item['kind'],
             'level': level_of(simplified(r), r['bpm'], r['durationSeconds']), 'duration': r['durationSeconds'], 'key': r['key']['key'],
             'bpm': r['bpm'], 'meter': {'label': label, 'beatsPerBar': bpb, 'sub': sub, 'phase': r['meter']['phase']},
             'beats': beats, 'tempo': tempo, 'sections': secs, 'chords': chords, 'rhythm': rhythm, 'notes': notes}
        if lyr: D['lyrics'] = lyr
        songs.append(D)
        # the owner's review: everything the analysis is unsure of
        rv = list(r['review'])
        unsure = [i for i, h in enumerate(r['chartHow']) if h == 'unsure']
        runs = []
        for i in unsure:
            if runs and i - runs[-1][1] <= 1: runs[-1][1] = i + 1
            else: runs.append([i, i + 1])
        for a, b in runs:
            if b - a >= 4: rv.append({'what': 'chords', 'from': beats[a], 'to': beats[min(b, len(beats) - 1)], 'note': 'the song\'s cycle does not explain this passage; measured chords kept'})
        rv.append(dict(rnote, **{'from': 0, 'to': r['durationSeconds']}))
        for a, e, was, now in fixed:
            rv.append({'what': 'beats', 'from': a, 'to': e, 'note': 'the tracker counted %d beats here; spaced again as %d at the song\'s beat — check the beat map' % (was, now)})
        if lnote: rv.append(lnote)
        if r['meter']['margin'] < .3: rv.append({'what': 'meter', 'from': 0, 'to': r['durationSeconds'], 'note': 'bar length %d is a weak choice (margin %.2f): %s' % (bpb, r['meter']['margin'], r['meter']['ranking'][:3])})
        if r['key']['agree'] < 3: rv.append({'what': 'key', 'from': 0, 'to': r['durationSeconds'], 'note': 'key methods disagree: %s' % {k: v['key'] for k, v in r['key']['methods'].items()}})
        rv.append({'what': 'sections', 'from': 0, 'to': r['durationSeconds'], 'note': 'sections follow where the voice sings; verse/chorus are not told apart by ear — letters mark parts with the same chords'})
        rv.append({'what': 'notes', 'from': 0, 'to': r['durationSeconds'], 'note': 'melody from the %s stem (pYIN, checked against Melodia and Basic Pitch): %d notes kept, %d dropped below 45 %% agreement; polyphonic singing gives the loudest voice only' % (r.get('melodyStem', 'vocals'), len(notes), dropped)})
        conf = r['chordConfidence']
        review[item['id']] = {
            'status': 'needs-review', 'review': sorted([x for x in rv if x.get('from') is not None], key=lambda x: x['from']),
            'chordConfidence': [round(float(np.mean(conf[max(0, int(np.searchsorted(beats, c['t'])) - 1):max(1, int(np.searchsorted(beats, chords[k + 1]['t'] if k + 1 < len(chords) else beats[-1])))] or [0])), 2) for k, c in enumerate(chords)],
            'methods': r['methods'], 'beatAgreement': r['beatAgreement'], 'beatLevels': r['beatLevels'], 'beatLevelNote': r.get('beatLevelNote'),
            'chordMethodAgreement': r['chordMethodAgreement'], 'key': r['key'], 'meter': r['meter'], 'subdivisionEvidence': r['subdivisionEvidence'],
            'cycle': r['cycle'], 'chartShare': {k: round(v / len(r['chartHow']), 3) for k, v in collections.Counter(r['chartHow']).items()},
            'strokes': r['strokes']['whole'], 'heardAs': [c for c in r['chordEvents'] if c['chord'] and c['chord'] != triad_name(c['chord'])][:400], 'ownerExample': OWNER_LYRICS.get(item['id'], {}).get('example'),
            'recording': {'folder': item['folder'], 'file': item['file']}, 'titleUnknown': bool(item.get('titleUnknown'))
        }
    OUT.mkdir(exist_ok=True)
    json.dump({'schema': 'panduri-songs', 'v': 1, 'songs': songs}, open(OUT / 'songs.json', 'w'), ensure_ascii=False, separators=(',', ':'))
    json.dump(review, open(OUT / 'review.json', 'w'), ensure_ascii=False, separators=(',', ':'))
    print(len(songs), 'songs', os.path.getsize(OUT / 'songs.json'), 'B', os.path.getsize(OUT / 'review.json'), 'B review')


if __name__ == '__main__':
    main()
