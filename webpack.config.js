import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
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
				use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/index.html",
		}),
		new MiniCssExtractPlugin({
			filename: "style/[name].css",
		}),
	],
	resolve: {
		extensions: [".ts", ".js", ".scss"],
	},
	watchOptions: {
		ignored: /node_modules/,
	},
};
