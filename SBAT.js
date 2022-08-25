var testData = ['This movie sucks.', 'I loved it!', 'A waste of time.',
                'Truly awful', 'Most hilarious movie ever'];
var textDisplay = document.getElementById('textDisplay');
var textIndex = 0;
var outputData = '[';
var positiveButton = document.getElementById('positiveButton');
var negativeButton = document.getElementById('negativeButton');
positiveButton.addEventListener('click', positiveButtonClicked);
negativeButton.addEventListener('click', negativeButtonClicked);

progressTextDisplay();

function progressTextDisplay(){
    if (textIndex < testData.length){
        textDisplay.textContent = testData[textIndex];
        textIndex ++;
    }
    else{
        positiveButton.disabled = true;
        negativeButton.disabled = true;
        alert ('Reached end of data.');
        displayOutput();
    }
}

function positiveButtonClicked(){
    outputData += '{"text": "' + testData[textIndex-1] + '", "label": "positive"},\r\n';
    progressTextDisplay();
}

function negativeButtonClicked(){
    outputData += '{"text": "' + testData[textIndex-1] + '", "label": "negative"},\r\n';
    progressTextDisplay();
}

function displayOutput(){
    outputData = outputData.slice(0, -3);
    outputData += ']';
    textDisplay.textContent = outputData;
}