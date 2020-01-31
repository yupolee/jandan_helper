//add pagination
const pageNavWrapper = $(".cp-pagenavi");
const pageNavHtml = `<div class="momane_pageNav"><input type="number"><a class="momane_gotoPage">翻页</a></div>`;

pageNavWrapper.append(pageNavHtml);

$(".momane_gotoPage").click(function () {
  let that = $(this), pageIpt = that.prev(), value = pageIpt.val().trim();
  if (!value || isNaN(value)) {
    let curPage = $(".current-comment-page").eq(0);
    let nextPage = curPage.next("a");
    if (nextPage.length < 1) {
      nextPage = curPage.prev("a");
    }
    value = nextPage.text().trim();
  }
  window.location.href = `https://jandan.net/duan/page-${value}#comments`
});
const storageKeys = {
  blockedUsers: "blockedUsers"
};

const ss = chrome.storage.sync;
ss.get(storageKeys.blockedUsers, i => {
  let blockerUsers = i[storageKeys.blockedUsers] || [];
  addBlockButtonAndBlockUser(blockerUsers);
});

function addBlockButtonAndBlockUser(blockUsers) {
  $(".author").each(function () {
    let that = $(this);
    let userCode = getUserCode(that);
    let row = that.parent();
    if (that.find(".momane_blockUser").length < 1) {
      that.append("<a class='momane_blockUser'>屏蔽</a>");
    }
    if (blockUsers.includes(userCode) && row.next(".momane_blockedContent").length < 1) {
      row.hide().after(`<div class="momane_blockedContent">此内容因作者被拉黑而屏蔽。<a class="momane_checkAnyway">[手贱一回]</div> `).parent().addClass("momane_blocked");
    }
  });
}

$("body").on("click", ".momane_blockUser", function () {
  let that = $(this);
  let userCode = getUserCode(that.parent());
  ss.get(storageKeys.blockedUsers, i => {
    let blockedUsers = i[storageKeys.blockedUsers] || [];
    if (!blockedUsers.includes(userCode)) {
      blockedUsers.push(userCode);
    }

    let temp = {};
    temp[storageKeys.blockedUsers] = blockedUsers;
    ss.set(temp, () => {
      addBlockButtonAndBlockUser(blockedUsers);
    });
  });
}).on("click", ".momane_checkAnyway", function () {
  let that = $(this);
  let content = that.parent().prev();
  if (content.is(":visible")) {
    that.text("再手贱一回");
    content.hide();
  } else {
    content.show();
    that.text("真不该手贱");
  }
});


function getUserCode($el) {
  let userCode = "";
  try {
    userCode = $el.find("strong").attr("title").match(/\w+/)[0];
  } catch (e) {
    console.log("An error when getting user code");
  }
  return userCode;
}