#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from SheetParser import SheetParser
from openpyxl import load_workbook
import json


DATASET = 'finnish-birth-cohorts'
FILENAME = 'FBC-rekisterit.xlsx'
DATA_PATH = '../public/data/' + DATASET + '/'

config = {
    'categories': {"subjects": {"fi": "kohorttilaiset", "en": "subjects"}, "parents": {"fi": "vanhemmat", "en": "parents"}},
    'start_row': 4,
    'reg_adm_col': 'A',
    'reg_col': 'B',
    'harmonize_col': 'C',
    'cat_col': 'D',
    'note_col': 'I',
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
parser = SheetParser(workbook['Yhdistetty'], config)
parser.parse_sheet()
parser.parse_link_sheet(workbook['Linkit rekisterikuvauksiin'])
data = parser.data

filenames = []

for dataset in data:
    filename = dataset['name']['en'] + '.json'
    with open(DATA_PATH + filename, 'w', encoding='utf-8') as f:
        print('Create/update file: ' + DATA_PATH + filename)
        json.dump(dataset, f, ensure_ascii=False, default=str, indent=2)
        filenames.append(filename)

with open(DATA_PATH + 'filenames.json', 'w', encoding='utf-8') as f:
    json.dump(filenames, f, ensure_ascii=False, default=str, indent=2)

parser.bundle_json_files(DATA_PATH)
