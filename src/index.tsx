// entry point 만들기

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";


// 리액트의 루트파일을 잡아주기
// 명시적이게 HTMLElement라고as로 강제 형변환 시켜주기
const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(<App />);

// npm run 같은 시작언어도 다 잡아주어야한다.
