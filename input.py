#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
from pprint import pprint


def find_by_name(list, name):
    for idx, item in enumerate(list):
        if item['name'] == name:
            return idx
    else:
        return None


def add_sampling(admin_level, register_level, sampling_level):
    ''' admin_level is datastructure that goes from admin level to sampling level '''
    admin_idx = find_by_name(data['registerAdmins'], admin_level['name'])
    register_idx = None
    sampling_idx = None

    if admin_idx is not None:
        register_idx = find_by_name(
            data['registerAdmins'][admin_idx]['registers'], register_level['name'])

        if register_idx is not None:
            sampling_idx = find_by_name(data['registerAdmins'][admin_idx]
                                        ['registers'][register_idx]['samplings'], sampling_level['name'])

    if admin_idx is None:
        add_from_admin_level(admin_level)
    elif register_idx is None:
        add_from_register_level(register_level, admin_idx)
    elif sampling_idx is None:
        add_from_sampling_level(sampling_level, admin_idx, register_idx)
    else:
        print('Poiminta on jo olemassa - mitään ei tapahtunut.')


def add_from_admin_level(admin_level):
    data['registerAdmins'].append(admin_level)


def add_from_register_level(register_level, admin_idx):
    admin = data['registerAdmins'][admin_idx]
    admin['registers'].append(register_level)


def add_from_sampling_level(sampling_level, admin_idx, register_idx):
    admin = data['registerAdmins'][admin_idx]
    register = admin['registers'][register_idx]
    register['samplings'].append(
        sampling_level)


register_admin = input('Rekisterinpitäjä: ')
register = input('Rekisteri: ')
sampling_name = input('Poiminnan nimi: ')
sampling_start = input('Poiminnan alkupvm (PP-KK-VVVV): ')
sampling_end = input('Poiminnan loppupvm (PP-KK-VVVV): ')

data = {}

path = 'poiminnat.json'

with open(path, 'r') as data_file:
    '''
    The default json-file:
    {"name": "rootLevel", "parent": null, "registerAdmins": []}
    '''

    data = json.load(data_file)

    sampling_level = {
        'name': sampling_name,
        'startDate': sampling_start,
        'endDate': sampling_end,
        'parent': register
    }

    register_level = {
        'name': register,
        'samplings': [sampling_level],
        'parent': register_admin,
    }

    admin_level = {
        'name': register_admin,
        'registers': [register_level],
        'parent': 'rootLevel'
    }

    add_sampling(admin_level, register_level, sampling_level)

with open(path, 'w', encoding='utf8') as data_file:
    json.dump(data, data_file, ensure_ascii=False)
