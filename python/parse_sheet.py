#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import regex
from openpyxl.utils import column_index_from_string

def parse_sheet(sheet, config):
    registrars = []
    registers = []
    datasets = []
    samplings = []

    start_row = config['start_row']
    end_row = config['end_row']

    iterator = sheet.iter_rows(min_row=start_row)
    row_fi = ()
    row_en = ()

    for row in iterator:
        row_fi = row
        try:
            row_en = next(iterator)
        except StopIteration:
            break
        
        if len(row_en) == 0 or row_en[0].row == end_row:
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
        samplings += new_samplings

    return (registrars, registers, datasets, samplings)

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

    notes_col = parse_col(config['notes_col'])
    notes_fi = row_fi[notes_col].value
    notes_en = row_en[notes_col].value

    keywords_col = parse_col(config['keywords_col'])
    keywords_fi = row_fi[keywords_col].value
    keywords_en = row_en[keywords_col].value

    return {
        'datasetId': row_fi[dataset_col].row,
        'datasetName': {
            'fi': name_fi if name_fi else '',
            'en': name_en if name_en else ''
        },
        'notes': {
            'fi': notes_fi if notes_fi != None else '',
            'en': notes_en if notes_en != None else ''
        },
        'keywords': {
            'fi': keywords_fi.split(',') if keywords_fi != None else [],
            'en': keywords_en.split(',') if keywords_en != None else []
        },
        'registerId': register_id
    }

def parse_samplings(row, datasets, config):
    datasetId = datasets[len(datasets) - 1].get('datasetId')
    cohort_configs = config['cohort_cols']

    samplings = []
    for cohort_config in cohort_configs:
        sampling_col = parse_col(cohort_config['col'])
        sampling_dates_str = str(row[sampling_col].value)
        dates = parse_dates(sampling_dates_str)
        for date in dates:
            samplings.append({
                'cohort': cohort_config['cohort'],
                'category': config['categories'][cohort_config['category']],
                'startDate': date['start_date'],
                'endDate': date['end_date'],
                'datasetId': datasetId
            })
    
    return samplings

def parse_dates(raw_dates_str):
    dates = []
    raw_dates_str = raw_dates_str.replace(' ', '')
    dates_list = raw_dates_str.split(';')
    for date_str in dates_list:
        start_date = format_date(date_str.split('-')[0], '-01-01')
        if start_date:
            end_date = format_date(date_str.split(
                '-')[1], '-12-31') if len(date_str.split('-')) > 1 else start_date

            dates.append({'start_date': start_date, 'end_date': end_date})
    return dates

def format_date(date_str, default_date):
    valid1 = regex.match(r'^[0-9]{4}$', date_str)
    valid2 = regex.match(r'^[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{4}$', date_str)

    if valid1:
        return date_str + default_date
    elif valid2:
        date_components = date_str.split('.')
        day = date_components[0].zfill(2)
        month = date_components[1].zfill(2)
        year = date_components[2]
        return year + '-' + month + '-' + day
    else:
        return False

def parse_col(col_str):
    return column_index_from_string(col_str) - 1