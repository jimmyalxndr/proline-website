# TMA Astro Starter Site

## 🏗️ Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── .../Card.vue
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/Vue components.

Any static assets, can be placed in the `public/` directory.\
Although for images you can put them into `src/assets/` if you want Astro to process them. (See [Astro Doco](https://docs.astro.build/en/guides/images/#image--astroassets) )

This Astro project is set up to use Tailwind, Vue 3 and TypeScript.

## 📦 Node

### 🏎️ PNPM

This project uses [PNPM](https://pnpm.io/) as the package manager. It's a faster, more efficient package manager than NPM or Yarn, and is recommended for use with Astro.

But worst case, if we ever need to switch back to NPM, it's a simple enough change anyway...🤷‍♂️

```sh
brew install pnpm
```

### 🔀 NVM

Node Version Manager is a tool that allows you to manage multiple versions of Node.js on your machine. This project is set up to use the version of Node.js specified in the `.nvmrc` file.\
If you haven't got NVM installed, you can install it with the following command:

```sh
brew install nvm
```

Then you can install the version of Node.js specified in the `.nvmrc` file with the following command:

```sh
nvm install
```

You can then switch to that version of Node.js with the following command:

```sh
nvm use
```

## 👨‍🔬 Testing

This project is configured to use Playwright for E2E testing. These tests test the site in a real browser, and can be run locally (see commands below) or in CI (not yet set up).\
You can find the tests in the `tests/` directory, which includes a few basic tests to get you started.

Don't forget you can [record tests](https://playwright.dev/docs/getting-started-vscode#record-a-new-test), you don't need to manually write them all!

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `pnpm install`         | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm lint`            | Lint your project for formatting and mistakes    |
| `pnpm test`            | Runs our Playwright E2E tests                    |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

## 🧩 Components

To make getting started on a new project easier, there are a few included components that you'll often need.

Layout files are `.astro` components. Where regular components are all `.vue` components, for consistency for if they were to be modified to be use Vue functionality.

1. **Card**:
   A simple card component that you can use to display content in.

1. **ContactForm**:
   A simple contact form that you can use with Netlify forms or a regular form action. This is made up of a few sub-components too, so you can use the whole form or just the parts you need if you're creating something more bespoke.

1. **Button**:
   A simple button component that you can use to display a button. Works with both submit buttons and regular links that want to pretend to be a button.

1. **YouTube**:
   A simple YouTube component that you can use to embed YouTube videos, but puts them behind a placeholder image until clicked, to keep our page load times down.

1. **MapStatic**:
   A simple static map component that you can use to display a Google map image. Lighter weight than the dynamic map component, and probably all you need for most use cases.\
   You will need to set an environment variable for the Google Maps API key, `GOOGLE_MAPS_API_KEY`.

1. **Icon**:
   A simple icon component that you can use to display an SVG icon. This is used by a number of other components, but you can use it directly too.

1. **Share**:
   A simple share component that you can use to share your page on social media and when supported, your OS's native share functionality.
   (Note this component is yet to be tested and might not quite work yet)

1. **Header**:
   A simple header component that you can use to display a basic site header.

1. **Menu**:
   A simple menu component that you can use to display a list of links. This is a simple component that you can use to get started with a menu.

1. **Prose**:
   A simple Tailwind Prose wrapper component that you can use to display content in a readable way.

1. **Footer**:
   A simple footer component that displays a basic site footer.

1. **Web fonts**:
   A simple component that you can use to load web fonts from the src folder. With all the code you need comment out in Tailwind config/CSS, ready to go.

### 📋 Still to be build

1. **Hero section** (full width image with text overlay)

1. **Side by side image and content** (like a full-width horizontal card basically)

1. **Social icon links** (in Footer etc., allow for both round and square variants)

1. **Logo grid** (allow for both clickable and non-clickable versions and ideally have monochrome option too)

1. **More [HTML form input elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)** (checkboxes, radio buttons, datalists, selects and a date picker)

1. **Pagination** (<https://app.uxcel.com/courses/ui-components-best-practices/best-practices-005>)

1. **Testimonials group**

1. **Tooltips** (<https://blog.logrocket.com/creating-beautiful-tooltips-with-only-css/> or <https://developer.chrome.com/blog/introducing-popover-api>)

1. **Modal** (<https://developer.mozilla.org/en-US/docs/Web/CSS/:modal>)

## 🌏 Hosting

This project is set up to be hosted on Netlify, but is also a one line config change to work on Cloudflare Pages.\
Although really, it can easily be setup to run anywhere that supports static sites.

### ✉️ Netlify Form via Postmark email setup

To have email's sent via you will need to go to Netlify's Web Admin for this site.
Under `Site configuration`, you need to add the following environment variables.\
They will likely just use one value across all environments.

| Variable               | Description                                                                                                                  |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| `POSTMARK_API_KEY`     | The API key for Postmark.                                                                                                    |
| `TZ`                   | The time zone for the site, eg: `Australia/Brisbane`. If not set, defaults to `Australia/Sydney`. This is a Node.js env var. |
| `EMAIL_FROM`           | Email address to send form submissions as/from, falls back to `tech@themarkagency.com.au` if not set.                        |
| `EMAIL_TO`             | Email address to send form submissions to.                                                                                   |
| `EMAIL_SUBJECT`        | The subject line for the email.                                                                                              |
| `EMAIL_THE_USER`       | Boolean to determine if the user should receive a copy of the email too. Default is `false`.                                 |
| `EMAIL_COLOUR_BG`      | The background colour for the outer background of the email. Default is `#f8f8f8`.                                           |
| `EMAIL_COLOUR_PAGE`    | The background colour for the inner "page" part of the email. Default is `#fff`.                                             |
| `EMAIL_COLOUR_TEXT`    | The text colour for the email. Default is `#333`.                                                                            |
| `EMAIL_LOGO_HEIGHT`    | The height of the logo in the email header. Default is `60px`.                                                               |
| `EMAIL_TOP_MESSAGE`    | The message text at the top of the USER email. Default is none.                                                              |
| `EMAIL_BOTTOM_MESSAGE` | The message text at the bottom of the USER email. Default is none.                                                           |

You can also setup multiple forms that send to separate email addresses by adding the following environment variables.\
Eg: if the form is called `quote` you would add the following environment variables:

| Variable                     | Description                                                                                                         |
| :--------------------------- | :------------------------------------------------------------------------------------------------------------------ |
| `QUOTE_EMAIL_FROM`           | Email address to send form submissions as/from, falls back to `EMAIL_FROM` if not set.                              |
| `QUOTE_EMAIL_TO`             | Email address to send form submissions to, falls back to `EMAIL_TO` if not set.                                     |
| `QUOTE_EMAIL_SUBJECT`        | The subject line for the email. Falls back to `EMAIL_SUBJECT` if not set.                                           |
| `QUOTE_EMAIL_THE_USER`       | Boolean to determine if the user should receive a copy of the email too. Falls back to `EMAIL_THE_USER` if not set. |
| `QUOTE_EMAIL_COLOUR_BG`      | The background colour for the outer background of the email. Falls back to `EMAIL_COLOUR_BG` if not set.            |
| `QUOTE_EMAIL_COLOUR_PAGE`    | The background colour for the inner "page" part of the email. Falls back to `EMAIL_COLOUR_PAGE` if not set.         |
| `QUOTE_EMAIL_COLOUR_TEXT`    | The text colour for the email. Falls back to `EMAIL_COLOUR_TEXT` if not set.                                        |
| `QUOTE_EMAIL_LOGO_HEIGHT`    | The height of the logo in the email header. Falls back to `EMAIL_LOGO_HEIGHT` if not set.                           |
| `QUOTE_EMAIL_TOP_MESSAGE`    | The message text at the top of the USER email. Falls back to `EMAIL_TOP_MESSAGE` if not set.                        |
| `QUOTE_EMAIL_BOTTOM_MESSAGE` | The message text at the bottom of the USER email. Falls back to `EMAIL_BOTTOM_MESSAGE` if not set.                  |
| `QUOTE_TZ`                   | The time zone for the site, eg: `Australia/Brisbane`. Falls back to `TZ` if not set.                                |

## 💡 Ideas?

Feel something is missing that would be useful in this starter repo or there's something you'd like to see done differently?
Talk to Tim and he'll make it so!
