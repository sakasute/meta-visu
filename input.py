#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
from datetime import date


def fill_date(dateString, end):
    if len(dateString.split('-')) == 1:
        return dateString + end
    else:
        return dateString


def fill_cohort(year):
    if len(year) == 2:
        return '19' + year
    else:
        return year


def find_by_name(list, name):
    for idx, item in enumerate(list):
        if item['name'] == name:
            return idx
    else:
        return None


def add_sampling(sampling, locationArr):
    data_temp = data

    for idx, location in enumerate(locationArr):
        array_name = location['array_name']
        search_name = location['search_name']

        # check if given array exists, or create it
        if data_temp.get(array_name) is None:
            data_temp[array_name] = []

        search_idx = find_by_name(data_temp[array_name], search_name)
        # check if on last iteration: if so, add sampling
        if idx == len(locationArr) - 1:
            data_temp[array_name].append(sampling)
        # check if element with given name exists, or create it
        elif search_idx is None:
            data_temp[array_name].append({'name': search_name})

        data_temp = data_temp[array_name][-1]


def create_file(register_admin):
    filepath = register_admin + '.json'
    try:
        f = open(filepath, 'r')
        f.close()
    except IOError:
        f = open(filepath, 'w')
        f.write('{"name": ' + '"' + register_admin +
                '",' + ' "registers": []' + '}')
        f.close()


register_admin = input('Rekisterinpitäjä: ')
register = input('Rekisteri: ')
# TODO: should be possible to leave as empty?
category = input('Rekisterin alaluokka: ')
sampling_name = input('Poiminnan nimi: ')
sampling_start = input('Poiminnan alkupvm (VVVV tai VVVV-KK-PP): ')
sampling_end = input('Poiminnan loppupvm (VVVV tai VVVV-KK-PP): ')
sampling_cohort = input('Poiminnan kohortti (1987/1997): ')
sampling_parents = input('Poiminta vanhemmista (k/e): ')

sampling_start = fill_date(sampling_start, '-1-1')
sampling_end = fill_date(sampling_end, '-12-31')
sampling_cohort = fill_cohort(sampling_cohort)

data = {}

create_file(register_admin)

path = register_admin + '.json'

with open(path, 'r') as data_file:
    data = json.load(data_file)

    sampling = {
        'name': sampling_name,
        'startDate': sampling_start,
        'endDate': sampling_end,
        'cohort': sampling_cohort,
        'parents': sampling_parents in ['kyllä', 'k', 'yes', 'y']
    }

    add_sampling(sampling, [
                 {'array_name': 'registers', 'search_name': register},
                 {'array_name': 'categories', 'search_name': category},
                 {'array_name': 'samplings', 'search_name': sampling_name}])

with open(path, 'w', encoding='utf8') as data_file:
    json.dump(data, data_file, ensure_ascii=False, default=str, indent=2)
