#!/usr/bin/env python3
"""results.json -> the Markdown tables of docs/studio3/GEORGIAN-SEPARATION.md §4 (so no number is typed by hand).
Usage: python report.py <work dir>/results.json"""
import json, sys
r = json.load(open(sys.argv[1]))
S = ['doli', 'garmoni', 'duduki', 'panduri']; KA = {'doli': 'დოლი', 'garmoni': 'გარმონი', 'duduki': 'დუდუკი', 'panduri': 'ფანდური'}
M = [('mix', 'გაყოფის გარეშე (მიქსი)'), ('nmf', 'NMF (კლასიკური)'), ('model', '**ქსელი**'), ('oracle', 'oracle (ზედა ზღვარი)')]
m = r['model']
print(f"ქსელი: {m['params']:,} პარამეტრი, {m['steps']:,} step, {m['seconds'] // 60} წთ ტრენინგი.\n")
print('### ტესტი A — უცნობი ჩანაწერები, ოთხივე ერთად, თანაბარი ხმა (40 მიქსი × 8 წმ), მედიანური SDR / SI-SDR, dB\n')
print('| მეთოდი | ' + ' | '.join(KA[s] for s in S) + ' |'); print('|---' * 5 + '|')
for k, name in M:
    print(f'| {name} | ' + ' | '.join(f"{r['A'][k][s]['medianSDR']:.1f} / {r['A'][k][s]['medianSISDR']:.1f}" for s in S) + ' |')
print('\n**გაუმჯობესება „გაყოფის გარეშესთან" (SDRi):** ' + ' · '.join(f"{KA[s]} +{r['A']['model'][s]['medianSDR'] - r['A']['mix'][s]['medianSDR']:.1f} dB" for s in S))
if 'A_cross' in r:
    c = r['A_cross']['medianSDR']
    print('\n**ჯვარედინი შემოწმება (ქსელი):** სტრიქონი — გამოყოფილი stem, სვეტი — ნამდვილი ტრეკი, მედიანური SDR, dB. გადარქმეული stem დიაგონალს გარეთ აინთებოდა.\n')
    print('| გამოყოფილი \\ ნამდვილი | ' + ' | '.join(KA[s] for s in S) + ' |'); print('|---' * 5 + '|')
    for i, s in enumerate(S): print(f'| {KA[s]} | ' + ' | '.join((f'**{c[i][j]:.1f}**' if i == j else f'{c[i][j]:.1f}') for j in range(4)) + ' |')
print('\n### ტესტი B — ნამდვილი ანსამბლი (დროით გამოყოფილი ნაწილი, საკუთარი ხმით), მედიანური SDR, dB\n')
for name, title, pres in [('qalta_xevsuruli', 'QALTA XEVSURULI (დოლი + გარმონი), 275–424 წმ', ['doli', 'garmoni']), ('session_07', 'DOLI_07 + FANDURI 2_09 (დოლი + ფანდური), 111–160 წმ', ['doli', 'panduri'])]:
    b = r['B'][name]; absent = [s for s in S if s not in pres]
    print(f'**{title}**\n'); print('| მეთოდი | ' + ' | '.join(KA[s] for s in pres) + ' | ' + ' | '.join(f'{KA[s]} — გაჟონვა' for s in absent) + ' |'); print('|---' * (1 + len(S)) + '|')
    for k, nm in M:
        print(f'| {nm} | ' + ' | '.join(f"{b[k][s]['medianSDR']:.1f} ({b[k][s]['windows']})" for s in pres) + ' | ' + ' | '.join(f"{b[k][s]['absentLeakDb']:.1f} dB" for s in absent) + ' |')
    print()
