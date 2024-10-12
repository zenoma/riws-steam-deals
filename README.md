# Introducción
Este proyecto consiste en obtener los datos de ofertas de la siguiente página: [Steam](https://store.steampowered.com/search/?specials=1)

Estos datos son guardados en un índice de Elasticsearch, que es consultado por un _frontend_ en React para mostrar y manejar dichos datos.

# Dependencias

## Herramientas básicas
* [wget](https://www.hostinger.es/tutoriales/usar-comando-wget/)
* [pip](https://pypi.org/project/pip/)
* [unzip](https://linux.die.net/man/1/unzip)

## Scrapping
Para este proyecto se ha utilizado [Scrapy](https://scrapy.org/) para la herramienta de captura de información.

```bash
# Instalación de Scrapy
pip install scrapy
```

Se ha requerido para la realización del Scrapeo un ChromeDriver, ya que es el navegador utilizado por la librería Selenium para interactuar con las páginas web. Para ello se necesita instalar Google Chrome pues ya contiene el dicho driver.

Instalación de Selenium y Google Chrome

```bash
# Instalación de Chrome
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt -y install ./google-chrome-stable_current_amd64.deb

# Instalación de Selenium
pip3 install selenium undetected-chromedriver
```
Instalación de ChromeLinux para desarrolladores.
[Chrome for Testing](https://googlechromelabs.github.io/chrome-for-testing/#stable)

``` bash
# Descargar el archivo chrome for testing
wget https://storage.googleapis.com/chrome-for-testing-public/129.0.6668.100/linux64/chrome-linux64.zip

# Mover el archivo descargado a /usr/local/bin/
mv chrome-linux64.zip /usr/local/bin/

# Descomprimir el archivo
cd /usr/local/bin/
unzip chrome-linux64.zip
```

# Ejecución

## Actualización de la base de datos (Scrapper)

Para actualizar los datos es necesario ejecutar el siguiente comando que obtendrá los datos de la página web y los volcará a un archivo .json

``` bash
scrapy crawl steam_spider -O games.json
```
