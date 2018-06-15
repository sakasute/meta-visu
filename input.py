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


def checkIfNewChild(dictList, name):
    ''' Checks whether a list of dictionaries already has a dictionary with a given name or not.'''
    for item in dictList:
        if item['name'] == name:
            return True
    else:
        return False


def getAdminByName(data_dict, adminName):
    for admin in data_dict['registerAdmins']:
        if admin['name'] == adminName:
            return admin
    else:
        return False


def getRegisterByName(data_dict, adminName, registerName):
    admin = getAdminByName(data_dict, adminName)
    if admin:
        for register in admin['registers']:
            if register['name'] == registerName:
                return register
        else:
            return False
    else:
        return False


def addNewAdmin(data_dict, newAdmin):
    data_dict['registerAdmins'].append(newAdmin)
    return data_dict


def addNewRegister(data_dict, adminName, newRegister):
    for admin in data_dict['registerAdmins']:
        if admin['name'] == adminName:
            admin['registers'].append(newRegister)

    return data_dict


with open(path, 'r') as data_file:
    data_dict = json.load(data_file)

    sampling = {
        'name': sampling_name,
        'startDate': sampling_start,
        'endDate': sampling_end,
        'parent': register
    }

    newRegister = {
        'name': register_admin,
        'samplings': [sampling],
        'parent': register_admin,
    }

    newAdmin = {
        'name': register_admin,
        'registers': [newRegister],
        'parent': 'rootLevel'
    }

    if checkIfNewChild(data_dict['registerAdmins'], register_admin):
        data_dict = addNewAdmin(data_dict, newAdmin)
    elif checkIfNewRegister()

with open(path, 'w', encoding='utf8') as data_file:
    json.dump(data_dict, data_file, ensure_ascii=False)
