require("dotenv").config();
const {
  renderError,
  parseBoolean,
  parseArray,
  clampValue,
  CONSTANTS,
} = require("../src/common/utils");
const fetchStackUser = require("../src/fetchers/stackoverflow-fetcher");
const renderStackOverFlowCard = require("../src/cards/stackoverflow-card");
const blacklist = require("../src/common/blacklist");

module.exports = async (req, res) => {
  console.log("Aqui api stack", req.query);
  const {
    username,
    ids,
    hide,
    hide_title,
    hide_border,
    hide_rank,
    show_icons,
    count_private,
    include_all_commits,
    line_height,
    title_color,
    icon_color,
    text_color,
    bg_color,
    theme,
    cache_seconds,
  } = req.query;
  let stack;

  res.setHeader("Content-Type", "image/svg+xml");

  if (blacklist.includes(username)) {
    return res.send(renderError("Something went wrong"));
  }

  try {
    stack = await fetchStackUser(ids);
    console.log("Stack", stack);
    const cacheSeconds = clampValue(
      parseInt(cache_seconds || CONSTANTS.TWO_HOURS, 10),
      CONSTANTS.TWO_HOURS,
      CONSTANTS.ONE_DAY
    );

    res.setHeader("Cache-Control", `public, max-age=${cacheSeconds}`);

    console.log("stack: ",  stack);
    return res.send(
        renderStackOverFlowCard(stack, {
        hide: parseArray(hide),
        show_icons: parseBoolean(show_icons),
        hide_title: parseBoolean(hide_title),
        hide_border: parseBoolean(hide_border),
        hide_rank: parseBoolean(hide_rank),
        include_all_commits: parseBoolean(include_all_commits),
        line_height,
        title_color,
        icon_color,
        text_color,
        bg_color,
        theme,
      })
    );
  } catch (err) {
    return res.send(renderError(err.message, err.secondaryMessage));
  }
};
