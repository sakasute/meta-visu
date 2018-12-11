#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import regex
import os
import json
from openpyxl.utils import column_index_from_string


def col_index_0_based(col_str):
    if col_str == False:
        return False

    return column_index_from_string(col_str) - 1


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


def parse_possible_link(value):
    if value.startswith('=HYPERLINK'):
        info = parse_hyperlink(value)
    else:
        info = {'name': value, 'link': ''}
    return info


def parse_hyperlink(hyperlink):
    # hyperlink format: =HYPERLINK("https://www.etk.fi/wp-content/uploads/aineistolupahakemus_2tietosis%C3%A4ll%C3%B6n_kuvaus_2015_09_24.pdf","Eläkerekisteri")
    value = hyperlink[hyperlink.find('(')+1:hyperlink.find(')')]  # gets the value from inside the brackets
    splitted_value = ''.join(value.replace('"', '')).split(',')
    return {'name': splitted_value[1], 'link': splitted_value[0]}


def update_with_new_elements(list_to_update, update_list):
    for el in update_list:
        if el not in list_to_update:
            list_to_update.append(el)

    return list_to_update


class SheetParser:
    def __init__(self, sheet, config):
        self.data = []
        self.row_fi = ()
        self.row_en = ()
        self.sheet = sheet
        self.keywords = {'en': [], 'fi': []}

        self.registrar_name = {'en': '', 'fi': ''}
        self.register_info = {'name': {'en': '', 'fi': ''}, 'link': {'en': '', 'fi': ''}}
        self.register_detail_name = {'en': '', 'fi': ''}
        self.current_registrar_idx = None
        self.current_register_idx = None
        self.current_register_detail_idx = None

        self.config = config
        self.categories = self.extract_config('categories')
        self.start_row = self.extract_config('start_row')
        self.registrar_col = col_index_0_based(self.extract_config('registrar_col'))
        self.register_col = col_index_0_based(self.extract_config('register_col'))
        self.harmonize_col = col_index_0_based(self.extract_config('harmonize_col'))
        self.register_detail_col = col_index_0_based(self.extract_config('register_detail_col'))
        self.notes_col = col_index_0_based(self.extract_config('notes_col'))
        self.keywords_col = col_index_0_based(self.extract_config('keywords_col'))
        self.cohort_cols = self.extract_config('cohort_cols')

    def bundle_json_files(self, path):
        with open(path + 'filenames.json', 'r', encoding='utf-8') as f:
            filelist = json.load(f)

        data_bundle = {'data': {}, 'keywords': self.keywords}
        for filename in filelist:
            with open(path + filename, 'r', encoding='utf-8') as f:
                data = json.load(f)
                data_bundle['data'][filename] = data

        with open(path + 'data_bundle.json', 'w', encoding='utf-8') as f:
            json.dump(data_bundle, f, ensure_ascii=False, default=str)

    def add_keywords_to_tree(self, keywords, registrar_idx, register_idx):
        registrar_keywords_en = self.data[registrar_idx]['keywords']['en']
        registrar_keywords_fi = self.data[registrar_idx]['keywords']['fi']

        register_keywords_en = self.data[registrar_idx]['registers'][register_idx]['keywords']['en']
        register_keywords_fi = self.data[registrar_idx]['registers'][register_idx]['keywords']['fi']

        self.data[registrar_idx]['keywords']['en'] = update_with_new_elements(registrar_keywords_en, keywords['en'])
        self.data[registrar_idx]['keywords']['fi'] = update_with_new_elements(registrar_keywords_fi, keywords['fi'])

        self.data[registrar_idx]['registers'][register_idx]['keywords']['en'] = update_with_new_elements(
            register_keywords_en, keywords['en'])
        self.data[registrar_idx]['registers'][register_idx]['keywords']['fi'] = update_with_new_elements(
            register_keywords_fi, keywords['fi'])

    def add_samplings(self, samplings, registrar_idx, register_idx, register_detail_idx):
        for sampling in samplings:
            self.data[registrar_idx]['registers'][register_idx]['registerDetails'][register_detail_idx]['samplings'].append(
                sampling)

    def create_registrar(self, registrar_name):
        self.data.append({
            'keywords': {'en': [], 'fi': []},
            'name': registrar_name,
            'registers': [],
        })

        return len(self.data) - 1

    def create_register(self, register_name, link, is_harmonized, registrar_idx):
        self.data[registrar_idx]['registers'].append({
            'isHarmonized': is_harmonized,
            'keywords': {'en': [], 'fi': []},
            'link': link,
            'name': register_name,
            'registerDetails': [],
        })
        return len(self.data[registrar_idx]['registers']) - 1

    def create_register_detail(self, register_detail_name, notes, keywords, registrar_idx, register_idx):
        # NOTE: keywords are added to every level of the tree for easier filtering later on.
        self.add_keywords_to_tree(keywords, registrar_idx, register_idx)
        self.data[registrar_idx]['registers'][register_idx]['registerDetails'].append({
            'keywords': keywords,
            'name': register_detail_name,
            'notes': notes,
            'samplings': []
        })
        return len(self.data[registrar_idx]['registers'][register_idx]['registerDetails']) - 1

    def create_samplings(self, dates_str, cohort, category):
        dates = parse_dates(dates_str)
        samplings = []
        for date in dates:
            samplings.append({
                'startDate': date['start_date'],
                'endDate': date['end_date'],
                'cohort': cohort,
                'category': self.categories[category]
            })
        return samplings

    def extract_config(self, key):
        return self.config[key] if key in self.config.keys() else False

    def find_by_name(self, list, name, lang):
        for idx, item in enumerate(list):
            if item['name'][lang] == name[lang]:
                return idx
        else:
            return None

    def parse_registrar_cols(self):
        self.update_dict_from_col(self.registrar_name, self.registrar_col)
        self.current_registrar_idx = self.find_by_name(self.data, self.registrar_name, 'en')

        if self.current_registrar_idx == None:
            self.current_registrar_idx = self.create_registrar(dict(self.registrar_name))

    def parse_register_cols(self):
        self.update_register_info()
        self.current_register_idx = self.find_by_name(
            self.data[self.current_registrar_idx]['registers'], self.register_info['name'], 'en')

        if self.current_register_idx == None:
            is_harmonized = False
            if self.harmonize_col is not False:
                is_harmonized = self.row_fi[self.harmonize_col].value == True
            self.current_register_idx = self.create_register(
                dict(self.register_info['name']), dict(self.register_info['link']), is_harmonized, self.current_registrar_idx)

    def parse_register_detail_cols(self):
        self.update_dict_from_col(self.register_detail_name, self.register_detail_col)
        self.current_register_detail_idx = self.find_by_name(self.data[self.current_registrar_idx]['registers']
                                                             [self.current_register_idx]['registerDetails'], self.register_detail_name, 'en')

        if self.current_register_detail_idx == None:
            notes = {'en': '', 'fi': ''}
            register_detail_keywords = {'fi': [], 'en': []}
            if self.notes_col is not False:
                self.update_dict_from_col(notes, self.notes_col)
            if self.keywords_col is not False:
                self.update_dict_with_list_col(register_detail_keywords, self.keywords_col)
                self.update_keywords(register_detail_keywords['en'], register_detail_keywords['fi'])
            self.current_register_detail_idx = self.create_register_detail(
                dict(self.register_detail_name), dict(notes), dict(register_detail_keywords), self.current_registrar_idx, self.current_register_idx)

    def parse_cohort_cols(self):
        samplings = []
        for cohort_col in self.cohort_cols:
            col = col_index_0_based(cohort_col['col'])
            cohort_dates_str = str(self.row_fi[col].value)
            cohort_samplings = self.create_samplings(
                cohort_dates_str, cohort_col['cohort'], cohort_col['category'])
            samplings += cohort_samplings

        self.add_samplings(samplings, self.current_registrar_idx,
                           self.current_register_idx, self.current_register_detail_idx)

    # updates given dictionary with the value of current cell if the value is not None
    def update_dict_from_col(self, dictionary, col):
        value_fi = self.row_fi[col].value
        value_en = self.row_en[col].value
        dictionary['fi'] = value_fi if value_fi != None else dictionary['fi']
        dictionary['en'] = value_en if value_en != None else dictionary['en']

    # updates dictionary with a parsed list value
    def update_dict_with_list_col(self, dictionary, col):
        value_fi = self.row_fi[col].value
        value_en = self.row_en[col].value
        if value_fi != None:
            # this snippet first removes all whitespace and then splits the string between commas
            dictionary['fi'] = list(map(lambda s: s.strip(), value_fi.split(',')))
        if value_en != None:
            dictionary['en'] = list(map(lambda s: s.strip(), value_en.split(',')))

    def update_keywords(self, keyword_list_en, keyword_list_fi):
        self.keywords['en'] = update_with_new_elements(self.keywords['en'], keyword_list_en)
        self.keywords['fi'] = update_with_new_elements(self.keywords['fi'], keyword_list_fi)

    def update_register_info(self):
        value_fi = self.row_fi[self.register_col].value
        value_en = self.row_en[self.register_col].value

        if value_fi != None:
            register_info_fi = parse_possible_link(value_fi)
            register_info_en = parse_possible_link(value_en)

            self.register_info = {
                'name': {
                    'fi': register_info_fi['name'],
                    'en': register_info_en['name']
                },
                'link': {
                    'fi': register_info_fi['link'],
                    'en': register_info_en['link']
                }
            }

    def parse_sheet(self):
        iterator = self.sheet.iter_rows(min_row=self.start_row)
        for row in iterator:
            self.row_fi = row

            # Tries to take the next row from iterator. This should be the English version of the row.
            # Otherwise, parsing is completed and the loop is broken.
            try:
                self.row_en = next(iterator)
            except StopIteration:
                break

            if len(self.row_en) == 0:
                break

            self.parse_registrar_cols()
            self.parse_register_cols()
            self.parse_register_detail_cols()
            self.parse_cohort_cols()
