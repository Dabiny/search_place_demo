// 맵준비 하기
// https://apis.map.kakao.com/web/guide/

import { ReactNode, useEffect, useState } from "react";

const KAKAO_MAP_SCRIPT_ID = 'kakao-map-script';
const KAKAO_MAP_APP_KEY = process.env.KAKAO_MAP_KEY; // kakao 발급 키

// props.children 타입정의해주기
interface KakaoMapScriptLoaderProps {
    children: ReactNode;
};

const MapLoader = (props: KakaoMapScriptLoaderProps) => {
    // 로딩 확인 유무
    const [mapScriptLoaded, setMapScriptLoaded] = useState(false);

    useEffect(() => {
        const mapScript = document.getElementById(KAKAO_MAP_SCRIPT_ID);
        if (mapScript && !window.kakao) return; // 예외처리

        const script = document.createElement('script');
        script.id = KAKAO_MAP_SCRIPT_ID;
        // url parameter로 장소를 검색하기위해 appkey뒤에도 param추가하여 명시해준다. 
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_APP_KEY}&libraries=services&autoload=false`;
        script.onload = () => {
            window.kakao.maps.load(() => {
                setMapScriptLoaded(true);
            })
        };
        script.onerror = () => {
            // load 실패시 
            setMapScriptLoaded(false);
        }

        document.getElementById('root')?.appendChild(script);
    }, []);

    return (
        <>
            {
                mapScriptLoaded ? props.children : (
                    <p>지도 로딩실패</p>
                )
            }
        </>
    )
}

export default MapLoader;