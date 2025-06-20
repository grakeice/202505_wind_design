import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import ImageMinimizerPlugin from "image-minimizer-webpack-plugin";
import autoprefixer from "autoprefixer";
import path from "path";

export default {
	entry: {
		index: path.resolve(import.meta.dirname, "./src/ts/index"),
	},
	output: {
		filename: "js/[name].js",
		path: path.resolve(import.meta.dirname, "./dist"),
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					{
						loader: "postcss-loader",
						options: { postcssOptions: { plugins: [autoprefixer()] } },
					},
					"sass-loader",
				],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/templates/index.html",
			inject: "body",
			chunks: ["index"],
			filename: "index.html",
		}),
		new MiniCssExtractPlugin({
			filename: "style/[name].css",
		}),
		new ImageMinimizerPlugin({
			test: /\.(jpe?g|png)$/i,
			generator: [
				{
					preset: "webp",
					filename: "./assets/images/[name][ext]",
					implementation: ImageMinimizerPlugin.sharpGenerate,
					options: {
						encodeOptions: {
							webp: {},
						},
					},
				},
				{
					preset: "avif",
					filename: "./assets/images/[name][ext]",
					implementation: ImageMinimizerPlugin.sharpGenerate,
					options: {
						encodeOptions: {
							avif: {},
						},
					},
				},
				{
					preset: "jpeg",
					filename: "./assets/images/[name][ext]",
					implementation: ImageMinimizerPlugin.sharpGenerate,
					options: {
						encodeOptions: {
							jpeg: {},
						},
					},
				},
				{
					preset: "png",
					filename: "./assets/images/[name][ext]",
					implementation: ImageMinimizerPlugin.sharpGenerate,
					options: {
						encodeOptions: {
							png: {},
						},
					},
				},
			],
		}),
		new CleanWebpackPlugin(),
	],
	resolve: {
		extensions: [".ts", ".js", ".scss"],
	},
	externals: {
		gsap: "gsap",
		p5: "p5",
		"matter-js": "Matter",
	},
	watchOptions: {
		ignored: /node_modules/,
	},
};
