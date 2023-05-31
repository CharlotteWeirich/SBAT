let inputData = ['This movie sucks.', 'I loved it!', 'A waste of time.',
                'Truly awful', 'Most hilarious movie ever'];
let textIndex = 0;
let outputData = [{"text":"This movie sucks.","label":""},{"text":"I loved it!","label":""},
                {"text":"A waste of time.","label":""},{"text":"Truly awful","label":""},
                {"text":"Most hilarious movie ever","label":""}];
let labelSet = [];
let labelObjectList = [];
let paginationValue = 0;
let shortcutList;
let multilabel = false;
let saveToLocalStorage = false;
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
let textBackwardButton = document.getElementById('textBackwardButton');
let textForwardButton = document.getElementById('textForwardButton');
let numberOfTexts = document.getElementById('numberOfTexts');
let labelSetArea = document.getElementById('labelSetArea');
let settingSwitch = document.getElementById('settingSwitch');
let wholeDocumentSwitch = document.getElementById('wholeDocumentSwitch');
let multilabelSwitch = document.getElementById('multilabelSwitch');
let welcomeArea = document.getElementById('welcomeArea');
let uploadArea = document.getElementById('uploadArea');
let localStorageSwitch = document.getElementById('localStorageSwitch');

// Main/Setup
setupHTMLElements();
progressTextDisplay();
enteredLabelSet.value = 'Positive\r\nNegative';
pagination0.selected = true;
shortcutButton.disabled = true;
labelSetArea.hidden = true;
annotationArea.hidden = true;
settingSwitch.checked = false;
wholeDocumentSwitch.checked = false;
multilabelSwitch.checked = false;
localStorageSwitch.checked = false;
loadConfigFile('/config.json');

if (localStorage.getItem('SBATData') != null){
    annotationArea.hidden = false;
    welcomeArea.hidden = true;
    SBATData = JSON.parse(localStorage.getItem('SBATData'));
    inputData = SBATData.inputData;
    textIndex = SBATData.textIndex;
    outputData = SBATData.outputData;
    labelObjectList = SBATData.labelObjectList;
    shortcutList = SBATData.shortcutList;
    multilabel = SBATData.multilabel;
    saveToLocalStorage = SBATData.saveToLocalStorage;

    if (textIndex > 0){
        textIndex--;
    }
    progressTextDisplay();

    let labelText = '';
    for (let i = 0; i < SBATData.labelSet.length; i ++){
        labelText += SBATData.labelSet[i] + '\r\n';
    }
    labelText = labelText.slice(0, -2);
    enteredLabelSet.value = labelText;
    submitButtonClicked();
    addShortcutFunctionality();

    if (multilabel == true){
        multilabelSwitch.checked = true;
    }
    multilabelSwitchClicked();
    if (saveToLocalStorage){
        localStorageSwitch.checked = true;
    }
    localStorageSwitchClicked();
    localStorage.removeItem('SBATData');
}


function setupHTMLElements(){
    downloadButton.addEventListener('click', downloadButtonClicked);
    fileSelector.addEventListener('change', (event) => {
        getFileData(event.target.files[0]);
        annotationArea.hidden = false;
        welcomeArea.hidden = true;
        uploadArea.hidden = true;
    });
    submitButton.addEventListener('click', submitButtonClicked);
    paginationDropdown.addEventListener('change', changePaginationOption);
    shortcutButton.addEventListener('click', shortcutButtonClicked);
    shortcutOkayButton.addEventListener('click', shortcutOkayButtonClicked);
    textBackwardButton.addEventListener('click', textBackwardButtonClicked);
    textForwardButton.addEventListener('click', textForwardButtonClicked);
    settingSwitch.addEventListener('change', settingSwitchClicked);
    wholeDocumentSwitch.addEventListener('change', wholeDocumentSwitchClicked);
    multilabelSwitch.addEventListener('change', multilabelSwitchClicked);
    localStorageSwitch.addEventListener('change', localStorageSwitchClicked);
}

// Upload Button

