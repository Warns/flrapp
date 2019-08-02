/* app için gerekli iconlar burdan tanımlanır */
export const ICONS = {
  rightArrow: require("root/assets/icons/rightArrow.png"),
  rightArrowGrey: require("root/assets/icons/rightArrowGrey.png"),
  rightArrowWhite: require("root/assets/icons/rightArrowWhite.png"),
  storeLocation: require("root/assets/icons/storeLocation.png"),
  location: require("root/assets/icons/location.png"),
  feedInstagram: require("root/assets/icons/feedInstagram.png"),
  feedCampaing: require("root/assets/icons/feedPromo.png"),
  feedVideo: require("root/assets/icons/feedVideo.png"),
  like: require("root/assets/icons/heartFull.png"),
  unLike: require("root/assets/icons/heartOutline.png"),
  close: require("root/assets/icons/close.png"),
  drpIco: require("root/assets/icons/drpIco.png"),
  listProduct: require("root/assets/icons/list_product.png"),
  listTexture: require("root/assets/icons/list_texture.png"),
  filters: require("root/assets/icons/filters.png"),
  list: require("root/assets/icons/list.png"),
  map: require("root/assets/icons/map.png"),
  back: require("root/assets/images/icons/back.png"),
  facebook: require("root/assets/icons/facebook.png"),
  instagram: require("root/assets/icons/instagram.png"),
  twitter: require("root/assets/icons/twitter.png"),
  youtube: require("root/assets/icons/youtube.png"),
  noConnection: require("root/assets/icons/noConnection.png"),
  plcFeeds: require("root/assets/icons/placeholder/feeds.png"),
  flormarExtra: require("root/assets/icons/flormarExtra.png"),
  userWomen: require("root/assets/icons/userWoman.png"),
  userMen: require("root/assets/icons/userMan.png"),
  campaingRectangle: require("root/assets/images/campaing-rectangle.png"),
  campaingTitle: require("root/assets/images/campaing-title.png"),
  bottomArrow: require("root/assets/icons/bottomArrow.png"),
  downArrow: require("root/assets/icons/downArrow.png"),
  upArrow: require("root/assets/icons/topArrow.png"),
  searchMap: require("root/assets/icons/search-map.png"),
  myLocation: require("root/assets/icons/myLocation.png"),
  loading: require("root/assets/gifs/goo.gif"),
  error: require("root/assets/icons/error.png"),
  cartNoResult: require("root/assets/icons/cartNoResult.png"),
  addressNoResult: require("root/assets/icons/addressNoResult.png"),
  couponNoResult: require("root/assets/icons/couponNoResult.png"),
  favoriteNoResult: require("root/assets/icons/favoriteNoResult.png"),
  followListNoResult: require("root/assets/icons/followListNoResult.png"),
  contentNoResult: require("root/assets/icons/contentNoResult.png"),
  asistanButton: require("root/assets/icons/asistanButton.png"),
  button: require("root/assets/icons/button.png"),
  searchClose: require("root/assets/icons/searchClose.png"),
  plus: require("root/assets/icons/plus.png"),
  closedIco: require("root/assets/icons/closedIco.png"),
  stars: require("root/assets/icons/stars.png"),
  starEmpty: require("root/assets/icons/star-empty.png"),
  starFull: require("root/assets/icons/star-full.png"),
  check: require("root/assets/icons/check.png"),
  checkBig: require("root/assets/icons/check-big.png"),
  comment: require("root/assets/icons/comment.png"),
  thumbsUp: require("root/assets/icons/like.png"),
  thumbsDown: require("root/assets/icons/dislike.png"),
  orderSuccessImg: require("root/assets/images/order-success-img.png"),
  orderSuccessRect: require("root/assets/images/order-success-rect.png"),
  orderSuccessTxt: require("root/assets/images/order-success-txt.png"),
  orderSuccessIcon: require("root/assets/images/order-success-icon.png"),
  top10Contributor: require("root/assets/icons/top10Contributor.png"),
  top100Contributor: require("root/assets/icons/top100Contributor.png"),
  reviewSuccess: require("root/assets/icons/review-success.png"),
  reviewHeart: require("root/assets/icons/review-heart.png"),
  domesticProduct: require("root/assets/images/yerliuretim.png"),
  lips0: require("root/assets/images/lips1.png"),
  lips1: require("root/assets/images/lips2.png"),
  lips2: require("root/assets/images/lips3.png"),
  lips3: require("root/assets/images/lips4.png"),
  gradient: require("root/assets/images/gradient.png")
};

/* VIEWER SAYFA TİPLERİ */
export const VIEWERTYPE = {
  SEG: "segmentify",
  SCROLLVIEW: "scrollView",
  LIST: "listViewer",
  HTML: "htmlViewer",
  HTMLTOJSON: "htmlToJSON",
  WEBVIEW: "webViewer",
  FORM: "form"
};

