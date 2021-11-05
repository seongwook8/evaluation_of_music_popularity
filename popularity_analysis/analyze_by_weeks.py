import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

year_start = 1981
year_end = 2020

dfs = []
final_df = []

for year in range(year_start, year_end + 1):
    file_name = "./yearly_data/result_" + str(year) + ".csv"
    df = pd.read_csv(file_name)
    dfs.append(df)

year = 1981
for i in range(len(dfs)):
    median_weeks = int(dfs[i]["weeks"].median())
    avg_weeks = dfs[i]["weeks"].mean()
    std_weeks = dfs[i]["weeks"].std()
    max_weeks = int(dfs[i]["weeks"][0])
    final_df.append([year, median_weeks, avg_weeks, std_weeks, max_weeks])
    year += 1

final_df = pd.DataFrame(final_df, columns=["year", "median", "average", "std", "maximum"])
final_df.to_csv("output.csv", index=False, header=True)


Year = final_df["year"]
Median = final_df["median"]
Average = final_df["average"]

# Median Weeks
plt.plot(Year, Median, color="red", marker="o")
plt.grid(True)
plt.title("Median Weeks by Year", fontsize=14)
plt.xlabel("Year")
plt.ylabel("Median Weeks")
plt.savefig("./images/median_weeks.png")

# Average Weeks
plt.clf()
plt.plot(Year, Average, color="blue", marker="o")
plt.grid(True)
plt.title("Average Weeks by Year", fontsize=14)
plt.xlabel("Year")
plt.ylabel("Average Weeks")
plt.savefig("./images/average_weeks.png")

# Combined
plt.clf()
plt.plot(Year, Median, color="red", marker="o", label="Median")
plt.plot(Year, Average, color="blue", marker="o", label="Average")
plt.legend(loc="upper left")
plt.grid(True)
plt.title("Popularity Chart by Weeks", fontsize=14)
plt.xlabel("Year")
plt.ylabel("Median Weeks")
plt.savefig("./images/popularity_chart_by_weeks.png")