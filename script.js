const fromCurrencySelect = document.getElementById('from-currency');
const toCurrencySelect = document.getElementById('to-currency');
const amountInput = document.getElementById('amount');
const convertButton = document.getElementById('convert-button');
const resultDiv = document.getElementById('result');
const swapButton = document.getElementById('swap-button');

// Using a free API that doesn't require an API key for this example
const API_URL = 'https://open.er-api.com/v6/latest/USD';

let currencyRates = {};

// Fetch currencies and populate dropdowns
async function populateCurrencies() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (data.result === 'success') {
            currencyRates = data.rates;
            const currencies = Object.keys(currencyRates);
            
            currencies.forEach(currency => {
                const option1 = document.createElement('option');
                option1.value = currency;
                option1.textContent = currency;
                fromCurrencySelect.appendChild(option1);

                const option2 = document.createElement('option');
                option2.value = currency;
                option2.textContent = currency;
                toCurrencySelect.appendChild(option2);
            });

            // Set default values
            fromCurrencySelect.value = 'USD';
            toCurrencySelect.value = 'EUR';
            
            // Perform an initial conversion on page load
            convertCurrency();
        } else {
            resultDiv.textContent = 'Error fetching currency data.';
        }
    } catch (error) {
        resultDiv.textContent = 'Error fetching currency data. Please check your connection.';
        console.error('Error populating currencies:', error);
    }
}

// Convert currency based on user input
function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    if (isNaN(amount)) {
        resultDiv.textContent = 'Please enter a valid amount.';
        return;
    }

    const fromRate = currencyRates[fromCurrency];
    const toRate = currencyRates[toCurrency];

    if (fromRate && toRate) {
        // The API provides rates against USD. The formula is (amount / fromRate) * toRate
        const convertedAmount = (amount / fromRate) * toRate;
        resultDiv.textContent = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
    } else {
        resultDiv.textContent = 'Error getting exchange rates.';
    }
}

// Swap the 'from' and 'to' currencies
function swapCurrencies() {
    const temp = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = temp;
    convertCurrency(); // Re-calculate after swapping
}

// Event Listeners
document.addEventListener('DOMContentLoaded', populateCurrencies);
convertButton.addEventListener('click', convertCurrency);
amountInput.addEventListener('input', convertCurrency);
fromCurrencySelect.addEventListener('change', convertCurrency);
toCurrencySelect.addEventListener('change', convertCurrency);
swapButton.addEventListener('click', swapCurrencies);