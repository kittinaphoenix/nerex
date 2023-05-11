const baseURL = window.API_URL;
const sampleTxt = "On June 15th, 2023, the Global Investment Bank reported a 4.2% increase in revenue for the first half of the year, with net earnings of $5.3 billion. In response, the board of directors approved a $1.2 billion infrastructure project in London, spanning a 3.5-mile radius around the city's financial district, to be completed by December 31st, 2025. An additional 8 million shares will be issued at a target price of $75.50 per share, with the initial public offering (IPO) scheduled for October 1st, 2023, to finance this expansion. Key stakeholders include prominent entrepreneur Jane A. Thompson, the local government, and the renowned construction firm, BuildTech Solutions. Furthermore, the project will include the development of a 350,000 square foot office complex and a 1,500-foot-tall skyscraper, making it one of the largest in the area. The project is expected to generate over 5,000 new jobs and contribute significantly to the local economy.";
const sampleTxt2 = "On May 20th, 2023, the International Finance Corporation announced a 6.1% growth in revenue for the first half of the year, with net earnings of $6.8 billion. Consequently, the executive committee approved a $1.5 billion transportation project in New York City, aiming to upgrade the city's subway system and extend it by 6 miles in key areas, with a completion deadline of June 30th, 2026. To fund this endeavor, 10 million shares will be issued at an initial target price of $85.75 per share, with the initial public offering (IPO) planned for November 15th, 2023. Major stakeholders involved in this project include business magnate John B. Smith, the city government, and the well-known engineering firm, TransTech Innovations. In addition, the project encompasses the construction of a new 250,000 square foot transit hub and the renovation of 50 subway stations, significantly improving their accessibility and safety. This project is anticipated to create more than 7,000 new jobs and have a substantial impact on the local economy and transportation infrastructure.";

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Materialize Dropdown
    const elems = document.querySelectorAll('.dropdown-trigger');
    const options = { coverTrigger: false, hover: false };
    M.Dropdown.init(elems, options);

    //add sample texts
    document.getElementById("textArea1").value = sampleTxt;
    document.getElementById("textArea2").value = sampleTxt2;
  
    // Extract button event listener
    const extractBtn = document.querySelector('.dropdown-trigger');
    extractBtn.addEventListener('click', extractAndDisplayResults);
  });
  
  async function extractData(text1, text2, method) {
    if (!text1 || !text2) return;
  
    try {
      const response = await fetch(baseURL + method.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text1: text1, text2: text2 }),
      });
  
      if (response.ok) {
        const data = await response.json();
        const parsedResult = JSON.parse(data.result); // Parse the JSON string into an object
        showResult(method, parsedResult);
      } else {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  async function extractAndDisplayResults() {
    const textArea1Value = document.querySelector('#textArea1').value;
    const textArea2Value = document.querySelector('#textArea2').value;
  
    // Call your Python API here to analyze the input texts
    // and get the results (tables, plain text, etc.)
  
    // Define the method object containing the endpoint (replace with your actual endpoint)
    const method = {
      endpoint: '/api/extract/comparsion',
    };
  
    // Call the extractData function with the text inputs and method object
    await extractData(textArea1Value, textArea2Value, method);
  }
  
  function showResult(method, parsedResult) {
    const nerContainer = document.querySelector('.ner-container');
    nerContainer.innerHTML = '';

    console.log(parsedResult);
  
    parsedResult.forEach((item) => {
      const widget = createWidget(item);
      nerContainer.appendChild(widget);
    });
  }
  
  function createWidget(item) {
    const widget = document.createElement('div');
    widget.className = 'widget';
  
    const widgetTitle = document.createElement('h5');
    widgetTitle.className = 'widget-title';
    widgetTitle.textContent = item.title;
  
    const widgetContent = document.createElement('div');
    widgetContent.className = 'widget-content';
  
    if (item.type === 'table') {
      // Add table content
      const table = createTable(item.data);
      widgetContent.appendChild(table);
    } else if (item.type === 'text') {
      // Add plain text content
      const paragraph = document.createElement('p');
      paragraph.textContent = item.data;
      widgetContent.appendChild(paragraph);
    }
  
    widget.appendChild(widgetTitle);
    widget.appendChild(widgetContent);
  
    return widget;
  }
  
  function createTable(data) {
    const table = document.createElement('table');
    table.className = 'highlight';
  
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
  
    Object.keys(data[0]).forEach(key => {
      const th = document.createElement('th');
      th.textContent = key;
      tr.appendChild(th);
    });
  
    thead.appendChild(tr);
    table.appendChild(thead);
  
    const tbody = document.createElement('tbody');
  
    data.forEach(row => {
      const tr = document.createElement('tr');
  
      Object.values(row).forEach(value => {
        const td = document.createElement('td');
        td.textContent = value;
        tr.appendChild(td);
      });
  
      tbody.appendChild(tr);
    });
  
    table.appendChild(tbody);
  
    return table;
  }