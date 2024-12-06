// Sidebar Section
const menuBtn = document.querySelector(".menu-btn");
const sidebar = document.querySelector(".sidebar");

const dokumenteBar = document.getElementById("dokumente-bar").addEventListener("click", function(){
    dokumente.style.display = "block";
    suche.style.display = "none";
});
const sucheBar = document.getElementById("suche-bar").addEventListener("click", function(){
    dokumente.style.display = "none";
    suche.style.display = "block";
});
const favoritenBar = document.getElementById("favoriten-bar").addEventListener("click", function(){
    dokumente.style.display = "none";
    suche.style.display = "none";
});
const dokumenteBarIcon = document.querySelector(".bx-folder-open").addEventListener("click", function(){
    dokumente.style.display = "block";
    suche.style.display = "none";
});
const sucheBarIcon = document.querySelector(".bx-search-alt-2").addEventListener("click", function(){
    dokumente.style.display = "none";
    suche.style.display = "block";
});
const favoritenBarIcon = document.querySelector(".bx-bookmark-heart").addEventListener("click", function(){
    dokumente.style.display = "none";
    suche.style.display = "none";
});

menuBtn.addEventListener("click", function(){
    sidebar.classList.toggle("active");

    if(sidebar.classList.contains("active")){
        menuBtn.textContent = "chevron_left";
    } else{
        menuBtn.textContent = "chevron_right";
    }
});

// Popup Section
const dokumente = document.querySelector(".dokumente");
const suche = document.querySelector(".suche");
const popup = document.querySelector(".erstellen-popup");
const erstellenBtn = document.querySelector(".erstellen-button.grid");
const entfernBtn = document.querySelector(".entfernen-button");

const ordnerBtn = document.getElementById("ordner-btn");
const snippetBtn = document.getElementById("snippet-btn");

const ordnernamePopup = document.querySelector(".ordnername-popup");
const ordnernameEntfernBtn = document.querySelector(".ordnername-popup .entfern-button");
const fertigBtn = document.querySelector(".fertig-button");
const ordnernameInput = document.querySelector(".popup-input input");

const mainContent = document.querySelector(".main-container");
const filter = document.querySelector(".filter");
const ordnerName = document.getElementById("ordner-name");
const zurückBtn = document.getElementById("zurück-btn");

erstellenBtn.addEventListener("click", function(){
    popup.style.visibility = "visible";
});

entfernBtn.addEventListener("click", function(){
    popup.style.visibility = "hidden";
});

ordnerBtn.addEventListener("click", function(){
    popup.style.visibility = "hidden";
    ordnernamePopup.style.visibility = "visible";
});


window.addEventListener("DOMContentLoaded", ladeOrdner);

fertigBtn.addEventListener("click", function(){
    const ordnerName = ordnernameInput.value.trim();

    if(ordnerName === ""){
        alert("Bitte gib einen gültigen namen ein");
        return;
    }

    erstelleOrdner(ordnerName, mainContent);

    // Ordner im localStorage speichern
    let gespeicherteOrdner = JSON.parse(localStorage.getItem("ordner")) || [];
    gespeicherteOrdner.push({ name: ordnerName });
    localStorage.setItem("ordner", JSON.stringify(gespeicherteOrdner));

    ordnernamePopup.style.visibility = "hidden";
    ordnernameInput.value = "";
});

ordnernameEntfernBtn.addEventListener("click", function(){
    ordnernameInput.value = "";
    ordnernamePopup.style.visibility = "hidden";
});

function ladeOrdner(){
    const gespeicherteOrdner = JSON.parse(localStorage.getItem("ordner")) || [];
    gespeicherteOrdner.forEach(function(ordner){
        erstelleOrdner(ordner.name);
    });
};

// Funktion zum Laden eines Ordners
function erstelleOrdner(name, zielContainer = mainContent){

    const neuesGrid = document.createElement("div");
    neuesGrid.classList.add("grid");

    neuesGrid.innerHTML = `
    <img src="Assets/IMG_1750.PNG">
        <p>${name}</p>
        <div class="icons">
        <i class='bx bx-heart'></i><i class='bx bx-x'></i>
        </div>`;

    neuesGrid.querySelector("img").addEventListener("click", function () {
        let vorhandenerContainer = Array.from(document.querySelectorAll(".ordner-inhalt"))
            .find(container => container.dataset.name === name);

        if (vorhandenerContainer) {
            AnzeigenOrdnerContainer(vorhandenerContainer, name, dokumente);
        } else {
            const { container: neuerContainer } = erstelleOrdnerContainer(name);
            neuerContainer.setAttribute("data-name", name);
            AnzeigenOrdnerContainer(neuerContainer, name, dokumente);
        }
        sucheSnippets();
    });

    const löschButton = neuesGrid.querySelector(".bx-x");
    löschButton.addEventListener("click", function(){
        löscheOrdner(name, neuesGrid);
    });

    if (zielContainer && zielContainer.appendChild) {
        zielContainer.appendChild(neuesGrid);
    } else {
        console.error("Der Zielcontainer ist ungültig oder kein DOM-Element!");
    }
}