/* VIEWER FLATLIST ITEM TYPE */
export const ITEMTYPE = {
  BANKTRANSFER: "bank_transfer",
  ADDRESS: "address",
  FAVORITE: "favorite",
  ORDER: "order",
  COUPON: "coupon",
  FOLLOWLIST: "followList",
  SERVICELIST: "serviceList",
  CARTLIST: "cartList",
  CAMPAING: "campaing",
  VIDEO: "video",
  FEEDS: "feeds",
  TRIGGERBUTTON: "triggerButton",
  EXITBUTTON: "exitButton",
  OPPORTUNITY: "opportunity", // SEPET SAYFASI FIRSATLAR
  CUSTOMDETAIL: "customDetail", // feeds blog, collection tıklananınca açılacak detay
  CUSTOMDETAILCONTENT: "customDetailContent", // detal sayfası nasıl uygulanır kısmı
  EXTRABUTTON: "extraButton"
};

export const FEEDSTYPE = {
  INSTAGRAM: "instagram",
  VIDEO: "video",
  CAMPAING: "promo",
  PRODUCT: "product",
  BLOGPOST: "blog",
  COLLECTION: "collection"
};

export const FEEDS_IMAGE_RATE = {
  video: 1.7857, // 750X420
  instagram: 1,
  promo: 1.2295, // 750x610
  product: 0.8, // 435x544
  blog: 1.2295, // 750x610
  collection: 1.2295 // 750X610
};

export const CLICK = "CLICK";
export const DOUBLE_CLICK = "DOUBLE_CLICK";
export const DATA_LOADED = "DATA_LOADED";
export const SERVICE_LIST_CLICKED = "SERVICE_LIST_CLICKED";
export const ORDER_LIST_CLICKED = "ORDER_LIST_CLICKED";
export const ADDRESS_LIST_CLICKED = "ADDRESS_LIST_CLICKED";
export const NEW_ADDRESS_CLICKED = "NEW_ADDRESS_CLICKED";
export const SET_FORM = "SET_FORM";
export const SET_VIEWER = "SET_VIEWER";
export const SET_INSTAGRAM = "SET_INSTAGRAM";
export const SET_WEBVIEW = "SET_WEBVIEW";
export const SET_ADDRESS_ITEM_CLICK = "SET_ADDRESS_ITEM_CLICK";
export const SET_VIDEO_PLAYER = "SET_VIDEO_PLAYER";
export const UPDATE_CART = "UPDATE_CART";
export const REMOVE_CART = "REMOVE_CART";
export const CART_FOOTER_MARGIN_BOTTOM = 115;
export const CART_FOOTER_EXPAND_MARGIN_BOTTOM = 200;
export const CART_BACKGROUND_COLOR_1 = "rgb(244, 236, 236)";
export const CART_BACKGROUND_COLOR_2 = "#FFFFFF";

/* form */
export const FORMDATA = {
  login: require("root/data/login.js"),
  createUser: require("root/data/createUser.js"),
  recoverPassword: require("root/data/recoverPassword.js"),
  changePassword: require("root/data/changePassword.js"),
  createAddress: require("root/data/createAddress.js"),
  setAddress: require("root/data/setAddress.js"),
  setUser: require("root/data/setUser.js"),
  productFilter: require("root/data/productFilter.js"),
  useCoupon: require("root/data/useCoupon.js"),
  deleteCoupon: require("root/data/deleteCoupon.js"),
  creditCart: require("root/data/creditCart.js"),
  //Opt-in
  optin_phone: require("root/data/optin_phone.js"),
  optin_phoneConfirmation: require("root/data/optin_phoneConfirmation.js"),
  optin_email: require("root/data/optin_email.js"),
  optin_password: require("root/data/optin_password.js"),
  optin_signup: require("root/data/optin_signup.js"),
  optin_subscription: require("root/data/optin_subscription.js"),
  optin_resetpassword: require("root/data/optin_resetpassword.js"),
  //Review
  review_submission: require("root/data/review_submission.js")
};

/* form style, from->container.js */
export const FORMSTYLE = {
  LIGHT: {
    BORDER_WIDTH: 0,
    BORDER_COLOR: "rgba(255, 255, 255, 0)",
    TITLE_COLOR: "#FFFFFF",
    ERROR_COLOR: "#d3838d",
    BACKGROUND_COLOR: "rgba(255, 255, 255, 0.4)"
  },
  DARK: {
    BORDER_WIDTH: 1,
    BORDER_COLOR: "#dddddd",
    TITLE_COLOR: "#9b9b9b",
    ERROR_COLOR: "#d3838d",
    BACKGROUND_COLOR: "#FFFFFF"
  }
};

