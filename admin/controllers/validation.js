// price check
function priceCheck(value) {
  if (value >= 1e6 && value <= 2e7) {
    return true;
  }
  return false;
}
// empty check
function isRequired(value) {
  //   console.log(Number(value));
  if (!value || !value?.trim()) {
    return false;
  }
  return true;
}

// price check
function priceCheck(value) {
  let regex = /^[0-9]+$/;
  if (regex.test(value)) {
    return true;
  }
  return false;
}

// name check
function nameCheck(value) {
  let regex = /^[a-zA-Z0-9 ]*$/;
  if (regex.test(value)) {
    return true;
  }
  return false;
}

// link check
function linkCheck(value) {
  let regex =
    /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
  if (regex.test(value)) {
    return true;
  }
  return false;
}

// type check
function typeCheck(value) {
  if (
    !(
      value == "phone" ||
      value == "laptop" ||
      value == "other" ||
      value == "ipad"
    )
  ) {
    return false;
  }
  return true;
}

// ============= Valdation ============= //
function validate() {
  let isValid = true;
  let nameSP = document.getElementById("TenSP").value;
  let price = document.getElementById("GiaSP").value;
  let screen = document.getElementById("ScreenSP").value;
  let backCamera = document.getElementById("camerasau").value;
  let frontCamera = document.getElementById("cameratruoc").value;
  let image = document.getElementById("HinhSP").value;
  let desc = document.getElementById("MotaSP").value;
  let type = document.getElementById("loaiSP").value;

  //   validation of price
  if (!isRequired(price)) {
    isValid = false;
    document.getElementById("spPrice").innerHTML = "Không được để trống";
  } else if (!priceCheck(price)) {
    isValid = false;
    document.getElementById("spPrice").innerHTML = "Phải nhập số";
  } else {
    document.getElementById("spPrice").innerHTML = "";
  }

  //   validation of name
  if (!isRequired(nameSP)) {
    isValid = false;
    document.getElementById("spName").innerHTML = "Không được để trống";
  } else if (!nameCheck(nameSP)) {
    isValid = false;
    document.getElementById("spName").innerHTML =
      "Tên sản phẩm không chứa các kí tự đặc biệt như @, #, !, ^, *,...";
  } else {
    document.getElementById("spName").innerHTML = "";
  }

  //   validation of image
  if (!isRequired(image)) {
    isValid = false;
    document.getElementById("spImage").innerHTML = "Không được để trống";
  } else if (!linkCheck(image)) {
    isValid = false;
    document.getElementById("spImage").innerHTML =
      "Nhập link hình ảnh sản phẩm";
  } else {
    document.getElementById("spImage").innerHTML = "";
  }
  // validation of type
  if (!typeCheck(type)) {
    document.getElementById("spType").innerHTML = "Phải chọn loại sản phẩm";
  } else {
    document.getElementById("spType").innerHTML = "";
  }
  // validation of screen
  if (!isRequired(screen)) {
    isValid = false;
    document.getElementById("spScreenSz").innerHTML = "Không được để trống";
  }
  // validation of front cam
  if (!isRequired(frontCamera)) {
    isValid = false;
    document.getElementById("spFroCam").innerHTML = "Không được để trống";
  }
  // validation of back cam
  if (!isRequired(backCamera)) {
    isValid = false;
    document.getElementById("spBackCam").innerHTML = "Không được để trống";
  }
  // validation of des
  if (!isRequired(desc)) {
    isValid = false;
    document.getElementById("spDes").innerHTML = "Không được để trống";
  }

  return isValid;
}
