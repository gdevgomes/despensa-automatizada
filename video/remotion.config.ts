import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("png");
Config.setOverwriteOutput(true);
// Marca o vídeo como BT.709. Sem isso, o player pode mostrar o vermelho alaranjado.
Config.setColorSpace("bt709");
