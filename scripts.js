mapboxgl.accessToken = 'pk.eyJ1IjoiaHVkaW5oIiwiYSI6ImNtdG8xdzVwMDBwZnkyenM3bHN3bTdodmIifQ.GclqCq-2pfrrZnPUlAJBxQ';

    // 1. MAP SETUP
    // set up Mapbox map (create a new instance of the class Map)
    const map = new mapboxgl.Map({
        container: 'map', // For finding the div with id "map" to put our container in
        center: [-73.969429,40.665306], // >> later on change this to user's location
        style: 'mapbox://styles/hudinh/cmth1cebu006x01sacb4j5pu0',
        projection: 'globe',
        zoom: 13,
    });


    // 2. CONTROLS
    // create a new geolocate instance and store it in geolocate
    // refer to GeolocateControl here: https://docs.mapbox.com/mapbox-gl-js/api/markers/
    const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true, // if true the GeolocateControl becomes a toggle button, 
        // and when on the user's location is actively monitored for changes
        showUserHeading: true
    });

    map.addControl(geolocate);

    // add directions interface to map 
    // refer to tutorial here: https://docs.mapbox.com/mapbox-gl-js/example/mapbox-gl-directions/ 
    const directions = new MapboxDirections({
            accessToken: mapboxgl.accessToken, 
            unit: 'metric',
            profile: 'mapbox/walking',
            interactive: false,
            controls: {
                inputs: true,
                instructions: true
            }
        });

    map.addControl(directions, 'top-right');


    // 3. STATES
    // create object to store tree states
    const treeState = {
        '01': 'unvisited', 
        '02': 'unvisited',
        '03': 'unvisited'
    }; 

    // create object to store tree data
    const treeData = {
        '01': { commonName: 'Sweet Birch', scientificName: 'Betula lenta' },
        '02': { commonName: 'Gray Birch', scientificName: 'Betula populifolia' },
        '03': { commonName: 'American Hornbeam', scientificName: 'Carpinus caroliniana' }
    };

    // create variable to store current popup
    let currentPopup = null;


    // 4. HELPER FUNCTIONS
    // function to generate and return the popup HTML string
    function getPopupHTML(treeId) {
        const treeCommonName = treeData[treeId].commonName;
        const treeScientificName = treeData[treeId].scientificName;
        const state = treeState[treeId]

        if (state === 'visited') {
            return `
                <div class="popup-card">
                    <h3>${treeCommonName}</h3>
                    <h3><em>${treeScientificName}</em></h3>
                    <div class="clue-images">
                        <img src="./images/clue-${treeId}_01.jpg" alt="Clue 1 Illustration"/>
                        <img src="./images/clue-${treeId}_02.jpg" alt="Clue 2 Illustration"/>
                    </div>
                    <audio controls>
                        <source src="./audio/audio-${treeId}.mp3" type="audio/mpeg">
                    </audio>
                    <button class="compare-btn">
                        Compare Notes
                    </button>
                </div>
            `;
            } else {
                return `
                    <div class="popup-card">
                        <h3>${treeCommonName}</h3>
                        <h3><em>${treeScientificName}</em></h3>
                        <div class="clue-images">
                            <img src="./images/clue-${treeId}_01.jpg" alt="Clue 1 Illustration"/>
                            <img src="./images/clue-${treeId}_02.jpg" alt="Clue 2 Illustration"/>
                        </div>
                        <audio controls>
                            <source src="./audio/audio-${treeId}.mp3" type="audio/mpeg">
                        </audio>
                        <button class="target-btn">
                            Take me there
                        </button>
                        <button class="visited-btn">
                            Finish observing
                        </button>
                    </div>
                `
            }
        }

    // function to attach event listeners to popup buttons - called whenever popup HTML is set or updated
    function attachPopupListeners(treeId) {
        const compareBtn = document.querySelector('.compare-btn');
        const targetBtn = document.querySelector('.target-btn');
        const visitedBtn = document.querySelector('.visited-btn');

        // if (btn) checks on each button in case it's null and null.addEventListener would throw an error
        if (compareBtn) {
            compareBtn.addEventListener('click', () => showCompareNotes(treeId));
        }
        if (targetBtn) {
            targetBtn.addEventListener('click', () => updateTreeState(treeId, 'target'));
        }
        if (visitedBtn) {
            visitedBtn.addEventListener('click', () => updateTreeState(treeId, 'visited'));
        }
    }
     
    // function that updates the popup to show botanical notes
    // called by the compare button listener
    function showCompareNotes(treeId) {
        const notes = {
            '01': `
                <h4>Sweet Birch Notes</h4>
                <p><strong>Habit:</strong> Oval, Pyramidal</p>
                <p><strong>Size:</strong> Medium-sized tree, 40'-50'</p>
                <p><strong>Bark:</strong> 
                    <ul>
                        <li>Reddish brown with horizontal lenticels on young trees.</li>
                        <li>Bark on older trunk is gray to blackish and cracks into scaly plates.</li> 
                        <li>Twigs are reddish brown with small white lenticels.</li>
                    </ul>
                </p>
                <p><strong>Leaf:</strong> 
                    <ul>
                        <li>Shape: Ovate to elliptical</li>
                        <li>Division: Simple</li>
                        <li>Arrangement: Alternate</li>
                        <li>Margin: Serrate</li>
                        <li>Texture/Venation: Clearly impressed parallel veins</li>
                        <li>Size: 2"-4" long</li>
                    </ul>
                </p>
            `,
            '02': `
                <h4>Gray Birch Notes</h4>
                <p><strong>Habit:</strong> Oval with an open and airy canopy that easily 
                    flutters like the poplar tree</p>
                <p><strong>Size:</strong> Small-medium tree, 20'-40'</p>
                <p><strong>Bark:</strong>
                    <ul>
                        <li>Grayish white bark, darker gray on old trees</li>
                        <li>Smooth, no peeling (unlike Paper Birch)</li>
                        <li>Black trianglar patches where branch meets trunk</li>
                    </ul>
                </p>
                <p><strong>Leaf:</strong>
                    <ul>
                        <li>Color: Dark green above, pale below</li>
                        <li>Shape: Broadly triangular, ovate-deltoid with elongated and 
                            sharply pointed tip. Long and slender petiole allows leaf 
                            to flutter easily</li>
                        <li>Division: Simple</li>
                        <li>Arrangmenet: Alternate</li>
                        <li>Margin: Doubly serrate</li>
                        <li>Texture/Venation: shiny above, parallel veins</li>
                        <li>Size: 2"-3.5" long</li>
                    </ul>
                </p>
            `,
            '03': `
                <h4>American Hornbeam Notes</h4>
                <p><strong>Habit:</strong> Round, flat-topped</p>
                <p><strong>Size:</strong> Small-medium tree, 20'-35'</p>
                <p><strong>Bark:</strong>
                    <ul>
                        <li>Smooth, light to medium gray</li>
                        <li>Fluted, sinewy trunk that looks like muscles</li>
                        <li>Stem is slender, smooth, dark red-brown and are dotted with 
                            tan lenticels</li>
                    </ul>
                </p>
                <p><strong>Leaf:</strong>
                    <ul>
                        <li>Shape: Ovate, elliptical</li>
                        <li>Division: Simple</li>
                        <li>Arrangmenet: Alternate</li>
                        <li>Margin: Serrate</li>
                        <li>Texture/Venation: Prominent parallel veins giving a 
                            corrugated texture</li>
                        <li>Size: 2"-5.5" long</li>
                    </ul>
                </p>
            `
        };

        if (currentPopup) {
            currentPopup.setHTML(`
                <div class="popup-card">
                    <h3>Compare Notes</h3>
                    ${notes[treeId]}
                </div>
            `);

            // whenever setHTML is called, it replaces the DOM and wipes out any previously attached listeners
            // -> call attachPopupListeners immediately after setHTML
            attachPopupListeners(treeId); 
        }
    }


    // 5. STATE UPDATE FUNCTION
    // create function to update tree state based on user interactions
    function updateTreeState (treeId, newState) {
        treeState[treeId] = newState;

        // if this tree is now the target, set it as the destination in directions
        if (newState === 'target') {
            // retrieve tree coordinates from source features
            // querySourceFeatures is a Mapbox-specific method on the map instance
            // read more about it here: https://docs.mapbox.com/mapbox-gl-js/api/map/#map#querysourcefeatures
            const features = map.querySourceFeatures('mapbox://hudinh.14wp2kyfcfk6', {
                sourceLayer: '68bb5b17bca5650c9abe',
                filter: ['==', 'Tree ID', treeId]
            });

            // (features.length > 0) -> defensive programming for cases where the query returns zero results
            if (features.length > 0) {
                const coords = features[0].geometry.coordinates;
                directions.setDestination(coords);
            }
        }

        // keep popup content in sync with tree state if popup's open 
        // so that users don't have to close and open popup again 
        // (eg: after users click 'Finish Observing' to reveal 'Compare Notes' button)
        // setHTML replaces the popup's current HTML content with the new string
        // getPopupHTML - custom function to generate new HTML string based on the current state
        if (currentPopup && currentPopup.isOpen()) {
            currentPopup.setHTML(getPopupHTML(treeId));
        }
        
        // attach popup listeners after setHTML is called
        attachPopupListeners(treeId);

        // update icon colors based on new state
        // setLayoutProperty syntax: map.setLayoutProperty(layerId, name, value)
        map.setLayoutProperty('tree-location-icons', 'icon-image', [
            'image',
                'Tree Location Marker',
                {
                    'params': {
                        'color-1': '#f2f2e9',
                        'color-2': [
                            'match', // operator - like a switch statement
                            ['get', 'Tree ID'], // input - get the Tree ID property from each feature
                            '01', treeState['01'] === 'target' ? '#1b25f2' :
                                  treeState['01'] === 'visited' ? '#8B91F8' : '#a7a8a9',
                            '02', treeState['02'] === 'target' ? '#1b25f2' :
                                  treeState['02'] === 'visited' ? '#8B91F8' : '#a7a8a9',
                            '03', treeState['03'] === 'target' ? '#1b25f2' :
                                  treeState['03'] === 'visited' ? '#8B91F8' : '#a7a8a9',
                            '#a7a8a9'                              
                        ]
                    }
                }
        ]);

        map.setLayoutProperty('tree-icons', 'icon-image', [
            'image', 
                ['match', ['get', 'Tree ID'],
                    '01', treeState['01'] === 'target' || 
                          treeState['01'] === 'visited' ? 
                          'Sweet Birch' : 'Number 1',
                    '02', treeState['02'] === 'target' || 
                          treeState['02'] === 'visited' ? 
                          'Gray Birch' : 'Number 2',
                    '03', treeState['03'] === 'target' || 
                          treeState['03'] === 'visited' ? 
                          'American Hornbeam' : 'Number 3',
                    'Question Mark'
                ],
                {
                    'params': {
                        'color-1': '#f2f2e9',
                        'color-2':  [
                            'match', ['get', 'Tree ID'], 
                            '01', treeState['01'] === 'target' ? '#1b25f2' :
                                  treeState['01'] === 'visited' ? '#8B91F8' : '#a7a8a9',
                            '02', treeState['02'] === 'target' ? '#1b25f2' :
                                  treeState['02'] === 'visited' ? '#8B91F8' : '#a7a8a9',
                            '03', treeState['03'] === 'target' ? '#1b25f2' :
                                  treeState['03'] === 'visited' ? '#8B91F8' : '#a7a8a9',
                            '#a7a8a9'
                        ]
                    }
                }
        ]);
    };

    
    // 6. MAP LOAD
    // .on() method - registers an event listener -> Mapbox's equivalent of JS's addEventListener
    map.on('load', () => {
        // log sources and trees layer to help debug
        console.log('Sources:', map.getStyle().sources);
        console.log('Trees layer:', map.getStyle().layers.find(l => l.id === 'trees'));

        // create an event listener for the geolocate control
        // when users click geolocate, their location will be put in the origin of directions 
        geolocate.on('geolocate', (e) => {
            const lon = e.coords.longitude;
            const lat = e.coords.latitude;
            directions.setOrigin([lon, lat]);
        });

        // clear icon from the original 'trees' layer that was set up in Mapbox Studio
        map.setLayoutProperty('trees', 'icon-image', '');

        // Layer 1 — marker base
        map.addLayer({
            'id': 'tree-location-icons',
            'type': 'symbol',
            'source': 'mapbox://hudinh.14wp2kyfcfk6',
            'source-layer': '68bb5b17bca5650c9abe',
            'layout': {
                'icon-image': [
                    'image', 
                        'Tree Location Marker',
                        {
                            'params': {
                                'color-1': '#f2f2e9',
                                'color-2': '#a7a8a9'
                            }
                        }
                ],
                'icon-size': [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    10,
                    0.1,
                    14,
                    0.25
                    ],
                'icon-allow-overlap': true,
            }
        });

        // Layer 2 - tree icons
        map.addLayer({
            'id': 'tree-icons',
            'type': 'symbol',
            'source': 'mapbox://hudinh.14wp2kyfcfk6',
            'source-layer': '68bb5b17bca5650c9abe',
            'layout': {
                'icon-image': [
                    'image',
                    ['match', ['get', 'Tree ID'],
                        '01', 'Number 1',
                        '02', 'Number 2',
                        '03', 'Number 3',
                        'Question Mark',
                    ],
                    {
                        'params': {
                            'color-1': '#a7a8a9'
                        }
                    }
                ],
                'icon-size': [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    10,
                    0.2,
                    14,
                    0.3
                    ],
                'icon-allow-overlap': true,
                'icon-offset': [1,1]
            }, 
            'paint': {
                'icon-opacity': [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    13, 0,
                    14, 1
                    ],
            }
        });

        // add click interaction for popups
        // addInteraction is similar to addEventListener
        // it listens for an event and then runs a callback function
        // it's designed specifically for map interactions as it understands Mapbox layers and features
        map.addInteraction('feature-click', {
            type: 'click', 
            target: { layerId: 'tree-location-icons' }, 
            // handler is a property whose value is a function
            // handler(e) is shorthand for handler: (e) => {}
            // e is the event object that Mapbox passes to the function automatically when the click happens
            // e is just a naming convention, not standard syntax -> can change this to event or anything
            handler(e) { 
                console.log('properties:', e.feature.properties);
                // get the clicked tree's properties
                const treeId = e.feature.properties['Tree ID'];
                const treeCommonName = e.feature.properties['Common Name'];
                const treeScientificName = e.feature.properties['Scientific Name']
                const coordinates = e.feature.geometry.coordinates.slice();

                if (currentPopup) {
                    currentPopup.remove();
                }
                // create and show popup
                currentPopup = new mapboxgl.Popup({offset: 25, anchor: 'bottom'})
                    .setLngLat(coordinates)
                    .setHTML(getPopupHTML(treeId))
                    .addTo(map);

                // attach popup listeners after setHTML is called
                attachPopupListeners(treeId);
            }
        });

        // Mouse enter cursor change
        map.addInteraction('enter-tree', {
            type: 'mouseenter',
            target: { layerId: 'tree-location-icons' }, 
            handler(e) {
                map.getCanvas().style.cursor = 'pointer'
            }
        });

        // Mouse leave cursor change
        map.addInteraction('leave-tree', {
            type: 'mouseleave',
            target: { layerId: 'tree-location-icons'},
            handler(e) {
                map.getCanvas().style.cursor = ''
            }
        })
    })