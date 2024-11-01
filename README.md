# Introducción
Este proyecto consiste en obtener los datos de ofertas de la siguiente página: [Steam](https://store.steampowered.com/search/?specials=1)

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

## Elasticsearch
Primero instalaremos la librería necesaria para usar Elasticsearch con Python

``` bash
pip install elasticsearch

```

A continuación instalaremos el servidor de Elasticsearch para poder enviar información e indexarla.
``` bash
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-8.15.3-linux-x86_64.tar.gz
tar -xzf elasticsearch-8.15.3-linux-x86_64.tar.gz
cd elasticsearch-8.15.3/
```

Es importante una vez instalado realizar los siguientes cambios en el fichero de configuración _elasticsearch.yml_
```
xpack.security.enabled: false 
xpack.security.enrollment.enabled: false


http.cors.enabled: true
http.cors.allow-origin: "*"
```


## React

Para la parte del frontend es necesario tener una versión de node instalado. (>= 22.9)
Una vez instalado ejecutamos el siguiente comando para obtener todas las dependencias necesarias

``` bash
npm install
```

# Ejecución

## 1. Levantar el servidor de Elasticsearch

Nos dirigimos a la carpeta de Elasticsearch y ejecutamos el servidor que almacenará los índices y los datos.

``` bash
./elasticsearch-8.15.3/bin/elasticsearch
```

## 2. Actualización de la base de datos (Scrapper)

Nos dirigimos al directorio de SteamsDealsScraper
Para actualizar los datos es necesario ejecutar el siguiente comando que obtendrá los datos de la página web y los enviará al servidor de Elasticsearch

``` bash
cd riws-steam-deals/SteamDealsScraper/SteamDealsScraper/

scrapy crawl steam_spider
```

## 3. Levantar el front end

Nos dirigimos a la carpeta de Elasticsearch y ejecutamos el servidor que almacenar├í los ├¡ndices y los datos.

``` bash
npm start
```

