# Transport service app

A responsive and user friendly app where you can search for a timetable between a departure station and an arrival station. Once loaded online it can be used in an offline setting with the use of serviceWorker that saves the required data in the cache. The default trainschedule is downloaded from the `http://www.caltrain.com/developer.html` site and the relevant data is saved in indexed database.

It uses jquery, polymer packages, serviceWorker and indexdb. It is build from yeoman web apps template using gulp.

##How to use
The autofocus is set on the departure station when loading the page. Type a first letter or click the down-arrow to get the available train stations to search from. When leaving the field a data object will be populated with all the trips from that station. 

Select an arrival station in the same way and another data object will be populated with all its trips. 

The two objects with the trips, will be compared and trips that bind the two stations together in the correct direction will be shown when clicking the `SEARCH TRANSPORTATION` button. All available trips with the departure and arrival time and the duration of the trip, will be shown.



## How to download and build
From the `app` code:
- download `package.json`, `gulpfile.js`, `bower.json` and the `app` folder and put in a _directory_ of your choice on your computer
- direct yourself to _the directory_ that you choosed in the terminal and run `npm install`. This will create a file `node-modules` and `bower_components`in your directory with the files you need to run `gulp`.
- run `gulp`, which will _minify_ all of the **css and js** files and put them in a directory called `dist` in the correct folders. It will also copy all the other files to their correct destinations.
- run `gulp serve` to run from the `app` directory or `gulp serve:dist` to run from the compressed and minified dist directory. This will run the Public transportation app on localhost port 9000. 






