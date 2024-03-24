import pandas as pd
from sqlalchemy import create_engine
import numpy as np
engine = create_engine('postgresql://gdpr:gdpr@localhost:5432/gdpr')



def clean_fine(fine):
    fine = fine.replace(',', '')
    if 'four-digit' in fine:
        return 1000
    elif ('unknown' in fine )or ('only intention' in fine):
        return np.nan
    elif 'between' in fine:
        return fine.split()[-1]
    elif 'five-digit' in fine:
        return 10000
    elif 'six-digit' in fine:
        return 100000
    elif 'three-digit' in fine:
        return 100
    return fine

def clean_date(decision_date):
    if 'unknown' in decision_date:
        return np.nan
    elif '-' not in decision_date:
        return decision_date+'-01-01'
    elif len(decision_date.split('-'))==2:
        return decision_date+'-01'
    return decision_date


def cleaner():
    data = pd.read_csv('gdpr.csv')
    data['fine'] = data['fine'].apply(clean_fine).astype(float)
    data['date of decision'] = data['date of decision'].apply(clean_date)
    data.columns = [col.replace(" ", '_').replace('/', '_or_') for col in data.columns]
    data['fine_type'] = data['type']
    del data['type']
    data.dropna(inplace=True)
    data.to_sql('clean_gdpr', engine, if_exists='replace',index=False)


if __name__ == "__main__":
    cleaner()