function getFileData(uploadedFile){
    textIndex = 0;
    outputData = [];

    let reader = new FileReader();
    reader.addEventListener('load', function (e){
        if (uploadedFile.type == 'text/plain'){
            inputData = e.target.result.split(/\r?\n/);
            for (i = 0; i < inputData.length; i++){
                const aO = new Object();
                aO.text = inputData[i];
                aO.label = [];
                outputData.push(aO);
            }
            progressTextDisplay();
        }
        if (uploadedFile.type == 'application/json'){
            json = e.target.result;
            parsedJson = JSON.parse(json);
            inputData = [];
            enteredLabelSet.value = '';
            if (parsedJson.labelSet.length > 0){
                for (let i = 0; i < parsedJson.labelSet.length; i++){
                    if (i == parsedJson.labelSet.length-1){
                        enteredLabelSet.value += parsedJson.labelSet[i]
                    }
                    else{
                        enteredLabelSet.value += parsedJson.labelSet[i] + '\r\n';
                    }
                }
                submitButtonClicked();
            }

            for (let i = 0; i < parsedJson.data.length; i++){
                inputData.push(parsedJson.data[i].text);
                outputData.push(parsedJson.data[i]);
            }
            progressTextDisplay();
        }     
    });
    reader.readAsText(uploadedFile);
}

// Annotation

function makeLabelButton(label){
    // create Button Element in HTML
    let labelButton = document.createElement('button');
    labelButton.innerHTML = label.substring(getSubLabelLevel(label));
    labelButton.id = label + 'Button';
    labelButton.className = 'labelButton';
    labelButtonArea.appendChild(labelButton);

    // give Button functionality
    document.getElementById(labelButton.id).addEventListener('click', function (){
        addLabel(label);
    })
}

function makeLabelDropDown(clsName, labels){

    // create drop down element
    let labelDropDown = document.createElement('select');
    labelDropDown.id = clsName + 'DropDown';
    let emptyOption = document.createElement('option');
    emptyOption.id = 'emptyOption';
    labelDropDown.appendChild(emptyOption);
    for (let i = 0; i < labels.length; i++){
        let labelOption = document.createElement('option');
        labelOption.id = labels[i] + 'Option';
        labelOption.innerHTML = labels[i].substring(1);
        labelDropDown.appendChild(labelOption);
    }
    let labelDropDownLabel = document.createElement('label');
    labelDropDownLabel.for = clsName + 'DropDown';
    labelDropDownLabel.id = clsName + 'DropDownLabel';
    labelDropDownLabel.innerHTML = clsName.substring(1);
    labelButtonArea.appendChild(labelDropDown);
    labelButtonArea.appendChild(labelDropDownLabel);

    // give drop down functionality
    document.getElementById(labelDropDown.id).addEventListener('change', function(){
        e = document.getElementById(labelDropDown.id);
        selectedLabel = e.options[e.selectedIndex].text;
        setClassLabel(clsName, selectedLabel);
    })
}

function setClassLabel(clsName, label){
    const i = outputData[textIndex-1].label.findIndex(e => e .clsName === clsName)
    if (i > -1){
        outputData[textIndex-1].label[i].label = label;
    }
    else {
        aO = new Object;
        aO.clsName = clsName;
        aO.label = label;
        outputData[textIndex-1].label.push(aO);
    }
}

function addLabel(label){
    if (multilabel == true){
        btn = document.getElementById(label + 'Button');
        if (btn.classList.contains('selected')){
            btn.classList.remove('selected');
            outputData[textIndex-1].label = outputData[textIndex-1].label.filter(function(e) { return e !== label });
        }
        else{
            outputData[textIndex-1].label.push(label);
        }
        textIndex--;
        progressTextDisplay();
    }
    else{
        outputData[textIndex-1].label = [];
        outputData[textIndex-1].label.push(label);
        progressTextDisplay();
    }
}

// set the label set to the user entered label set and create the annotation buttons
function submitButtonClicked(){

    shortcutButton.disabled = false;

    // remove the current label buttons
    if (labelSet.length > 0){
        for (let i = 0; i < labelSet.length; i++){
            if (labelSet[i][0] != '*' && labelSet[i][0] != '-'){
                btn = document.getElementById(labelSet[i] + 'Button');
                btn.parentNode.removeChild(btn);
            }
            if (labelSet[i][0] == '*'){
                drpdwn = document.getElementById(labelSet[i] + 'DropDown');
                drpdwn.parentNode.removeChild(drpdwn);
                drpdwnlbl = document.getElementById(labelSet[i] + 'DropDownLabel');
                drpdwnlbl.parentNode.removeChild(drpdwnlbl);
            }
        }
    }    
    // create new ones
    labelSet = enteredLabelSet.value.split(/\r?\n/);
    labelObjectList = []
    for (let i = 0; i < labelSet.length; i++){
        if (labelSet[i][0] == '*'){
            clsLabelList = [];
            for (let j = i + 1; j < labelSet.length; j++){
                if (labelSet[j][0] == '-'){
                    clsLabelList.push(labelSet[j]);
                }
                else {
                    break;
                }
            }
            makeLabelDropDown(labelSet[i], clsLabelList);
            i = i + clsLabelList.length;
        }
        else {
            labelObject = new Object();
            labelObject.name = labelSet[i];
            labelObject.hasParent = false;
            labelObject.childrenList = [];
            labelObjectList.push(labelObject);
            makeLabelButton(labelSet[i]);
        }
    }

    for (let i = 0; i < labelSet.length; i++){
        let subLabelLevel = getSubLabelLevel(labelSet[i]);
        for (let j = i + 1; j < labelSet.length; j++){
            if (getSubLabelLevel(labelSet[j]) == subLabelLevel + 1){
                labelObjectList[i].childrenList.push(labelSet[j]);
                labelObjectList[j].hasParent = true;
            }
            if (getSubLabelLevel(labelSet[j]) <= subLabelLevel){
                break;
            }
        }
    }

    textIndex--;
    progressTextDisplay();
}

