let inputData = ['This movie sucks.', 'I loved it!', 'A waste of time.',
                'Truly awful', 'Most hilarious movie ever'];
let textIndex = 0;
let outputData = [];
let labelSet = [];
let shortcutList = ['p', 'n'];

// HTML Elements
let textDisplay = document.getElementById('textDisplay');
let downloadButton = document.getElementById('downloadButton');
let fileSelector = document.getElementById('fileSelector');
let submitButton = document.getElementById('submitButton');
let shortcutButton = document.getElementById('shortcutButton');
let enteredLabelSet = document.getElementById('enteredLabelSet');


// Main/Setup
setupHTMLElements();
progressTextDisplay();
enteredLabelSet.value = 'Positive\r\nNegative';
shortcutButton.disabled = true;

function setupHTMLElements(){
    downloadButton.addEventListener('click', downloadButtonClicked);
    fileSelector.addEventListener('change', (event) => {
        getFileData(event.target.files[0]);
    });
    submitButton.addEventListener('click', submitButtonClicked);
    shortcutButton.addEventListener('click', shortcutButtonClicked);
}

// Upload Button
/* when a user uploads a file, load the contents into inputData
*/
// called when change in fileSelector
function getFileData(uploadedFile){
    textIndex = 0;
    outputData = [];

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
                // load saved labelSet from file if there is one
                if (i == 0 && parsedJson[i].hasOwnProperty('labelSet')){
                    for (let j = 0; j < parsedJson[i].labelSet; j ++){
                        enteredLabelSet.value += parsedJson[i].labelSet[j];
                    }
                    submitButtonClicked();
                }
                // put already annotated texts directly into outputData and skip ahead
                if (parsedJson[i].label != ''){
                    outputData.push(parsedJson[i]);
                    progressTextDisplay;
                }
                else {
                    inputData.push(parsedJson[i].text);
                }
            }
            progressTextDisplay();
        }     
    });
    reader.readAsText(uploadedFile);
}

// Annotation
/* 
*/
function makeLabelButton(label, shortcut){
    // create Button Element in HTML
    let labelButton = document.createElement('button');
    labelButton.innerHTML = label;
    labelButton.id = label + 'Button';
    labelButton.accessKey = shortcut;
    document.body.appendChild(labelButton);

    // give Button functionality
    document.getElementById(labelButton.id).addEventListener('click', function (){
        const aO = new Object();
        aO.text = inputData[textIndex-1];
        aO.label = label;
        outputData.push(aO);
        progressTextDisplay();
    })
}

// set the label set to the user entered label set and create the annotation buttons
function submitButtonClicked(){
    submitButton.disabled = true;
    shortcutButton.disabled = false;
    // remove the current label buttons
    if (labelSet.length > 0){
        for (let i = 0; i < labelSet.length; i++){
        btn = document.getElementById(labelSet[i] + 'Button');
        btn.parentNode.removeChild(btn);
        }
    }    
    // create new ones
    labelSet = enteredLabelSet.value.split(/\r?\n/);
    for (let i = 0; i < labelSet.length; i++){
        makeLabelButton(labelSet[i], shortcutList[i]);
    }
}
function progressTextDisplay(){
    if (textIndex < inputData.length){
        textDisplay.textContent = inputData[textIndex];
        textIndex ++;
    }
    else{
        alert ('Reached end of data.');
        displayOutput();
        submitButton.disabled = false;
        if (labelSet.length > 0){
            for (let i = 0; i < labelSet.length; i++){
            btn = document.getElementById(labelSet[i] + 'Button');
            btn.disabled = true;
            }
        }   
    }
}

function displayOutput(){
    textDisplay.textContent = JSON.stringify(outputData);
}

// Download Button
/* write outputData to a .json file and download it
*/
function downloadButtonClicked(){
    // add the remaining not yet annotated texts to the output data with empty labels
    while (textIndex <= inputData.length){
        const aO = new Object();
        aO.text = inputData[textIndex-1];
        aO.label = '';
        outputData.push(aO);
        textIndex++;
    }
    // add the label set to the beginning of the outputData
    if (labelSet.length != 0){
        labelSetObject = new Object();
        labelSetObject.labelSet = labelSet;
        outputData.unshift(labelSetObject);
    }
    let textFileAsBlob = new Blob([JSON.stringify(outputData)], {type:'application/json'});
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

// shortcut Choice

function shortcutButtonClicked(){
    shortcutWindow = window.open('shortcutChoice.html', 'shortcutChoice',
    'scrollbars=no,status=no,location=no,toolbar=no,menubar=no,width=600,height=300,left=100,top=100');
    message_broadcast(labelSet);
}

function message_broadcast(message)
{
    localStorage.setItem('message',JSON.stringify(message));
    localStorage.removeItem('message');
}