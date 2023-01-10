import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useMap } from "../hooks/useMap";
import { PlaceInfoType } from "./interfaceTypes";
import  ReactDOM  from "react-dom";
import styled from "@emotion/styled";

interface MarkerProps {
    place: PlaceInfoType;
    showInfo?: boolean;
    index: number;
}

const MARKER_IMAGE_URL =
    "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png";

// Marker 기능
// 1. Mark 핀 표시
// 2. 핀 위에 위치 정보 표시
const Marker = (props: MarkerProps) => {
    const infoContainer = useRef(document.createElement("div"));
    const map = useMap();
    // 2. 핌 위에 위치 정보 표시
    const infoWindow = useMemo(() => {
        infoContainer.current.style.position = "absolute";
        infoContainer.current.style.bottom = '40px';

        // 오버레이 생성하여 반환
        return new kakao.maps.CustomOverlay({ 
            position: props.place.position,
            content: infoContainer.current,
            map: map
        });
    }, []);

    // 1. Mark 핀 표시
    const marker = useMemo(() => {
        const markSize = new kakao.maps.Size(36, 37);
        const markOptions = {
            spriteSize: new kakao.maps.Size(36, 691),
            spriteOrigin: new kakao.maps.Point(0, props.index * 46 + 10),
            offset: new kakao.maps.Point(13, 37),
        };
        const markerImage = new kakao.maps.MarkerImage(
            MARKER_IMAGE_URL,
            markSize,
            markOptions
        );
        
        // marker 생성
        const markerPoint = new kakao.maps.Marker({
            map: map,
            position: props.place.position,
            image: markerImage
        });

        kakao.maps.event.addListener(markerPoint, 'click', () => {
            // 위치 줌 조정
            map.setCenter(props.place.position);
            map.setLevel(1, {
                animate: true,
            });
            
            // TODO: 정보div 표시해주기
            infoWindow.setMap(map);
        })

        return markerPoint; // 마커 포인트 반환
    }, []);

    // 핀을 꽂고, 다시 서치하면 이전 핀이 여전히 꽂혀있음. 
    // useLayoutEffect로 마운트하기 전, 전에 있던 핀을 제거하고 다시 새롭게 핀을 꼽을 수 있게 해주기. 
    useLayoutEffect(() => {
        return () => {
            marker.setMap(null);
        }
    });

    // maker가 있어야 정보div를 붙일 수 있다. 
    useEffect(() => {
        if (props.showInfo) {
            infoWindow.setMap(map);
            return;
        }

        return () => {
            infoWindow.setMap(null);
        }
    }, [props.showInfo]);

    return infoContainer.current ? ReactDOM.createPortal(
        <Message onClick={() => infoWindow.setMap(null)}>
            <Title>{props.place.title}</Title>
            <Address>{props.place.address}</Address>
        </Message>
        ,   
        infoContainer.current
    ) : null;
};

export default Marker;

const Message = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: auto;

    margin-left: -90px;
    border-radius: 15px;
    border: 1px dash white;

    background-color: #8282ee;
    opacity: 0.9;
`;

const Title = styled.label`
    font-weight: bold;
    padding: 6px 8px;
`;

const Address = styled.div`
    font-size: 12px;
    padding: 0 6px 6px;
`;