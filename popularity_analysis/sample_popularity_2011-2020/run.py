import numpy as np
import pandas as pd

dfs = []

year = 2011
month = 1
day = 1
residual = 1

file_name = ""
dir = "../with_weeks/years/"

for y in range(year, year + 10):
    for m in range(month, month + 12):
        day = residual
        d = day
        while d < day + 30:
            if m < 10:
                if d < 10:
                    file_name = dir + str(y) + "-0" + str(m) + "-0" + str(d) + ".csv"
                else:
                    file_name = dir + str(y) + "-0" + str(m) + "-" + str(d) + ".csv"
            elif m >= 10:
                if d < 10:
                    file_name = dir + str(y) + "-" + str(m) + "-0" + str(d) + ".csv"
                else:
                    file_name = dir + str(y) + "-" + str(m) + "-" + str(d) + ".csv"

            print(file_name)

            d += 7

            if m == 1 or m == 3 or m == 5 or m == 7 or m == 8 or m == 10 or m == 12:
                if d > 31: 
                    residual = d - 31
                    break;
            elif m == 2:
                if y == 2012 or y == 2016 or y == 2020:
                    if d > 29: 
                        residual = d - 29
                        break;
                else:
                    if d > 28: 
                        residual = d - 28
                        break;
            else:
                if d > 30: 
                    residual = d - 30
                    break;

            df = pd.read_csv(file_name)
            dfs.append(df)

new_df = pd.concat(dfs)
new_df = new_df.sort_values("weeks", ascending=False).drop_duplicates(subset=["spotify_id"])
new_df.to_csv(r"result_combined.csv", index=False, header=True)

df_popular, df_unpopular = [x for _, x in new_df.groupby(new_df["weeks"] < 10)]
df_popular.to_csv(r"result_popular.csv", index=False, header=True)
df_unpopular.to_csv(r"result_unpopular.csv", index=False, header=True)

