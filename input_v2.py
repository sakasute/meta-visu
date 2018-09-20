#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from PyInquirer import prompt
import json
import regex
from datetime import date
from os import listdir

DATA_PATH = 'public/data/'
NEW_REGISTER_ADMIN_STR = '<--Lisää uusi rekisteriviranomainen-->'
NEW_REGISTER_STR = '<--Lisää uusi rekisteri-->'
NEW_CATEGORY_STR = '<--Lisää uusi kategoria-->'
COHORT_LIST = ['1987', '1997']
SAMPLING_TARGETS = {'nuoret': 'subjects', 'vanhemmat': 'parents'}
UNDEFINED_STR = '<määrittelemätön>'


def find_by_name(list, name, lang):
    for idx, item in enumerate(list):
        if item['name'][lang] == name:
            return idx
    else:
        return None


def fill_date(dateString, end):
    if len(dateString.split('-')) == 1:
        return dateString + end
    else:
        return dateString


def get_register_admin_names(filenames):
    names = []
    for filename in filenames:
        with open(DATA_PATH + register_admin_name, 'r') as data_file:
            data = json.load(data_file)
            names.append(data['name'])
    return names


def replace_empty_str(str):
    if (str == ""):
        return UNDEFINED_STR
    else:
        return str


def validate_date(date_str):
    # FIXME: looks just for the format, not boundaries. Could try to parse date
    # after format is checked and catch the possible exception.

    valid1 = regex.match('^[0-9]{4}-[0-9]{2}-[0-9]{2}$', date_str)
    valid2 = regex.match('^[0-9]{4}$', date_str)

    if valid1 or valid2:
        return True
    else:
        return 'Annathan päivämäärän joko muodossa VVVV-KK-PP tai VVVV.'


def validate_filename(filename):
    forbidden_chars = ['\\', '.', '/', ':', '*', '<', '>', '|', '"']
    if any(char in filename for char in forbidden_chars):
        return 'Nimi ei voi sisältää seuraavia merkkejä: ' + ' '.join(forbidden_chars)
    else:
        return True


def create_register_admin_file(name):
    filepath = DATA_PATH + name['en'] + '.json'
    try:
        f = open(filepath, 'r')
        f.close()
    # create the file if it doesn't exist, ie. opening it fails
    except IOError:
        f = open(filepath, 'w')
        f.write('{"name": ' + '"' + name +
                '",' + ' "registers": []' + '}')
        f.close()


def create_register_admin():
    register_admin_data = prompt_create_register_admin()
    create_register_admin_file(register_admin_data)

    return {'name': register_admin_data}


def create_register(data):
    # TODO:
    return data


def create_category(data, register_idx):
    # TODO:
    return data


def create_sampling(data, register_idx, category_idx):
    category_name = data['registers'][register_idx]['categories'][category_idx]['name']['fi']
    sampling_data = prompt_create_sampling(category_name)
    sampling = {
        'name': sampling_data['filename'],
        'startDate': fill_date(sampling_data['start_date'], '-01-01'),
        'endDate': fill_date(sampling_data['end_date'], '-12-31'),
        'cohort': sampling_data['cohort'],
        'category': sampling_data['target']
    }

    data['registers'][register_idx]['categories'][category_idx]['samplings'].append(sampling)

    create_another_flag = prompt_confirm_create_another_sampling()

    if create_another_flag:
        create_sampling(data, register_idx, category_idx)

    return data


def prompt_register_admin(register_admin_list):
    return prompt([
        {
            'type': 'list',
            'name': 'choice',
            'message': 'Valitse rekisteriviranomainen:',
            'choices': register_admin_list + [NEW_REGISTER_ADMIN_STR],
        }
    ])


def prompt_register(register_list, register_admin_name):
    return prompt([
        {
            'type': 'list',
            'name': 'choice',
            'message': 'Valitse rekisteri: ' + '(valittu rekisteriviranomainen: ' + register_admin_name + ')',
            'choices': register_list + [NEW_REGISTER_STR],
        }
    ])