function löscheOrdner(name, ordnerElement){
    ordnerElement.remove();

    let gespeicherteOrdner = JSON.parse(localStorage.getItem("ordner")) || [];
    gespeicherteOrdner = gespeicherteOrdner.filter((ordner) => ordner.name !== name);
    localStorage.setItem("ordner", JSON.stringify(gespeicherteOrdner));
}

function addErstellenPopup(parent){
    const erstellenPopupDiv = document.createElement("div");
    erstellenPopupDiv.classList.add("erstellen-popup");
    erstellenPopupDiv.style.visibility = "visible";

    const entfernenButtonDiv = document.createElement("div");
    entfernenButtonDiv.classList.add("entfernen-button");

    const zurückIcon = document.createElement("i");
    zurückIcon.classList.add("bx", "bx-x");
    zurückIcon.addEventListener("click", function(){
        erstellenPopupDiv.remove();
    });

    const h3 = document.createElement("h3");
    h3.textContent = "Hinzufügen";

    const popupButtonsDiv = document.createElement("div");
    popupButtonsDiv.classList.add("popup-button");

    const ordnerBtn = document.createElement("button");
    ordnerBtn.classList.add("ordner-btn");
    ordnerBtn.textContent = "Ordner";
    ordnerBtn.addEventListener("click", function(){
        if(parent){
            alert("Du kannst derzeit keine Ordner in einen Ordner erstellen. Ich arbeite allerdings dran..");
            return;
        }
        erstellenPopupDiv.style.visibility = "hidden";
        erstellenPopupDiv.remove();
        addOrdnernamePopup(parent);
    });

    const iOrderBtn = document.createElement("i");
    iOrderBtn.classList.add("bx", "bx-folder");
    iOrderBtn.style.marginLeft = "5px";
    ordnerBtn.appendChild(iOrderBtn);

    const snippetBtn = document.createElement("button");
    snippetBtn.classList.add("snippet-btn");
    snippetBtn.textContent = "Snippet";
    snippetBtn.addEventListener("click", function(){
        erstelleSnippetPopup();
        erstellenPopupDiv.remove();
    })

    const isnippetBtn = document.createElement("i");
    isnippetBtn.classList.add("bx", "bxs-file-doc");
    isnippetBtn.style.marginLeft = "5px";
    snippetBtn.appendChild(isnippetBtn);

    entfernenButtonDiv.appendChild(zurückIcon);

    ordnerBtn.appendChild(iOrderBtn);

    popupButtonsDiv.appendChild(ordnerBtn);
    popupButtonsDiv.appendChild(snippetBtn);

    erstellenPopupDiv.appendChild(entfernenButtonDiv);
    erstellenPopupDiv.appendChild(h3);
    erstellenPopupDiv.appendChild(popupButtonsDiv);

    dokumente.insertAdjacentElement("beforeend", erstellenPopupDiv);
}

function addOrdnernamePopup(parent){
    const ordnernamePopupDiv = document.createElement("div");
    ordnernamePopupDiv.classList.add("ordnername-popup");
    ordnernamePopupDiv.style.visibility = "visible";

    const entfernbuttonDiv = document.createElement("div");
    entfernbuttonDiv.classList.add("entfern-button");

    const x = document.createElement("i");
    x.classList.add("bx", "bx-x");
    x.addEventListener("click", function(){
        ordnernamePopupDiv.remove();
    });

    const h3 = document.createElement("h3");
    h3.textContent = "Ordner benennen..";

    const popupInputDiv = document.createElement("div");
    popupInputDiv.classList.add("popup-input");

    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = "25";

    const button = document.createElement("button");
    button.classList.add("fertig-button");
    button.textContent = "Fertig";
    button.addEventListener("click", function(){
        const inputordnerName = input.value.trim();

        if(input.value === ""){
            alert("Gib einen gültigen Ordnernamen ein.");
            return;
        }
        ordnernamePopupDiv.remove();
        const { container } = erstelleOrdnerContainer(inputordnerName);
        AnzeigenOrdnerContainer(container, inputordnerName, parent);
        erstelleOrdner(inputordnerName, container);
    });

    entfernbuttonDiv.appendChild(x);

    popupInputDiv.appendChild(input);
    popupInputDiv.appendChild(button);

    ordnernamePopupDiv.appendChild(entfernbuttonDiv);
    ordnernamePopupDiv.appendChild(h3);
    ordnernamePopupDiv.appendChild(popupInputDiv);

    dokumente.appendChild(ordnernamePopupDiv);
}


