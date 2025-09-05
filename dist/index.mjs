function z(t = {}) {
  let a, d = !1, g, u;
  const T = t.hasOwnProperty("muted") ? !!t.muted : !0;
  let l = 1;
  const c = document.createElement("canvas"), h = c.getContext("2d"), m = {}, o = {
    width: 0,
    height: 0,
    draw_time: "",
    duration: 0
  }, n = {
    msg: o,
    start: function() {
      a.currentTime = 0, d = !0, F() && I();
    },
    fastStart: (e) => {
      d = !0, e || (e = 200), e < 30 && (e = 30);
      let r = 0, i;
      const s = () => {
        r >= n.msg.duration && (clearInterval(i), r = n.msg.duration), a.currentTime = r;
      };
      s(), i = setInterval(() => {
        r += l, s();
      }, e);
    },
    destroy: function() {
      a.removeEventListener("timeupdate", g), u && a.removeEventListener("loadedmetadata", u), document.body.removeChild(a);
    },
    setIntervalTime: (e) => {
      e < 200 && (e = 200), l = e / 1e3;
    },
    getSrc: () => a.src,
    getImgs: () => m,
    setCurrentTime: function(e, r) {
      if (e > n.msg.duration && (e = n.msg.duration), r && (d = !1), r && e !== a.currentTime) {
        n.msg.draw_time = "", a.currentTime = e;
        return;
      } else
        n.msg.draw_time = e;
      let i = "";
      m[e] ? i = m[e] : i = S(), m[e] = i, t.backImgFn && f(t.backImgFn) && t.backImgFn(i), e === n.msg.duration && x();
    },
    FileToBase64: function(e) {
      return new Promise((r, i) => {
        if (!e) {
          i({ message: "暂无文件", code: 2 });
          return;
        }
        try {
          const s = new FileReader();
          s.onload = (k) => {
            var w;
            r((w = k.target) == null ? void 0 : w.result);
          }, s.readAsDataURL(e);
        } catch (s) {
          i({ message: s.message, code: 1 });
        }
      });
    }
  }, b = () => {
    const e = document.createElement("video");
    return typeof t.width == "number" ? e.style.width = (t.width || 0) + "px" : e.style.width = t.width + "", typeof t.height == "number" ? e.style.height = (t.height || 0) + "px" : e.style.height = t.height + "", e.style.opacity = "0", e.style.position = "absolute", e.style.top = "0px", e.style.left = "0px", e.style.transform = "translateX(-100%)", e.style.zIndex = "-1", document.body.appendChild(e), e;
  }, f = (e) => e && Object.prototype.toString.call(e) === "[object Function]", F = () => a.paused, I = () => {
    a.play();
  }, y = () => {
    t.success && f(t.success) && t.success();
  }, v = (e) => {
    t.fail && f(t.fail) && t.fail(e);
  }, x = () => {
    d && (d = !1, t.finish && f(t.finish) && t.finish());
  }, E = () => {
    c.width = a.offsetWidth, c.height = a.offsetHeight;
  }, S = () => h ? (h.drawImage(
    a,
    0,
    0,
    c.width,
    c.height
  ), c.toDataURL("image/png")) : "", C = () => {
    if (O(t))
      for (const r in t) {
        const i = r;
        o[r] = t[i];
      }
    const e = () => {
      const r = { width: "offsetWidth", height: "offsetHeight" };
      for (const i in r)
        if (!t.hasOwnProperty(i)) {
          const s = r[i];
          s in a && (o[i] = a[s]);
        }
      E();
    };
    t.intervalTime && (t.intervalTime < 200 ? l = 200 / 1e3 : l = t.intervalTime / 1e3), a.muted = T, a.readyState === 4 ? (e(), y()) : (u = () => {
      if (o.duration = a.duration, e(), f(t.success)) {
        const r = setTimeout(() => {
          clearTimeout(r), y();
        }, 200);
      }
      a.removeEventListener("loadedmetadata", u);
    }, a.addEventListener("loadedmetadata", u));
  }, L = () => {
    g = () => {
      const { duration: e, currentTime: r } = a, { draw_time: i } = n.msg;
      n.msg.duration || (n.msg.duration = e), (e === r && i !== r || i === "" || +i + l <= r) && n.setCurrentTime(a.currentTime);
    }, a.addEventListener("timeupdate", g);
  }, O = (e) => e && Object.prototype.toString.call(e) === "[object Object]";
  async function H() {
    if (a = t.video || b(), !a.src)
      if (t != null && t.file) {
        const e = await n.FileToBase64(t.file);
        if (typeof e == "string")
          a.src = e;
        else {
          v(e.message);
          return;
        }
      } else {
        v("暂无切片的视频");
        return;
      }
    C(), L();
  }
  return H(), n;
}
const D = { videoSlice: z };
export {
  D as default,
  z as videoSlice
};