def prompt_category(category_list, register_name):
    return prompt([
        {
            'type': 'list',
            'name': 'choice',
            'message': 'Valitse kategoria: ' + '(valittu rekisteri: ' + register_name + ')',
            'choices': category_list + [NEW_CATEGORY_STR],
        }
    ])


def prompt_create_register_admin():
    print('Lisää uusi rekisteriviranomainen:')
    return prompt([
        {
            'type': 'input',
            'name': 'fi',
            'message': 'Rekisteriviranomaisen nimi suomeksi:',
            'validate': lambda val: validate_filename(val)
        },
        {
            'type': 'input',
            'name': 'en',
            'message': 'Rekisteriviranomaisen nimi englanniksi:',
            'validate': lambda val: validate_filename(val)
        }
    ])


def prompt_create_register():
    # TODO:
    return


def prompt_create_category():
    # TODO:
    return


def prompt_create_sampling(category_name):
    print('Lisää uusi poiminta (): ' + '(valittu kategoria: ' + category_name + ')')
    return prompt([
        {
            'type': 'input',
            'name': 'filename',
            'message': 'Tiedostonimi (valinnainen):'
        },
        {
            'type': 'input',
            'name': 'start_date',
            'message': 'Alkupvm (VVVV-KK-PP tai VVVV):',
            'validate': lambda val: validate_date(val)
        },
        {
            'type': 'input',
            'name': 'end_date',
            'message': 'Loppupvm (VVVV-KK-PP tai VVVV):',
            'validate': lambda val: validate_date(val)
        },
        {
            'type': 'list',
            'name': 'cohort',
            'message': 'Poiminnan kohortti:',
            'choices': COHORT_LIST
        },
        {
            'type': 'list',
            'name': 'target',
            'message': 'Poiminnan kohde:',
            'choices': list(SAMPLING_TARGETS.keys())
        },
    ])


def prompt_confirm_create_another_sampling():
    # TODO:
    return


def select_register_admin():
    filenames = list(filter(lambda n: n != 'filenames.json', listdir(DATA_PATH)))
    names = get_register_admin_names(filenames)
    names_fi = list(map(lambda n: n['fi'], names))
    names_en = list(map(lambda n: n['en'], names))
    name_fi = prompt_register_admin(sorted(names_fi))['choice']
    name = {}
    if name_fi == NEW_REGISTER_ADMIN_STR:
        name = create_register_admin()
    else:
        idx = names_fi.index(name_fi)
        name_en = names_en[idx]
        name = {'fi': name_fi, 'en': name_en}

    return name


def select_register(data, register_admin_name):
    registers = data['registers']
    names = sorted(list(map(lambda n: n['name']['fi'], registers)))
    name_fi = prompt_register(names, register_admin_name)['choice']
    if name_fi == NEW_REGISTER_STR:
        data = create_register(data)

    register_idx = find_by_name(registers, name_fi, 'fi')
    return data, register_idx


def select_category(data, register_idx):
    registers = data['registers']
    register_name = registers[register_idx]['name']['fi']
    categories = registers[register_idx]['categories']
    names = sorted(list(map(lambda n: n['name']['fi'], categories)))
    name_fi = prompt_category(names, register_name)
    if name_fi == NEW_CATEGORY_STR:
        data = create_category(data, register_idx)

    category_idx = find_by_name(categories, name_fi, 'fi')
    return data, category_idx


register_admin_name = select_register_admin()
filename = register_admin_name['en'] + '.json'
with open(DATA_PATH + filename, 'r') as data_file:
    data = json.load(data_file)

data, register_idx = select_register(data, register_admin_name['fi'])
data, category_idx = select_category(data, register_idx)
data = create_sampling(data, register_idx, category_idx)

with open(DATA_PATH + filename, 'w', encoding='utf8') as data_file:
    json.dump(data, data_file, ensure_ascii=False, default=str, indent=2)
