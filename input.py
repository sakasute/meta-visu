#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
from pprint import pprint


register_admin = input('Rekisterinpitäjä: ')
register = input('Rekisteri: ')
sampling_name = input('Poiminnan nimi: ')
sampling_start = input('Poiminnan alkupvm (PP-KK-VVVV): ')
sampling_end = input('Poiminnan loppupvm (PP-KK-VVVV): ')

path = 'poiminnat.json'


def get_admin_by_name(data_dict, admin_name):
    for admin in data_dict['registerAdmins']:
        if admin['name'] == admin_name:
            return admin
    else:
        return None


def get_register_by_name(data_dict, admin_name, register_name):
    admin = get_admin_by_name(data_dict, admin_name)
    if admin:
        for register in admin['registers']:
            if register['name'] == register_name:
                return register
        else:
            return None
    else:
        return None


def add_new_admin(data_dict, new_admin):
    data_dict['registerAdmins'].append(new_admin)
    return data_dict


def add_new_register(data_dict, admin_name, new_register):
    for admin in data_dict['registerAdmins']:
        if admin['name'] == admin_name:
            admin['registers'].append(new_register)

    return data_dict


with open(path, 'r') as data_file:
    data_dict = json.load(data_file)

    sampling = {
        'name': sampling_name,
        'startDate': sampling_start,
        'endDate': sampling_end,
        'parent': register
    }

    new_register = {
        'name': register_admin,
        'samplings': [sampling],
        'parent': register_admin,
    }

    new_admin = {
        'name': register_admin,
        'registers': [new_register],
        'parent': 'rootLevel'
    }

    if get_admin_by_name(data_dict, register_admin) == None:
        data_dict = add_new_admin(data_dict, new_admin)
    elif get_register_by_name(data_dict, register_admin, register) == None:
        data_dict = add_new_register(data_dict, register_admin, register)
    # TODO: add_sampling() and handle basic add_admin and add_register
with open(path, 'w', encoding='utf8') as data_file:
    json.dump(data_dict, data_file, ensure_ascii=False)
