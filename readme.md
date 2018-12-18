# meta-visu

The purpose of this project is to visualize some metadata in the case where there are lots datasets from multpile data adminstrators and registers. The visualization is used by the [Finnish Birth Cohort 1987 and 1997](https://thl.fi/fi/tutkimus-ja-kehittaminen/tutkimukset-ja-hankkeet/kansallinen-syntymakohortti-1987), and [Psycohorts](http://psycohorts.utu.fi/) studies. The data is visualized in a tree like structure showing where the data is from. In the leaves, there is a timeline that shows which years are included in the data. The visualization is live here: https://fbc-studies.github.io/meta-visu/

![Screenshot of the visualization](readme-imgs/visu-screenshot.PNG?raw=true "Screenshot of the visualization")

## Implementation

The application consists of three main components: the data as an excel-file, Python-script to convert the data from the excel into json-files, and the React frontend to show the visualization and let the user to control the filters. The data is saved to the `public/data/<dataset>`-folder (dataset is either finnish-birth-cohort or psycohorts).

The excel file should be formatted more or less as below. The Python script has some possible configurations (such as the order of columns). Currently, there is one version for updating each, the finnish-birth-cohort and psycohorts, data. The excel format as the source of the data was selected because it is easily human-readable and human-editable. There was also a similarly formatted excel excisting for the fbc-data.

![Screenshot of the excel format](readme-imgs/data-screenshot.PNG?raw=true "Screenshot of the excel format")

A few notes about the format:

- On registrar, register, description, keywords and notes columns the rows are handled as pairs: the first one is for Finnish and the second for the English translation.
- All registrars, registers and descriptions should have both Finnish and English translations or at least some text in both cells. Otherwise, the data is parsed incorrectly (e.g. wrong register may be added under wrong registrar).
- Register-cells can hold hyperlinks. If a link to the register description is added, the link is presented in the visualization. The links are separate for the Finnish and English rows.
- true-false/harmonization column is planned to be used on the psycohorts-dataset to show which registers have been "harmonized". Currently, it only adds an asterisk next to the register name on the visualization. This feature might be unnecessary: more elegant way to mark harmonized registers could be through keywords. Data format: TRUE/FALSE
- Keywords are saved as comma-separated plain text. In the frontend, a user can select a keyword to show only the corresponding registrar, register and description nodes.
- The data year/date cells should be plain text, not date formatted. Otherwise, the python script won't parse them correctly. A single year is parsed as a section of one whole year, single date as one point in time and a dash-separated pair of years/dates as a section with the given start and end year/date. Multiple sections/points can be added with `;` as the separator.
- Notes from notes-column are shown in the visualization when hovering mouse cursor over an info-icon next to the corresponding timeline.

The frontend uses two optional url-parametes: `lang` to select the shown language and `ds` to select the shown dataset. So, if you want a direct link e.g. to the English version of the Psycohorts-visualization, you can use url https://fbc-studies.github.io/meta-visu/?lang=en&ds=psycohorts . If no parameters are given, the application defaults to `lang=fi` and `ds=finnish-birth-cohorts`.

The actual visualization is done with a javascript library called [d3.js](https://d3js.org/).
In addition to these main parts, the repository holds many files that are needed when developing new features or modifying the application.

The application is designed to be distributed as a web page hosted from the github repository ([Github Pages](https://pages.github.com/)). This was an easy and free option to host and update the application without needing to deploy a backend somewhere. Of course, this sets some limitations such as having to update the data locally (and pushing it to the repository) instead of doing it e.g. through the web app. Of course, the application can be hosted anywhere, e.g. locally if wanted.

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

## Updating the data

Step-by-step instructions to update the data after you have set up Python and Node:

1. Make the desired changes to the excel-file (probably saved in Google Drive).
2. Download the file as .xlsx-file if the file is in Google Drive or save it.
3. Replace the previous version of the file inside the python-folder.
4. Run `python update_fbc_data.py` (or `update_psy_data.py` depending which dataset you are updating) inside the python-folder.
5. The data should now be updated. Now you should commit and push the changes to keep the github-repository up-to-date.
6. Lastly, run command `npm run deploy`. This updates the production build of the application inside the build-folder and pushes it to gh-pages -branch. This branch is the one that is served at https://fbc-studies.github.io/meta-visu/
