#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from SheetParser import SheetParser
from openpyxl import load_workbook
import json


DATASET = 'psycohorts'
FILENAME = 'PSYCOHORTS-registers.xlsx'
DATA_PATH = '../public/data/' + DATASET + '/'

config = {
    'categories': {"subjects": {"fi": "kohorttilaiset", "en": "subjects"}, "parents": {"fi": "vanhemmat", "en": "parents"}},
    'start_row': 4,
    'registrar_col': 'A',
    'register_col': 'B',
    'harmonize_col': 'C',
    'register_detail_col': 'D',
    'keywords_col': 'AL',	
    'notes_col': 'AK',
    'cohort_cols': [
        {
            'col': 'E',
            'cohort': '1966',
            'category': 'subjects'
        },
        {
            'col': 'F',
            'cohort': '1986',
            'category': 'subjects'
        },
        {
            'col': 'G',
            'cohort': '1966',
            'category': 'parents'
        },
        {
            'col': 'H',
            'cohort': '1986',
            'category': 'parents'
        },
        {
            'col': 'I',
            'cohort': '1987',
            'category': 'subjects'
        },
        {
            'col': 'J',
            'cohort': '1997',
            'category': 'subjects'
        },
        {
            'col': 'K',
            'cohort': '1987',
            'category': 'parents'
        },
        {
            'col': 'L',
            'cohort': '1997',
            'category': 'parents'
        },
        {
            'col': 'M',
            'cohort': 'FNBCS-81',
            'category': 'subjects'
        },
        {
            'col': 'N',
            'cohort': 'FNBCS-81',
            'category': 'parents'
        },
        {
            'col': 'O',
            'cohort': 'FIPS-ADHD',
            'category': 'subjects'
        },
        {
            'col': 'P',
            'cohort': 'FIPS-ADHD',
            'category': 'parents'
        },
        {
            'col': 'Q',
            'cohort': 'FIPS-ASD',
            'category': 'subjects'
        },
        {
            'col': 'R',
            'cohort': 'FIPS-ASD',
            'category': 'parents'
        },
        {
            'col': 'S',
            'cohort': 'FIPS-Tourette',
            'category': 'subjects'
        },
        {
            'col': 'T',
            'cohort': 'FIPS-Tourette',
            'category': 'parents'
        },
        {
            'col': 'U',
            'cohort': 'FIPS-Conduct dis.',
            'category': 'subjects'
        },
        {
            'col': 'V',
            'cohort': 'FIPS-Conduct dis.',
            'category': 'parents'
        },
        {
            'col': 'W',
            'cohort': 'FIPS-Anxiety',
            'category': 'subjects'
        },
        {
            'col': 'X',
            'cohort': 'FIPS-Anxiety',
            'category': 'parents'
        },
        {
            'col': 'Y',
            'cohort': 'FIPS-Depression',
            'category': 'subjects'
        },
        {
            'col': 'Z',
            'cohort': 'FIPS-Depression',
            'category': 'parents'
        },
        {
            'col': 'AA',
            'cohort': 'FIPS-Schizophrenia',
            'category': 'subjects'
        },
        {
            'col': 'AB',
            'cohort': 'FIPS-Schizophrenia',
            'category': 'parents'
        },
        {
            'col': 'AC',
            'cohort': 'FIPS-Bipolar',
            'category': 'subjects'
        },
        {
            'col': 'AD',
            'cohort': 'FIPS-Bipolar',
            'category': 'parents'
        },
        {
            'col': 'AE',
            'cohort': 'FIPS-Learning dis.',
            'category': 'subjects'
        },
        {
            'col': 'AF',
            'cohort': 'FIPS-Learning dis.',
            'category': 'parents'
        },
        {
            'col': 'AG',
            'cohort': 'FIPS-OCD',
            'category': 'subjects'
        },
        {
            'col': 'AH',
            'cohort': 'FIPS-OCD',
            'category': 'parents'
        },
        {
            'col': 'AI',
            'cohort': 'SSRI',
            'category': 'subjects'
        },
        {
            'col': 'AJ',
            'cohort': 'SSRI',
            'category': 'parents'
        }
    ]
}

workbook = load_workbook(FILENAME, read_only=True)
sheet = workbook['registers']
sheet_parser = SheetParser(sheet, config)
sheet_parser.parse_sheet()
data = sheet_parser.data

filenames = []

for dataset in data:
    filename = dataset['name']['en'] + '.json'
    with open(DATA_PATH + filename, 'w', encoding='utf-8') as f:
        print('Create/update file: ' + DATA_PATH + filename)
        json.dump(dataset, f, ensure_ascii=False, default=str, indent=2)
        filenames.append(filename)

with open(DATA_PATH + 'filenames.json', 'w', encoding='utf-8') as f:
    json.dump(filenames, f, ensure_ascii=False, default=str, indent=2)

sheet_parser.bundle_json_files(DATA_PATH)
