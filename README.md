# Electricity Consumption and Production Tracker
## Overview
This project is a web application that allows users to search for and visualize electricity consumption and production data for Finland. The application fetches data from the Fingrid API and displays it using D3.js for data visualization.

## Features
- Search Form: Users can input start and end dates to search for electricity data within a specific time range.
- Dataset Selection: Users can select between electricity production and consumption datasets.
- Graphical Representation: The application visualizes the selected dataset as a line graph, showing the trend of electricity consumption or production over time.

## Setup
1. Clone the repository to your local machine.
2. Open the project directory in your code editor.
3. Launch the project using a local server. For example, you can use Live Server for Visual Studio Code.
4. Access the application through the browser by navigating to the local server URL.

## Usage
1. Input the desired start and end dates using the date picker inputs.
2. Select the dataset (electricity production or consumption) using the radio buttons.
3. Click the "Get data" button to fetch and visualize the electricity data.
4. The application will display any errors encountered during the data retrieval process.
5. The line graph will show the trend of electricity consumption or production over the selected time range.

## Dependencies
- D3.js: A JavaScript library for manipulating documents based on data.
- Fingrid API: Provides access to electricity consumption and production data for Finland.

## Credits
- This project utilizes data from the Fingrid API.
' Data visualization is achieved using D3.js.

## License
This project is licensed under the MIT License.