// Ordner Section
let gespeicherterOrdnerInhalt;
    function erstelleOrdnerContainer(name) {
        const erstellenButtonDiv = document.createElement("div");
        erstellenButtonDiv.classList.add("erstellen-button-div");

        const NeuErstellenbuttonOrdnerDiv = document.createElement("div");
        NeuErstellenbuttonOrdnerDiv.classList.add("erstellen-button-ordner", "grid");
        NeuErstellenbuttonOrdnerDiv.addEventListener("click", function() {
            addErstellenPopup(NeuOrdnerInhalt);
        });

        const NeuH1 = document.createElement("h1");
        NeuH1.textContent = "+ Erstellen";

        const NeuOrdnerInhalt = document.createElement("div");
        NeuOrdnerInhalt.classList.add("ordner-inhalt");
        NeuOrdnerInhalt.style.display = "Grid";

        zurückBtn.addEventListener("click", function(){
            erstellenButtonDiv.remove();
        });

    erstellenButtonDiv.appendChild(NeuErstellenbuttonOrdnerDiv);
    NeuErstellenbuttonOrdnerDiv.appendChild(NeuH1);
    mainContent.insertAdjacentElement("afterend", erstellenButtonDiv)

    gespeicherterOrdnerInhalt = NeuOrdnerInhalt;
    return { container: NeuOrdnerInhalt, name };
}

let aktuellerOrdner = null;

function AnzeigenOrdnerContainer(ordnerContainer, name, parent){
    aktuellerOrdner = JSON.parse(localStorage.getItem("ordner"))
        .find(ordner => ordner.name === name);

    let erstellenButtonDiv = document.querySelector(".erstellen-button-div");

    if (!erstellenButtonDiv) {
        const neuerErstellenButtonDiv = document.createElement("div");
        neuerErstellenButtonDiv.classList.add("erstellen-button-div");

        const NeuErstellenbuttonOrdnerDiv = document.createElement("div");
        NeuErstellenbuttonOrdnerDiv.classList.add("erstellen-button-ordner", "grid");
        NeuErstellenbuttonOrdnerDiv.addEventListener("click", function () {
            addErstellenPopup(ordnerContainer);
        });

        const NeuH1 = document.createElement("h1");
        NeuH1.textContent = "+ Erstellen";

        NeuErstellenbuttonOrdnerDiv.appendChild(NeuH1);
        neuerErstellenButtonDiv.appendChild(NeuErstellenbuttonOrdnerDiv);

        mainContent.insertAdjacentElement("afterend", neuerErstellenButtonDiv);
    }
    parent.appendChild(ordnerContainer);

    mainContent.style.display = "none";
    filter.style.display = "none"
    ordnerContainer.style.display = "grid";

    ordnerName.textContent = name;
    zurückBtn.style.display = "block";

    zurückBtn.onclick = null;
    zurückBtn.addEventListener("click", function(){
        zurückBtn.style.display = "none";
        mainContent.style.display = "grid";
        filter.style.display = "";
        ordnerContainer.style.display = "none";

        ordnerName.textContent = "Dokumente";

        const vorhandenerErstellenButtonDiv = document.querySelector(".erstellen-button-div");
        if (vorhandenerErstellenButtonDiv) {
            vorhandenerErstellenButtonDiv.remove();
        }
        sucheSnippets();
    });

    ladeSnippets(name, ordnerContainer);
}
    
