import { useRef, useState } from "react";
import DynamicMap from "./Map/DynamicMap";
import { PlaceInfoType } from "./Map/interfaceTypes";
import MapLoader from "./Map/MapLoader";
import PlaceMarker from "./Map/PlaceMarker";
import SearchLocationUI from "./Map/SearchLocationUI";

const App = () => {
    const [place, setPlace] = useState<PlaceInfoType[]>([]);
    const [placeId, setPlaceId] = useState("");
    return (
        <div>
            <MapLoader>
                <DynamicMap>
                    <SearchLocationUI
                        updatePlace={(place) => setPlace(place)}
                        updateId={(placeId) => setPlaceId(placeId)}
                    />
                    <PlaceMarker placeInfos={place} selectedPlaceId={placeId}/>
                </DynamicMap>
            </MapLoader>
        </div>
    );
};

export default App;
