(function fixScroll() {
  const links = [].slice.apply(document.getElementsByClassName("header-nav-link"));
  links.forEach((elem) => {
    elem.addEventListener("click", () => {
      setTimeout(() => {
        let pageWithScrollHeight = Math.max(
          document.body.scrollHeight, document.documentElement.scrollHeight,
          document.body.offsetHeight, document.documentElement.offsetHeight,
          document.body.clientHeight, document.documentElement.clientHeight
        );
        if (pageWithScrollHeight > window.pageYOffset + document.documentElement.clientHeight) {
          let headerHeight = document.getElementsByClassName("header")[0].offsetHeight;
          window.scrollBy(0, -headerHeight);
        }
      }, 10);
    });
  })
})();
