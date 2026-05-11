# Personal Website

![image](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![image](https://img.shields.io/badge/GSAP-93CF2B?style=for-the-badge&logo=greensock&logoColor=white)
![image](https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![image](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)
![image](https://img.shields.io/badge/Playwright-45ba4b?style=for-the-badge&logo=Playwright&logoColor=white)

![image](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![image](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

I'm a high school student with a serious interest in software development. I mostly lean toward React for web projects and Java for desktop applications. I love the process of taking an idea from a rough concept to a working tool and I'm constantly looking for new projects to contribute to.

## 📦 Demo

See the [live demo](https://wyu.app/).

> [!NOTE]
> This website has an older version located in the `archive` branch, and is hosted [here](https://v3.wyu.app).

## 💻 Installation

### Requirements

- [Git](https://git-scm.com/install/)
- [Node.js](https://nodejs.org/en/download)
- [Playwright](https://playwright.dev/docs/intro#installing-playwright) (Optional, see commands section)

### Instructions

Clone the repository to get the project onto your device.

```bash
git clone https://github.com/wyu4/personal-website.git
```

Then, install the project dependencies.

```bash
npm install
```

Create a copy of the following, placing them in a `.env` file, and fill the information in.

```
REPOSITORY_REFRESH=1800
LANGUAGE_REFRESH=3600
GITHUB_LOGIN=wyu4
GITHUB_API_KEY=secret
DATABASE_URL=url # Supabase URL
DATABASE_KEY=secret # Supabase Key
THREAD_CAP=20
CRON_SECRET=secret
```

To run the project, run the development command.

```bash
npm run dev
```

### Commands

| Command         | Description                                                    |
| --------------- | -------------------------------------------------------------- |
| `npm run dev`   | Builds and runs the project locally with a live-updating build |
| `npm run build` | Builds and runs an optimized production build locally          |
| `npm run lint`  | Runs linting checks                                            |
| `npm run clear` | Clears only the `.next` cache folder                           |

This project also supports _Playwright_ commands for testing purposes. Install using the npx command line.

```bash
npx playwright install
```

To use any of the following commands, first host the project locally on port 3000 using `npm run dev` on a seperate terminal.

| Additional Test Commands | Description                                  |
| ------------------------ | -------------------------------------------- |
| `npm run test:chrome`    | Creates a chrome window and opens port 3000  |
| `npm run test:firefox`   | Creates a firefox window and opens port 3000 |
| `npm run test:safari`    | Creates a safari window and opens port 3000  |

_© 2026 Wilson Yu_