// Snippet Section
function erstelleSnippet(name, parentelement, codeblockcode, kurztextInput){
    const snippetContainerDiv = document.createElement("div");
    snippetContainerDiv.classList.add("snippet-container");

    const beschreibungDiv = document.createElement("div");
    beschreibungDiv.classList.add("beschreibung");

    const detailsDiv = document.createElement("div");
    detailsDiv.classList.add("details-div");

    const h1 = document.createElement("h1");
    h1.textContent = name;

    const entfernenDiv = document.createElement("div");
    entfernenDiv.classList.add("lösch-snippet-btn");

    const favorisierenI = document.createElement("i");
    favorisierenI.classList.add("bx", "bx-heart");

    const x = document.createElement("i");
    x.classList.add("bx", "bx-x");
    x.addEventListener("click", function(){
        const aktuellerOrdnerName = ordnerName.textContent;
        const snippetName = name;
        snippetContainerDiv.remove();

        const istSucheContainer = parentelement.classList.contains("suche-container");

        if (istSucheContainer){
            löscheSnippetInSuche(snippetName);
        } else{
            löscheSnippet(name, aktuellerOrdnerName);
        }
    });

    const p = document.createElement("p");
    p.textContent = kurztextInput.value;

    const pre = document.createElement("pre");
    pre.classList.add("code-section")

    const code = document.createElement("code");
    code.classList.add("language-javascript");
    code.id = "code-block";

    code.textContent = codeblockcode.value;
    hljs.highlightElement(code);

    entfernenDiv.appendChild(favorisierenI);
    entfernenDiv.appendChild(x);

    detailsDiv.appendChild(h1);
    detailsDiv.appendChild(entfernenDiv);

    beschreibungDiv.appendChild(detailsDiv);
    beschreibungDiv.appendChild(p);

    pre.appendChild(code);

    snippetContainerDiv.appendChild(beschreibungDiv);
    snippetContainerDiv.appendChild(pre);
    
    parentelement.appendChild(snippetContainerDiv);
}

function erstelleSnippetPopup(){
    const snippetPopupDiv = document.createElement("div");
    snippetPopupDiv.classList.add("snippet-Popup");
    snippetPopupDiv.style.visibility = "visible";

    const entfernenButtonDiv = document.createElement("div");
    entfernenButtonDiv.classList.add("entfernen-button");

    const zurückIcon = document.createElement("i");
    zurückIcon.classList.add("bx", "bx-x");
    zurückIcon.addEventListener("click", function(){
        snippetPopupDiv.remove();
    });

    entfernenButtonDiv.appendChild(zurückIcon);

    const snippetBeschreibungDiv = document.createElement("div");
    snippetBeschreibungDiv.classList.add("snippet-beschreibung");

    const titelInput = document.createElement("input");
    titelInput.type = "text";
    titelInput.id = "snippet-titel";
    titelInput.placeholder = "Neuer Titel..";
    titelInput.maxLength = "30";

    const kurztextInput = document.createElement("input");
    kurztextInput.type = "text";
    kurztextInput.id = "snippet-kurztext";
    kurztextInput.placeholder = "Kurze Beschreibung..";
    kurztextInput.maxLength = "40";

    snippetBeschreibungDiv.appendChild(titelInput);
    snippetBeschreibungDiv.appendChild(kurztextInput);

    const snippetCodeDiv = document.createElement("div");
    snippetCodeDiv.classList.add("snippet-code");

    const textArea = document.createElement("textarea");
    textArea.classList.add("code-input");
    textArea.placeholder = "Füge hier dein Code Snippet ein..";

    const speichernButton = document.createElement("button");
    speichernButton.classList.add("snippet-fertig");
    speichernButton.textContent = "Speichern";
    speichernButton.addEventListener("click", function(){
        const snippetName = titelInput.value.trim();
    
        if(textArea.value === "" || titelInput.value === "" || kurztextInput.value === ""){
            alert("Bitte fülle alle Daten aus.")
            return;
        }
    
        const aktuellerOrdnerName = ordnerName.textContent;
        
        let gespeicherteOrdner = JSON.parse(localStorage.getItem("ordner")) || [];
        
        let aktuellerOrdnerIndex = gespeicherteOrdner.findIndex(o => o.name === aktuellerOrdnerName);
    
        if (aktuellerOrdnerIndex !== -1) {
            
            if (!gespeicherteOrdner[aktuellerOrdnerIndex].snippets) {
                gespeicherteOrdner[aktuellerOrdnerIndex].snippets = [];
            }
    
            gespeicherteOrdner[aktuellerOrdnerIndex].snippets.push({
                name: snippetName,
                kurztext: kurztextInput.value,
                code: textArea.value
            });

            localStorage.setItem("ordner", JSON.stringify(gespeicherteOrdner));
    
            erstelleSnippet(snippetName, gespeicherterOrdnerInhalt, textArea, kurztextInput);
            snippetPopupDiv.remove();
        } else {
            alert("Fehler: Ordner nicht gefunden");
        }
    });

    snippetCodeDiv.appendChild(textArea);
    snippetCodeDiv.appendChild(speichernButton);

    snippetPopupDiv.appendChild(entfernenButtonDiv);
    snippetPopupDiv.appendChild(snippetBeschreibungDiv);
    snippetPopupDiv.appendChild(snippetCodeDiv);

    dokumente.appendChild(snippetPopupDiv);
}