/*** Redux Actions ***/

/* settings */
export const SET_SETTINGS = "SET_SETTINGS";
export const SET_CLIENT_PROPERTIES = "SET_CLIENT_PROPERTIES";

/* root navigation */
export const SET_OPTIN_NAVIGATION = "SET_OPTIN_NAVIGATION";
export const SET_MAIN_NAVIGATION = "SET_MAIN_NAVIGATION";
export const SET_NAVIGATION = "SET_NAVIGATION";
export const NAVIGATE = "NAVIGATE";

/* cart */
export const BANK_TRANSFER = "bankTransfer";
export const CREDIT_CART = "creditCart";
export const SET_CART_ADDRESS = "SET_CART_ADDRESS";
export const SET_DIFFERENT_ADDRESS = "SET_DIFFERENT_ADDRESS";
export const CARGO_CLICKED = "CARGO_CLICKED";
export const SET_INSTALLMENT = "SET_INSTALLMENT";
export const SET_CART_INFO = "SET_CART_INFO";
export const SET_CART_CARGO = "SET_CART_CARGO";
export const SET_CART_ITEMS = "SET_CART_ITEMS";
export const SET_PAYMENT = "SET_PAYMENT";
export const ADD_CART_ITEM = "ADD_CART_ITEM";
export const SET_CART_NO_RESULT = "SET_CART_NO_RESULT";
export const RESET_CART = "RESET_CART";
export const ADD_TO_FAVORITES = "ADD_TO_FAVORITES";
export const REMOVE_FROM_FAVORITES = "REMOVE_FROM_FAVORITES";
export const SET_CART_PROGRESS = "SET_CART_PROGRESS";
export const SET_BANK_TRANSFER = "SET_BANK_TRANSFER";
export const RESET_PAYMENT = "RESET_PAYMENT";
export const SET_CREDIT_CART = "SET_CREDIT_CART";
export const SET_BANK_POINT = "SET_BANK_POINT";
export const SET_EXTRA_POINT = "SET_EXTRA_POINT";
export const SET_USER_POINTS = "SET_USER_POINTS";
export const SET_AGREEMENT = "SET_AGREEMENT";
export const SET_ORDER_SUCCESS_MESSAGE = "SET_ORDER_SUCCESS_MESSAGE";
export const SET_ORDER_3D_BUTTON = "SET_ORDER_3D_BUTTON";

/* general */
export const SET_CATEGORIES = "SET_CATEGORIES";
export const SET_SELECTED_CATEGORY = "SET_SELECTED_CATEGORY";
export const SET_TEXTURE_DISPLAY = "SET_TEXTURE_DISPLAY";
export const SET_SCREEN_DIMENSIONS = "SET_SCREEN_DIMENSIONS";
export const OPEN_PRODUCT_DETAILS = "OPEN_PRODUCT_DETAILS";
export const CLOSE_PRODUCT_DETAILS = "CLOSE_PRODUCT_DETAILS";
export const UPDATE_PRODUCT_DETAILS_ITEM = "UPDATE_PRODUCT_DETAILS_ITEM";
export const UPDATE_PRODUCT_VIDEOS = "UPDATE_PRODUCT_VIDEOS";
export const SHOW_PRELOADING = "SHOW_PRELOADING";
export const OPEN_VIDEO_PLAYER = "OPEN_VIDEO_PLAYER";

/* user */
export const SET_USER = "SET_USER";
export const UPDATE_USER = "UPDATE_USER";
export const REMOVE_USER = "REMOVE_USER";
export const SET_CART_NUM = "SET_CART_NUM";
export const UPDATE_OPTIN = "UPDATE_OPTIN";

/* menu */
export const SET_MENU_TYPE = "SET_MENU_TYPE";
export const SHOW_MENU = "SHOW_MENU";
export const HIDE_MENU = "HIDE_MENU";

/* location */
export const SET_LOCATION = "SET_LOCATION";

/* offline notice */
export const SET_CONNECTION = "SET_CONNECTION";

/* segmentify */
export const SET_SEGMENTIFY_USER_SESSION = "SET_SEGMENTIFY_USER_SESSION";
export const SET_SEGMENTIFY_INSTANCEID = "SET_SEGMENTIFY_INSTANCEID";

/* assistant */
export const ASSISTANT_SHOW = "ASSISTANT_SHOW";
export const SET_ASSISTANT = "SET_ASSISTANT";
export const ASSISTANT_OPENED = "ASSISTANT_OPENED";

/* customPopup */
export const SHOW_CUSTOM_POPUP = "SHOW_CUSTOM_POPUP";