function progressTextDisplay(){

    //hide child buttons
    if (labelObjectList.length > 0){
        for (let i = 0; i < labelObjectList.length; i++){
            if (labelObjectList[i].hasParent){
                btn = document.getElementById(labelObjectList[i].name + 'Button');
                btn.hidden = true;
            }
        }
    }

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
            selectLabelButtons();
            textDisplay.value = inputData[textIndex];
            textIndex++;
        }
        else{
            alert ('Reached end of data.');
            pagination0.selected = true;
            changePaginationOption();
            displayOutput();
            if (labelSet.length > 0){
                for (let i = 0; i < labelSet.length; i++){
                    if (labelSet[i][0] != '*' && labelSet[i][0] != '-'){
                        btn = document.getElementById(labelSet[i] + 'Button');
                        btn.disabled = true;
                    }
                    if (labelSet[i][0] == '*'){
                        drpdwn = document.getElementById(labelSet[i] + 'DropDown');
                        drpdwn.disabled = true;
                    }
                }
            }
        }
    }

    else{
        if (textIndex < inputData.length){
            textDisplay.value = inputData[textIndex];
            selectLabelButtons();
            textIndex ++;      
        }
        else{
            alert ('Reached end of data.');
            displayOutput();
            if (labelSet.length > 0){
                for (let i = 0; i < labelSet.length; i++){
                    if (labelSet[i][0] != '*' && labelSet[i][0] != '-'){
                        btn = document.getElementById(labelSet[i] + 'Button');
                        btn.disabled = true;
                    }
                    if (labelSet[i][0] == '*'){
                        drpdwn = document.getElementById(labelSet[i] + 'DropDown');
                        drpdwn.disabled = true;
                    }
                }
            }   
        }
    }
    numberOfTexts.value = textIndex + '/' + inputData.length;

    // show relevant child buttons
    if (labelObjectList.length > 0){
        for(let i = 0; i < outputData[textIndex-1].label.length; i++){
            let num;
            for (let j = 0; j < labelObjectList.length; j++){
                if (labelObjectList[j].name == outputData[textIndex-1].label[i]){
                    num = j;
                    break;
                }
            }
            for (let k = 0; k < labelObjectList[num].childrenList.length; k++){
                btn = document.getElementById(labelObjectList[num].childrenList[k] + 'Button');
                btn.hidden = false;
            }
        }
    }
}

function displayOutput(){
    let cleanedOutputData = outputData;
    for (let i = 0; i < outputData.length; i++){
        for (let j = 0; j < outputData[i].label.length; j++){
            cleanedOutputData[i].label[j] = outputData[i].label[j].substring(getSubLabelLevel(outputData[i].label[j]));
        }
        
    }
    textDisplay.value = JSON.stringify(cleanedOutputData);
}

function selectLabelButtons(){
    for (let i = 0; i < labelSet.length; i++){
        if (labelSet[i][0] != '*' && labelSet[i][0] != '-'){
            btn = document.getElementById(labelSet[i] + 'Button');
            if (btn.classList.contains('selected')){
                btn.classList.remove('selected');
            }
        }
        if (labelSet[i][0] == '*'){
            drpdwn = document.getElementById(labelSet[i] + 'DropDown');
            drpdwn.value = 0;
        }
    }
    for (let i = 0; i < outputData[textIndex].label.length; i++){
        if (typeof outputData[textIndex].label[i] ==='string' || outputData[textIndex].label[i]instanceof String){
            btn = document.getElementById(outputData[textIndex].label[i] + 'Button');
            btn.classList.add('selected');
        }
        else if ('clsName' in outputData[textIndex].label[i]){
            lO = outputData[textIndex].label[i];
            drpdwn = document.getElementById(lO.clsName + 'DropDown');
            drpdwn.value = lO.label;
        }
    }
}

