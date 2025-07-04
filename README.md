# Transport Tracker App

Based on my personal experience as a former public transport commuter. I used to travel to and from Gading Serpong, Tangerang (a Jakarta satellite city) and Kemang, South Jakarta.

**Disclaimer: Only tested on Android, untested on iOS**

## Table of Contents

- [Tech Stack](#tech-stack)
- [Get Started](#get-started)
  - [Create Supabase Tables](#create-supabase-tables)
- [Build Preview APK](#build-preview-apk)
  - [With EAS](#with-eas)
  - [With Android Studio](#with-android-studio)
- [Screenshots](#screenshots-as-of-160-rc6)

## Tech Stack

- **Mapping:**
  - @maplibre/maplibre-react-native
  - expo-location
- **UI Library:**
  - expo-router
  - react-native-vector-icons
  - react-native-reanimated
- **Storage:**
  - @supabase/supabase-js
  - @react-native-async-storage/async-storage
  - react-native-mmkv-storage
- **Date/Time:**
  - moment
  - moment-timezone
  - react-native-calendars
  - expo-localization (for getting timezone)
- **Other Utilities:**
  - expo-crypto (for generating UUID)
  - react-native-keyboard-aware-scroll-view (for handling view autoscroll)
  - react-native-gesture-handler (core for touch/gesture handling)
  - @react-native-community/netinfo (for fetching internet connection status)

## Get Started

This app uses Expo SDK 52.

1. Install dependencies

    ```bash
    npm install
    ```
2. Start the app

    ```bash
    npx expo start
    ```

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

### Create Supabase Tables

- Directions Table

  ```pgsql
  create table
    public_transport_tracker.directions (
      id bigint generated by default as identity not null,
      name text not null,
      constraint directions_pkey primary key (id)
    ) tablespace pg_default;
  ```

- Icons Table

  ```pgsql
  create table
    public_transport_tracker.icons (
        id bigint generated by default as identity not null,
        name text not null,
        constraint icons_pkey primary key (id)
    ) tablespace pg_default;
  ```

- Vehicle Types Table

  ```pgsql
  create table
    public_transport_tracker.types (
      id bigint generated by default as identity not null,
      name text not null,
      icon_id bigint null,
      constraint type_pkey primary key (id),
      constraint types_icon_id_fkey foreign key (icon_id) references public_transport_tracker.icons (id) on update cascade on delete set null
    ) tablespace pg_default;
  ```

- Stops Table

  ```pgsql
  create table
    public_transport_tracker.stops (
      id bigint generated by default as identity not null,
      name text not null default ''::text,
      lat double precision null,
      lon double precision null,
      name_alt text null,
      vehicle_type bigint null,
      constraint stops_pkey primary key (id),
      constraint stops_vehicle_type_fkey foreign key (vehicle_type) references public_transport_tracker.types (id)
    ) tablespace pg_default;

  create index if not exists stops_vehicle_type_idx on public_transport_tracker.stops using btree (vehicle_type) tablespace pg_default;
  ```

- Routes Table

  ```pgsql
  create table
    public_transport_tracker.routes (
      id bigint generated by default as identity not null,
      first_stop_id bigint not null,
      last_stop_id bigint not null,
      code text null,
      name text null,
      vehicle_type_id bigint null,
      constraint routes_pkey primary key (id),
      constraint routes_first_stop_id_fkey foreign key (first_stop_id) references public_transport_tracker.stops (id),
      constraint routes_last_stop_id_fkey foreign key (last_stop_id) references public_transport_tracker.stops (id),
      constraint routes_vehicle_type_id_fkey foreign key (vehicle_type_id) references public_transport_tracker.types (id)
    ) tablespace pg_default;

  create index if not exists routes_first_stop_id_idx on public_transport_tracker.routes using btree (first_stop_id) tablespace pg_default;

  create index if not exists routes_last_stop_id_idx on public_transport_tracker.routes using btree (last_stop_id) tablespace pg_default;

  create index if not exists routes_vehicle_type_id_idx on public_transport_tracker.routes using btree (vehicle_type_id) tablespace pg_default;
  ```

- Travels Table

  ```pgsql
  create table
    public_transport_tracker.travels (
      id bigint generated by default as identity not null,
      created_at timestamp with time zone not null default now(),
      bus_initial_arrival timestamp without time zone null,
      bus_initial_departure timestamp without time zone null,
      bus_final_arrival timestamp without time zone null,
      route_id bigint not null,
      first_stop_id bigint not null,
      last_stop_id bigint not null,
      notes text null,
      vehicle_code text null,
      direction_id bigint not null,
      type_id bigint not null,
      constraint travels_pkey primary key (id),
      constraint travels_route_id_fkey foreign key (route_id) references public_transport_tracker.routes (id),
      constraint travels_first_stop_id_fkey foreign key (first_stop_id) references public_transport_tracker.stops (id),
      constraint travels_last_stop_id_fkey foreign key (last_stop_id) references public_transport_tracker.stops (id),
      constraint travels_direction_id_fkey foreign key (direction_id) references public_transport_tracker.directions (id),
      constraint travels_type_id_fkey foreign key (type_id) references public_transport_tracker.types (id)
    ) tablespace pg_default;

  create index if not exists travels_id_idx on public_transport_tracker.travels using btree (id) tablespace pg_default;

  create index if not exists travels_type_id_idx on public_transport_tracker.travels using btree (type_id) tablespace pg_default;

  create index if not exists travels_last_stop_id_idx on public_transport_tracker.travels using btree (last_stop_id) tablespace pg_default;

  create index if not exists travels_first_stop_id_idx on public_transport_tracker.travels using btree (first_stop_id) tablespace pg_default;

  create index if not exists travels_direction_id_idx on public_transport_tracker.travels using btree (direction_id) tablespace pg_default;

  create index if not exists travels_route_id_idx on public_transport_tracker.travels using btree (route_id) tablespace pg_default;
  ```

- Laps Table

  ```pgsql
  create table
    public_transport_tracker.laps (
      id bigint generated by default as identity not null,
      travel_id bigint not null,
      time timestamp without time zone not null,
      note text null,
      stop_id bigint null,
      lat double precision null,
      lon double precision null,
      constraint laps_pkey primary key (id),
      constraint laps_travel_id_fkey foreign key (travel_id) references public_transport_tracker.travels (id) on delete cascade,
      constraint laps_stop_id_fkey foreign key (stop_id) references public_transport_tracker.stops (id) on delete set null
    ) tablespace pg_default;

  create index if not exists laps_travel_id_idx on public_transport_tracker.laps using btree (travel_id) tablespace pg_default;
  ```

- Route Travel Time Function

  ```pgsql
  create or replace function public_transport_tracker.calculate_average_travel_times(
      route_id_param int,
      direction_id_param int,
      first_stop_id_param bigint,
      last_stop_id_param bigint
  )
  returns table(
      avg_travel_time interval,
      avg_top_5_longest interval,
      min_top_5_longest interval,
      max_top_5_longest interval,
      avg_top_5_shortest interval,
      min_top_5_shortest interval,
      max_top_5_shortest interval
  )
  language sql
  as $$
  WITH TravelEffectiveTimes AS (
      SELECT
          t.id as travel_id,
          COALESCE(
              (SELECT l_start.time
              FROM public_transport_tracker.laps l_start
              WHERE l_start.travel_id = t.id
              AND l_start.stop_id = first_stop_id_param
              ORDER BY l_start.time ASC
              LIMIT 1
              ),
              CASE WHEN t.first_stop_id = first_stop_id_param THEN t.bus_initial_departure ELSE NULL END
          ) as initial_effective_time,

          COALESCE(
              (SELECT l_end.time
              FROM public_transport_tracker.laps l_end
              WHERE l_end.travel_id = t.id
              AND l_end.stop_id = last_stop_id_param
              ORDER BY l_end.time DESC
              LIMIT 1
              ),
              CASE WHEN t.last_stop_id = last_stop_id_param THEN t.bus_final_arrival ELSE NULL END
          ) as final_effective_time
      FROM public_transport_tracker.travels t
      WHERE t.route_id = route_id_param
      AND t.direction_id = direction_id_param
  ),
  RankedTravels AS (
      SELECT
          final_effective_time - initial_effective_time AS travel_duration,
          ROW_NUMBER() OVER (ORDER BY (final_effective_time - initial_effective_time) DESC) as rank_longest,
          ROW_NUMBER() OVER (ORDER BY (final_effective_time - initial_effective_time) ASC) as rank_shortest
      FROM TravelEffectiveTimes
      WHERE (final_effective_time - initial_effective_time) IS NOT NULL
      AND (final_effective_time - initial_effective_time) >= '0 seconds'
  )
  SELECT
      AVG(travel_duration) AS avg_travel_time,

      AVG(CASE WHEN rank_longest <= 5 THEN travel_duration ELSE NULL END) AS avg_top_5_longest,
      MIN(CASE WHEN rank_longest <= 5 THEN travel_duration ELSE NULL END) AS min_top_5_longest,
      MAX(CASE WHEN rank_longest <= 5 THEN travel_duration ELSE NULL END) AS max_top_5_longest,

      AVG(CASE WHEN rank_shortest <= 5 THEN travel_duration ELSE NULL END) AS avg_top_5_shortest,
      MIN(CASE WHEN rank_shortest <= 5 THEN travel_duration ELSE NULL END) AS min_top_5_shortest,
      MAX(CASE WHEN rank_shortest <= 5 THEN travel_duration ELSE NULL END) AS max_top_5_shortest
  FROM RankedTravels;
  $$;
  ```

## Build Preview APK

### With EAS

You need to specify `extra.eas.projectId` and `updates.url` on your app.config.js file

1. Pull latest environment variables from EAS server

    ```pgsql
    npx eas env:pull --environment preview
    ```

2. Update EAS server with latest commit

    ```pgsql
    npx eas update --environment preview
    ```

3. Start build queue

    ```pgsql
    npx eas build --profile preview --platform android
    ```

### With Android Studio

When you're ready to build the APK, run:

```bash
npx expo prebuild --clean
```

This command will create the android folder necessary to build with Android Studio. Close any `npx expo start` instance to avoid Android Studio gradle import error.

## Screenshots (as of 1.6.0-rc.6)
### Light Mode
![Light Mode(1)](https://github.com/user-attachments/assets/540bd0e8-b75f-4993-b671-83ebeef0a4d1)

### Dark Mode
![Dark Mode(1)](https://github.com/user-attachments/assets/b1da4388-4b1b-49ec-9c84-1a4897a38ae9)
