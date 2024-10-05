## To start the Website :

First input your URI for mongoDB to connect to connect the project to the database,
You can find it in server.js  —> mongoose.connect('input your server URI here',
Similarly change its occurrence at different locations 


### Go to backend directory
    —> node server.js
### Go to Frontend directory
     —> npm start  
 

This will fetch the data and start the server to run the Dashboard.

Below are the few Images on how the Dashboard looks :

![Screenshot (180)](https://github.com/user-attachments/assets/12c28351-d7bb-48de-863e-b4d7ec1834e1)
![Screenshot (182)](https://github.com/user-attachments/assets/a1b9b13d-ce72-400f-92e8-7617b977edae)

## Dashboard Overview:

The project is a comprehensive dashboard built using the MERN stack (MongoDB, Express, React, Node.js) to visualize various metrics related to global data.

### Data Fetching and State Management:

The data is fetched from a MongoDB database via a REST API built with Express and Node.js.
The React frontend manages state using hooks like useState and useEffect.

### Filter Functionality:

Users can filter data based on sector, relevance, intensity, and country using dropdown menus.
Initially, no data is shown; data appears only after selecting from the dropdown menus.

### Visualizations:

Bar Chart: Displays total relevance by country.
Line Chart: Shows total likelihood by country.
Pie Chart: Illustrates the distribution of PESTLE (Political, Economic, Social, Technological, Legal, Environmental) factors by total count.
World Map: Marks countries based on the data, highlighting their geographical locations.
Additional Charts:
Line chart for total intensity by year.
Bar chart for total relevance by year.

### Responsive Design:

The charts are styled to fit within a responsive layout, adjusting for different screen sizes.

### Dynamic Data Display:

The filtered titles are displayed in a row format, ensuring a clean and organized view.
A table is provided to show detailed data for the selected country.




## How I Built This Project

### Setting Up the Environment:

Initialized a new project using Create React App for the frontend.
Set up a Node.js server with Express for the backend.
Connected to MongoDB using Mongoose for data management.


### Creating the REST API:

Defined data models using Mongoose schemas.
Built RESTful endpoints to fetch data from MongoDB.
Used CORS middleware to enable cross-origin requests.

### Fetching Data in React:

Utilized the fetch API to get data from the backend.
Managed application state using React hooks (useState and useEffect).




### Implementing Filter Functionality:

Added dropdown menus for sectors, relevance, intensity, and country.
Used state to handle user selections and filter data accordingly.

### Data Visualization with D3.js:

Integrated D3.js for creating dynamic and interactive charts.
Used D3.js functions to create scales, axes, and chart elements (bars, lines, paths).
Implemented responsive designs for the charts.


Styling:

Applied CSS for layout and styling.
Ensured that the filtered titles display in a row by using flexbox
.
Testing and Debugging:

Tested the application to ensure data is correctly fetched and displayed.
Debugged any issues with data rendering and chart responsiveness.

