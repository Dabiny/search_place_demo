// 지도 이동시키기
// https://apis.map.kakao.com/web/sample/moveMap/
import styled from "@emotion/styled";
import { ReactNode, useEffect, useRef, useState } from "react";
import { KakaoMapContext } from "../hooks/useMap";

interface DynamicMapProps {
    children: ReactNode;
}

const DynamicMap = (props: DynamicMapProps) => {
    const [map, setMap] = useState<kakao.maps.Map>();
    const kakaoMapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // 분기처리
        if(!kakaoMapRef.current) return;
        // if(!map) return;

        const targetPoint = new kakao.maps.LatLng(33.450701, 126.570667);
        const options = {
            center: targetPoint,
            level: 3, //확대 레벨
        };

        setMap(new window.kakao.maps.Map(kakaoMapRef.current, options));
    }, []);

    return (
      <>
        <Container>
            <Map ref={kakaoMapRef}/>
        </Container>
        {
            map ? (
                <KakaoMapContext.Provider value={map} >
                    {props.children}
                </KakaoMapContext.Provider>
            ) : (
                <div>
                    지도 정보를 가져오는데 실패하였습니다 ..
                </div>
            )
        }
      </>  
    )
};

export default DynamicMap;

const Container = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
`;

const Map = styled.div`
    position: static;
    width: 100%;
    height: 100%;
`;