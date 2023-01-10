const path = require("path");
const dotenv = require("dotenv"); // kakaomap key환경변수 module
const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

dotenv.config();

// 배포용, 개발용 구분
const isProduction = process.env.NODE_ENV === "production";

// TODO: npm install 연결 및 build, css 경로 설정
module.exports = {
    entry: "./src/index.tsx",
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"], // 확장자
    },
    output: {
        path: path.resolve(__dirname, "../build"), // build 경로
        filename: "static/js/[name].[contenthash:8].js", // 이름설정
        clean: true, // 덮어쓰기 유무
    },
    devtool: isProduction ? false : "eval-source-map", // 배포용이면 false, 개발용이면 eval-source-map사용
    devServer: {
        // 개발서버 설정
        port: 3000,
        hot: true, // 코드 자동갱신
        open: true, // 페이지 자동열림
        client: {
            overlay: true, // 에러를 화면으로 띄울지 유무
            progress: true, // webpack 빌드상황 표시 유무
        },
    },
    module: {
        // babel, module 추가
        rules: [
            {
                oneOf: [
                    {
                        test: /\.(ts|tsx)/,
                        exclude: /node_modules/,
                        use: {
                            loader: "babel-loader",
                        },
                    },
                    {
                        test: /\.(css)$/i,
                        exclude: /node_modules/,
                        use: [
                            isProduction
                                ? MiniCssExtractPlugin.loader
                                : "style-loader", // 2.
                            "css-loader", // 1.
                        ],
                    },
                ],
            },
        ],
    },
    plugins: [
        isProduction // 배포용, 개발용 plugin설정
            ? new HtmlWebpackPlugin({
                  template: "public/index.html",
                  minify: true,
              })
            : new HtmlWebpackPlugin({
                  template: "public/index.html",
              }),
        isProduction
            ? new MiniCssExtractPlugin({
                  linkType: false,
                  filename: "[name].[contenthash:8].css",
              })
            : undefined,
        new webpack.DefinePlugin({
            "process.env": JSON.stringify(process.env),
        }),
    ].filter(Boolean),
};
