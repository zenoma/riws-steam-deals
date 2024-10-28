# Introducción
Este proyecto consiste en obtener los datos de ofertas de la siguiente página: [Steam]('https://store.steampowered.com/search/?specials=1')

Estos datos son guardados en un índice de Elasticsearch, que es consultado por un _frontend_ en React para mostrar y manejar dichos datos.

# Dependencias

## Scrapping
Se ha requerido para la realización del Scrapeo un ChromeDriver, ya que es el navegador utilizado por la librería Selenium para interactuar con las páginas web. Para ello se necesita instalar Google Chrome pues ya contiene el dicho driver.

Instalación de Selenium y google chrome

``` bash
pip3 install selenium undetected-chromedriver
pip3 install scrapy-selenium
pip3 install webdriver-manager

sudo apt update
sudo apt install google-chrome-stable

```
Instalación de ChromeLinux para desarrolladores.
[Chrome for Testing](https://googlechromelabs.github.io/chrome-for-testing/#stable)

``` bash
# Mover el archivo descargado a /usr/local/bin/
wget https://storage.googleapis.com/chrome-for-testing-public/130.0.6723.69/linux64/chromedriver-linux64.zip
sudo unzip chromedriver-linux64.zip -d /usr/local/bin/
sudo chmod +x /usr/local/bin/chromedriver

#IMPORTANTE: chromedriver debe estar en /usr/local/bin/

# Añadimos la carpeta al PATH
export PATH="$PATH:/usr/local/bin"

```

# Ejecución

## Actualización de la base de datos (Scrapper)

Primero nos movemos al directorio SteamDealsScraper.
Para actualizar los datos es necesario ejecutar el siguiente comando que obtendrá los datos de la página web y los volcará a un archivo .json

``` bash
cd SteamDealsScraper

scrapy crawl steam_spider -O games.json
```
