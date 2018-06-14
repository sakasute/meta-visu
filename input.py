#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
from pprint import pprint


def add_nested_dict(dictionary, key):
    if (key not in dictionary.keys()):
        dictionary[key] = {}
    return dictionary


register_admin = input('Rekisterinpitäjä: ')
register = input('Rekisteri: ')
data_name = input('Poiminnan nimi: ')
data_start = input('Poiminnan alkupvm (PP-KK-VVVV): ')
data_end = input('Poiminnan loppupvm (PP-KK-VVVV): ')

path = 'poiminnat.json'

with open(path, 'r') as data_file:
    data_dict = json.load(data_file)
    # TODO: do recursively?
    data_dict = add_nested_dict(data_dict, register_admin)
    data_dict[register_admin] = add_nested_dict(
        data_dict[register_admin], register)
    data_dict[register_admin][register] = add_nested_dict(
        data_dict[register_admin][register], data_name)

    data_dict[register_admin][register][data_name] = {
        'alkupvm': data_start,
        'loppupvm': data_end
    }

with open(path, 'w', encoding='utf8') as data_file:
    json.dump(data_dict, data_file, ensure_ascii=False)
