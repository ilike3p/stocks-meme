const fmpApiKey = '3fcf836c643e57ea595c320853b52635';
const redditApiUrl = 'https://tradestie.com/api/v1/apps/reddit';
const modal = document.querySelector('.modal');
const modalOpenButton = document.querySelector('.modal-open');
const overlay = document.querySelector('.modal-overlay');
const modalCloseButtons = document.querySelectorAll('.modal-close');
const tickerInput = document.getElementById('tickersymbol');
const modalHeader = document.getElementById('modal-header');
const modalBody = document.getElementById('modal-body');
const mainContainer = document.getElementById('mstocks');
const ESCAPE_KEY_CODE = 27;
const INVALID_TICKER_MESSAGE = 'Invalid Ticker Symbol';

modalOpenButton.addEventListener('click', (event) => {
  event.preventDefault();
  openModal(tickerInput.value.trim());
});

overlay.addEventListener('click', toggleModal);

modalCloseButtons.forEach((button) => {
  button.addEventListener('click', toggleModal);
});

document.addEventListener('keydown', (event) => {
  if (event.code === ESCAPE_KEY_CODE && document.body.classList.contains('modal-active')) {
    toggleModal();
  }
});

function openModal(tickerSymbol) {
  fmpApi(tickerSymbol);
}

function toggleModal () {
  modal.classList.toggle('opacity-0');
  modal.classList.toggle('pointer-events-none');
  document.body.classList.toggle('modal-active');
  clearModal();
}

function fmpApi(tickerSymbol) {
  clearModal();
  toggleModal();
  const requestUrl = `https://financialmodelingprep.com/api/v3/profile/${tickerSymbol}?apikey=${fmpApiKey}`;

  if (tickerSymbol.length > 0) {
    fetch(requestUrl)
      .then(response => response.json())
      .then(stonkData => {
        if (stonkData.length > 0) {
          modalHeader.innerHTML = stonkData[0].companyName;
          const objectArray = Object.entries(stonkData[0]);
          for (let i = 0; i < 10; i++) {
            const label = document.createElement('div');
            const stonkValue = document.createElement('div');
            label.innerHTML = objectArray[i][0];
            stonkValue.innerHTML = objectArray[i][1];
            modalBody.appendChild(label);
            modalBody.appendChild(stonkValue);
          }
          storeTickers();
        } else {
          invalidTickerSymbol(modalBody);
        }
      })
      .catch(error => console.log(error));
  } else {
    invalidTickerSymbol(modalBody);
  }
}

function invalidTickerSymbol(modalBody) {
  const label = document.createElement('div');
  label.innerHTML = INVALID_TICKER_MESSAGE;
  modalBody.appendChild(label);
  tickerInput.value = '';
}

function clearModal() {
  modalBody.innerHTML = '';
  modalHeader.innerHTML = '';
}

function storeTickers() {
  const symbol = tickerInput.value;
  localStorage.setItem('ticker', symbol);
}

function loadLastTicker() {
  const lastTicker = localStorage.getItem('ticker');
  if (lastTicker) {
    tickerInput.value = lastTicker;
  }
}

function appendData(data) {
  const sortedData = data.sort((firstEl, secondEl) => {
    if (firstEl.sentiment_score > secondEl.sentiment_score) {
      return -1;
    } else if (firstEl.sentiment_score < secondEl.sentiment_score) {
      return 1;
    } else {
      return 0;
    }
  });

  mainContainer.innerHTML = '';

  for (let i = 0
