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
    'reg_adm_col': 0,
    'reg_col': 1,
    'cat_col': 2,
    'cohort_cols': [
        {
            'col': 3,
            'cohort': '1987',
            'category': 'subjects'
        },
        {
            'col': 4,
            'cohort': '1997',
            'category': 'subjects'
        },
    ]
}

workbook = load_workbook(FILENAME, read_only=True)
subjects_parser = SheetParser(workbook['Kohorttilaiset'], config)
subjects_parser.parse_sheet()
subjects_data = subjects_parser.data

config['cohort_cols'] = [
    {
        'col': 3,
        'cohort': '1987',
        'category': 'parents',
    },
    {
        'col': 4,
        'cohort': '1997',
        'category': 'parents',
    }
]

parents_parser = SheetParser(workbook['Vanhemmat'], config)
parents_parser.data = subjects_data
parents_parser.parse_sheet()
data = parents_parser.data

filenames = []

for dataset in data:
    filename = dataset['name']['en'] + '.json'
    with open(DATA_PATH + filename, 'w') as f:
        print('Create/update file: ' + DATA_PATH + filename)
        json.dump(dataset, f, ensure_ascii=False, default=str, indent=2)
        filenames.append(filename)

with open(DATA_PATH + 'filenames.json', 'w') as f:
    json.dump(filenames, f, ensure_ascii=False, default=str, indent=2)
