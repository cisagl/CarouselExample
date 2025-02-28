(() => {
    const API = "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";

    if ($(".product-detail") === 0) {
        console.log('product-detail öğesi bulunamadı');
        return;
    }

    const loadProducts = async () => {
        const localData = localStorage.getItem("products");
        if (localData) return JSON.parse(localData);

        try {
            const response = await fetch(API);
            const data = await response.json();
            localStorage.setItem("products", JSON.stringify(data));
            console.log("API'den ürünler yüklendi");
            return data;
        } catch (error) {
            console.error("Ürünleri yüklerken hata oluştu:", error);
            return [];
        }
    };

    const renderProducts = async () => {
        const products = await loadProducts();

        if (!products || products.length === 0) return;
        const carousel = $(".carousel");
        carousel.html("");
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

        products.forEach((product) => {
            const imageUrl = product.img;
            const isFavorite = favorites.includes(product.id);
            const favoriteSymbol = isFavorite ? "💙" : "🤍";

            const productHTML = `
                <div class="carousel-item" data-id="${product.id}">
                    <div class="product-image">
                    <div class="fav-btn">
                        <button class="favorite-btn" data-id="${product.id}">${favoriteSymbol}</button>
                    </div>
                        <a href="${product.url}" target="_blank">
                            <img src="${imageUrl}" alt="${product.name}">
                        </a>
                    </div>
                    <p class="name">${product.name}</p>
                    <p class="price">${product.price} TL</p>
                </div>
            `;
            carousel.append(productHTML);
        });
    };

    const setEvents = () => {
        $(document).on("click", ".favorite-btn", function () {
            const productId = $(this).data("id");
            let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

            if (favorites.includes(productId)) {
                favorites = favorites.filter((id) => id !== productId);
                $(this).removeClass("active").html("🤍");
                console.log(productId, "removed");
                console.log(favorites);
            } else {
                favorites.push(productId);
                $(this).addClass("active").html("💙");
                console.log (productId, "added");
                console.log(favorites);
            }
            localStorage.setItem("favorites", JSON.stringify(favorites));
        });

        $(document).on("click", ".carousel-next", function () {
            const carousel = $(".carousel");
            const scrollAmount = $(".carousel-item").outerWidth(true);
            carousel.animate({ scrollLeft: "+=" + scrollAmount }, 300);
        });

        $(document).on("click", ".carousel-prev", function () {
            const carousel = $(".carousel");
            const scrollAmount = $(".carousel-item").outerWidth(true);
            carousel.animate({ scrollLeft: "-=" + scrollAmount }, 300);
        });
    };

    const buildHTML = () => {
        const html = `
            <div class="carousel-container">
                <h2>You Might Also Like</h2>
                <div class="carousel-wrapper">
                    <button class="carousel-prev">‹</button>
                    <div class="carousel"></div>
                    <button class="carousel-next">›</button>
                </div>
            </div>
        `;
        $(".product-detail").append(html);
    };

    const buildCSS = () => {
        const css = `
            .carousel-container {
                margin-top: 20px;
                padding: 30px;
                background: rgb(189, 189, 189);
                border-radius: 10px;
                text-align: center;
                position: relative;
            }

            .carousel-wrapper {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                margin: auto;
                overflow: hidden;
            }

            .carousel {
                display: flex;
                gap: 10px;
                overflow-x: hidden;
                transition: transform 0.3s ease-in-out;
                width: 100%;
            }

            .carousel-item {
                position: relative;
                flex: 0 0 calc(100% / 6.8);
                text-align: center;
                background: white;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }

            .fav-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                z-index: 1;
                display: flex;
                justify-content: flex-end;
                overflow: hidden;
            }

            .carousel-item p {
                margin: 0;
                padding: 10px;
                font-size: 14px;
            }

            .favorite-btn {
                background: white;
                border: 1px solid white;
                border-radius: 10%;
                padding: 5px;
                font-size: 25px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                cursor: pointer;
            }

            .carousel-item a {
                text-decoration: none;
                color: black;
            }

            .carousel-item a:hover {
                text-decoration: underline;
            }

            .carousel-item img {
                width: 100%;
                height: 100%;
            }

            .carousel-prev,
            .carousel-next {
                background: none;
                color: white;
                border: none;
                padding: 10px;
                cursor: pointer;
                font-size: 50px;
                border-radius: 5px;
                position: absolute;
                top: 50%;
            }

            .carousel-prev:hover,
            .carousel-next:hover {
                color: black;
            }

            .carousel-prev {
                position: relative;
                left: -10px;
            }

            .carousel-next {
                position: relative;
                right: -10px;
            }

            .price {
                font-weight: bold;
                color: rgb(12, 32, 214);
            }

            .name {
                font-family: 'arial';
            }

            @media (max-width: 1200px) {
                .carousel-item {
                    flex: 0 0 calc(100% / 5);
                }
            }

            @media (max-width: 992px) {
                .carousel-item {
                    flex: 0 0 calc(100% / 4);
                }
            }

            @media (max-width: 768px) {
                .carousel-item {
                    flex: 0 0 calc(100% / 3);
                }
            }

            @media (max-width: 576px) {
                .carousel-item {
                    flex: 0 0 calc(100% / 2);
                }
            }

            @media (max-width: 400px) {
                .carousel-item {
                    flex: 0 0 100%;
                }
            }


        `;
        $("<style>").html(css).appendTo("head");
    };

    const init = async () => {
        buildHTML();
        buildCSS();
        renderProducts();
        setEvents();
    };

    init();
})();