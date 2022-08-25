let inputData = ['This movie sucks.', 'I loved it!', 'A waste of time.',
                'Truly awful', 'Most hilarious movie ever'];
let textIndex = 0;
let outputData = '[';
let fileUploaded = false;

let textDisplay = document.getElementById('textDisplay');
let positiveButton = document.getElementById('positiveButton');
let negativeButton = document.getElementById('negativeButton');
let downloadButton = document.getElementById('downloadButton');
let fileSelector = document.getElementById('fileSelector');

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

    let reader = new FileReader();
    reader.addEventListener('load', function (e){
        if (uploadedFile.type == 'text/plain'){
            inputData = e.target.result.split(/\r?\n/);
            progressTextDisplay();
        }
        if (uploadedFile.type == 'application/json'){
            json = e.target.result;
            parsedJson = JSON.parse(json);
            inputData = [];
            for (let i = 0; i < parsedJson.length; i++){
                inputData.push(parsedJson[i].text);
            }
            progressTextDisplay();
        }     
    });
    reader.readAsText(uploadedFile);
}
