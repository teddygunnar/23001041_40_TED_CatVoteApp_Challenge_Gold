function initialSetup() {
  const socket = new WebSocket("ws://127.0.0.2:3005");
  const BASE_URL = "http://127.0.0.1:3005/api/v1";
  const token = sessionStorage.getItem("authToken");
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
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('user');
        alert('Sesion login telah habis')
      }
      return Promise.reject(error);
    }
  );

  //GET LIST OF CATS
  const getCats = async () => {
    try {
      const { status, data } = await axios.get(`${BASE_URL}/cats`);
      if (status === 200) {
        return data?.payload?.map((val) => {
          return {
            ...val,
            id: val.imageId,
            url: val.imageUrl,
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
  const getOutsourcedCats = async () => {
    try {
      const { status, data } = await axios.get(
        "https://api.thecatapi.com/v1/images/search?limit=10"
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

  // FUNCTION FOR LIKE A CAT
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

  // FUNCTION FOR UNLIKE A CAT
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

  return { socket, getCats, getOutsourcedCats, likeCat, unlikeCat };
}

async function index() {
  const { socket, getCats, getOutsourcedCats, likeCat, unlikeCat } =
    initialSetup();
  const cats = await getOutsourcedCats();
  const favCats = await getCats();

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
    showList({ favCats, cats }, socket, likeCat, unlikeCat);
  }

  socket.addEventListener("open", (event) => {
    console.log("Connected to WebSocket server");
    // You can send initial messages or perform actions on connection
  });

  socket.addEventListener("message", async (event) => {
    const { action, ...rest } = JSON.parse(event.data);
    updateUI(action, rest);
  });

  socket.addEventListener("close", (event) => {
    console.log("WebSocket connection closed");
  });

  showList({ favCats, cats }, socket, likeCat, unlikeCat);
}

function showList(data, socket, likeCat, unlikeCat) {
  const { favCats, cats } = data;
  const catListEl = document.getElementById("catList");
  const favCatlistEl = document.getElementById("favCatList");

  if (favCats.length) {
    favCatlistEl.innerHTML = "";
    favCats.forEach((val) => {
      const liEl = document.createElement("li");

      //element
      const imgEl = document.createElement("img");
      const pEl = document.createElement("p");
      const spanEl = document.createElement("span");
      const spanEl2 = document.createElement("span");
      const spanEl3 = document.createElement("span");

      //populate every element into dataEl
      const dataEl = [imgEl, pEl, spanEl, spanEl2, spanEl3];

      spanEl2.onclick = () => {
        if (val.userLiked) {
          const data = {
            id: val.imageId,
            count: val.numberOfLikes,
          };
          socket.send(JSON.stringify(data));
          unlikeCat(val);
        } else {
          const data = {
            id: val.imageId,
            count: val.numberOfLikes,
          };
          socket.send(JSON.stringify(data));
          likeCat(val);
        }
      };

      spanEl2.textContent = val.userLiked ? "Dislike" : "Like";
      spanEl2.classList = "like_btn";
      spanEl2.id = "like_btn";
      spanEl3.textContent = val.numberOfLikes;
      spanEl3.id = `likes${val.imageId}`;
      imgEl.src = val.imageUrl;
      dataEl.forEach((o) => {
        liEl.appendChild(o);
      });
      favCatlistEl.appendChild(liEl);
    });
  }

  if (cats.length) {
    catListEl.innerHTML = "";

    cats.forEach((val) => {
      const liEl = document.createElement("li");

      //element
      const imgEl = document.createElement("img");
      const pEl = document.createElement("p");
      const spanEl = document.createElement("span");
      const spanEl2 = document.createElement("span");
      const spanEl3 = document.createElement("span");

      //populate every element into dataEl
      const dataEl = [imgEl, pEl, spanEl, spanEl2, spanEl3];

      spanEl2.onclick = () => {
        if (val.userLiked) {
          const data = {
            id: val.imageId,
            count: val.numberOfLikes,
          };
          socket.send(JSON.stringify(data));
          unlikeCat(val);
        } else {
          const data = {
            id: val.imageId,
            count: val.numberOfLikes,
          };
          socket.send(JSON.stringify(data));
          likeCat(val);
        }
      };

      spanEl2.textContent = val.userLiked ? "Dislike" : "Like";
      spanEl2.classList = "like_btn";
      spanEl2.id = "like_btn";
      spanEl3.textContent = val.numberOfLikes;
      spanEl3.id = `likes${val.imageId}`;
      imgEl.src = val.imageUrl;
      dataEl.forEach((o) => {
        liEl.appendChild(o);
      });
      catListEl.appendChild(liEl);
    });
  }
}

index();
