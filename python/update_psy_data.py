#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from parse_sheet import parse_sheet
from openpyxl import load_workbook
import json


DATASET = 'psycohorts'
FILENAME = 'PSYCOHORTS-registers.xlsx'
DATA_PATH = '../public/data/' + DATASET + '/'

config = {
    'categories': {"subjects": {"fi": "kohorttilaiset", "en": "subjects"}, "parents": {"fi": "vanhemmat", "en": "parents"}},
    'start_row': 4,
    'end_row': 101,
    'registrar_col': 'A',
    'register_col': 'B',
    'dataset_col': 'C',
    'keywords_col': 'AK',	
    'notes_col': 'AJ',
    'cohort_cols': [
        {
            'col': 'D',
            'cohort': '1966',
            'category': 'subjects'
        },
        {
            'col': 'E',
            'cohort': '1986',
            'category': 'subjects'
        },
        {
            'col': 'F',
            'cohort': '1966',
            'category': 'parents'
        },
        {
            'col': 'G',
            'cohort': '1986',
            'category': 'parents'
        },
        {
            'col': 'H',
            'cohort': '1987',
            'category': 'subjects'
        },
        {
            'col': 'I',
            'cohort': '1997',
            'category': 'subjects'
        },
        {
            'col': 'J',
            'cohort': '1987',
            'category': 'parents'
        },
        {
            'col': 'K',
            'cohort': '1997',
            'category': 'parents'
        },
        {
            'col': 'L',
            'cohort': '2007',
            'category': 'subjects'
        },
        {
            'col': 'M',
            'cohort': '2007',
            'category': 'parents'
        },
        {
            'col': 'N',
            'cohort': 'FIPS-ADHD',
            'category': 'subjects'
        },
        {
            'col': 'O',
            'cohort': 'FIPS-ADHD',
            'category': 'parents'
        },
        {
            'col': 'P',
            'cohort': 'FIPS-ASD',
            'category': 'subjects'
        },
        {
            'col': 'Q',
            'cohort': 'FIPS-ASD',
            'category': 'parents'
        },
        {
            'col': 'R',
            'cohort': 'FIPS-Tourette',
            'category': 'subjects'
        },
        {
            'col': 'S',
            'cohort': 'FIPS-Tourette',
            'category': 'parents'
        },
        {
            'col': 'T',
            'cohort': 'FIPS-Conduct dis.',
            'category': 'subjects'
        },
        {
            'col': 'U',
            'cohort': 'FIPS-Conduct dis.',
            'category': 'parents'
        },
        {
            'col': 'V',
            'cohort': 'FIPS-Anxiety',
            'category': 'subjects'
        },
        {
            'col': 'W',
            'cohort': 'FIPS-Anxiety',
            'category': 'parents'
        },
        {
            'col': 'X',
            'cohort': 'FIPS-Depression',
            'category': 'subjects'
        },
        {
            'col': 'Y',
            'cohort': 'FIPS-Depression',
            'category': 'parents'
        },
        {
            'col': 'Z',
            'cohort': 'FIPS-Schizophrenia',
            'category': 'subjects'
        },
        {
            'col': 'AA',
            'cohort': 'FIPS-Schizophrenia',
            'category': 'parents'
        },
        {
            'col': 'AB',
            'cohort': 'FIPS-Bipolar',
            'category': 'subjects'
        },
        {
            'col': 'AC',
            'cohort': 'FIPS-Bipolar',
            'category': 'parents'
        },
        {
            'col': 'AD',
            'cohort': 'FIPS-Learning dis.',
            'category': 'subjects'
        },
        {
            'col': 'AE',
            'cohort': 'FIPS-Learning dis.',
            'category': 'parents'
        },
        {
            'col': 'AF',
            'cohort': 'FIPS-OCD',
            'category': 'subjects'
        },
        {
            'col': 'AG',
            'cohort': 'FIPS-OCD',
            'category': 'parents'
        },
        {
            'col': 'AH',
            'cohort': 'SSRI',
            'category': 'subjects'
        },
        {
            'col': 'AI',
            'cohort': 'SSRI',
            'category': 'parents'
        }
    ]
}

workbook = load_workbook(FILENAME, read_only=True)
sheet = workbook['registers']
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