let inputData = ['This movie sucks.', 'I loved it!', 'A waste of time.',
                'Truly awful', 'Most hilarious movie ever'];
let textIndex = 0;
let outputData = '[';
let fileUploaded = false;

// HTML Elements
let textDisplay = document.getElementById('textDisplay');
let positiveButton = document.getElementById('positiveButton');
let negativeButton = document.getElementById('negativeButton');
let downloadButton = document.getElementById('downloadButton');
let fileSelector = document.getElementById('fileSelector');


// Main/Setup
setupHTMLElements();
progressTextDisplay();

function setupHTMLElements(){
    positiveButton.addEventListener('click', positiveButtonClicked);
    negativeButton.addEventListener('click', negativeButtonClicked);
    downloadButton.addEventListener('click', downloadButtonClicked);
    fileSelector.addEventListener('change', (event) => {
        getFileData(event.target.files[0]);
    });
}

// Upload Button
/* when a user uploads a file, load the contents into inputData
*/
// called when change in fileSelector
function getFileData(uploadedFile){
    downloadButton.disabled = true;
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

// Annotation
/* 
*/
function positiveButtonClicked(){
    outputData += '{"text": "' + inputData[textIndex-1] + '", "label": "positive"},\r\n';
    progressTextDisplay();
}

function negativeButtonClicked(){
    outputData += '{"text": "' + inputData[textIndex-1] + '", "label": "negative"},\r\n';
    progressTextDisplay();
}

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

// Download Button
/* write outputData to a .json file and download it
*/
function downloadButtonClicked(){
    let textFileAsBlob = new Blob([outputData], {type:'application/json'});
    let downloadLink = document.createElement("a");
    downloadLink.download = document.getElementById('fileNameToSaveAs').value;;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null)
    {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    }
    else
    {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }
    downloadLink.click();
}
