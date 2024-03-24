from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from datetime import datetime
import logging
logging.basicConfig(level = logging.INFO)

from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import pandas as pd
from selenium.common.exceptions import ElementClickInterceptedException


class MakeDriver:

    def __init__(self, url: str) -> None:
        self.website = url

    def create_driver(self) -> None:
        options = Options()
        options.add_argument("--window-size=1920,1080")
        options.add_argument("--headless")
        user_agent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.51 Safari/537.35'
        options.add_argument(f'user-agent={user_agent}')
        options.add_experimental_option("detach", True)

        self.website_driver = webdriver.Chrome(
            service=Service(
            ChromeDriverManager().install()
            ),
            options=options
        )
        self.website_driver.get(self.website)

    def destroy_driver(self) -> None:
        self.website_driver.quit()


class Crawler:

    def __init__(self, website):
        self.website = website
    


    def run(self):
        driver_obj = MakeDriver(self.website)
        driver_obj.create_driver()
        logging.info(f"{datetime.now()}: Driver created.")

        # fetch data
        WebDriverWait(driver_obj.website_driver, 20).until(
            EC.presence_of_element_located((By.XPATH, '//a[@class="paginate_button next"]'))
        )
        dataframes = []
        dataframes.append(self.scrape(driver_obj.website_driver))
        while True:
            try:
                driver_obj.website_driver.maximize_window()
                try:
                    showmore_link = WebDriverWait(driver_obj.website_driver, 20).until(EC.element_to_be_clickable((By.XPATH, '//a[@class="paginate_button next"]')))
                    showmore_link.click()
                except ElementClickInterceptedException:
                    print("Trying to click on the button again")
                    driver_obj.website_driver.execute_script("arguments[0].click()", showmore_link)
                dataframes.append(self.scrape(driver_obj.website_driver))
            except Exception as e:
                break
        all_dataframes = pd.concat(dataframes)
        all_dataframes.to_csv('gdpr.csv', index=False)


    def scrape(self, driver):
        table = driver.find_element(By.XPATH, '//table[@id="penalties"]')
        table_headers = table.find_elements(By.XPATH, './/th')
        columns = [self.clean_str(header.text, 'column') for header in table_headers if header.text!='']
        table_rows = table.find_elements(By.XPATH, './/tr')
        table_list = []
        for table_row in table_rows:
            row = [self.clean_str(cell.text, 'not column') for cell in table_row.find_elements(By.XPATH, './/td') if cell.text!='']
            if len(row)>0:
                table_list.append(row)
        df = pd.DataFrame(table_list, columns = columns).drop('source', axis=1)
        return df

    def clean_str(self, text, text_type):
        if text_type=='column':
            return text.lower().replace('[', '').replace(']', '').replace('.', '').replace('€', '').strip()
        return text.lower().strip()

if __name__ == "__main__":
    crawler = Crawler("https://www.enforcementtracker.com/")
    crawler.run()