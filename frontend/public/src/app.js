const baseURL = window.API_URL;
const sampleTxt = "On June 15th, 2023, the Global Investment Bank reported a 4.2% increase in revenue for the first half of the year, with net earnings of $5.3 billion. In response, the board of directors approved a $1.2 billion infrastructure project in London, spanning a 3.5-mile radius around the city's financial district, to be completed by December 31st, 2025. An additional 8 million shares will be issued at a target price of $75.50 per share, with the initial public offering (IPO) scheduled for October 1st, 2023, to finance this expansion. Key stakeholders include prominent entrepreneur Jane A. Thompson, the local government, and the renowned construction firm, BuildTech Solutions. Furthermore, the project will include the development of a 350,000 square foot office complex and a 1,500-foot-tall skyscraper, making it one of the largest in the area. The project is expected to generate over 5,000 new jobs and contribute significantly to the local economy.";

const extractionMethods = [
  { id: 'regex', label: 'Regex', endpoint: "/api/extract/regex", type: "table" },
  { id: 'spacy', label: 'Spacy', endpoint: "/api/extract/spacy", type: "table"  },
  { id: 'wordtwonumber', label: 'Word2Number', endpoint: "/api/extract/wordtwonumber", type: "table"  },
  { id: 'bert', label: 'BERT Sentiment', endpoint: "/api/extract/bert", type: "table"  },
];

document.addEventListener('DOMContentLoaded', () => {
  M.AutoInit();
  initDropdown();
  createDynamicTabs();

  document.getElementById("inputText").value = sampleTxt;
});

function initDropdown() {
  const dropdown = document.getElementById('dropdown1');
  extractionMethods.forEach(method => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = method.label;
    a.onclick = () =>
    extractData(method);
    li.appendChild(a);
    dropdown.appendChild(li);
  });
}

async function extractData(method) {
  const inputText = document.getElementById('inputText').value;
  if (!inputText) return;

  try {
    const response = await fetch(baseURL + method.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: inputText }),
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

function showResult(method, result) {
  const resultContainer = document.getElementById(method.id);
  resultContainer.innerHTML = '';

  switch (method.type) {
    case 'table':
      const table = document.createElement('div');
      const values = result.values;
      var percent_changes = [];
      if (result.percent_changes) percent_changes = result.percent_changes;
      const allResults = [...values, ...percent_changes]; // Combine both arrays
      
      // Create header row
      const tableHeader = document.createElement('div');
      tableHeader.classList.add('row', 'table-row', 'table-header');
      Object.keys(allResults[0]).forEach(key => {
        const cell = document.createElement('div');
        cell.classList.add('col', 'header-cell','cell');
        cell.textContent = key;
        tableHeader.appendChild(cell);
      });
      table.appendChild(tableHeader);
      
      // Create data rows
      allResults.forEach((row, index) => {
        const tableRow = document.createElement('div');
        tableRow.classList.add('row', 'table-row');
        Object.values(row).forEach(col => {
          const cell = document.createElement('div');
          cell.classList.add('col', 's4','cell');
          cell.textContent = col;
          tableRow.appendChild(cell);
        });
        table.appendChild(tableRow);
      });
      resultContainer.appendChild(table);
      break;

    case 'plain':
      // Handle plain text result here
      break;

    default:
      console.error('Unknown result type:', method.type);
  }
}

function createDynamicTabs(method) {
  const tabsContainer = document.querySelector('.tabs-container');
  tabsContainer.innerHTML = '';

  const resultContainer = document.getElementById("resultContainer");

  const ul = document.createElement('ul');
  ul.classList.add('tabs');

  extractionMethods.forEach((item, index) => {
    const li = document.createElement('li');
    li.classList.add('tab', 'col');

    const a = document.createElement('a');
    a.href = `#${item.id}`;
    a.textContent = item.label;

    if (index === 0) {
      a.classList.add('active');
    }

    li.appendChild(a);
    ul.appendChild(li);

    const content = document.createElement('div');
    content.id = item.id;
    content.classList.add('col', 's12', 'ner-right-side', 'salmon-border');

    if (index === 0) {
      content.style.display = 'block';
    } else {
      content.style.display = 'none';
    }

    resultContainer.appendChild(content);
  });

  tabsContainer.appendChild(ul);

  const instance = M.Tabs.init(tabsContainer.querySelector('.tabs'));
}