let inputData = ['This movie sucks.', 'I loved it!', 'A waste of time.',
                'Truly awful', 'Most hilarious movie ever'];
let textIndex = 0;
let outputData = [];
let labelSet = [];
let paginationValue = 0;
let shortcutList;
let keyCodeList = {"0":48,"1":49,"2":50,"3":51,"4":52,"5":53,"6":54,"7":55,"8":56,"9":57,"d":68,"b":66,"a":65,"s":83,"i":73,"f":70,"k":75,"ß":219,"Dead":220,"+":187,"ü":186,"p":80,"o":79,"u":85,"z":90,"t":84,"r":82,"e":69,"w":87,"g":71,"h":72,"j":74,"l":76,"ö":192,"ä":222,"#":191,"y":89,"x":88,"c":67,"v":86,"n":78,"m":77,",":188,".":190,"-":189,"ArrowRight":39,"ArrowLeft":37,"ArrowUp":38,"ArrowDown":40,"PageDown":34,"Clear":12,"Home":36,"PageUp":33,"End":35,"Delete":46,"Insert":45,"Control":17,"AltGraph":18,"Meta":92,"Alt":18,"Shift":16,"CapsLock":20,"Tab":9,"Escape":27,"F1":112,"F2":113,";":188,":":190,"_":189,"'":191,"*":187,"Q":81,"W":87,"E":69,"R":82,"T":84,"Z":90,"S":83,"A":65,"D":68,"I":73,"U":85,"O":79,"Y":89,"X":88,"C":67,"F":70,"V":86,"G":71,"B":66,"H":72,"N":78,"J":74,"M":77,"K":75,"L":76,"P":80,"Ö":192,"Ä":222,"Ü":186,"!":49,"\"":50,"§":51,"$":52,"%":53,"&":54,"/":55,"(":56,")":57,"=":48,"?":219,"°":220}

// HTML Elements
let textDisplay = document.getElementById('textDisplay');
let downloadButton = document.getElementById('downloadButton');
let fileSelector = document.getElementById('fileSelector');
let submitButton = document.getElementById('submitButton');
let shortcutButton = document.getElementById('shortcutButton');
let enteredLabelSet = document.getElementById('enteredLabelSet');
let labelButtonArea = document.getElementById('labelButtonArea');
let anootationArea = document.getElementById('annotationArea');
let paginationDropdown = document.getElementById('paginationDropdown');
let shortcutOkayButton = document.getElementById('shortcutOkayButton');
let shortcutArea = document.getElementById('shortcutArea');
let pagination0 = document.getElementById('pagination0');
let pagination1 = document.getElementById('pagination1');
let pagination2 = document.getElementById('pagination2');
let pagination3 = document.getElementById('pagination3');


// Main/Setup
setupHTMLElements();
progressTextDisplay();
enteredLabelSet.value = 'Positive\r\nNegative';
pagination0.selected = true;
shortcutButton.disabled = true;

