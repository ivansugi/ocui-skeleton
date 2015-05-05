# OCUI Skeleton

This project is meant to be the skeletal framework in which we create future UI projects.

## Feature goals

* 100% JavaScript.  Node on the backend, AngularJS on the front end.
* Simple custom Bootstrap theme
* Lightweight
* Maintainable
* Modern development environment

## Prerequisites

* Install [Node](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)
* Install [Ruby](https://www.ruby-lang.org/en/documentation/installation/)
  This is only needed because there are no javascript versions of a SASS linter.
* Upgrade NPM
  sudo npm install -g npm
* Install Bower
  sudo npm install -g bower
* Install Gulp
  sudo npm install -g gulp
* Install scss-lint
  sudo gem install scss-lint
* Install browser-sync
  sudo npm install -g browser-sync

### Editor setup

* Install [EditorConfig plugin](http://editorconfig.org/#download)
* Install [JSHint plugin](http://jshint.com/install/)
* Install JSCS editor plugin (lookup yourself)
* Install [SCSS Lint plugin](https://github.com/brigade/scss-lint#editor-integration)

## Clone repository

```
git clone https://github.com/OpenClinica/ocui-skeleton.git
```

## Install dependencies

```
cd ./ocui-skeleton
npm install
bower install
```

## Run the application

### Run in developement mode

```
gulp
```

Use browersync link (port 8000) with your ip address so that the brower is automatically refreshed when files change.

### Run in production mode

```
gulp prod
node ./server/app.js
```

## Directory layout

```
/                    project config files
  node_modules/      node/npm dependencies
  server/            node server files
    controllers/     express controllers
      api/           express-resource-new rest end points
    app.js           this is the actual node server
  webroot/           the node server serves this directory as the webserver root or public directory
    app/             angular files
    dist/            automatically created files
    vendor/          bower dependencies
  websrc/            source files that are used to generate public files in /webroot/dist
```
## Browser support

We will target the following browsers:

* Desktop Chrome
* Desktop Firefox
* Windows Internet Explorer 10 or higher
* Windows Microsoft Edge
* OSX Safari
* Android Chrome
* iOS Safari

## Libraries used

### Node (server side)

See [package.json](package.json)

### Bower (browser side)

See [bower.json](bower.json)