function getSubLabelLevel(label){
    let counter = 0;
    for (let i = 0; i < label.length; i++){
        if (label[i] == '>'){
            counter++;
        }
        else{
            break;
        }
    }
    return counter;
}

function textBackwardButtonClicked(){
    if (textIndex-2 >= 0){
        textIndex-=2;
        progressTextDisplay();
    }
}

function textForwardButtonClicked(){
    if (textIndex < inputData.length){
        progressTextDisplay();
    }
}

// Download Button

function downloadButtonClicked(){

    let cleanedOutputData = outputData;
    /*
    for (let i = 0; i < outputData.length; i++){
        for (let j = 0; j < outputData[i].label.length; j++){
            cleanedOutputData[i].label[j] = outputData[i].label[j].substring(getSubLabelLevel(outputData[i].label[j]));
        }
        
    }
    */

    dataToWrite = new Object();
    dataToWrite.labelSet = labelSet;
    dataToWrite.data = cleanedOutputData;
    let textFileAsBlob = new Blob([JSON.stringify(dataToWrite)], {type:'application/json'});
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
            textFrontDiv = document.getElementById('textFrontDiv' + i);
            textBackDiv = document.getElementById('textBackDiv' + i);
            textFrontDiv.parentNode.removeChild(textFrontDiv);
            textBackDiv.parentNode.removeChild(textBackDiv);
        }
        textDisplay.style = 'width:600px; height:200px';
        textDisplay.style.fontWeight = 'normal';
        paginationValue = 0;
    }
    else {
        for(i = 1; i <= paginationValue; i++){
            textFrontDiv = document.getElementById('textFrontDiv' + i);
            textBackDiv = document.getElementById('textBackDiv' + i);
            textFrontDiv.parentNode.removeChild(textFrontDiv);
            textBackDiv.parentNode.removeChild(textBackDiv);
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
            textFrontDiv = document.createElement('div');
            textFrontDiv.id = 'textFrontDiv' + i;
            textFrontDisplay = document.createElement('textarea');
            textFrontDisplay.style = 'width:600px; height:50px';
            textFrontDisplay.readonly = true;
            textFrontDisplay.id = 'textFrontDisplay' + i;
            if (i == 1){
                annotationArea.insertBefore(textFrontDiv, textDisplay);
                textFrontDiv.appendChild(textFrontDisplay);
            }
            else{
                textFrontDivFront = document.getElementById('textFrontDiv' + (i-1));
                annotationArea.insertBefore(textFrontDiv, textFrontDivFront);
                textFrontDiv.appendChild(textFrontDisplay);
            }
            textBackDiv = document.createElement('div');
            textBackDiv.id = 'textBackDiv' + i;
            textBackDisplay = document.createElement('textarea');
            textBackDisplay.style = 'width:600px; height:50px';
            textBackDisplay.readonly = true;
            textBackDisplay.id = 'textBackDisplay' + i;
            annotationArea.insertBefore(textBackDiv, numberOfTexts);
            textBackDiv.appendChild(textBackDisplay);
        }
        textDisplay.style = 'width:600px; height:50px';
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
    shortcutButton.disabled = true;
    shortcutOkayButton.hidden = false;
}

function shortcutOkayButtonClicked(){

    // fill the shortcutList with the entered shortcuts & delete html elements
    shortcutList = new Object();
    for(i = 0; i < labelSet.length; i++){
        shortcutField = document.getElementById(labelSet[i] + 'Shortcut');
        shortcutList[labelSet[i]] = shortcutField.value;
        shortcutField.parentNode.removeChild(shortcutField);
        shortcutFieldLabel = document.getElementById(labelSet[i] + 'Label');
        shortcutFieldLabel.parentNode.removeChild(shortcutFieldLabel);
    }

    shortcutOkayButton.hidden = true;
    shortcutButton.disabled = false;

    // add shortcut functionality
    addShortcutFunctionality();
    
    alert ('Shortcuts set!');
}

