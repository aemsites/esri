import {
    loadScript,
  } from '../../scripts/aem.js';

export default function decorate(block) {


return loadScript('https://js.arcgis.com/4.9/').then((res) => {
    // document.addEventListener("DOMContentLoaded", function() {
        console.log('inside bloop')
        var arcgis_node = document.createElement("script");
        // arcgis_node.addEventListener("load", function() {
        loadMap();
        // });
        console.log('after loading map')
        // document.getElementsByTagName("body")[0].appendChild(arcgis_node);
        block.appendChild(arcgis_node);
        console.log('after appending body', document.getElementsByTagName("body")[0])
        var extractGeoJSON = function(dataArr){
        return new Promise(function(resolve, reject){
        
            var esriData = dataArr.data.map(function(item, idx){
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
            var apiData = axios.get(
            "https://dpa.esri.com/api/get-distributor-list-belongs-to/americas"
            );
            
            apiData.then(function(ret){
                console.log('this is apiData', ret)
            // Renderer for Exri Europe Locations
            // var rawGraphics = await extractGeoJSON(ret);
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
            var basemap = new Basemap({
                portalItem: {
                id: "2e331e9a2c6a4b9280d10e29261ff3e0" // custome basemap
                }
            });
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
                // alignment: 'top-center',
                dockEnabled: false,
                dockOptions: {
                    // Disables the dock button from the popup
                    buttonEnabled: false,
                    // Ignore the default sizes that trigger responsive docking
                    breakpoint: true
                }
                }
            });
            view.constraints = {
                maxZoom: 5,
                minZoom: 1
            };
            console.log('this is the view', view)
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
    // block.append(footer);
}

