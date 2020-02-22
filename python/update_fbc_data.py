#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from parse_sheet import parse_sheet
from openpyxl import load_workbook
import json


DATASET = 'finnish-birth-cohorts'
FILENAME = 'FBC-rekisterit.xlsx'
DATA_PATH = '../public/data/' + DATASET + '/'

config = {
    'categories': {"subjects": {"fi": "kohorttilaiset", "en": "subjects"}, "parents": {"fi": "vanhemmat", "en": "parents"}},
    'start_row': 4,
    'end_row': 95,
    'registrar_col': 'A',
    'register_col': 'B',
    'dataset_col': 'C',
    'keywords_col': 'D',
    'notes_col': 'I',
    'cohort_cols': [
        {
            'col': 'E',
            'cohort': '1987',
            'category': 'subjects'
        },
        {
            'col': 'F',
            'cohort': '1997',
            'category': 'subjects'
        },
        {
            'col': 'G',
            'cohort': '1987',
            'category': 'parents',
        },
        {
            'col': 'H',
            'cohort': '1997',
            'category': 'parents',
        }
    ]
}

workbook = load_workbook(FILENAME, read_only=True)
sheet = workbook['rekisterit']

(registrars, registers, datasets, samplings) = parse_sheet(sheet, config)

with open(DATA_PATH + 'registrars.json', 'w', encoding='utf-8') as f:
    print('create file: ' + DATA_PATH + 'registrars.json')
    json.dump(registrars, f, ensure_ascii=False, default=str, indent=2)

with open(DATA_PATH + 'registers.json', 'w', encoding='utf-8') as f:
    print('create file: ' + DATA_PATH + 'registers.json')
    json.dump(registers, f, ensure_ascii=False, default=str, indent=2)

with open(DATA_PATH + 'datasets.json', 'w', encoding='utf-8') as f:
    print('create file: ' + DATA_PATH + 'datasets.json')
    json.dump(datasets, f, ensure_ascii=False, default=str, indent=2)

with open(DATA_PATH + 'samplings.json', 'w', encoding='utf-8') as f:
    print('create file: ' + DATA_PATH + 'samplings.json')
    json.dump(samplings, f, ensure_ascii=False, default=str, indent=2)