function addShortcutFunctionality(){
    document.onkeyup = function(e){
        if (e.which == 37 || e.keyCode == 37){
            textBackwardButton.click();
        }
        if (e.which == 39 || e.keyCode == 39){
            textForwardButton.click();
        }
        for(i = 0; i < labelSet.length; i++){
            if (e.which == keyCodeList[shortcutList[labelSet[i]]] 
                || e.keyCode == keyCodeList[shortcutList[labelSet[i]]]){
                document.getElementById(labelSet[i] + 'Button').click();
            }
        }
    }
}

//switches

function settingSwitchClicked(){
    if(settingSwitch.checked == true){
        labelSetArea.hidden = false;
        uploadArea.hidden = false;
    }
    else{
        labelSetArea.hidden = true;
        uploadArea.hidden = true;
    }
}

function wholeDocumentSwitchClicked(){
    if (wholeDocumentSwitch.checked == true){
        textDisplay.value = '';
        for (let i = 0; i < inputData.length; i++){
            textDisplay.value += inputData[i] + '\n'
        }
        textBackwardButton.disabled = true;
        textForwardButton.disabled = true;
        if (labelSet.length > 0){
            for (let i = 0; i < labelSet.length; i++){
            btn = document.getElementById(labelSet[i] + 'Button');
            btn.disabled = true;
            }
        }
        paginationDropdown.disabled = true;
    }
    else{
        textDisplay.value = '';
        textIndex--;
        progressTextDisplay();
        textBackwardButton.disabled = false;
        textForwardButton.disabled = false;
        if (labelSet.length > 0){
            for (let i = 0; i < labelSet.length; i++){
            btn = document.getElementById(labelSet[i] + 'Button');
            btn.disabled = false;
            }
        }
        paginationDropdown.disabled = false;
    }
}

function multilabelSwitchClicked(){
    if (multilabelSwitch.checked == true){
        multilabel = true;
    }
    else{
        multilabel = false;
    }
}

function localStorageSwitchClicked(){
    if (localStorageSwitch.checked == true){
        saveToLocalStorage = true;
    }
    else{
        saveToLocalStorage = false;
    }
}

function saveDataToLocalStorage(){
    SBATData = new Object();
    SBATData.inputData = inputData;
    SBATData.textIndex = textIndex;
    SBATData.outputData = outputData;
    SBATData.labelSet = labelSet;
    SBATData.labelObjectList = labelObjectList;
    SBATData.shortcutList = shortcutList;
    SBATData.multilabel = multilabel;
    SBATData.saveToLocalStorage = saveToLocalStorage;
    localStorage.setItem('SBATData', JSON.stringify(SBATData));
}

function loadConfigFile(file){
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        var allText = rawFile.responseText;
        alert(allText);

    }
    rawFile.send();
}

function loadConfigSettings(settings){
    annotationArea.hidden = false;
    welcomeArea.hidden = true;
    multilabel = settings.multilabel;
    shortcutList = settings.shortcutList;

    let labelText = '';
    for (let i = 0; i < settings.labelSet.length; i ++){
        labelText += settings.labelSet[i] + '\r\n';
    }
    labelText = labelText.slice(0, -2);
    enteredLabelSet.value = labelText;
    submitButtonClicked();
    addShortcutFunctionality();

    if (settings.paginationValue == 0){
        pagination0.selected = true;
    }
    else if (settings.paginationValue == 1){
        pagination1.selected = true;
    }
    else if (settings.paginationValue == 2){
        pagination2.selected = true;
    }
    else if (settings.paginationValue == 3){
        pagination3.selected = true;
    }
    changePaginationOption();

    if (multilabel == true){
        multilabelSwitch.checked = true;
    }

    if (settings.hideSettings == true){
        settingSwitch.hidden = true;
    }
}

//warning before closing the window
function goodbye(e) {
    if (saveToLocalStorage){
        saveDataToLocalStorage();
    }
    else {
        if(!e) e = window.event;
        //e.cancelBubble is supported by IE - this will kill the bubbling process.
        e.cancelBubble = true;
        e.returnValue = 'You sure you want to leave?'; //This is displayed on the dialog
    
        //e.stopPropagation works in Firefox.
        if (e.stopPropagation) {
            e.stopPropagation();
            e.preventDefault();
        }
    }
}
window.onbeforeunload = goodbye;

// keyboard shortcuts for the navigation buttons
document.onkeyup = function(e){
    if (e.which == 37 || e.keyCode == 37){
        textBackwardButton.click();
    }
    if (e.which == 39 || e.keyCode == 39){
        textForwardButton.click();
    }
}