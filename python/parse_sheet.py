#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from openpyxl.utils import column_index_from_string

def parse_sheet(sheet, config):
    registrars = []
    registers = []
    datasets = []
    samplings = []

    start_row = config['start_row']

    iterator = sheet.iter_rows(min_row=start_row)
    row_fi = ()
    row_en = ()

    for row in iterator:
        row_fi =  row
        try:
            row_en = next(iterator)
        except StopIteration:
            break

        if len(row_en) == 0:
            break

        new_registrar = parse_registrar(row_fi, row_en, config)
        if (new_registrar):
            registrars.append(new_registrar)

        new_register = parse_register(row_fi, row_en, registrars, config)
        if new_register:
            registers.append(new_register)

        new_dataset = parse_dataset(row_fi, row_en, registers, config)
        if new_dataset:
            datasets.append(new_dataset)

        new_samplings = parse_samplings(row_fi, datasets, config)

def parse_registrar(row_fi, row_en, config):
    registrar_col = parse_col(config['registrar_col'])
    name_fi = row_fi[registrar_col].value
    name_en = row_en[registrar_col].value
    if name_fi:
        return {
            'registrarId': row_fi[registrar_col].row,
            'registrarName': {
                'fi': name_fi,
                'en': name_en
            }
        }
    else: 
        return None

def parse_register(row_fi, row_en, registrars, config):
    registrar_id = registrars[len(registrars) - 1].get('registrarId')
    register_col = parse_col(config['register_col'])
    name_fi = row_fi[register_col].value
    name_en = row_en[register_col].value
    if name_fi:
        return {
            'registerId': row_fi[register_col].row,
            'registerName': {
                'fi': name_fi,
                'en': name_en
            },
            'registrar_id': registrar_id
        }
    else:
        return None

def parse_dataset(row_fi, row_en, registers, config):
    register_id = registers[len(registers) - 1].get('registerId')
    dataset_col = parse_col(config['dataset_col'])
    name_fi = row_fi[dataset_col].value
    name_en = row_en[dataset_col].value
    if name_fi:
        notes_col = parse_col(config['notes_col'])
        notes_fi = row_fi[notes_col].value
        notes_en = row_en[notes_col].value
        return {
            'datasetId': row_fi[dataset_col].row,
            'datasetName': {
                'fi': name_fi,
                'en': name_en
            },
            'notes': {
                'fi': notes_fi if notes_fi != None else '',
                'en': notes_en if notes_en != None else ''
            },
            'registerId': register_id
        }
    else:
        None

def parse_samplings(row, datasets, config):
    cohorts = config['cohort_cols']
    

def parse_col(col_str):
    return column_index_from_string(col_str) - 1