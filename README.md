# pollen-o-meter
Seminararbeit DHBW CAS, Grundlagen Web Engineering, Master Informatik

This SPA demonstrates its functionality without a server (only static github page) and uses modified testdata of "Source: Deutscher Wetterdienst" (DWD). Purpose of this modification is to check the functionality of the main information element, which gives a visual feedback of the pollen risk for every federal state of germany. The map shows a background color depending on the risk of the pollen flight and does not make any difference between specific pollen types. As soon as only one type of pollen of a region or subregion has a high risk on DWD index, the background color of this hole federal state will be changed by a bunch of functions. In addition, the map of germany is the main interactive navigation element which allows pseudo navigation by a event listener on hashchange. More detailed pollen risk information will be displayed for a specific federal state by a click driven event on the map (also for subregions, when data from DWD is available). The apps landing page can also be called when clicking on the title Pollen-O-Meter. To enable responsiveness, two grids with a container like design using semantic elements (one with media query) and some auto adjustments comes in handy. For live data a serverside XMLHttpRequest is needed cause of CORS policy. A node.js server has been implemented in this project for a exam only locally and is not published on github.

## live page on github
https://wheeler89.github.io/pollen-o-meter/

If a error 404 occurs when first open this git page, try to add index.html on its path.

--> https://wheeler89.github.io/pollen-o-meter/index.html

## author
Andreas Räder

## sources
Learn more about the data sources and licences here.

https://opendata.dwd.de/README.txt

https://www.dwd.de/EN/service/copyright/copyright_node.html 




