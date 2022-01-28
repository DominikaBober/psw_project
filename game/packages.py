import os
import ast
import numpy
import random
import uuid
import pickle
import math
import json
import warnings
import itertools
import unittest
import assertpy
import hamcrest
from functools import reduce
from hamcrest.core.base_matcher import BaseMatcher
from parameterized import parameterized
from beautifultable import BeautifulTable
from itertools import permutations
from collections import ChainMap, Counter
from string import ascii_letters, digits
from colorama import Fore, Style


def unique(list):
    unique_list = []
    for x in list:
        if x not in unique_list:
            unique_list.append(x)
    return unique_list
