# SHOQAN Classic Menswear

A responsive university midterm project for a classic menswear store. The six separate HTML pages follow the supplied sitemap and desktop wireframes, with a shared header and footer. This is a frontend demonstration with sample products, representative photographs and local shopping-cart behavior.

## Pages

| Page | File | Main content |
| --- | --- | --- |
| Home | `index.html` | Hero, four categories, four new arrivals, benefits, newsletter |
| Catalog | `catalog.html` | Filter sidebar, sorting, product grid and pagination |
| Product | `product.html` | Gallery, size/color choices, quantity, accordions and recommendations |
| Cart / Checkout | `cart.html` | Cart rows, order summary, promo code and checkout form |
| About & Contact | `contact.html` | Brand story, four features, contact form and map placeholder |
| Login / Register | `login.html` | Demonstration login and expandable registration form |

## Technologies and structure

- HTML5: semantic `header`, `nav`, `main`, `section`, `article`, `aside`, `form` and `footer` elements.
- CSS3: shared styles in `css/style.css`, organized by page and component.
- Bootstrap **5.3.8**: CSS loaded through the jsDelivr CDN with a local fallback; the JavaScript bundle loads from `vendor/` for reliable offline interactions. Used for the container, checkout `row`/`col-*` layout, utilities, buttons, form controls and product accordion.
- Vanilla JavaScript: the sample product list is in `js/products.js`; page interactions are in `js/script.js`. Both load with `defer`, with the product list first.
- Local images: `images/hero`, `images/products`, `images/categories` and `images/branding`.

There is no framework, package installation or build step.

## Open the project

For a quick preview, open `index.html` in a modern browser. Bootstrap loads from its CDN when available and falls back to the included local files when offline. JavaScript must be enabled for the product grids, filters, cart and form feedback.

For consistent cart persistence between pages, use a local HTTP server. Open a terminal **inside the repository root** (the folder containing `index.html`) and run:

```sh
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000). On Windows, `py -m http.server 8000` is an alternative when Python is installed through the Python launcher. Stop the server with `Ctrl+C`. A code editor's static server extension also works.

The account pages and checkout are demonstration-only frontend flows: they validate input locally, show feedback in the page and never send credentials, payment data or orders to a server.

## Features and demo behavior

- Responsive navigation with a mobile menu and a working collection search.
- Catalog with **27 sample products**, **9 per page**, category/size/color/maximum-price filters and sorting. Category links on the home page open the relevant filtered view.
- Product details opened through `product.html?id=...`, selectable sizes and colors, quantity control, thumbnail selection and a saved wishlist.
- The gallery thumbnails show different crops of the representative product photograph; they are not separate product angles. Images illustrate the category and may not match every product name or selected color exactly.
- Cart quantities, removal and totals update immediately. The first visit starts with three sample items so the cart matches the wireframe: Classic Wool Suit, Oxford Cotton Shirt and Tailored Trousers. Removing all items leaves the cart empty on later visits.
- The cart and wishlist use the browser's `localStorage` keys `shoqan-cart-v1` and `shoqan-wishlist-v1`. They are specific to the browser and site address. If storage is unavailable, interactions still work in the current page, but changes may not survive navigation.
- Prices are shown in **Kazakhstani tenge (₸ / KZT)**. Promo code **SHOQAN10** takes 10% off the product subtotal.
- Standard delivery is **2,500 ₸**, or free when the product subtotal is at least **100,000 ₸** before discounts. Express delivery is **5,000 ₸**; pickup is free. An empty cart has no delivery charge.
- Newsletter, contact, checkout, login and registration forms validate input and display feedback. Checkout produces an on-page demo confirmation and clears the cart. No order, payment, subscription or message is sent; no account is created. Personal form values and passwords are not saved.
- Login's “Remember me” is a demonstration control; it does not create a persistent authenticated session.
- Accessible labels, image alt text, keyboard focus states, a skip link and status announcements support keyboard and screen-reader use.

## Кодты түсіндіруге арналған қысқаша нұсқаулық

- Әр HTML файл — бір бет. Header, негізгі мазмұн және footer сол файлдың ішінде орналасқан.
- `css/style.css` жалпы стильдер, әр бет және mobile бөлімдеріне бөлінген. Түстер мен өлшемдер ережелерде тікелей жазылған. Bootstrap accordion үшін ғана бес CSS параметрі сақталған.
- Бір қатардағы элементтерге Flexbox, бірнеше бағанды каталог пен бет құрылымына Grid қолданылады. Экран кішірейгенде қарапайым media query ережелері іске қосылады.
- `js/products.js` ішінде 27 тауардың атауы, бағасы, суреті, өлшемдері және түстері бар.
- `js/script.js` ішінде кәдімгі функциялар, `for` циклдері, `if` шарттары және `addEventListener` қолданылады. `setupCatalog`, `setupProduct` және басқа бөлімдер өз бетіндегі элементтер бар болса ғана жұмыс істейді.
- `productCard` бір тауардың HTML кодын жасайды. `renderCards` сол функциямен тауарлар тізімін көрсетеді. Осылайша бірдей карточка коды бірнеше жерде қайталанбайды.
- `saveCart` себетті `localStorage` ішінде сақтайды; `renderCart` экрандағы себетті жаңартады. Бұл серверге тапсырыс жібермейтін оқу жобасы.

## Examples to explain during the defence

| Requirement | Example in the project |
| --- | --- |
| Flexbox | `.header-inner`, `.header-menu` and `.nav-list` align navigation; `.product-actions` and `.newsletter-fields` align controls using `display: flex`, `align-items`, `justify-content` and `gap`. |
| CSS Grid | `.category-grid`, `.product-grid` and `.catalog-layout` define columns using `display: grid` and `grid-template-columns`. |
| CSS positioning | `.product-card` is relatively positioned; `.product-badge` is absolutely positioned inside it. The hero also uses a positioned overlay. |
| Media queries | Tablet rules at 991px, mobile rules at 767px and small-screen rules at 479px adjust navigation, grids, cart rows and forms. A reduced-motion query removes transitions. |
| HTML table | The product's **Size guide** accordion contains a table with `thead`, `tbody`, `tr`, `th` and `td`. The cart also uses a semantic table. |
| Forms | The newsletter, filters, product quantity, checkout, contact and account forms use appropriate input types, labels and native validation. |
| Bootstrap | Checkout uses `row`, `g-3`, `col-sm-6` and `col-12`; forms use `form-control`, `form-select` and `form-check`; product details use an accordion. Custom CSS preserves the supplied wireframe proportions. |

## Quick test route

1. On Home, follow **Shop now**, a category link and each main navigation link.
2. In Catalog, apply a category, size or color filter; reset it; change the sort order and try pages 1, 2 and 3. Search for a product from the header.
3. Open a product, change its size, color, quantity and thumbnail. Expand all three accordions and check the size table. Add it to the cart.
4. In Cart, change a quantity and remove an item. Apply **SHOQAN10** and compare totals. Change the delivery method and check the delivery charge.
5. Try an incomplete checkout, then use sample details and accept the terms. Verify the demo confirmation and empty cart. Reload to check that the empty state persists.
6. Try valid and invalid newsletter/contact/account forms. The success messages should clearly describe demonstration behavior.
7. Resize to desktop, tablet, mobile and a narrow 375px viewport. Check the menu, stacked checkout, mobile cart rows, footer and keyboard focus. No page should scroll horizontally.

To restore the initial three-item cart for a demonstration, remove only `shoqan-cart-v1` through the browser's developer tools (Application/Storage → Local Storage), then reload.

## Images and limitations

Photographs are kept locally so the page does not depend on remote image loading. Source and replacement notes are documented in `images/README.md`. Replace the representative assets with actual product photographs before using this as a real store; preserve their filenames or update the paths in HTML, CSS and the product data.

The contact details, opening hours, store map, delivery terms and product information are illustrative. The map points to Astana generally, not a verified SHOQAN store. Footer information and social buttons open explanatory demo dialogs. There is no inventory service, authentication system, payment processor or backend.

Keep the `vendor` folder with the project: it provides Bootstrap when the CDN is unavailable. The included Bootstrap bundle handles the product accordion. Use a current browser with JavaScript enabled for the full demonstration.

## Deployment and submission

This folder is ready for static hosting, but **a public deployment URL still needs to be created for the midterm submission**.

- **GitHub Pages:** Put the contents of `shoqan` at the root of a repository. In **Settings → Pages**, select **Deploy from a branch**, choose the branch and `/(root)`, and save. Keep `index.html` at the publishing root. See the [official publishing-source instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
- **Netlify:** Use its manual deploy/drop area and upload the `shoqan` folder containing `index.html`. This static project needs no build command. See the [official manual deployment instructions](https://docs.netlify.com/deploy/create-deploys/).

After publishing, open every page from the live URL, repeat the cart flow and test a mobile viewport. Include the final URL with the project submission. No deployment is performed by these instructions.
