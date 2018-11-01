# meta-visu

The purpose of this project is to visualize some metadata in the case where there are lots datasets from multpile data adminstrators and registers. The data is visualized in a tree like structure showing where the data is from. In the leaves', there is a timeline that shows which years are included in the data.

## Implementation

The application consists of two main components. First is a simple little python script `input.py` that helps the user input the metadata. This data is saved in the `public/data`-folder in a file corresponding to the given register adminstrator.

The other part is a React-frontend served as a web page. The actual visualization is done with a javascript library called [d3.js](https://d3js.org/).
In addition to these two main parts, the repository holds many files that are needed when developing new features or modifying the application.

The application is designed to be distributed as a web page hosted from the github repository ([Github Pages](https://pages.github.com/)). This was an easy and cheap option to host and update the application without needing to deploy a backend somewhere. Of course, this sets some limitations such as having to update the data locally (and pushing it to the repository) instead of doing it e.g. through the web app. Of course, the application can be hosted anywhere, e.g. locally if wanted.

## Installing development dependencies on Windows without admin rights (wip)

### Python:

1. Download the "Windows executable installer" from [here](https://www.python.org/downloads/windows/) (the plain x86-version if you aren't sure or the 64-bit version if you know you have 64-bit system)
2. Execute the installer:
   - select a location that doesn't need admin right (e.g. you User-folder)
   - make sure that "Install for all users" is unselected and "add to PATH" is selected
   - you might need to restart your computer before the `python` and `pip` commands are usable from the command line

### Node and NPM

1. Download the zip-version of Node (it includes NPM) from [here](https://nodejs.org/en/download/)
2. Extract the zip into e.g. you User-folder
3. Add the extracted folder into the PATH in your Windows user environment variables (NOTE: going to document this better at some point)
4. Now `node` and `npm` commands should be usable from the command line

### Setting up proxys for pip and npm

You may need to configure `pip` and `npm` to use a proxy depending on the network your machine is in:

- pip:
  - use command `pip --proxy <proxy-address> install <module>` to install modules
- npm:
  - configure npm to use proxy with `npm config set proxy <proxy-address>`

## Development environment

Step-by-step instructions to get started with developing the React app:

1. Install [Node](https://nodejs.org/en/). Node comes with NPM (Node Package Manager), which let you install the needed development dependencies
2. Install the dependencies by opening a terminal/command line in the root folder of the project and running command `npm install`. This command tells NPM to install the dependencies that are defined in the `package.json`-file.
   - **NOTE:** I'm developing on Linux myself and I suspect there will be some more trouble on Windows to get the command line to find the `npm` command. If you are having problems you should look into adding commands to "PATH" variable on windows.
3. Start development server with: `npm start`
4. When you are ready to publish the changes, run `npm run deploy` (if this gives an error about missing 'build'-folder or something like that, run `npm run build` first).