function ladeSnippets(ordnerName, ordnerContainer) {
    const vorhanndeneSnippets = document.querySelectorAll(".snippet-container");
    vorhanndeneSnippets.forEach(snippet => snippet.remove());

    const gespeicherteOrdner = JSON.parse(localStorage.getItem("ordner")) || [];
    const aktuellerOrdner = gespeicherteOrdner.find(o => o.name === ordnerName);

    if (aktuellerOrdner && aktuellerOrdner.snippets) {
        aktuellerOrdner.snippets.forEach(function(snippet) {
            /*const parentElement = document.querySelector(".ordner-inhalt");
            erstelleSnippet(snippet.name, parentElement, { value: snippet.code }, { value: snippet.kurztext });*/
            erstelleSnippet(
                snippet.name, 
                ordnerContainer, 
                { value: snippet.code }, 
                { value: snippet.kurztext }
            );
        });
    }
}

function löscheSnippet(snippetName, ordnerName) {
    let gespeicherteOrdner = JSON.parse(localStorage.getItem("ordner")) || [];
    
    let ordnerIndex = gespeicherteOrdner.findIndex(ordner => ordner.name === ordnerName);
    
    if (ordnerIndex !== -1) {
        // Snippets in diesem Ordner filtern
        if (gespeicherteOrdner[ordnerIndex].snippets) {
            gespeicherteOrdner[ordnerIndex].snippets = gespeicherteOrdner[ordnerIndex].snippets.filter(
                snippet => snippet.name !== snippetName
            );
            localStorage.setItem("ordner", JSON.stringify(gespeicherteOrdner));
        }
    }
}


// Such Section
const sucheContainer = document.querySelector(".suche-container");
const searchBtn = document.getElementById("search-btn");

function toggleKeineErgebnisse(show) {
    const keineErgebnisse = document.getElementById('keine-ergebnisse');
    const sucheContainer = document.querySelector('.suche-container');
    
    if (keineErgebnisse && sucheContainer) {
        if (show) {
            keineErgebnisse.style.display = 'block';
            sucheContainer.classList.add('no-results');
        } else {
            keineErgebnisse.style.display = 'none';
            sucheContainer.classList.remove('no-results');
        }
    }
}
// toggleKeineErgebnisse(true); // So anzeigen, wenn keine suchergebnisse gefunden
// toggleKeineErgebnisse(false); // So anzeigen, wenn suchergebnisse gefunden

function sucheSnippets(){
    const suchInput = document.getElementById("suche-input").value.toLowerCase().trim();
    const sucheContainer = document.querySelector(".suche-container");

    //vorherige Suchergebnisse löschen
    sucheContainer.innerHTML = "";

    let gefundeneSnippets = [];
    let AlleOrdner = JSON.parse(localStorage.getItem("ordner"));

    AlleOrdner.forEach(ordner => {
        if(ordner.snippets){
            const gefilterteSnippets = ordner.snippets.filter(snippet =>
                snippet.name.toLowerCase().includes(suchInput)
            );

            gefundeneSnippets = gefundeneSnippets.concat(gefilterteSnippets);
        }
    });

    if(gefundeneSnippets.length > 0){
        gefundeneSnippets.forEach(snippet => {
            erstelleSnippet(
                snippet.name,
                sucheContainer,
                { value: snippet.code },
                { value: snippet.kurztext }
            );
        });
        toggleKeineErgebnisse(false);
    } else{
        toggleKeineErgebnisse(true);
    }
}

function löscheSnippetInSuche(snippetName){
    let AlleOrdner = JSON.parse(localStorage.getItem("ordner")) || [];

    AlleOrdner.forEach(ordner => {
        if(ordner.snippets){
            ordner.snippets = ordner.snippets.filter(snippet =>
            snippet.name !== snippetName);
        }
    });
    localStorage.setItem("ordner", JSON.stringify(AlleOrdner));
    sucheSnippets();
}

window.addEventListener('DOMContentLoaded', sucheSnippets);

document.getElementById("suche-input").addEventListener("input", sucheSnippets);
document.getElementById("search-btn").addEventListener("click", sucheSnippets);
