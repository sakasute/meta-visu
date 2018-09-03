# meta-visu

The purpose of this project is to visualize some metadata in the case where there are lots datasets from multpile data adminstrators and registers. The data is visualized in a tree like structure showing where the data is from. In the leaves', there is a timeline that shows which years are included in the data.

## Implementation

The application consists of two main components. First is a python script `input.py` that let's the user input the metadata. This data is saved in the `data`-folder in a file corresponding to the given register adminstrator.

The other part is a HTML/javascript frontend that shows the input data. This frontend uses a javascript library called [d3.js](https://d3js.org/) that helps in binding the data to the visual elements. The source code for the javascript part can be found in the `src`-folder and the styles in the `css`-folder.

In addition to these two main parts, the repository holds many files that are needed when developing new features or modifying the application.

The application is designed to be distributed as a web page hosted from the github repository ([Github Pages](https://pages.github.com/)). This was an easy and cheap choice to host and update the application without needing to deploy a backend somewhere. Of course, this sets some limitations such as having to update the data locally (and pushing it to the repository) instead of doing it e.g. through the web app. Of course, the application can be hosted anywhere, e.g. locally if wanted.

**REMEMBER TO RUN `npm run build` BEFORE PUBLISHING CHANGES!**

## Notes

- Styles won't work properly on IE11 because e.g. var() is used. Could be fixed if really needed.
- If IE11 support not needed, I should take a look at what other polyfills etc. can be removed.
- The few icons that are used, should be downloaded and served locally
- Polyfills/Babel bloat the code from about 10—15 kb to about 100 kb :(
