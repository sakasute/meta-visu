#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import regex
import os
import json
from openpyxl.utils import column_index_from_string


def col_index_0_based(col_str):
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
    print({'name': splitted_value[1], 'link': splitted_value[0]})
    return {'name': splitted_value[1], 'link': splitted_value[0]}


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

    @staticmethod
    def bundle_json_files(path):
        with open(path + 'filenames.json', 'r', encoding='utf-8') as f:
            filelist = json.load(f)

        data_bundle = {}
        for filename in filelist:
            with open(path + filename, 'r', encoding='utf-8') as f:
                data = json.load(f)
                data_bundle[filename] = data

        with open(path + 'data_bundle.json', 'w', encoding='utf-8') as f:
            json.dump(data_bundle, f, ensure_ascii=False, default=str)

    def add_link(self, link, registrar_idx, register_idx):
        self.data[registrar_idx]['registers'][register_idx]['link'] = link

    def add_samplings(self, samplings, registrar_idx, register_idx, register_detail_idx):
        for sampling in samplings:
            self.data[registrar_idx]['registers'][register_idx]['registerDetails'][register_detail_idx]['samplings'].append(
                sampling)

    def create_registrar(self, registrar_name):
        self.data.append({
            'name': registrar_name,
            'registers': []
        })

        return len(self.data) - 1

    def create_register(self, register_name, link, is_harmonized, registrar_idx):
        # TODO: add support for keywords
        self.data[registrar_idx]['registers'].append({
            'name': register_name,
            'link': link,
            'isHarmonized': is_harmonized,
            'registerDetails': []
        })
        return len(self.data[registrar_idx]['registers']) - 1

    def create_register_detail(self, register_detail_name, notes, keywords, registrar_idx, register_idx):
        self.data[registrar_idx]['registers'][register_idx]['registerDetails'].append({
            'name': register_detail_name,
            'notes': notes,
            'keywords': keywords,
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
            keywords = {'fi': [], 'en': []}
            if self.notes_col is not False:
                self.update_dict_from_col(notes, self.notes_col)
            if self.keywords_col is not False:
                self.update_dict_with_list_col(keywords, self.keywords_col)
            self.current_register_detail_idx = self.create_register_detail(
                dict(self.register_detail_name), dict(notes), dict(keywords), self.current_registrar_idx, self.current_register_idx)

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
            dictionary['fi'] = ''.join(value_fi.split()).split(',')
        if value_en != None:
            dictionary['en'] = ''.join(value_en.split()).split(',')

    def update_keywords(self, keyword_list_fi, keyword_list_en):
        for keyword in keyword_list_fi:
            if keyword not in self.keywords:
                self.keywords['fi'].append(keyword)

        for keyword in keyword_list_en:
            if keyword not in self.keywords:
                self.keywords['en'].append(keyword)

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

    def parse_link_sheet(self, link_sheet):
        registrar_name = {'fi': '', 'en': ''}

        link_col = 2
        iterator = link_sheet.iter_rows(min_row=self.start_row)
        for row in iterator:
            row_fi = row
            try:
                row_en = next(iterator)
            except StopIteration:
                break

            if len(row_en) == 0:
                break

            # NOTE: this method assumes that register admins and registers have already been created
            # with parse_sheet()
            registrar_name['fi'] = row_fi[self.registrar_col].value if row_fi[self.registrar_col].value != None else registrar_name['fi']
            registrar_name['en'] = row_en[self.registrar_col].value if row_en[self.registrar_col].value != None else registrar_name['en']
            registrar_idx = self.find_by_name(self.data, registrar_name, 'en')

            register_name = {'fi': row_fi[self.register_col].value, 'en': row_en[self.register_col].value}
            register_idx = self.find_by_name(self.data[registrar_idx]['registers'], register_name, 'en')

            try:
                link_fi = row_fi[link_col].value if row_fi[link_col].value != None else ''
            except IndexError:
                link_fi = ''

            try:
                link_en = row_en[link_col].value if row_en[link_col].value != None else ''
            except IndexError:
                link_en = ''

            link = {'fi': link_fi, 'en': link_en}
            self.add_link(dict(link), registrar_idx, register_idx)
