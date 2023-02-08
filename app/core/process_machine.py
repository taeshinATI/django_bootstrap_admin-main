import numpy as np
import pandas as pd
import os, json

class Machine:
    def __init__(self) -> None:
        self.result = []
        self.path = r"C:\\Users\\tspark\\Documents\\df_web.csv"
        self.read_df()

    def read_df(self):
        self.df = pd.read_csv(self.path, low_memory=False)

    def get_x(self):
        return self.df.machine_name.unique()

    def get_y(self):
        return [(self.df['machine_name'] == 'M5V2').sum(), (self.df['machine_name'] == 'M5V4').sum()]

    def get_df(self):
        return self.df

if __name__ == '__main__':
    machine = Machine()
    df = machine.get_df()
    x_label = machine.get_x()
    y_label = machine.get_y()

    res = list(x_label)
    res = int(res)
