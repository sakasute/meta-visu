#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
from datetime import date
from os import listdir


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


def create_ra_file(register_admin):
    filepath = 'data/' + register_admin + '.json'
    try:
        f = open(filepath, 'r')
        f.close()
    # create the file if it doesn't exist, ie. opening it fails
    except IOError:
        f = open(filepath, 'w')
        f.write('{"name": ' + '"' + register_admin +
                '",' + ' "registers": []' + '}')
        f.close()


def save_filename_list():
    with open('data/filenames.json', 'w', encoding='utf8') as f:
        filenames = list(
            filter(lambda n: n != 'filenames.json', listdir('data/')))
        json.dump(filenames, f, ensure_ascii=False, default=str, indent=2)


def create_fill_options(list):
    fill_string = ""
    for i in range(0, len(list)):
        fill_string = fill_string + str(i + 1) + '=' + list[i] + '\n'
    return fill_string


def select_option(list, inp):
    try:
        inp_as_int = int(inp)
        return list[inp_as_int - 1]
    except:
        return inp


def take_input(description, auto_fill_arr):
    inp = input('%s (%s): ' %
                (description, create_fill_options(auto_fill_arr)))
    return select_option(auto_fill_arr, inp)


admin_list = list(map(lambda f: f.split('.')[0], listdir('data/')))
admin_list = list(filter(lambda n: n != 'filenames', admin_list))
register_admin = take_input('Rekisterinpitäjä', admin_list)
create_ra_file(register_admin)

path = 'data/' + register_admin + '.json'
save_filename_list()

# generate auto-fill shortcuts
with open(path, 'r') as data_file:
    data = json.load(data_file)

    register_list = list(map(lambda r: r['name'], data['registers']))
    register = take_input('Rekisteri', register_list)

    register_idx = find_by_name(data['registers'], register)
    category_list = []
    if register_idx is not None:
        category_list = list(
            map(lambda c: c['name'], data['registers'][register_idx]['categories']))

    category = take_input('Rekisterin alaluokka', category_list)

# FIXME: just a rough version of letting input multiple samplings at once (under one register/category)
while 1:
    sampling_name = input('Poiminnan nimi: ')
    sampling_start = input('Poiminnan alkupvm (VVVV tai VVVV-KK-PP): ')
    sampling_end = input('Poiminnan loppupvm (VVVV tai VVVV-KK-PP): ')
    sampling_cohort = input('Poiminnan kohortti (1987/1997): ')
    sampling_parents = input('Poiminta vanhemmista (k/e): ')

    sampling_start = fill_date(sampling_start, '-01-01')
    sampling_end = fill_date(sampling_end, '-12-31')
    sampling_cohort = fill_cohort(sampling_cohort)

    data = {}

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
