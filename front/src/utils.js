
import Axios from "axios";

import api from "@/api";
import camelcaseKeys from "camelcase-keys";

const uploadImage = async function (data, contentType, onUploadProgress) {
  const storagingInfo = (
    await api.post("/v1/storaging/", {
      scope: "profile-images",
      content_type: contentType
    })
  ).data;

  await Axios({
    method: "PUT",
    url: storagingInfo.pre_signed_url,
    headers: {
      "Content-Type": contentType
    },
    data,
    onUploadProgress
  });

  return storagingInfo.id;
}

const summarize = function (text, maxLength, maxLines) {
  if (!text) return "";
  const defaultMaxLength = 60;
  const defaultMaxLines = 4;
  const newLineCount = (text.match(/\n/g) || []).length;
  if (text.length < (maxLength || defaultMaxLength) && newLineCount < (maxLines || defaultMaxLines)) {
    return text;
  } else {
    return (
      text
        .substr(0, (maxLength || defaultMaxLength) - 3)
        .split("\n")
        .slice(0, (maxLines || defaultMaxLines))
        .join("\n") + "..."
    );
  }
}

const isDebug = () => {
  return process.env.NODE_ENV !== 'production' &&
    process.env.NODE_ENV !== 'test' &&
    typeof console !== 'undefined'
}

const getIconUrl = function (user) {
  if (!(user && user.iconMediaKey)) return "";
  return `https://static.selelab.com/profile-images/${user.iconMediaKey}`
}

const getErrorMessage = function (response) {
  const errorMessages = {
    400: "メールアドレスまたはパスワードが正しくありません。",
    403: "この操作は許されていません。一旦ログアウトし、再度ログインしてからお試しください。",
    500: "サーバー内部でエラーが発生しました。しばらくしてからアクセスしてください。"
  };

  if (response) {
    return errorMessages[response.status] || "正しく処理することができませんでした。管理者へお問い合わせください。";
  }
  return "サーバーにアクセスできませんでした。インターネット接続を確認し、管理者へお問い合わせください。";
}

const notBlankValidation = function (v) {
  if (!v) {
    return "値を入れてください"
  }
  return true;
}

const filterFalsy = (obj) => (
  Object.fromEntries(Object.entries(obj).filter((item) => item[1]))
)

const scrollToElementById = function (id) {
  if (!id) return;
  const ref = document.getElementById(id)
  if (ref) ref.scrollIntoView({
    behavior: "smooth"
  });
}

const camelize = (obj) =>
  camelcaseKeys(obj, { deep: true })


export {
  uploadImage,
  getIconUrl,
  isDebug,
  summarize,
  getErrorMessage,
  notBlankValidation,
  filterFalsy,
  scrollToElementById,
  camelize
}
