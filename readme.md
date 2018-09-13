**Updating to new version, visualization should up soon!**

# meta-visu

**REMEMBER TO RUN `npm run build` BEFORE PUBLISHING CHANGES!**

The purpose of this project is to visualize some metadata in the case where there are lots datasets from multpile data adminstrators and registers. The data is visualized in a tree like structure showing where the data is from. In the leaves', there is a timeline that shows which years are included in the data.

## Implementation

The application consists of two main components. First is a python script `input.py` that let's the user input the metadata. This data is saved in the `data`-folder in a file corresponding to the given register adminstrator.

The other part is a HTML/javascript frontend that shows the input data. This frontend uses a javascript library called [d3.js](https://d3js.org/) that helps in binding the data to the visual elements. The source code for the javascript part can be found in the `src`-folder and the styles in the `css`-folder.

In addition to these two main parts, the repository holds many files that are needed when developing new features or modifying the application.

The application is designed to be distributed as a web page hosted from the github repository ([Github Pages](https://pages.github.com/)). This was an easy and cheap choice to host and update the application without needing to deploy a backend somewhere. Of course, this sets some limitations such as having to update the data locally (and pushing it to the repository) instead of doing it e.g. through the web app. Of course, the application can be hosted anywhere, e.g. locally if wanted.

## Development environment

Due to differences between web browsers and me wanting to use modern JavaScript features, modifying the application isn't as easy as just making changes to the source code and publishing the changes. Instead, the code needs to be compiled first which, unfortunately, leads to a quite lengthy detour into web development tools. Here is somewhat step-by-step instructions:

1. Install [Node](https://nodejs.org/en/). Node comes with NPM (Node Package Manager), which let you install the needed development dependencies
2. Install the dependencies by opening a terminal/command line in the root folder of the project and running command `npm install`. This command tells NPM to install the dependencies that are defined in the `package.json`-file.
   - **NOTE:** I'm developing on Linux myself and I suspect there will be some more trouble on Windows to get the command line to find the `npm` command. If you are having problems you should look into adding commands to "PATH" variable on windows.
3. While developing you should have two scripts running:
   - `npm run webpack-dev` watches for changes in JavaScript files and bundles them into `dist/index_bundle.js`-file without doing any browser compatibility magic. This bundle should work with at least Chrome and most likely with Firefox without problems.
   - `npm start` starts a [`live-server`](https://www.npmjs.com/package/live-server) which hosts the project locally. When it's running, you can access the web page from `http://localhost:8080` (by default).
     - `live-server` also reloads the page automatically when files are saved and injects css-changes to the web page directly making development easier.
4. When the changes are ready you are ready to make the final commit before publishing changes, you should run `npm run build`. This makes the `index_bundle.js` with the production configuration, which transforms the syntax into older JavaScript and adds some polyfills (using [Babel](https://babeljs.io/) and [Webpack](https://webpack.js.org/)) for features that are missing from some older browsers such as IE11 (although currently, the use of css-variables makes the application practically incompatible with IE11).

### Why is the development environment kind of complicated

In optimal dev environment, things would probably work something like this:

1. While developing, you run `npm start` which starts the webpack in development mode: auto-reloading development server is started, js code is bundled but not compiled.
2. When pushed to a server, the code is automatically run through the `build`-command transforming it into production version.

- Also css would be bundled and transformed to be more compatible.

However, there are couple things preventing this: firstly, I'm very new to webpack, and didn't have time and/or energy to get everything to work the way I wanted. Secondly, the deploy environment is a github repository so you have to push the production version of the code directly.

## Notes

- Styles won't work properly on IE11 because e.g. var() is used. Could be fixed if really needed.
- If IE11 support not needed, I should take a look at what other polyfills etc. can be removed.
- The few icons that are used, should be downloaded and served locally
- Polyfills/Babel bloat the code from about 10—15 kb to about 100 kb :(
