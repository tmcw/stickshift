# stickshift

A clean & modern data interface.

## Features

* **Export** query results to JSON & CSV
* **Visualize** some query results automatically
* **Share** and save queries

## Usage

This is an app you can start with the `npm start` command. You'll need
to copy [config.example.json](config.example.json) to `config.json`
and configure it with a repository to use for query storage and an
endpoint for queries.

`stickshift` talks to your database through an HTTP interface: it doesn't include a
node component, and isn't tied to a specific kind of SQL or place where it's
hosted.

## Architecture

`stickshift` is built with [React](http://facebook.github.io/react/),
[Flux](https://facebook.github.io/flux/),
and [React-Router](https://github.com/rackt/react-router). It's written
in CommonJS & ES6 and cross-compiled with [browserify](http://browserify.org/)
& [6to5](https://6to5.org/). Query storage is powered by [hubdb](http://github.com/mapbox/hubdb).

## Charts

`stickshift` automatically creates charts for applicable queries: those
that

* Have a column parseable as dates
* Have at least one other column of numbers

These charts are rendered with [Vega](https://github.com/trifacta/vega).
They're designed for exploratory data analysis, so are relatively simple.
