// 키워드로 장소검색하고 목록으로 표출하기
// https://apis.map.kakao.com/web/sample/keywordList/

import styled from "@emotion/styled";
import React, { useEffect, useRef, useState } from "react";
import { useMap } from "../hooks/useMap";
import { PlaceInfoType } from "./interfaceTypes";

interface SearchLocationUiProps{
    updatePlace: (place: PlaceInfoType[]) => void;
    updateId: (placeId: string) => void;
}

const SearchLocationUI = (props: SearchLocationUiProps) => {
    const [keyword, setKeyword] = useState("");
    const [places, setPlaces] = useState<PlaceInfoType[]>([]);
    const kakaoPlace = useRef<kakao.maps.services.Places | null>(null);

    const map = useMap(); // contextAPI 접근.

    useEffect(() => {
        if (kakaoPlace.current) return;
        kakaoPlace.current = new kakao.maps.services.Places();
    }, []);

    const searchKeyword = (keyword: string) => {
        if (!keyword.length) {
            alert("키워드를 입력해주세요");
            return;
        }
        if (!kakaoPlace.current) {
            alert("kakaoPlace error");
            return;
        }
        // 키워드로 검색한 검색결과 배열[{...}]을 반환한다.
        kakaoPlace.current.keywordSearch(keyword, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
                const placeInfos = result.map((value) => {
                    return {
                        id: value.id, // 장소 id
                        position: new kakao.maps.LatLng(
                            Number(value.y),
                            Number(value.x)
                        ), // 좌표
                        title: value.place_name, // 상호명
                        address: value.address_name, // 주소
                    };
                });
                props.updatePlace(placeInfos);
                setPlaces(placeInfos);
            }
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // 새로고침 금지
        searchKeyword(keyword);
    };

    const handleClickItem = (item: PlaceInfoType) => {
        map.setCenter(item.position);
        map.setLevel(1);
        props.updateId(item.id); // 클릭 item.id update
    }

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <Input
                    placeholder="검색장소를 입력해주세요 🔍"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </Form>
                <List>
                    {places.map((item, idx) => {
                        return (
                            <Item key={item.id} onClick={() => handleClickItem(item)}>
                                <label>
                                    {`${idx + 1}. `}
                                    {item.title}
                                </label>
                                <div className="address">{item.address}</div>
                            </Item>
                        );
                    })}
                </List>
        </Container>
    );
};

export default SearchLocationUI;

const Container = styled.div`
    position: absolute;
    z-index: 1;
    height: 90%;
    width: 350px;
    background: white;
    opacity: 0.7;
    border-radius: 5px;
    overflow-y: auto;

    @media screen and (max-width: 1000px) {
        height: 40%;
        width: 400px;
    }
`;

const Form = styled.form`
    display: flex;
    justify-content: center;

    position: sticky;
    top: 0;

    background: white;
    opacity: 1;
`;

const Input = styled.input`
    z-index: 2;

    width: 80%;
    minwidth: 200px;
    height: 50px;

    padding: 2px 10px 2px 20px;
    margin-top: 15px;
    margin-bottom: 15px;

    border: 2px gray solid;
    border-radius: 5px;

    font-size: 20px;

    @media screen and (max-width: 1000px) {
        height: 60px;
        font-size: 25px;
    }
`;



const List = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const Item = styled.li`
    display: flex;
    flex-direction: column;

    padding: 10px;
    border-bottom: 1px solid #d3d3d3;

    cursor: pointer;

    label {
        margin-bottom: 5px;
        font-weight: bold;
    }

    &: hover {
        background: #d2d2d2;
        opacity: 1;
        transition: background-color 0.1s;
    }
    @media screen and (max-width: 1000px) {
        font-size: 20px;
    }
`;
