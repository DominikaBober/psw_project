import sys
sys.path.append('./')
from packages import *

def print_table(table, top_text, left_text, bottom_text, right_text):

    # color = '\u001b[35m'
    color = Fore.MAGENTA
    top_text = [None if item is None else f"{Style.NORMAL}{color}{item}{Style.RESET_ALL}" for item in top_text]
    left_text = [None if item is None else f"{Style.NORMAL}{color}{item}{Style.RESET_ALL}" for item in left_text]
    bottom_text = [None if item is None else f"{Style.NORMAL}{color}{item}{Style.RESET_ALL}" for item in bottom_text]
    right_text = [None if item is None else f"{Style.NORMAL}{color}{item}{Style.RESET_ALL}" for item in right_text]

    new_table = BeautifulTable()
    new_table.append_row(sum([[""], top_text, [""]],[]))
    for i in range(len(table)):
       new_table.append_row(sum([[left_text[i]], list(table[i]), [right_text[i]]],[]))
    new_table.append_row(sum([[""], bottom_text, [""]],[]))

    print(new_table,"\n")