function setupHTMLElements(){
    downloadButton.addEventListener('click', downloadButtonClicked);
    fileSelector.addEventListener('change', (event) => {
        getFileData(event.target.files[0]);
    });
    submitButton.addEventListener('click', submitButtonClicked);
    paginationDropdown.addEventListener('change', changePaginationOption);
    shortcutButton.addEventListener('click', shortcutButtonClicked);
    shortcutOkayButton.addEventListener('click', shortcutOkayButtonClicked);
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
function makeLabelButton(label){
    // create Button Element in HTML
    let labelButton = document.createElement('button');
    labelButton.innerHTML = label;
    labelButton.id = label + 'Button';
    labelButton.className = 'labelButton';
    labelButtonArea.appendChild(labelButton);

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
        makeLabelButton(labelSet[i]);
    }
}
function progressTextDisplay(){

    if (paginationValue > 0){
        if (textIndex < inputData.length){
            for (i = 1; i <= paginationValue; i++){
                if (textIndex >= i){
                    textFrontDisplay = document.getElementById('textFrontDisplay' + i);
                    textFrontDisplay.value = inputData[textIndex - i];
                }
                if (textIndex <= (inputData.length - i)){
                    textBackDisplay = document.getElementById('textBackDisplay' + i);
                    textBackDisplay.value = inputData[textIndex + i];
                    if(textBackDisplay.value == 'undefined'){
                        textBackDisplay.value = '';
                    }
                }
            }
            textDisplay.value = inputData[textIndex];
            textIndex++;
        }
        else{
            alert ('Reached end of data.');
            pagination0.selected = true;
            changePaginationOption();
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

    else{
        if (textIndex < inputData.length){
            textDisplay.value = inputData[textIndex];
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
}

function displayOutput(){
    textDisplay.value = JSON.stringify(outputData);
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

// Pagination

function changePaginationOption(){

    if (pagination0.selected == true){
        for(i = 1; i <= paginationValue; i++){
            textFrontDisplay = document.getElementById('textFrontDisplay' + i);
            textBackDisplay = document.getElementById('textBackDisplay' + i);
            textFrontDisplay.parentNode.removeChild(textFrontDisplay);
            textBackDisplay.parentNode.removeChild(textBackDisplay);
        }
        textDisplay.style = 'width:600px; height:200px';
        textDisplay.style.fontWeight = 'normal';
        paginationValue = 0;
    }
    else {
        for(i = 1; i <= paginationValue; i++){
            textFrontDisplay = document.getElementById('textFrontDisplay' + i);
            textBackDisplay = document.getElementById('textBackDisplay' + i);
            textFrontDisplay.parentNode.removeChild(textFrontDisplay);
            textBackDisplay.parentNode.removeChild(textBackDisplay);
        }
        if (pagination1.selected == true){
            paginationValue = 1;
        }
        if (pagination2.selected == true){
            paginationValue = 2;
        }
        if (pagination3.selected == true){
            paginationValue = 3;
        }
        for (i = 1; i <= paginationValue; i++){
            textFrontDisplay = document.createElement('textarea');
            textFrontDisplay.style = 'width:200px; height:200px';
            textFrontDisplay.readonly = true;
            textFrontDisplay.id = 'textFrontDisplay' + i;
            if (i == 1){
                annotationArea.insertBefore(textFrontDisplay, textDisplay);
            }
            else{
                textFrontDisplayFront = document.getElementById('textFrontDisplay' + (i-1));
                annotationArea.insertBefore(textFrontDisplay, textFrontDisplayFront);
            }
            textBackDisplay = document.createElement('textarea');
            textBackDisplay.style = 'width:200px; height:200px';
            textBackDisplay.readonly = true;
            textBackDisplay.id = 'textBackDisplay' + i;
            annotationArea.insertBefore(textBackDisplay, paginationDropdown);
        }
        textDisplay.style = 'width:200px; height:200px';
        textDisplay.style.fontWeight = 'bold';
    }
    textIndex--;
    progressTextDisplay();
}

// shortcut Choice

function shortcutButtonClicked(){

    for(i = 0; i < labelSet.length; i++){
        let shortcutField = document.createElement('textarea');
        shortcutField.style = 'width:30px; height:15px';
        shortcutField.maxLength = '1';
        shortcutField.id = labelSet[i] + 'Shortcut';
        let shortcutFieldLabel = document.createElement('label');
        shortcutFieldLabel.for = shortcutField.id;
        shortcutFieldLabel.innerHTML = labelSet[i];
        shortcutFieldLabel.id = labelSet[i] + 'Label';
        shortcutArea.insertBefore(shortcutFieldLabel, shortcutOkayButton);
        shortcutArea.insertBefore(shortcutField, shortcutFieldLabel);
    }
    shortcutOkayButton.hidden = false;
}

function shortcutOkayButtonClicked(){

    // fill the shortcutList with the entered shortcuts & delete html elements
    shortcutList = new Object();
    for(i = 0; i < labelSet.length; i++){
        shortcutField = document.getElementById(labelSet[i] + 'Shortcut');
        shortcutList[labelSet[i]] = shortcutField.value;
        shortcutField = document.getElementById(labelSet[i] + 'Shortcut');
        shortcutField.parentNode.removeChild(shortcutField);
        shortcutFieldLabel = document.getElementById(labelSet[i] + 'Label');
        shortcutFieldLabel.parentNode.removeChild(shortcutFieldLabel);
    }

    shortcutOkayButton.hidden = true;

    // add shortcut functionality
    document.onkeyup = function(e){
        for(i = 0; i < labelSet.length; i++){
            if (e.which == keyCodeList[shortcutList[labelSet[i]]] 
                || e.keyCode == keyCodeList[shortcutList[labelSet[i]]]){
                document.getElementById(labelSet[i] + 'Button').click();
            }
        }
    }
    alert ('Shortcuts set!');
}