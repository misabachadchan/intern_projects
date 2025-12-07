let display = document.getElementById('display');

// Function to add value to display
function appendValue(value) {
    display.value += value;
}

// Function to clear display
function clearDisplay() {
    display.value = '';
}

// Function to calculate result
function calculateResult() {
    try {
        display.value = eval(display.value);
    } catch (error) {
        display.value = "Error";
    }
}
