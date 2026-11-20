#!/usr/bin/env python3
"""round2/results_<fold>.json -> Markdown tables (no number typed by hand). Usage: python report2.py <work>/round2 F1|F2 [names...]"""
import json, os, sys
R2, fold = sys.argv[1], sys.argv[2]; r = json.load(open(os.path.join(R2, f'results_{fold}.json')))
S = ['doli', 'garmoni', 'duduki', 'panduri']; KA = {'doli': 'დოლი', 'garmoni': 'გარმონი', 'duduki': 'დუდუკი', 'panduri': 'ფანდური'}
LBL = {'nmf': 'NMF', 'asis_v1': 'v1 (არსებული მოდელი)', 'asis_v2': 'v2 (არსებული მოდელი)'}
def lbl(n):
    if n in LBL: return LBL[n]
    n2 = n.replace(fold + '_', ''); return ('hybrid (' + n2.split(':')[1].replace(fold + '_', '') + ' + NMF)') if n2.startswith('hybrid:') else n2 + ' (ხელახლა, ამ fold-ზე)'
names = sys.argv[3:] or [k for k in r if not k.startswith('_')]
def worst(n): return min(r[n]['eq'][s]['medianSDR'] for s in S)
print(f'#### {fold}: ოთხივე ერთად, თანაბარი ხმა (40 × 8 წმ) — მედიანური SDR / SI-SDR, dB [25–75 %]\n')
print('| მეთოდი | ' + ' | '.join(KA[s] for s in S) + ' | ყველაზე სუსტი |'); print('|---' * 6 + '|')
for n in names:
    print(f'| {lbl(n)} | ' + ' | '.join(f"{r[n]['eq'][s]['medianSDR']:.1f} / {r[n]['eq'][s]['medianSISDR']:.1f} [{r[n]['eq'][s]['q25']:.1f}…{r[n]['eq'][s]['q75']:.1f}]" for s in S) + f' | {worst(n):.1f} |')
if '_oracle' in r: print('| oracle (ზედა ზღვარი) | ' + ' | '.join(f"{r['_oracle'][s]:.1f}" for s in S) + ' | |')
print(f'\n#### {fold}: სხვადასხვა ხმა (თითო −8…+8 dB, მთლიანი −20…+8 dB) — მედიანური SDR, dB\n')
print('| მეთოდი | ' + ' | '.join(KA[s] for s in S) + ' |'); print('|---' * 5 + '|')
for n in names: print(f'| {lbl(n)} | ' + ' | '.join(f"{r[n]['var'][s]['medianSDR']:.1f}" for s in S) + ' |')
print(f'\n#### {fold}: მიქსს ემატება ქართული ვოკალი (ტრენინგში არნასმენი ნაწილი) — ოთხის მედიანური SDR, dB\n')
print('| მეთოდი | ' + ' | '.join(KA[s] for s in S) + ' | ვოკალის რა წილი მოხვდა ოთხ არხში |'); print('|---' * 6 + '|')
for n in names:
    L = r[n]['leak']['share']; vin = sum(L[4][:4])
    print(f'| {lbl(n)} | ' + ' | '.join(f"{r[n]['voc'][s]:.1f}" for s in S) + f' | {vin * 100:.0f} % |')
print(f'\n#### {fold}: გაჟონვა — მარტო ერთი საკრავი შედის; მისი ენერგიის რა წილი ხვდება თითო არხში (%)\n')
for n in names:
    L = r[n]['leak']['share']; cols = r[n]['leak']['cols'][:len(L[0])]
    has_o = any(L[i][4] > 0 for i in range(5))
    print(f'**{lbl(n)}**\n'); print('| შედის \\ ხვდება | ' + ' | '.join(KA.get(c, 'სხვა') for c in cols[:5 if has_o else 4]) + ' |'); print('|---' * ((5 if has_o else 4) + 1) + '|')
    for i, row in enumerate(['doli', 'garmoni', 'duduki', 'panduri', 'voice']):
        print(f"| {KA.get(row, 'ვოკალი')} | " + ' | '.join((f'**{L[i][j] * 100:.0f}**' if i == j else f'{L[i][j] * 100:.0f}') for j in range(5 if has_o else 4)) + ' |')
    print()
ens = [e for e in (r[names[0]].get('ens') or {})]
if ens:
    print(f'#### {fold}: ნამდვილი ანსამბლი (მთელი სესია, 8 წმ ფანჯრები) — მედიანური SDR / SI-SDR, dB\n')
    for e in ens:
        pres = [s for s in S if 'medianSDR' in r[names[0]]['ens'][e][s]]
        print(f'**{e}** — ' + ' + '.join(KA[s] for s in pres) + '\n'); print('| მეთოდი | ' + ' | '.join(KA[s] for s in pres) + ' |'); print('|---' * (len(pres) + 1) + '|')
        for n in names: print(f'| {lbl(n)} | ' + ' | '.join(f"{r[n]['ens'][e][s]['medianSDR']:.1f} / {r[n]['ens'][e][s]['medianSISDR']:.1f} ({r[n]['ens'][e][s]['windows']})" for s in pres) + ' |')
        print()
