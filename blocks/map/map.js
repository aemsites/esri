import {
    loadScript,
  } from '../../scripts/aem.js';

import { div } from '../../scripts/dom-helpers.js'

export default function decorate(block) {
return loadScript('https://js.arcgis.com/4.9/').then((res) => {
    
    const gridContainer = div({id: "grid-container"})
    const appWrapper = div({id: "eam-app-wrapper"})
    gridContainer.appendChild(appWrapper)
    const mapWrapper = div({id: "eam-map-wrapper"})
    appWrapper.appendChild(mapWrapper)
    const map = div({id: "eam-map" });

    mapWrapper.appendChild(map)

    block.append(gridContainer);

    loadMap();

    var extractGeoJSON = function(dataArr){
    return new Promise(function(resolve){
    
        var esriData = dataArr.map(function(item, idx){
        var geom = item.location.geometry.coordinates;
        var addr = ''
        if(item.address1){
            addr += item.address1 + ", "
        }
        if(item.address2){
            addr += item.address2 + ", "
        }
        if(item.address3){
            addr += item.address3 + ", "
        }
        if(item.city){
            addr += item.city + ", "
        }
        if(item.country){
            addr += item.country + ", "
        }

        var attributes = {
            objectId: idx,
            Distributor: item.distributorName,
            Country: item.country,
            Distributor_Address:addr,
            Distributor_Contact_Name:item.primaryContactFullName,
            Distributor_Phone_1:item.mainPhoneNumber,
            Distributor_Email:item.generalEmail,
            Distributor_Website:item.website
        };
        var retData = {
            attributes:attributes,
            geometry: {
            type: "point",
            y: geom[0] || 0,
            x: geom[1] || 0
            }
        };
        return retData;
        });
        resolve(esriData);
    });
    };

    function loadMap() {
    require([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/PopupTemplate",
        "esri/Basemap",
        "esri/layers/TileLayer",
        "esri/layers/VectorTileLayer",
        "esri/core/watchUtils"
    ], function(Map, MapView, FeatureLayer, PopupTemplate, Basemap, TileLayer, VectorTileLayer, watchUtils) {
        const url = "https://dpa.esri.com/api/get-distributor-list-belongs-to/americas"
        fetch(url, {
            method: "GET",
        })
        .then((res) => res.json())
        .then(function(ret){
        extractGeoJSON(ret).then(function(rawGraphics){
        
        var eamRenderer = {
            type: "simple",
            symbol: {
            type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
            size: 9,
            color: "#0079c1", //calcite 'blue'
            outline: {
                color: [0, 121, 193, 0.14901960784313725], //calcite 'blue'
                width: 8
            }
            }
        };

        var vtlLayer = new VectorTileLayer({
            // URL to the vector tile service
            style: {
            version: 8,
            sources: {
                esri: {
                type: "vector",
                url:
                    "https://clmaps.maps.arcgis.com/sharing/rest/content/items/e1ffbfe669e145f49013f5656850b4e1/resources/styles/root.json?f=pjson"
                }
            }
            }
        });

        var eamPopTemplate = {
            title: "<b>{Distributor}<b>",
            content:
            "<p><b>{Country}</b><br>" +
            '<a x-cq-linkchecker="skip" href="{Distributor_Website}" target="_blank" style="color:#0079c1">Visit Site</a><br>' +
            "<span>{Distributor_Contact_Name}</span><br>" +
            "<span>{Distributor_Phone_1}</span><br>" +
            '<a x-cq-linkchecker="skip" href ="mailto:{Distributor_Email}">{Distributor_Email}</a><br>' +
            "<span>{Distributor_Address}</span><br>" +
            "</p>"
        };

        //Esri European Regional Distributors locations FeatureLayer

        var keys = Object.keys(rawGraphics[0].attributes)
        
        var fields = keys.map(function(key){return{name:key, alias:key, type: key==='objectId'?'objectId':'string'}})
        var eamFL = new FeatureLayer({
            //url: "https://services1.arcgis.com/G84Qg78md8fRCEAD/arcgis/rest/services/ME_Countries_1/FeatureServer/0",
            fields:fields,
            source: rawGraphics,
            objectIdField: "objectId",
            renderer: eamRenderer,
            // outFields: ["*"],
            popupTemplate:eamPopTemplate
        });
            // eamFL.popupTemplate = eamPopTemplate;

        var map = new Map({});
        map.add(vtlLayer);
        map.add(eamFL);
        
        var view = new MapView({
            map: map,
            container: "eam-map",
            center: [],
            popup: {
            dockEnabled: false,
            dockOptions: {
                buttonEnabled: false,
                breakpoint: true
            }
            }
        });
        view.constraints = {
            maxZoom: 5,
            minZoom: 1
        };

        eamFL.when(function() {
            view.extent = eamFL.fullExtent.expand(1.4);
        });


        function fullScreen() {
            document
            .getElementById("eam-map-wrapper")
            .classList.toggle("is-fullscreen");
            document.getElementById("returnBtn").classList.toggle("btn-vis");
        }

        let classname = document.getElementsByClassName("fullscreen-btn");
        for (var i = 0; i < classname.length; i++) {
            classname[i].addEventListener("click", fullScreen, false);
        }

        })
        
        });
    });
    }
    })
}

