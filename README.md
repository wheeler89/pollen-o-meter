# pollen-o-meter
Seminararbeit DHBW CAS, Grundlagen Web Engineering

This Test-SPA demonstrates its functionality without server (static github page) and uses modified testdata from  "Source: Deutscher Wetterdienst" (DWD). Purpose of this modification is to check the functionality of the main information element, which gives visual feedback of the pollen risk for every federal state of germany. The map shows a background color depending on the risk of the pollen flight and does not make a difference between specific pollen types. Which means in this context, that as soon as only one type of pollen of a region or subregion has a high risk on DWD index, the background color of this hole federal state will be changed by a bunch of helper functions. In addition, the map of germany is the main interactive navigation element which allows pseudo navigation by event listening on hashchange. More detailed pollen risk information will be displayed for a federal state by mouse click on the map (also for subregions, when data from DWD is available). The landing page can also be called by clicking on the title Pollen-O-Meter. To enable a kind of responsiveness, a flex layout, grid and a media query comes in handy. To make usage of live data from DWD, a serverside XMLHttpRequest is needed. This was implemented in this project for a exam locally and is not published on github.

Learn more about the data sources and licences here:
https://opendata.dwd.de/README.txt
https://www.dwd.de/EN/service/copyright/copyright_node.html 
