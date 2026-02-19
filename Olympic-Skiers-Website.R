library(sf)
library(here)
library(dplyr)
library(readr)
library(countrycode)
library(janitor)
library(tidyr)
library(stringr)
library(ggplot2)
library(lubridate)
library(tidygeocoder)

#read in athlete data
athlete_data <- read_csv(here::here("bios_locs.csv"))

#read in result data and filter for skiiers
results_data <- read_csv(here::here("results.csv"))%>%
  filter(type == "Winter")%>%
  filter(str_detect(discipline, fixed("(Skiing)")))%>%
  filter(medal != "NA") #filter for medalists only

#join location data and other characteristics
medalist_data <- results_data%>%
  left_join(athlete_data, by ="athlete_id")%>%
  filter(type == "Winter")%>%
  filter(str_detect(discipline, fixed("(Skiing)")))%>%
  filter(medal != "NA") #filter for medalists only

medalist_data <- medalist_data%>%
  filter(medal == "Gold")

#realized that none of the medalists for skiing include coordinates so switching to host cities!

##################
#   HOST CITIES
##################

host_cities <- read_csv(here::here("olympic-hosts.csv"))

host_cities_geo <- read_csv(here::here("olympic-hosts-geo.csv"))

#joining coordinates from geo to host_cities
host_cities <- host_cities%>%
  left_join(host_cities_geo, by = "Year")%>%
  filter(Type == "summergames" | ype == "wintergames")

