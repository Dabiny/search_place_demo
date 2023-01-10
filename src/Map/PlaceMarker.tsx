// 마커 생성하기 (검색 결과 목록과 마커를 표출하는 함수부분)
// https://apis.map.kakao.com/web/sample/keywordList/

import { useEffect } from "react";
import { useMap } from "../hooks/useMap";
import { PlaceInfoType } from "./interfaceTypes";
import Marker from "./Marker";
interface PlaceMarkerProps {
    placeInfos: PlaceInfoType[];
    selectedPlaceId: string;
}

//  mark를 찍기위한 필요정보 -> 1. 리스트, 2.
const PlaceMarker = (props: PlaceMarkerProps) => {
    const map = useMap();

    useEffect(() => {
        if (!props.placeInfos.length) return;

        const bounds = new kakao.maps.LatLngBounds();
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        props.placeInfos.forEach((item) => {
            bounds.extend(item.position);
        });

        map.setBounds(bounds); // map 위치 다시 지정하기
    }, [props.placeInfos]);

    return (
        <>
            {props.placeInfos.map((place, index) => {
                return (
                    <Marker
                        key={place.id}
                        place={place}
                        showInfo={props.selectedPlaceId === place.id}
                        index={index}
                    />
                );
            })}
        </>
    );
};

export default PlaceMarker;
