// =========================== INITIALIZATION =============================== //
const BASE_URL = "http://127.0.0.1:3005/api/v1";
const socket = new WebSocket("ws://127.0.0.2:3005");
const { authToken: token } = JSON.parse(sessionStorage.getItem("user") || `{}`);

if (!token) {
  window.location.href = "/app/login";
  alert("Sesion login telah habis");
}
//prettier-ignore
axios.interceptors.request.use(function (config) {
  axios.defaults.headers.Accept = "application/json";
  const exclude = "api.thecatapi.com";
  if (!config.url.includes(exclude)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, function (error) {
  return Promise.reject(error.response);
});

//prettier-ignore
axios.interceptors.response.use((res) => {
    return res;
  }, (error) => {
    if (error.response.status === 401) {
      window.location.href = '/app/login';
      sessionStorage.removeItem('user');
      alert('Sesion login telah habis')
    }
    return Promise.reject(error);
  }
);

// ====================== END OF INITIAL SETUP ============================= //

function catsHook() {
  //GET LIST OF CATS
  const getCats = async () => {
    try {
      const { status, data } = await axios.get(`${BASE_URL}/cats`);
      if (status === 200) {
        return data?.payload?.map((val) => {
          return {
            ...val,
            imageId: val.imageId,
            imageUrl: val.imageUrl,
            numberOfLikes: val.numberOfLikes,
          };
        });
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  //GET LITS OF CATS FROM 3RD PARTY LIBRARY
  const generateRandomCats = async (page = 1) => {
    try {
      const { status, data } = await axios.get(
        `https://api.thecatapi.com/v1/images/search?limit=10&page=${page}`
      );
      if (status === 200) {
        return data?.map((val) => {
          return {
            imageId: null,
            imageUrl: val.url || "",
          };
        });
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  return { getCats, generateRandomCats };
}

function handleGenerateLikeBtn(val) {
  const iconsEl = document.createElement("i");
  iconsEl.setAttribute("role", "button");
  iconsEl.setAttribute("data-toggle", "tooltip");
  iconsEl.setAttribute("data-placement", "top");
  iconsEl.setAttribute("title", "Like this cat");
  if (val) {
    iconsEl.classList = "fa-solid fa-thumbs-up";
  } else {
    iconsEl.classList = "fa-regular fa-thumbs-up";
  }
  return iconsEl;
}

function handleOpenFilter() {
  const options = document.getElementById("filter-options");
  const attr = options.getAttribute("data-show");
  let bool;
  bool = attr === "false" ? false : true;
  options.setAttribute("data-show", !bool);
}

function handleLogout() {
  sessionStorage.removeItem("user");
  window.location.href = "/app/login";
}

function handleSortBy(index, data) {
  const allBtns = Array.from(
    document.querySelectorAll(".filter-utils")[0].children
  );

  // logic sorting the books based on the buttons;

  const { value } = allBtns[index];
  const { favCats } = data;

  const currentDate = new Date();

  //prettier-ignore
  switch (value) {
    case "all-time":
      favCats.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      showList(data);
      break;
    case "past-hours":
      const pastHours = new Date(currentDate - 24 * 60 * 60 * 1000);
      const pastHoursData = favCats.filter((o) => new Date(o.createdAt) >= pastHours);
      console.log(pastHoursData)
      showList({ ...data, favCats: pastHoursData });
      break;
    case "past-weeks":
      const pastWeeks = new Date(currentDate - 1 * 7 * 24 * 60 * 60 * 1000);
      const pastWeeksData = favCats.filter((o) => new Date(o.createdAt) >= pastWeeks);
      showList({ ...data, favCats: pastWeeksData });
      break;
      default: 
      showList(data);
      break;
  }

  // add .active class while removing .active class for unrelated button
  allBtns.forEach((val, i) => {
    if (i !== index) {
      val.classList.remove("active");
    } else {
      val.classList.add("active");
    }
  });
}

function showList(data) {
  const likeCat = async (val) => {
    try {
      const { status, data } = await axios.post(`${BASE_URL}/like/cat`, {
        imageId: val.imageId || null,
        imageUrl: val.imageUrl,
      });
      if (status === 200) {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const unlikeCat = async (val) => {
    try {
      const { status, data } = await axios.post(
        `${BASE_URL}/like/unlike/${val.imageId}`
      );
      if (status === 200) console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const { favCats, cats } = data;
  const catListEl = document.getElementById("catList");
  const favCatlistEl = document.getElementById("favCatList");

  function processLike(val) {
    if (socket.readyState !== WebSocket.CLOSED) {
      if (val.userLiked) {
        const _data = {
          id: val.imageId,
          count: val.numberOfLikes,
        };
        socket.send(JSON.stringify(_data));
        unlikeCat(val);
      } else {
        const _data = {
          id: val.imageId,
          count: val.numberOfLikes,
        };
        socket.send(JSON.stringify(_data));
        likeCat(val);
      }
    } else {
      alert(
        "Koneksi ke websocket telah tertutup, silahkan refresh browser terlebih dahulu"
      );
    }
  }

  if (favCats.length) {
    favCatlistEl.innerHTML = "";

    favCats.forEach((val) => {
      const liEl = document.createElement("li");

      // ELEMENT

      //img-wrapper
      const imgWrapperEl = document.createElement("div");
      imgWrapperEl.classList = "img-wrapper";

      //img-card
      const imgEl = document.createElement("img");

      // imgWrapperEl.appendChild(imgEl);

      //footer-card-container
      const likeContainer = document.createElement("div");

      // icon & like count container
      const countEl = document.createElement("span");
      const likeBtn = handleGenerateLikeBtn(val.userLiked);

      const likeCountContainer = document.createElement("div");
      likeCountContainer.classList = "like-count-container";
      likeCountContainer.appendChild(likeBtn);
      likeCountContainer.appendChild(countEl);

      const createdAtEl = document.createElement("span");

      countEl.textContent = val.numberOfLikes;
      createdAtEl.textContent = moment(val.createdAt).fromNow();
      createdAtEl.classList = "date-created-span";
      createdAtEl.setAttribute("data-toggle", "tooltip");
      createdAtEl.setAttribute("data-placement", "top");
      createdAtEl.setAttribute("title", moment(val.createdAt));

      likeContainer.classList = "card-footer-container";

      likeContainer.setAttribute("data-liked", val.userLiked);
      likeContainer.appendChild(likeCountContainer);
      likeContainer.appendChild(createdAtEl);

      //populate every element into dataEl
      const dataEl = [imgEl, imgWrapperEl, likeContainer];

      likeBtn.onclick = () => {
        processLike(val);
      };
      imgEl.onclick = () => {
        processLike(val);
      };

      imgEl.src = val.imageUrl;
      dataEl.forEach((o) => {
        liEl.appendChild(o);
      });
      favCatlistEl.appendChild(liEl);
    });
  } else {
    const div = document.createElement("div");
    div.textContent = "No data";
    favCatlistEl.innerHTML = "";
    favCatlistEl.appendChild(div);
  }

  if (cats.length) {
    catListEl.innerHTML = "";

    cats.forEach((val) => {
      const liEl = document.createElement("li");

      // ELEMENT
      //img-card
      const imgEl = document.createElement("img");

      //footer-card-container
      const likeContainer = document.createElement("div");

      // utilites
      const countEl = document.createElement("span");
      const likeBtn = handleGenerateLikeBtn(val.userLiked);

      countEl.textContent = val.numberOfLikes;
      likeContainer.classList = "card-footer-container";

      likeContainer.setAttribute("data-liked", false);
      likeContainer.appendChild(likeBtn);
      likeContainer.appendChild(countEl);

      //populate every element into dataEl
      const dataEl = [imgEl, likeContainer];

      likeBtn.onclick = () => {
        processLike(val);
      };

      imgEl.onclick = () => {
        processLike(val);
      };

      // spanEl2.appendChild(likeBtn);
      imgEl.src = val.imageUrl;
      dataEl.forEach((o) => {
        liEl.appendChild(o);
      });
      catListEl.appendChild(liEl);
    });
  }
}

async function index() {
  const { getCats, generateRandomCats } = catsHook();
  const cats = await generateRandomCats();
  const favCats = await getCats();
  favCats.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  let page = 1;

  function updateUI(action, val) {
    const { userId } = JSON.parse(sessionStorage.getItem("user"));
    switch (action) {
      case "update":
        const index = favCats.findIndex((o) => o.imageId === val.imageId);
        if (index !== -1) {
          favCats[index]["numberOfLikes"] = val.numberOfLikes;

          if (val.userId === userId) {
            favCats[index]["userLiked"] = val.userLiked;
          }
        }
        break;
      case "add":
        const i = cats.findIndex((o) => o.imageUrl === val.imageUrl);
        if (i === -1) {
          favCats.push({
            imageId: val.imageId,
            imageUrl: val.imageUrl,
            numberOfLikes: 1,
            userLiked: val.userId === userId ? true : false,
          });
        } else {
          cats[i] = {
            ...cats[i],
            imageId: val.imageId,
            numberOfLikes: 1,
            userLiked: val.userId === userId ? true : false,
          };
          favCats.push(cats[i]);
        }
        cats.splice(i, 1);
        break;
      default:
        const ind = favCats.findIndex((o) => o.imageId === val.imageId);
        favCats.splice(ind, 1);
        break;
    }
    showList({ favCats, cats });
  }

  async function loadMore(page = 1) {
    const newCats = await generateRandomCats(page);
    cats.push(...newCats);
    showList({ favCats, cats });
  }

  const loadMoreBtn = document.getElementById("load-more-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const filterBtn = document.getElementById("filter-btn");

  const querySelect = document.querySelectorAll(".filter-utils");

  Array.from(querySelect[0]?.children).forEach(
    (val, index) =>
      (val.onclick = () => {
        handleSortBy(index, { cats, favCats });
      })
  );

  logoutBtn.onclick = handleLogout;
  filterBtn.onclick = handleOpenFilter;
  loadMoreBtn.onclick = () => {
    page = page + 1;
    loadMore(page);
  };

  socket.addEventListener("open", (event) => {
    console.log("Websocket connected");
  });

  socket.addEventListener("message", async (event) => {
    const { action, ...rest } = JSON.parse(event.data);
    updateUI(action, rest);
  });

  socket.addEventListener("close", (event) => {
    console.log("WebSocket connection closed");
  });

  showList({ favCats, cats });
}

index();
