#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import regex
import os
import json
from openpyxl.utils import column_index_from_string


def col_index_0_based(col_str):
    return column_index_from_string(col_str) - 1


class SheetParser:
    def __init__(self, sheet, config):
        self.data = []
        self.row_fi = ()
        self.row_en = ()
        self.sheet = sheet
        self.categories = config['categories']
        self.start_row = config['start_row']
        self.registrar_col = col_index_0_based(config['registrar_col'])
        self.register_col = col_index_0_based(config['register_col'])
        self.register_detail_col = col_index_0_based(config['register_detail_col'])
        self.harmonize_col = col_index_0_based(config['harmonize_col'])
        self.notes_col = col_index_0_based(config['notes_col'])
        self.cohort_cols = config['cohort_cols']

    @staticmethod
    def bundle_json_files(path):
        # NOTE: this method breaks if there are subfolders in the given path
        filelist = os.listdir(path)
        try:
            filelist.remove('filenames.json')
            filelist.remove('data_bundle.json')
        except ValueError:
            pass

        data_bundle = {}
        for filename in filelist:
            with open(path + filename, 'r', encoding='utf-8') as f:
                data = json.load(f)
                data_bundle[filename] = data

        with open(path + 'data_bundle.json', 'w', encoding='utf-8') as f:
            json.dump(data_bundle, f, ensure_ascii=False, default=str)

    def add_link(self, link, registrar_idx, register_idx):
        self.data[registrar_idx]['registers'][register_idx]['link'] = link

    def create_registrar(self, registrar_name):
        self.data.append({
            'name': registrar_name,
            'registers': []
        })

        return len(self.data) - 1

    def create_register(self, register_name, is_harmonized, registrar_idx):
        # TODO: add support for keywords
        self.data[registrar_idx]['registers'].append({
            'name': register_name,
            'isHarmonized': is_harmonized,
            'link': {'fi': "", 'en': ""},
            'registerDetails': []
        })
        return len(self.data[registrar_idx]['registers']) - 1

    def create_register_detail(self, register_detail_name, note, registrar_idx, register_idx):
        self.data[registrar_idx]['registers'][register_idx]['registerDetails'].append({
            'name': register_detail_name,
            'note': note,
            'samplings': []
        })
        return len(self.data[registrar_idx]['registers'][register_idx]['registerDetails']) - 1

    def create_samplings(self, dates_str, cohort, category):
        dates = self.parse_dates(dates_str)
        samplings = []
        for date in dates:
            samplings.append({
                'startDate': date['start_date'],
                'endDate': date['end_date'],
                'cohort': cohort,
                'category': self.categories[category]
            })
        return samplings

    def add_samplings(self, samplings, registrar_idx, register_idx, register_detail_idx):
        for sampling in samplings:
            self.data[registrar_idx]['registers'][register_idx]['registerDetails'][register_detail_idx]['samplings'].append(
                sampling)

    def find_by_name(self, list, name, lang):
        for idx, item in enumerate(list):
            if item['name'][lang] == name[lang]:
                return idx
        else:
            return None

    def format_date(self, date_str, default_date):
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

    def parse_dates(self, raw_dates_str):
        dates = []
        raw_dates_str = raw_dates_str.replace(' ', '')
        dates_list = raw_dates_str.split(';')
        for date_str in dates_list:
            start_date = self.format_date(date_str.split('-')[0], '-01-01')
            if start_date:
                end_date = self.format_date(date_str.split(
                    '-')[1], '-12-31') if len(date_str.split('-')) > 1 else start_date

                dates.append({'start_date': start_date, 'end_date': end_date})
        return dates

    def update_if_not_none(self, dictionary, col):
        value_fi = self.row_fi[col].value
        value_en = self.row_en[col].value
        dictionary['fi'] = value_fi if value_fi != None else dictionary['fi']
        dictionary['en'] = value_en if value_en != None else dictionary['en']

    def parse_sheet(self):
        registrar_name = {'en': '', 'fi': ''}
        register_name = {'en': '', 'fi': ''}
        register_detail_name = {'en': '', 'fi': ''}

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

            notes = {'en': '', 'fi': ''}

            self.update_if_not_none(registrar_name, self.registrar_col)
            registrar_idx = self.find_by_name(self.data, registrar_name, 'en')

            if registrar_idx == None:
                registrar_idx = self.create_registrar(dict(registrar_name))

            self.update_if_not_none(register_name, self.register_col)
            register_idx = self.find_by_name(
                self.data[registrar_idx]['registers'], register_name, 'en')

            if register_idx == None:
                is_harmonized = self.row_fi[self.harmonize_col].value == True
                register_idx = self.create_register(dict(register_name), is_harmonized, registrar_idx)

            self.update_if_not_none(register_detail_name, self.register_detail_col)
            register_detail_idx = self.find_by_name(self.data[registrar_idx]['registers']
                                                    [register_idx]['registerDetails'], register_detail_name, 'en')

            if register_detail_idx == None:
                self.update_if_not_none(notes, self.notes_col)
                register_detail_idx = self.create_register_detail(
                    dict(register_detail_name), dict(notes), registrar_idx, register_idx)

            samplings = []
            for cohort_col in self.cohort_cols:
                col = col_index_0_based(cohort_col['col'])
                cohort_dates_str = str(self.row_fi[col].value)
                cohort_samplings = self.create_samplings(
                    cohort_dates_str, cohort_col['cohort'], cohort_col['category'])
                samplings += cohort_samplings

            self.add_samplings(samplings, registrar_idx, register_idx, register_detail_idx)

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
