// config i18n
import i18n from "i18next";
import i18nextFSBackend from "i18next-node-fs-backend";

i18n.use(i18nextFSBackend).init({
  lng: "vietnamese", // Ngôn ngữ mặc định
  fallbackLng: "vietnamese", // Ngôn ngữ dự phòng
  preload: ["vietnamese"], // Các ngôn ngữ cần preload
  backend: {
    loadPath: __dirname + "../../../i18n/{{lng}}.json",
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
