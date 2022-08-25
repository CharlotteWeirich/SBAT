var inputData = ['This movie sucks.', 'I loved it!', 'A waste of time.',
                'Truly awful', 'Most hilarious movie ever'];
var textIndex = 0;
var outputData = '[';
var fileUploaded = false;

var textDisplay = document.getElementById('textDisplay');
var positiveButton = document.getElementById('positiveButton');
var negativeButton = document.getElementById('negativeButton');
var downloadButton = document.getElementById('downloadButton');
var fileSelector = document.getElementById('fileSelector');

positiveButton.addEventListener('click', positiveButtonClicked);
negativeButton.addEventListener('click', negativeButtonClicked);
downloadButton.addEventListener('click', downloadButtonClicked);
fileSelector.addEventListener('change', (event) => {
    getFileData(event.target.files[0]);
});

progressTextDisplay();

function progressTextDisplay(){
    if (textIndex < inputData.length){
        textDisplay.textContent = inputData[textIndex];
        textIndex ++;
    }
    else{
        positiveButton.disabled = true;
        negativeButton.disabled = true;
        alert ('Reached end of data.');
        displayOutput();
        if (fileUploaded){
            downloadButton.disabled = false;
        }
    }
}

function displayOutput(){
    outputData = outputData.slice(0, -3);
    outputData += ']';
    textDisplay.textContent = outputData;
}

function positiveButtonClicked(){
    outputData += '{"text": "' + inputData[textIndex-1] + '", "label": "positive"},\r\n';
    progressTextDisplay();
}

function negativeButtonClicked(){
    outputData += '{"text": "' + inputData[textIndex-1] + '", "label": "negative"},\r\n';
    progressTextDisplay();
}

function downloadButtonClicked(){

}

function getFileData(uploadedFile){
    positiveButton.disabled = false;
    negativeButton.disabled = false;
    fileUploaded = true;
    textIndex = 0;
    outputData = '[';
    console.log(uploadedFile);
    var reader = new FileReader();
    reader.addEventListener('load', function (e){
        inputData = e.target.result.split(/\r?\n/);
        progressTextDisplay();
    });
    reader.readAsText(uploadedFile);
}
