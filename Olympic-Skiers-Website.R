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
  filter(Type == "summergames" | type == "wintergames")

host_cities_full <- host_cities %>%
  left_join(
    host_cities_geo %>%
      select(City, Year, Latitude, Longitude),
    by = c("City", "Year")
  )%>%
  filter(Type == "summergames" | Type == "wintergames")

#manually filling in missing info
host_cities_full$Latitude[host_cities_full$Year == 2026]  <- 45.4642 
host_cities_full$Longitude[host_cities_full$Year == 2026]  <- 9.1824
host_cities_full$Longitude[host_cities_full$Year == 1904]  <- -90.200310
host_cities_full$Latitude[host_cities_full$Year == 1904]  <- 38.630280
host_cities_full$Latitude[host_cities_full$Year == 1956]  <- 59.329323
host_cities_full$Longitude[host_cities_full$Year == 1956]  <- 18.068581
host_cities_full$Latitude[host_cities_full$Year == 1968]  <- 19.432608
host_cities_full$Longitude[host_cities_full$Year == 1968]  <- -99.133209
host_cities_full$Longitude[host_cities_full$Year == 2016]  <- -43.172897
host_cities_full$Latitude[host_cities_full$Year == 2016]  <- -22.906847
host_cities_full$Latitude[host_cities_full$Year == 2028] <- 37.3677
host_cities_full$Latitude[host_cities_full$Year == 2018] <- 37.3677
host_cities_full$Longitude[host_cities_full$Year == 2018] <- 128.3954
host_cities_full$Longitude[host_cities_full$Year == 2020] <- 139.6500
host_cities_full$Latitude[host_cities_full$Year == 2020] <- 35.6764
host_cities_full$Latitude[host_cities_full$Year == 2022] <- 39.9042
host_cities_full$Longitude[host_cities_full$Year == 2022] <- 116.4074
host_cities_full$Longitude[host_cities_full$Year == 2024] <- 2.3514
host_cities_full$Latitude[host_cities_full$Year == 2024] <- 48.8575
host_cities_full$Latitude[host_cities_full$Year == 2028] <- 34.0549
host_cities_full$Longitude[host_cities_full$Year == 2028] <- 118.2426
host_cities_full$Events[host_cities_full$Year == 2020] <- 339
host_cities_full$Countries[host_cities_full$Year == 2020] <- 
host_cities_full$Countries[host_cities_full$Year == 2020] <- 206
host_cities_full$Athletes[host_cities_full$Year == 2020] <- 206
host_cities_full$Athletes[host_cities_full$Year == 2020] <- 22420
host_cities_full$Athletes[host_cities_full$Year == 2020] <- 11420
host_cities_full$Athletes[host_cities_full$Year == 2022] <- 2869
host_cities_full$Countries[host_cities_full$Year == 2022] <- 91
host_cities_full$Events[host_cities_full$Year == 2022] <- 109
host_cities_full$Events[host_cities_full$Year == 2024] <- 329
host_cities_full$Countries[host_cities_full$Year == 2024] <- 206
host_cities_full$Athletes[host_cities_full$Year == 2024] <- 10714
host_cities_full$Athletes[host_cities_full$Year == 2026] <- 2916
host_cities_full$Countries[host_cities_full$Year == 2026] <- 92
host_cities_full$Events[host_cities_full$Year == 2026] <- 116