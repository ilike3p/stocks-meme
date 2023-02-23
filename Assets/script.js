// Select DOM elements
const openmodal = document.querySelector('.modal-open');
const overlay = document.querySelector('.modal-overlay');
const closemodal = document.querySelectorAll('.modal-close');
const mainContainer = document.getElementById('mstocks');
const tickerInput = document.getElementById('tickersymbol');
const modalHeader = document.getElementById('modal-header');
const modalBody = document.getElementById('modal-body');

// Bind event listeners
openmodal.addEventListener('click', handleOpenModal);
overlay.addEventListener('click', toggleModal);
tickerInput.addEventListener('keydown', handleTickerInput);
closemodal.forEach(el => el.addEventListener('click', toggleModal));

// Fetch Wallstreetbets top ten stocks every 15 minutes
setInterval(fetchTopTenStocks, 1000 * 60 * 15);
fetchTopTenStocks();

// Functions

function handleOpenModal(event) {
  event.preventDefault();
  openModal(tickerInput.value.trim());
}

function handleTickerInput(event) {
  if (event.key === 'Enter') {
    handleOpenModal(event);
  }
}

function openModal(tickerSymbol) {
  if (tickerSymbol) {
    fmpApi(tickerSymbol);
  } else {
    console.error('Invalid ticker symbol');
  }
}

function toggleModal() {
  document.body.classList.toggle('modal-active');
  const modal = document.querySelector('.modal');
  modal.classList.toggle('opacity-0');
  modal.classList.toggle('pointer-events-none');
  clearModal();
}

function fetchTopTenStocks() {
  fetch('https://tradestie.com/api/v1/apps/reddit')
    .then(response => response.json())
    .then(data => {
      const sortedData = data.sort((a, b) => b.sentiment_score - a.sentiment_score);
      mainContainer.innerHTML = '';
      sortedData.slice(0, 10).forEach(stock => {
        const div = document.createElement('a');
        div.href = '';
        div.textContent = stock.ticker;
        div.onclick = event => {
          event.preventDefault();
          openModal(stock.ticker);
        };
        const div2 = document.createElement('div');
        div2.textContent = stock.sentiment_score;
        mainContainer.appendChild(div);
        mainContainer.appendChild(div2);
      });
    })
    .catch(error => console.error(error));
}

function fmpApi(tickerSymbol) {
  clearModal();
  fetch(`https://financialmodelingprep.com/api/v3/profile/${tickerSymbol}?apikey=3fcf836c643e57ea595c320853b52635`)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        modalHeader.textContent = data[0].companyName;
        Object.entries(data[0]).slice(0, 10).forEach(([key, value]) => {
          const label = document.createElement('div');
          const stonkValue = document.createElement('div');
          label.textContent = key;
          stonkValue.textContent = value;
          modalBody.appendChild(label);
          modalBody.appendChild(stonkValue);
        });
        localStorage.setItem('ticker', tickerSymbol);
      } else {
        invalidTickerSymbol();
      }
    })
    .catch(error => console.error(error));
}

function invalidTickerSymbol() {
  const label = document.createElement('div');
  label.textContent = 'Invalid ticker symbol';
  modalBody.appendChild(label);
  tickerInput.value = '';
}

function clearModal() {
  modalHeader.textContent = '';
  modalBody.innerHTML = '';
}

function loadLastTicker() {
  const lastTicker = localStorage.getItem('ticker');
  if (lastTicker) {
  }};
