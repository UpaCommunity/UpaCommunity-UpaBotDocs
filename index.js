window.onload = async() => {
    let rootDocs = document.getElementById("body__docs")
    let getDocs = await axios.get("./src/util/DocsEs.json");
    getDocs.data.forEach((get) => {
        if(get.docsShow === true) {
            let getSubsDocs = get.docsRoutes.map((getSub) => `<div class="docs__item_subItem" onclick="window.location='#${getSub.routeUrl}'"><i class='bx bx-chevrons-right'></i> ${get.docsId}.${getSub.routeId}- ${getSub.routeName}</div>`).join("")
            rootDocs.innerHTML += `
                <div class="docs__item">
                    <div class="docs__item_name" onclick="docsSubs(${get.docsId})"><i class='bx bx-chevron-right'></i>  ${get.docsId}- ${get.docsName}</div>
                    <div class="docs__item_subs" id="docsSubs_${get.docsId}">
                        ${getSubsDocs}
                    </div>
                </div>
            `
            }
    });
};

async function docsSubs(itemSub) {
    let getSubs = document.getElementById(`docsSubs_${itemSub}`)
    getSubs.classList.toggle("inUse");
};

const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
};

const handleLocation = async() => {
    const getPath = window.location.hash; let path = getPath.replace("#", "");
    const getDocsData = await axios.get("./src/util/DocsEs.json");
    let getDocs; getDocsData.data.forEach((find, i) => {
        let findUwu = find.docsRoutes.find((fin) => fin.routeUrl === path);
        if(findUwu) {
            return getDocs = {
                dataDocs: find.docsRoutes.find((fin) => fin.routeUrl === path),
                dataIndex: i
            };
        }
    });
    if(!getDocs) {
        window.location = "#/es/inicial/bienvenida"
    }

    document.getElementById("router__name").innerHTML = `<i class='bx bxs-chevrons-right'></i> ${getDocsData.data[getDocs.dataIndex].docsName}`;
    document.getElementById("root__name").innerHTML = `<i class='bx bxs-chevron-right'></i> ${getDocs.dataDocs.routeName}`;
    document.getElementById("content__namePrev").innerHTML = `${getDocs.dataDocs.routeNamePrev}`;
    document.getElementById("content__nameNext").innerHTML = `${getDocs.dataDocs.routeNameNext}`;

    if(getDocs.dataDocs.routeUrlPrev === "false") {
        document.getElementById("buttons__prev").href = `#${getDocs.dataDocs.routeUrl}`;
    } else {
        document.getElementById("buttons__prev").href = `#${getDocs.dataDocs.routeUrlPrev}`;
    }
    if(getDocs.dataDocs.routeUrlNext === "false") {
        document.getElementById("buttons__next").href = `#${getDocs.dataDocs.routeUrl}`;
    } else {
        document.getElementById("buttons__next").href = `#${getDocs.dataDocs.routeUrlNext}`;
    }

    // Cargado Guia
    document.getElementById("root__page").innerHTML = "";
    await axios.get(`./src/pages/Docs_${getDocs.dataIndex}.${getDocs.dataDocs.routeId}.html`).then((data) => {
        document.getElementById("root__page").innerHTML = data.data;
    }).catch((e) => {
        document.getElementById("root__page").innerHTML = "No fue posible cargar la documentacion.";
    })
}

window.onpopstate = handleLocation;
window.route = route;

handleLocation();