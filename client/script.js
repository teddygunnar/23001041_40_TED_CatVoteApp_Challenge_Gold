function initialSetup() {
  const socket = new WebSocket("ws://localhost:3005");
  const BASE_URL = "http://127.0.0.1:3005/api/v1";
  const token = sessionStorage.getItem("authToken");

  //prettier-ignore
  axios.interceptors.request.use(function (config) {
    axios.defaults.headers.Accept = "application/json";
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  }, function (error) {
    return Promise.reject(error.response);
  });

  //prettier-ignore
  axios.interceptors.response.use((res) => {
      return res;
    }, (error) => {
      if (error.response.status === 401) {
        alert('Sesion login telah habis')
      }
      return Promise.reject(error);
    }
  );

  return { socket, BASE_URL, token };
}

async function index() {
  const { socket, BASE_URL, token } = initialSetup();

  //GET LIST OF CATS
  const getCats = async () => {
    try {
      const { status, data } = await axios.get(`${BASE_URL}/cats`);
      if (status === 200) {
        return data?.payload?.map((val) => {
          return {
            id: val.imageId,
            url: val.imageUrl,
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

  const getOutsourcedCats = async () => {
    try {
      const { status, data } = await axios.get(
        "https://api.thecatapi.com/v1/images/search?limit=10"
      );
      if (status === 200) {
        return data?.map((val) => {
          return {
            id: null,
            url: val.url || "",
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

  const likeCat = async (val) => {
    try {
      const { status, data } = await axios.post(
        `${BASE_URL}/like/cat`,
        {
          imageId: val.id || null,
          imageUrl: val.url,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // You may need to adjust the content type based on the API requirements
          },
        }
      );
      if (status === 200) {
        console.log(data);
        // return data?.map((val) => {
        //   return {
        //     url: val.url || "",
        //   };
        // });
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const outsourcedCats = await getOutsourcedCats();
  const cats = await getCats();

  const elGato = [...cats, ...outsourcedCats];

  if (elGato.length) {
    const catListEl = document.getElementById("catList");

    elGato.forEach((val) => {
      const liEl = document.createElement("li");

      //element
      const imgEl = document.createElement("img");
      const pEl = document.createElement("p");
      const spanEl = document.createElement("span");
      const spanEl2 = document.createElement("span");

      //populate every element into dataEl
      const dataEl = [imgEl, pEl, spanEl, spanEl2];

      spanEl2.onclick = () => {
        // socket.send("Braaah");
        likeCat(val);
      };

      spanEl2.textContent = "Like";
      spanEl2.classList = "like_btn";
      imgEl.src = val.url;
      dataEl.forEach((o) => {
        liEl.appendChild(o);
      });
      catListEl.appendChild(liEl);
    });
  }

  socket.addEventListener("open", (event) => {
    console.log("Connected to WebSocket server");
    // You can send initial messages or perform actions on connection
  });

  socket.addEventListener("message", async (event) => {
    console.log(`Received message: ${event.data}`);

    // where you put function for updating likes
    // await getCats();
    // await getOutsourcedCats()
    // Process incoming messages from the server
  });

  socket.addEventListener("close", (event) => {
    console.log("WebSocket connection closed");
  });
}

index();
